import { Head, Link, router } from "@inertiajs/react";
import ProgressBar from "../Components/ProgressBar";
import { MapPin, Phone, Mail } from "lucide-react";

export default function PembayaranDonasi({ auth, id, programTitle, bank, donationData }) {
    // Pastikan props diterima dengan benar
    const data = donationData || {};

    // Judul program asli dari controller (fallback ke simulasi bila kosong)
    const programName = programTitle || "Pembangunan Asrama Santri";
    const programId = Number(id);

    // Rekening yayasan dari shared props (config/bank.php)
    const bankInfo = bank || {};
    const bankName = bankInfo.bank_name || "BTN Syariah";
    const accountNumber = bankInfo.account_number || "20022284222";
    const accountName = bankInfo.account_name || "Yayasan Minhajul Misbah Al Jadid";
    const qrisImage = bankInfo.qris_image || null;

    // Data Donatur dari Controller
    const donatur = {
        name: data.name || "Hamba Allah",
        email: data.email || "email@example.com",
        phone: data.phone || "-",
        nominal: Number(data.nominal) || 0,
    };

    const invoiceNo = data.invoice_no || "MM2025120607634";
    // KODE UNIK dari Controller (angka acak 1-999), akan digunakan sebagai DISPLAY saja
    const uniqueNumberCode = Number(data.unique_code) || 0;

    // --- KOREKSI PENTING DI SINI ---
    // 1. TOTAL TRANSFER HANYA NOMINAL MURNI
    const totalTransfer = donatur.nominal; // KODE UNIK (uniqueNumberCode) TIDAK DITAMBAHKAN

    // 2. Kode Unik Kata (Hanya untuk Display)
    const _programTitle = programName;
    const getInitials = (title) => {
        const words = title.split(/\s+/).filter((word) => word.length > 0);
        if (words.length >= 2) {
            return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
        }
        return title.substring(0, 2).toUpperCase();
    };
    const uniqueWordCode = getInitials(programTitle);

    // Angka Unik yang ditampilkan (angka 1-999 yang sebenarnya dari DB)
    const displayedNumberCode = uniqueNumberCode;
    // --- AKHIR KOREKSI PENTING ---

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert(`Berhasil menyalin: ${text}`);
    };

    // FUNGSI NAVIGASI
    const handleManualConfirmation = () => {
        const donationId = data?.id;
        if (!donationId) {
            alert(
                "Donation ID tidak tersedia. Mohon muat ulang halaman atau hubungi admin.",
            );
            return;
        }
        // Arahkan langsung ke halaman konfirmasi untuk donationId
        router.get(route("donasi.konfirmasi", { id: donationId }));
    };

    // Fallback jika data tidak ada
    if (!donationData || !donatur.name) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6 text-center">
                <h1 className="text-xl font-bold text-red-700 mb-4">
                    Kesalahan Data Donasi
                </h1>
                <p className="text-gray-600">
                    Terjadi kesalahan dalam memuat data donasi. Silakan ulangi
                    proses atau hubungi Admin.
                </p>
                <Link
                    href={route("donasi.show", { id: id })}
                    className="mt-4 text-blue-600 hover:text-blue-800 underline"
                >
                    Kembali ke halaman program
                </Link>
            </div>
        );
    }

    return (
        <>
            <Head title="Pembayaran Donasi" />

            <div className="min-h-screen bg-white text-slate-800 font-sans">
                {/* --- Navbar --- */}
                <nav className="flex justify-between items-center px-6 py-4 bg-green-100 shadow-sm sticky top-0 z-50">
                    <div className="text-2xl font-bold text-green-700 italic">
                        Minhaj<span className="text-green-900">Peduli</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm font-semibold">
                        <Link
                            href={route("donasi.show", { id: id })}
                            className="text-gray-600 hover:text-green-700"
                        >
                            Kembali
                        </Link>
                    </div>
                </nav>

                <div className="max-w-4xl mx-auto px-6 py-10">
                    <ProgressBar step={2} />

                    {/* --- Content Utama --- */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Alhamdulillah,
                        </h1>
                        <p className="text-sm md:text-base text-gray-600">
                            Terima kasih Bapak{" "}
                            <span className="font-bold">{donatur.name}</span>{" "}
                            telah bersedia mengisi formulir kesediaan donasi.
                        </p>
                    </div>

                    {/* --- BLOK RINCIAN DONASI --- */}
                    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden mb-8 shadow-sm">
                        {/* Rincian Data */}
                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-300">
                            <div className="p-4 font-bold text-gray-700 bg-gray-50 md:bg-white">
                                Nama Lengkap
                            </div>
                            <div className="p-4 md:col-span-2 text-gray-800">
                                {donatur.name}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-300">
                            <div className="p-4 font-bold text-gray-700 bg-gray-50 md:bg-white">
                                E-mail
                            </div>
                            <div className="p-4 md:col-span-2 text-gray-800">
                                {donatur.email}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-300">
                            <div className="p-4 font-bold text-gray-700 bg-gray-50 md:bg-white">
                                Nomor Telepon
                            </div>
                            <div className="p-4 md:col-span-2 text-gray-800">
                                {donatur.phone}
                            </div>
                        </div>

                        {/* BARIS NAMA PROGRAM (Diperbarui dengan Kode Kata) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-300">
                            <div className="p-4 font-bold text-gray-700 bg-gray-50 md:bg-white">
                                Program Donasi
                            </div>
                            <div className="p-4 md:col-span-2 text-gray-800 font-semibold">
                                {programName} (Kode:{" "}
                                <span className="text-blue-700 font-bold">
                                    {uniqueWordCode}
                                </span>
                                )
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-300">
                            <div className="p-4 font-bold text-gray-700 bg-gray-50 md:bg-white">
                                No. Invoice
                            </div>
                            <div className="p-4 md:col-span-2 text-gray-800">
                                <div className="font-medium">{invoiceNo}</div>
                                <button
                                    onClick={() => copyToClipboard(invoiceNo)}
                                    className="text-blue-600 hover:text-blue-800 text-sm underline mt-1 cursor-pointer"
                                >
                                    Salin nomor invoice
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-300">
                            <div className="p-4 font-bold text-gray-700 bg-gray-50 md:bg-white">
                                Bank Tujuan
                            </div>
                            <div className="p-4 md:col-span-2 text-gray-800">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="text-2xl font-black text-blue-900 italic tracking-tighter">
                                        {bankName}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 mb-1">
                                    An. {accountName}.
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-bold text-lg tracking-wider">
                                        {accountNumber}
                                    </span>
                                    <button
                                        onClick={() =>
                                            copyToClipboard(accountNumber)
                                        }
                                        className="text-blue-600 hover:text-blue-800 text-sm underline cursor-pointer"
                                    >
                                        Salin nomor rekening
                                    </button>
                                </div>
                                {/* Buka aplikasi bank (Android) dengan nomor + nominal terisi */}
                                <a
                                    href={`intent://transfer?rek=${accountNumber}&nominal=${totalTransfer}#Intent;scheme=btnmobile;package=id.co.btn.mobile;end`}
                                    className="mt-3 inline-block bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold py-2 px-5 rounded-full transition"
                                >
                                    Buka BTN Mobile
                                </a>
                                <p className="text-xs text-gray-500 italic mt-2">
                                    *Jika aplikasi tidak terbuka, salin nomor di
                                    atas lalu transfer manual via m-banking /
                                    ATM ke {bankName} {accountNumber}.
                                </p>
                                {qrisImage && (
                                    <div className="mt-4 border border-gray-200 rounded-lg p-4 text-center bg-gray-50">
                                        <p className="font-bold text-gray-700 mb-2">
                                            Atau scan QRIS (dana langsung masuk
                                            rekening yayasan)
                                        </p>
                                        <img
                                            src={qrisImage}
                                            alt="QRIS Yayasan"
                                            className="w-56 h-56 object-contain mx-auto"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Nominal Donasi (Dipisahkan) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-300">
                            <div className="p-4 font-bold text-gray-700 bg-gray-50 md:bg-white">
                                Nominal Donasi
                            </div>
                            <div className="p-4 md:col-span-2 text-gray-800">
                                Rp{" "}
                                {new Intl.NumberFormat("id-ID").format(
                                    donatur.nominal,
                                )}
                            </div>
                        </div>

                        {/* Kode Unik (Dipisahkan) - KOREKSI TEKS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-300">
                            <div className="p-4 font-bold text-gray-700 bg-gray-50 md:bg-white">
                                Kode Unik
                            </div>
                            <div className="p-4 md:col-span-2 text-gray-800">
                                <div className="text-sm text-gray-600 mb-1">
                                    Kode unik ini untuk identifikasi donasi Anda
                                    (tidak perlu ditransfer):
                                </div>
                                {/* Kode Unik Angka = Angka Unik dari DB */}
                                <span className="text-red-600 font-bold">
                                    Rp{" "}
                                    {new Intl.NumberFormat("id-ID").format(
                                        displayedNumberCode,
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Total Transfer (Jumlah Final) - KOREKSI TOTAL TRANSFER */}
                        <div className="grid grid-cols-1 md:grid-cols-3">
                            <div className="p-4 font-bold text-green-700 bg-green-700/10 md:bg-white text-lg">
                                TOTAL TRANSFER
                            </div>
                            <div className="p-4 md:col-span-2 text-gray-800">
                                <div className="text-xl font-bold flex items-center text-green-700">
                                    {/* HANYA NOMINAL MURNI */}
                                    Rp{" "}
                                    {new Intl.NumberFormat("id-ID").format(
                                        totalTransfer,
                                    )}
                                </div>
                                <div className="text-sm text-red-600 italic mt-2">
                                    *Mohon transfer sebesar nominal donasi Anda.
                                    Kode unik hanya untuk identifikasi.
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* --- AKHIR BLOK RINCIAN DONASI --- */}

                    {/* Tombol Aksi */}
                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={handleManualConfirmation}
                            className="bg-[#fde047] hover:bg-yellow-400 text-yellow-900 font-bold py-3 px-8 rounded-full shadow-md w-full md:w-auto transition transform active:scale-95"
                        >
                            Konfirmasi manual
                        </button>

                        <button
                            onClick={handleManualConfirmation}
                            className="bg-[#4ade80] hover:bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-md w-full md:w-auto text-center transition transform active:scale-95"
                        >
                            Sudah sesuai nominal
                        </button>
                    </div>
                </div>

                {/* Footer */}
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
