import { Head, Link, useForm } from '@inertiajs/react';
import Navbar from "@/Components/Navbar";
import { Search, MapPin, Phone, Mail, ArrowRight, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Fungsi helper format Rupiah
const formatRupiah = (number) => {
    const num = Number(number);
    if (isNaN(num) || num === 0) return "Rp 0";

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(num);
};

export default function Donasi({ auth, allPrograms = [], totalStats = {} }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAll, setShowAll] = useState(false); // State untuk kontrol tampilan "Lihat Semua"

    // --- LOGIKA HAPUS ---
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus program ini?")) {
            destroy(route('donasi.destroy', id));
        }
    };

    // --- Stats Data Dinamis ---
    const totalCollected = totalStats.collected_amount || 0;
    const totalDonatur = totalStats.total_donatur || 0;
    const programCount = totalStats.program_count || allPrograms.length;

    const statsData = [
        { val: programCount.toString(), label: "Program Donasi" },
        { val: formatRupiah(totalCollected), label: "Total Donasi Terkumpul" },
        { val: totalDonatur.toString(), label: "Total Donatur" }
    ];

    // --- Memproses Programs Data ---
    const programsData = allPrograms.map(prog => ({
        id: prog.id,
        title: prog.title,
        current: formatRupiah(prog.collected_amount || 0),
        target: formatRupiah(prog.target_amount || 0),
        pct: Number(prog.percentage) || 0,
        img: prog.image_path || '/images/default.png',
    }));

    // Filter Program berdasarkan pencarian
    let filteredPrograms = programsData.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // LOGIKA LIMIT: Batasi 4 jika tidak mencari DAN tidak sedang klik "Lihat Semua"
    if (searchTerm === '' && !showAll) {
        filteredPrograms = filteredPrograms.slice(0, 4);
    }

    return (
        <>
            <Head title="Donasi" />

            <div className="min-h-screen bg-[#dcfce7] text-slate-800 font-sans overflow-x-hidden">

                <Navbar auth={auth} />

                {/* --- Hero Section --- */}
                <section className="relative h-[500px] flex items-center justify-center text-center px-4 overflow-hidden group">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/pesantren1.png"
                            alt="Construction Site"
                            className="w-full h-full object-cover animate-slow-zoom"
                        />
                        <div className="absolute inset-0 bg-black/60"></div>
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto text-white animate-fade-in-up">
                        <h1 className="text-4xl md:text-6xl font-bold uppercase mb-4 tracking-wide drop-shadow-lg">
                            DONASI
                        </h1>
                        <p className="text-lg md:text-xl font-medium mb-2 drop-shadow-md">
                            Investasikan Donasi Anda dalam Pembangunan Pondok Pesantren, Mari Membentuk Generasi Unggul di Masa Depan!
                        </p>
                        <p className="text-sm md:text-base text-gray-300 mb-8 italic">
                            Raih Pahala Jariah dengan Berdonasi Pembangunan Pondok Pesantren
                        </p>
                        <a
                            href="#program-list"
                            className="inline-block bg-white/20 hover:bg-white/30 text-white border border-white px-8 py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm hover:scale-105 active:scale-95 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                        >
                            Yuk Donasi
                        </a>
                    </div>
                </section>

                {/* --- Stats Boxes --- */}
                <section className="relative z-20 px-4 -mt-16 mb-12">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                        {statsData.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-green-700 text-white rounded-2xl py-8 px-4 text-center shadow-xl border-4 border-green-100/20 transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:bg-green-600 cursor-default"
                            >
                                <div className="text-3xl md:text-4xl font-bold mb-1">{item.val}</div>
                                <div className="text-sm md:text-base font-medium opacity-90">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- Quote Banner --- */}
                <section className="relative h-64 flex items-center justify-center mb-12 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img src="/images/pesantren2.png" alt="Quote Background" className="w-full h-full object-cover fixed-bg" />
                        <div className="absolute inset-0 bg-black/50"></div>
                    </div>
                    <div className="relative z-10 max-w-4xl px-6 text-center animate-pulse-slow">
                        <p className="text-xl md:text-3xl font-bold text-white italic leading-relaxed drop-shadow-lg">
                            “Wujudkan Pesantren Impian. Donasi Anda Sangat Berarti.”
                        </p>
                    </div>
                </section>

                {/* --- Program List Section --- */}
                <section id="program-list" className="max-w-6xl mx-auto px-6 pb-20">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h2 className="text-2xl font-bold text-green-900 border-l-4 border-green-500 pl-4">Pilihan Program Donasi</h2>
                        <div className="relative w-full md:w-80 group">
                            <input
                                type="text"
                                placeholder="Cari Program Donasi"
                                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition-all duration-300 group-hover:shadow-md"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5 group-hover:text-green-600 transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredPrograms.length > 0 ? (
                            filteredPrograms.map((prog) => (
                                <div
                                    key={prog.id}
                                    className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full group"
                                >
                                    <div className="h-56 overflow-hidden relative">
                                        <img
                                            src={prog.img}
                                            alt={prog.title}
                                            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2 font-serif group-hover:text-green-700 transition-colors">{prog.title}</h3>
                                            <div className="text-xs text-gray-500 mb-2 font-medium flex justify-between">
                                                <span>Terkumpul: <span className="font-bold text-green-700">{prog.current}</span></span>
                                                <span>Target: {prog.target}</span>
                                            </div>

                                            <div className="w-full bg-gray-200 rounded-full h-3 mb-6 relative overflow-hidden">
                                                <div className="bg-green-500 h-full rounded-full relative" style={{ width: `${prog.pct}%` }}>
                                                    <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full -translate-x-full animate-shimmer"></div>
                                                </div>
                                            </div>

                                            {/* --- PERBAIKAN DI SINI: Optional Chaining auth?.user --- */}
                                            {auth?.user && (
                                                <div className="flex gap-2 mb-6 border-t pt-4">
                                                    <Link
                                                        href={route('donasi.edit', prog.id)}
                                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 rounded-md text-xs font-semibold transition shadow-sm"
                                                    >
                                                        Edit Program
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(prog.id)}
                                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-xs font-semibold transition shadow-sm"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-end">
                                            <Link
                                                href={route('donasi.show', { id: prog.id })}
                                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-semibold text-sm shadow-md transition-all duration-300 transform active:scale-95 hover:shadow-lg flex items-center gap-2 group-hover:gap-3"
                                            >
                                                Donasi Sekarang <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-10 text-gray-500 italic bg-white/50 rounded-lg border border-dashed border-gray-300">
                                Program tidak ditemukan.
                            </div>
                        )}
                    </div>

                    {/* TOMBOL LIHAT SEMUA */}
                    {programCount > 4 && searchTerm === '' && !showAll && (
                        <div className="text-center mt-12">
                            <button
                                type="button"
                                onClick={() => setShowAll(true)}
                                className="inline-block bg-white text-green-700 border-2 border-green-600 px-8 py-3 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 shadow-lg font-semibold hover:-translate-y-1"
                            >
                                Lihat Semua Program ({programCount})
                            </button>
                        </div>
                    )}
                </section>

                {/* --- Footer --- */}
                <footer className="w-full mt-10">
                    <div className="bg-green-50 py-10 px-6 text-green-900 border-t-4 border-green-200">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
                            <div className="flex flex-col justify-start md:w-1/3">
                                <h2 className="text-3xl font-bold italic text-green-700 mb-2">MinhajPeduli</h2>
                                <p className="text-lg font-medium text-green-800">Pondok Pesantren AL-Minhaj</p>
                            </div>
                            <div className="flex flex-col md:flex-row gap-8 md:gap-16 md:w-2/3 md:justify-end">
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-green-900">Alamat</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start group">
                                            <MapPin className="w-6 h-6 text-green-700 mr-3 mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                                            <span className="text-green-800 leading-relaxed">
                                                Desa kuripan Kel.Kuripan<br />Kec. Ciseeng, Bogor, Jawa Barat
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-green-900">Hubungi Kami</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-center group">
                                            <Mail className="w-6 h-6 text-green-700 mr-3 group-hover:scale-110 transition-transform" />
                                            <a href="mailto:AlMinhaj@gmail.com" className="text-green-800 hover:text-green-600 transition hover:underline">AlMinhaj@gmail.com</a>
                                        </li>
                                        <li className="flex items-center group">
                                            <Phone className="w-6 h-6 text-green-700 mr-3 group-hover:scale-110 transition-transform" />
                                            <a href="tel:082108210821" className="text-green-800 hover:text-green-600 transition hover:underline">082108210821</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white py-4 text-center border-t border-green-100">
                        <p className="text-sm text-gray-700 font-medium flex items-center justify-center">
                            <span className="text-lg mr-1">©</span> {new Date().getFullYear()} MINHAJ PEDULI. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                </footer>

                <style>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes slowZoom {
                        0% { transform: scale(1); }
                        100% { transform: scale(1.1); }
                    }
                    @keyframes shimmer {
                        100% { transform: translateX(100%); }
                    }
                    @keyframes pulseSlow {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.8; }
                    }
                    .animate-fade-in-up {
                        animation: fadeInUp 1s ease-out forwards;
                    }
                    .animate-slow-zoom {
                        animation: slowZoom 20s linear infinite alternate;
                    }
                    .animate-shimmer {
                        animation: shimmer 2s infinite;
                    }
                    .animate-pulse-slow {
                        animation: pulseSlow 3s ease-in-out infinite;
                    }
                `}</style>
            </div>
        </>
    );
}
