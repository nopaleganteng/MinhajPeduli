import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    MapPin,
    Phone,
    Mail,
    ArrowLeft,
    Check,
    X,
    Share2,
    Copy,
    Facebook,
    Twitter,
    MessageCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";

const formatRupiah = (number) => {
    const num = Number(number);
    if (isNaN(num)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(num);
};

export default function DetailDonasi({ auth, program, donation }) {
    const [nominal, setNominal] = useState("");

    // State untuk Share Modal & Copy Link
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [currentUrl, setCurrentUrl] = useState("");

    const { post, processing } = useForm();

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentUrl(window.location.href);
        }
    }, []);

    // --- PERBAIKAN POIN 1: Early Return (Pelindung jika data belum ada) ---
    if (!program) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#dcfce7]">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
                    <h2 className="text-xl font-bold text-green-800 mb-2">
                        Memuat Data...
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Mohon tunggu sebentar atau periksa koneksi Anda.
                    </p>
                    <Link
                        href="/donasi"
                        className="text-green-600 font-semibold underline"
                    >
                        Kembali ke Daftar Donasi
                    </Link>
                </div>
            </div>
        );
    }

    const handleUpdateStatus = (newStatus) => {
        const isPaid = newStatus === "paid";
        const message = isPaid
            ? "Terima donasi ini? Pastikan dana sudah masuk ke rekening yayasan."
            : "Apakah Anda yakin ingin menolak donasi ini?";

        if (window.confirm(message)) {
            post(route("admin.donations.update-status", donation.id), {
                data: { status: newStatus },
                preserveScroll: true,
                onSuccess: () => {
                    alert(
                        `Berhasil! Status donasi diperbarui menjadi ${newStatus}.`,
                    );
                },
            });
        }
    };

    const handleDonationClick = () => {
        // Pastikan ID dikonversi ke String agar Ziggy tidak bingung
        const programId = program?.id ? String(program?.id) : null;

        if (!programId) {
            alert("Terjadi kesalahan: ID Program tidak ditemukan.");
            return;
        }

        const nominalValue = Number(nominal);
        if (!nominalValue || nominalValue < 10000 || isNaN(nominalValue)) {
            alert(
                "Mohon masukkan nominal donasi minimal Rp 10.000 untuk melanjutkan.",
            );
            return;
        }

        // Gunakan format objek yang sesuai dengan definisi route: parameter 'id' dan 'nominal'
        router.visit(
            route("donasi.form", {
                id: programId,
                nominal: nominalValue,
            }),
        );
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(currentUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const shareLinks = {
        whatsapp: `https://api.whatsapp.com/send?text=Bantu ${program.title} yuk! Cek detailnya di sini: ${currentUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${currentUrl}&text=Bantu ${program.title}`,
        line: `https://social-plugins.line.me/lineit/share?url=${currentUrl}`,
    };

    const collected = formatRupiah(program.collected_amount || 0);
    const target = formatRupiah(program.target_amount || 0);
    const percentage = program.percentage || 0;

    return (
        <>
            <Head title={program.title} />

            {/* --- Modal Share Overlay --- */}
            {isShareOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">
                                Bagikan lewat
                            </h3>
                            <button
                                onClick={() => setIsShareOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-center">
                            <a
                                href={shareLinks.whatsapp}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition">
                                    <MessageCircle size={28} fill="white" />
                                </div>
                                <span className="text-xs font-medium text-gray-600">
                                    WhatsApp
                                </span>
                            </a>
                            <a
                                href={shareLinks.facebook}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1877F2] rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition">
                                    <Facebook size={28} fill="white" />
                                </div>
                                <span className="text-xs font-medium text-gray-600">
                                    Facebook
                                </span>
                            </a>
                            <a
                                href={shareLinks.line}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#06C755] rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition">
                                    <span className="font-bold text-xl">L</span>
                                </div>
                                <span className="text-xs font-medium text-gray-600">
                                    LINE
                                </span>
                            </a>
                            <a
                                href={shareLinks.twitter}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1DA1F2] rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition">
                                    <Twitter size={28} fill="white" />
                                </div>
                                <span className="text-xs font-medium text-gray-600">
                                    Twitter
                                </span>
                            </a>
                        </div>

                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-2 bg-gray-50">
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm text-gray-500 truncate px-2">
                                    {currentUrl}
                                </p>
                            </div>
                            <button
                                onClick={handleCopyLink}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center gap-2 ${isCopied ? "bg-green-600 text-white" : "bg-[#0ea5e9] text-white hover:bg-sky-600"}`}
                            >
                                {isCopied ? (
                                    <Check size={16} />
                                ) : (
                                    <Copy size={16} />
                                )}
                                {isCopied ? "Disalin" : "Salin"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-[#dcfce7] text-slate-800 font-sans">
                {/* --- Navbar (responsif, punya hamburger mobile) --- */}
                <Navbar auth={auth} />

                <div className="max-w-6xl mx-auto px-6 py-10">
                    <Link
                        href={
                            donation
                                ? route("admin.donations")
                                : route("donasi")
                        }
                        className="inline-flex items-center text-green-700 hover:text-green-900 font-semibold mb-6 transition"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        {donation
                            ? "Kembali ke Daftar Donasi Admin"
                            : "Kembali ke Daftar Donasi"}
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                        {/* --- Kiri: Detail Info --- */}
                        <div className="lg:col-span-2">
                            <div className="rounded-3xl overflow-hidden shadow-lg mb-8 h-80 md:h-[400px] bg-white">
                                <img
                                    src={program.image_path}
                                    alt={program.title}
                                    className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                                />
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-900 mb-4 font-serif break-words">
                                {program.title}
                            </h1>
                            <p className="text-base sm:text-lg text-gray-700 mb-8 leading-relaxed font-medium break-words">
                                {program.desc_short}
                            </p>
                            <hr className="border-green-300 mb-8" />
                            <div className="bg-white/50 p-5 sm:p-6 rounded-2xl border border-green-100">
                                <h2 className="text-xl font-bold text-green-800 mb-4 border-l-4 border-green-500 pl-3">
                                    Detail Program
                                </h2>
                                <div className="text-gray-800 space-y-4 leading-relaxed text-justify whitespace-pre-line break-words">
                                    {program.desc_long}
                                </div>
                            </div>
                        </div>

                        {/* --- Kanan: Card Donasi & Aksi Admin --- */}
                        <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
                            <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>

                                {/* Statistik Progress */}
                                <div className="relative w-40 h-40 mx-auto mb-6 mt-4">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke="#e5e7eb"
                                            strokeWidth="10"
                                            fill="transparent"
                                        />
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke="#16a34a"
                                            strokeWidth="10"
                                            fill="transparent"
                                            strokeDasharray={440}
                                            strokeDashoffset={
                                                440 - (440 * percentage) / 100
                                            }
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-blue-800">
                                            {percentage}%
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-gray-600 text-sm font-medium">
                                        Donasi Terkumpul:
                                    </p>
                                    <p className="text-2xl font-bold text-green-700">
                                        {collected}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        dari target donasi {target}
                                    </p>
                                </div>

                                {donation ? (
                                    /* --- MODE ADMIN --- */
                                    <div className="space-y-3">
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                                            Validasi Admin
                                        </p>
                                        <div className="mb-4 text-left p-3 bg-gray-50 rounded-lg border text-sm">
                                            <p className="text-gray-500 italic">
                                                Donatur:{" "}
                                                <span className="text-slate-800 font-bold not-italic">
                                                    {donation.name}
                                                </span>
                                            </p>
                                            <p className="text-gray-500 italic">
                                                Nominal:{" "}
                                                <span className="text-green-700 font-bold not-italic">
                                                    {formatRupiah(
                                                        donation.nominal,
                                                    )}
                                                </span>
                                            </p>
                                        </div>

                                        {donation.status === "pending" ? (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        handleUpdateStatus(
                                                            "paid",
                                                        )
                                                    }
                                                    disabled={processing}
                                                    className="w-full py-3 bg-green-600 text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition disabled:opacity-50"
                                                >
                                                    <Check size={20} /> Terima
                                                    Donasi
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleUpdateStatus(
                                                            "failed",
                                                        )
                                                    }
                                                    disabled={processing}
                                                    className="w-full py-3 bg-white text-red-600 border border-red-200 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition disabled:opacity-50"
                                                >
                                                    <X size={20} /> Tolak /
                                                    Gagal
                                                </button>
                                            </>
                                        ) : (
                                            <div className="p-4 bg-gray-100 rounded-xl border border-dashed border-gray-300">
                                                <p
                                                    className={`font-bold uppercase ${donation.status === "paid" ? "text-green-600" : "text-red-600"}`}
                                                >
                                                    Status: {donation.status}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* --- MODE USER --- */
                                    <>
                                        <div className="mb-4 text-left">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-900 font-bold">
                                                        Rp
                                                    </span>
                                                </div>
                                                <input
                                                    type="number"
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm font-medium transition shadow-inner"
                                                    placeholder="Masukkan Nominal Donasi"
                                                    value={nominal}
                                                    onChange={(e) =>
                                                        setNominal(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleDonationClick}
                                            className="block w-full bg-[#16a34a] hover:bg-green-700 text-white text-lg font-bold py-3 px-4 rounded-full shadow-lg transform active:scale-95 transition duration-200"
                                        >
                                            Donasi Sekarang
                                        </button>
                                        <button
                                            onClick={() => setIsShareOpen(true)}
                                            className="block w-full mt-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold py-3 px-4 rounded-full transition flex items-center justify-center gap-2"
                                        >
                                            <Share2 size={18} /> Bagikan
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Footer --- */}
                <footer className="w-full mt-10">
                    <div className="bg-green-50 py-10 px-6 text-green-900">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
                            <div className="md:w-1/3">
                                <h2 className="text-3xl font-bold italic text-green-700 mb-2">
                                    MinhajPeduli
                                </h2>
                                <p className="text-lg font-medium text-green-800">
                                    Pondok Pesantren AL-Minhaj
                                </p>
                            </div>
                            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-green-900">
                                        Alamat
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <MapPin className="w-6 h-6 text-green-700 mr-3 mt-1 shrink-0" />
                                            <span className="text-green-800 text-sm">
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
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center">
                                            <Mail className="w-5 h-5 text-green-700 mr-3" />
                                            <span>AlMinhaj@gmail.com</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Phone className="w-5 h-5 text-green-700 mr-3" />
                                            <span>082108210821</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white py-4 text-center border-t border-green-200 text-xs text-gray-500">
                        © {new Date().getFullYear()} MINHAJ PEDULI. ALL RIGHTS RESERVED.
                    </div>
                </footer>
            </div>
        </>
    );
}
