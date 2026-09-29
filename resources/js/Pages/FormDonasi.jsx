import { Head, Link, router, usePage } from "@inertiajs/react";
import ProgressBar from "../Components/ProgressBar";
import { MapPin, Phone, Mail, ChevronDown } from "lucide-react";
import { useState } from "react";

function FormDonasi({ auth, program_id, program, nominal, errors = {} }) {
    const { bank: bankProp } = usePage().props;
    const bankInfo = bankProp || {};
    const bankName = bankInfo.bank_name || "BTN Syariah";
    const accountName =
        bankInfo.account_name || "Yayasan Minhajul Misbah Al Jadid";
    const [formData, setFormData] = useState({
        sapaan: "Bapak",
        name: auth.user?.name || "",
        email: auth.user?.email || "",
        phone: "",
        notes: "",
        isAnonymous: false,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handlePayment = () => {
        if (
            (!formData.name && !formData.isAnonymous) ||
            !formData.email ||
            !formData.phone
        ) {
            alert(
                "Mohon lengkapi Nama (atau centang Hamba Allah), Email, dan Nomor Telepon.",
            );
            return;
        }

        const dataKirim = {
            nominal: nominal,
            name: formData.isAnonymous ? "Hamba Allah" : formData.name,
            email: formData.email,
            phone: formData.phone,
            notes: formData.notes,
        };

        const targetProgramId = program?.id ? program.id : program_id;
        router.post(route("donasi.store", { id: targetProgramId }), dataKirim, {
            onError: (errs) =>
                console.error("Validasi Gagal atau Error Server:", errs),
        });
    };

    // small fallback list for dev; in production the controller should provide `program`
    const allPrograms = [
        {
            id: 1,
            title: "Pembangunan Asrama Santri",
            img: "/images/pesantren1.png",
        },
        {
            id: 2,
            title: "Pembangunan Pesantren Tahfidz",
            img: "/images/pesantren2.png",
        },
        {
            id: 3,
            title: "Wakaf Al-quran dan Buku",
            img: "/images/pesantren1.png",
        },
        { id: 4, title: "Pembangunan Masjid", img: "/images/pesantren2.png" },
    ];

    const programFromServer = program
        ? {
              id: Number(program.id),
              title: program.title,
              img: program.img || "/images/pesantren1.png",
          }
        : null;
    const programLocal = allPrograms.find((p) => p.id === Number(program_id));
    const programUsed = programFromServer || programLocal;

    if (!programUsed) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-100">
                <p className="text-red-700 font-bold">
                    Error: Program dengan ID{" "}
                    {program_id || (program && program.id)} tidak ditemukan!
                </p>
            </div>
        );
    }

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <>
            <Head title="Formulir Donasi" />

            <div className="min-h-screen bg-white text-slate-800 font-sans">
                <nav className="flex justify-between items-center px-6 py-4 bg-green-100 shadow-sm sticky top-0 z-50">
                    <div className="text-2xl font-bold text-green-700 italic">
                        Minhaj<span className="text-green-900">Peduli</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm font-semibold">
                        <Link
                            href={route("donasi.show", { id: programUsed.id })}
                            className="text-gray-600 hover:text-green-700"
                        >
                            Kembali
                        </Link>
                    </div>
                </nav>

                <div className="max-w-5xl mx-auto px-6 py-10">
                    <ProgressBar step={1} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-xl font-bold text-gray-700 border-b pb-2">
                                Profil Donatur
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sapaan *
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="sapaan"
                                            value={formData.sapaan}
                                            onChange={handleInputChange}
                                            className="block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-green-500 bg-white"
                                        >
                                            <option>Bapak</option>
                                            <option>Ibu</option>
                                            <option>Saudara/i</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3 text-gray-400 w-4 h-4 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Lengkap *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Isi nama lengkap anda"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-green-500"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    E-mail *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Contoh: example@gmail.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-green-500"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nomor Telepon *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="0812xxxxx"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-green-500"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Do'a & Harapan
                                </label>
                                <textarea
                                    name="notes"
                                    rows="4"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-green-500"
                                ></textarea>
                                {errors.notes && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.notes}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="hamba-allah"
                                    type="checkbox"
                                    name="isAnonymous"
                                    checked={formData.isAnonymous}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="hamba-allah"
                                    className="ml-2 block text-sm text-gray-600"
                                >
                                    Sembunyikan nama saya (sebagai "Hamba
                                    Allah")
                                </label>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h2 className="text-lg font-bold text-gray-700 mb-4">
                                    Ringkasan Transaksi
                                </h2>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <img
                                        src={
                                            programUsed.img ||
                                            "/images/pesantren1.png"
                                        }
                                        alt={programUsed.title}
                                        className="w-full h-32 object-cover rounded-lg mb-4"
                                    />
                                    <p className="text-green-600 font-bold mb-1">
                                        Donasi
                                    </p>
                                    <h3 className="text-md font-semibold text-gray-800 mb-4">
                                        {programUsed.title}
                                    </h3>
                                    <div className="flex justify-between items-center border-t border-gray-300 pt-3">
                                        <span className="font-bold text-gray-700">
                                            Total Donasi
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            {formatRupiah(nominal)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-gray-700 mb-4">
                                    Pilih Metode Pembayaran *
                                </h2>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-gray-100 px-4 py-2 font-semibold text-sm text-gray-700 border-b border-gray-200">
                                        Transfer Bank (Verifikasi Manual)
                                    </div>
                                    <div className="p-4 bg-white flex items-center gap-4">
                                        <input
                                            type="radio"
                                            name="payment"
                                            defaultChecked
                                            className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="font-bold text-blue-900 italic text-lg">
                                                    {bankName}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                An. {accountName}
                                            </p>
                                        </div>
                                        <span className="font-bold text-gray-500 text-sm">
                                            {bankName}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-full shadow-lg transition"
                            >
                                Lanjut Pembayaran
                            </button>
                        </div>
                    </div>
                </div>

                <footer className="w-full mt-10">
                    <div className="bg-green-50 py-10 px-6 text-green-900">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
                            <div className="flex flex-col justify-start md:w-1/3">
                                <h2 className="text-3xl font-bold italic text-green-700 mb-2">
                                    MinhajPeduli
                                </h2>
                                <p className="text-lg font-medium text-green-800">
                                    Pondok Pesantren AL-Minhaj
                                </p>
                            </div>
                            <div className="flex flex-col md:flex-row gap-8 md:gap-16 md:w-2/3 md:justify-end">
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-green-900">
                                        Alamat
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <MapPin className="w-6 h-6 text-green-700 mr-3 mt-1 shrink-0" />
                                            <span className="text-green-800 leading-relaxed">
                                                Desa kuripan Kel.Kuripan
                                                <br />
                                                Kec. Ciseeng, Bogor, Jawa Barat
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-green-900">
                                        Hubungi Kami
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-center">
                                            <Mail className="w-6 h-6 text-green-700 mr-3" />
                                            <a
                                                href="mailto:AlMinhaj@gmail.com"
                                                className="text-green-800 hover:text-green-600 transition"
                                            >
                                                AlMinhaj@gmail.com
                                            </a>
                                        </li>
                                        <li className="flex items-center">
                                            <Phone className="w-6 h-6 text-green-700 mr-3" />
                                            <a
                                                href="tel:082108210821"
                                                className="text-green-800 hover:text-green-600 transition"
                                            >
                                                082108210821
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white py-4 text-center border-t border-green-200">
                        <p className="text-sm text-gray-700 font-medium flex items-center justify-center">
                            <span className="text-lg mr-1">©</span> {new Date().getFullYear()} MINHAJ
                            PEDULI. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default FormDonasi;
