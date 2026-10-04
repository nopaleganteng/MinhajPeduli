import { Head, Link, router } from "@inertiajs/react";
import ProgressBar from "../Components/ProgressBar";
import { MapPin, Phone, Mail, Check, X, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function KonfirmasiPembayaran({ auth, id, data, donation_id }) {
    const donatur = {
        name: data.name || "Hamba Allah",
        email: data.email || "",
        phone: data.phone || "",
        nominal: Number(data.nominal) || 0,
    };

    const uniqueCode = Number(data.unique_code_number) || 0;
    const formattedUniqueCode = uniqueCode.toString().padStart(3, "0");
    const invoiceNo = data.invoice_no || "INV-GENERATING";

    const [bankOwner, setBankOwner] = useState(donatur.name);
    const [selectedBank, setSelectedBank] = useState("BCA");
    const [paymentDate, setPaymentDate] = useState(
        new Date().toISOString().split("T")[0],
    );
    const [notes, setNotes] = useState("");
    const [paymentProof, setPaymentProof] = useState(null);
    const [paymentProofName, setPaymentProofName] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    // step state: 1=form, 2=payment/confirmation, 3=done
    const [step, setStep] = useState(() => {
        // Cek sessionStorage jika ada
        if (typeof window !== "undefined") {
            const saved = window.sessionStorage.getItem("konfirmasiStep");
            if (saved) return parseInt(saved, 10);
        }
        return 1;
    });

    const formatRupiah = (num) => {
        return new Intl.NumberFormat("id-ID").format(Math.floor(num));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPaymentProof(file);
            setPaymentProofName(file.name);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveProof = () => {
        setPaymentProof(null);
        setPaymentProofName("");
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        document.getElementById("payment-proof-upload").value = null;
    };

    // Simpan step ke sessionStorage setiap kali berubah
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.sessionStorage.setItem("konfirmasiStep", step);
        }
    }, [step]);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!bankOwner || !paymentDate || !paymentProof) {
            alert("Mohon lengkapi semua data dan lampirkan bukti transfer.");
            return;
        }
        setProcessing(true);
        setStep(2);
        router.post(
            route("donasi.confirm"),
            {
                donation_id: data.id || donation_id, // fallback ke donation_id jika data.id tidak ada
                proof_image: paymentProof,
                bank_owner: bankOwner,
                bank_name: selectedBank,
                payment_date: paymentDate,
                notes: notes,
            },
            {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(true);
                    setStep(3);
                },
                onError: (errors) => {
                    alert("Terjadi kesalahan saat mengirim konfirmasi.");
                    console.log(errors);
                },
                onFinish: () => setProcessing(false),
            },
        );
    };

    // Debug: cek nilai data.id dan donation_id
    console.log('data.id:', data.id);
    console.log('donation_id:', donation_id);
    return (
        <>
            <Head title="Konfirmasi Pembayaran" />
            <div className="min-h-screen bg-white text-slate-800 font-sans">
                {/* Navbar */}
                <nav className="flex justify-between items-center px-6 py-4 bg-green-100 shadow-sm sticky top-0 z-50">
                    <div className="text-2xl font-bold text-green-700 italic">
                        Minhaj<span className="text-green-900">Peduli</span>
                    </div>
                    <Link
                        href="/"
                        className="text-sm font-semibold text-gray-600"
                    >
                        Kembali
                    </Link>
                </nav>

                <div className="max-w-4xl mx-auto px-6 py-10">
                    <ProgressBar step={3} />

                    <div className="text-center mb-8">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-700 uppercase tracking-wide">
                            Mohon Lengkapi Form
                            <br />
                            Konfirmasi Pembayaran Manual
                        </h1>
                        <hr className="mt-4 border-gray-300 w-full" />
                    </div>

                    {/* Table Container - Mengembalikan Desain Awal */}
                    <div className="border border-gray-400 text-sm md:text-base">
                        <div className="border-b border-gray-400 bg-white p-4 font-bold text-gray-700 uppercase">
                            Formulir Konfirmasi Pembayaran Manual
                        </div>

                        {/* Invoice */}
                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-400">
                            <div className="p-4 font-bold text-gray-700 border-b md:border-b-0 md:border-r border-gray-400 bg-gray-50 md:bg-white flex items-center">
                                No. Invoice
                            </div>
                            <div className="p-4 md:col-span-2 text-gray-800 flex items-center">
                                {invoiceNo}
                            </div>
                        </div>

                        {/* Nama */}
                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-400">
                            <div className="p-4 font-bold text-gray-700 border-b md:border-b-0 md:border-r border-gray-400 bg-gray-50 md:bg-white flex items-center">
                                Nama Lengkap
                            </div>
                            <div className="p-4 md:col-span-2 text-gray-800 flex items-center">
                                {donatur.name}
                            </div>
                        </div>

                        {/* Bank Anda */}
                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-400">
                            <div className="p-4 font-bold text-gray-700 border-b md:border-b-0 md:border-r border-gray-400 bg-gray-50 md:bg-white flex items-center">
                                Bank Anda *
                            </div>
                            <div className="p-4 md:col-span-2 text-gray-800 flex flex-col md:flex-row gap-3">
                                <input
                                    type="text"
                                    value={bankOwner}
                                    onChange={(e) =>
                                        setBankOwner(e.target.value)
                                    }
                                    className="border border-gray-400 px-3 py-2 w-full md:w-1/2 focus:outline-none"
                                    placeholder="Nama pemilik rekening"
                                />
                                <select
                                    value={selectedBank}
                                    onChange={(e) =>
                                        setSelectedBank(e.target.value)
                                    }
                                    className="border border-gray-400 px-3 py-2 w-full md:w-1/3 bg-white"
                                >
                                    <option value="BCA">BCA</option>
                                    <option value="BRI">BRI</option>
                                    <option value="MANDIRI">MANDIRI</option>
                                    <option value="BNI">BNI</option>
                                </select>
                            </div>
                        </div>

                        {/* Nominal Murni */}
                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-400">
                            <div className="p-4 font-bold text-gray-700 border-b md:border-b-0 md:border-r border-gray-400 bg-gray-50 md:bg-white flex items-center">
                                Jumlah Donasi
                            </div>
                            <div className="p-4 md:col-span-2 text-gray-800 font-bold flex items-center">
                                Rp {formatRupiah(donatur.nominal)}
                            </div>
                        </div>

                        {/* Kode Unik Terpisah */}
                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-400">
                            <div className="p-4 font-bold text-gray-700 border-b md:border-b-0 md:border-r border-gray-400 bg-gray-50 md:bg-white flex items-center">
                                Kode Unik
                            </div>
                            <div className="p-4 md:col-span-2 text-red-600 font-bold flex items-center">
                                {formattedUniqueCode}
                            </div>
                        </div>

                        {/* Tanggal Bayar */}
                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-400">
                            <div className="p-4 font-bold text-gray-700 border-b md:border-b-0 md:border-r border-gray-400 bg-gray-50 md:bg-white flex items-center">
                                Tanggal Bayar *
                            </div>
                            <div className="p-4 md:col-span-2">
                                <input
                                    type="date"
                                    value={paymentDate}
                                    onChange={(e) =>
                                        setPaymentDate(e.target.value)
                                    }
                                    className="border border-gray-400 px-3 py-2 w-full md:w-1/2"
                                />
                            </div>
                        </div>

                        {/* Bukti Bayar */}
                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-400">
                            <div className="p-4 font-bold text-gray-700 border-b md:border-b-0 md:border-r border-gray-400 bg-gray-50 md:bg-white flex items-center">
                                Bukti Pembayaran *
                            </div>
                            <div className="p-4 md:col-span-2 text-gray-800">
                                <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-4">
                                    <input
                                        type="text"
                                        value={paymentProofName || "Bukti belum dipilih"}
                                        readOnly
                                        className="border border-gray-400 px-3 py-2 w-full md:w-1/2 bg-white text-gray-400 italic"
                                    />
                                    <input
                                        type="file"
                                        id="payment-proof-upload"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                    />
                                    <label
                                        htmlFor="payment-proof-upload"
                                        className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 border border-gray-400 text-center"
                                    >
                                        Pilih File
                                    </label>
                                </div>
                                {previewUrl && (
                                    <div className="mt-4 p-2 border border-dashed border-gray-400 relative max-w-xs bg-gray-50">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-auto object-cover rounded"
                                        />
                                        <button
                                            onClick={handleRemoveProof}
                                            className="absolute top-0 right-0 m-1 p-1 bg-red-500 text-white rounded-full"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Catatan */}
                        <div className="grid grid-cols-1 md:grid-cols-3">
                            <div className="p-4 font-bold text-gray-700 border-b md:border-b-0 md:border-r border-gray-400 bg-gray-50 md:bg-white">
                                Catatan
                            </div>
                            <div className="p-4 md:col-span-2 text-gray-800">
                                <textarea
                                    placeholder="Tambahkan catatan (opsional)"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows="3"
                                    className="w-full border border-gray-300 p-2 focus:outline-none resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleSubmit}
                            disabled={processing}
                            className={`${processing ? "bg-gray-400" : "bg-green-100 hover:bg-green-200"} text-green-900 font-bold py-3 px-8 sm:px-20 w-full sm:w-auto rounded-full shadow-md border border-green-300 transition transform active:scale-95`}
                        >
                            {processing ? "Mengirim..." : "Konfirmasi Sekarang"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Sukses */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-2xl">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} strokeWidth={3} />
                        </div>
                        <h2 className="text-xl font-bold mb-2">
                            Terima Kasih!
                        </h2>
                        <p className="text-gray-600 mb-6 text-sm">
                            Konfirmasi pembayaran Anda telah kami terima dan
                            akan segera diverifikasi.
                        </p>
                        <button
                            onClick={() => router.visit("/")}
                            className="w-full bg-sky-500 text-white py-2 rounded-lg font-bold"
                        >
                            Oke
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
