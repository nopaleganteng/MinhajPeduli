import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import { ArrowDownLeft, ArrowUpRight, FileText, Mail, Phone, MapPin, Wallet } from "lucide-react";

// Helper Format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

export default function Laporan({
    auth,
    summary: summaryProp = null,
    mutasi: mutasiProp = null,
}) {
    // Jika props tidak dikirim (fallback), tetap gunakan data dummy agar komponen tidak error.
    const summary = summaryProp ?? {
        total_masuk: 0,
        total_keluar: 0,
        saldo_akhir: 0,
    };

    const mutasi =
        mutasiProp && mutasiProp.length > 0
            ? mutasiProp
            : [
                  {
                      id: 0,
                      tanggal: new Date().toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                      }),
                      uraian: "Belum ada transaksi",
                      tipe: "masuk",
                      nominal: 0,
                  },
              ];

    return (
        <>
            <Head title="Laporan Keuangan" />

            <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50 text-slate-800 font-sans flex flex-col justify-between">
                <div>
                    <Navbar auth={auth} />

                    <section className="pt-28 pb-16 px-6 bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-700 text-white text-center shadow-xl">
                        <div className="max-w-4xl mx-auto">
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase text-emerald-100">
                                <Wallet size={14} /> Transparansi Dana
                            </span>
                            <h1 className="mt-6 text-3xl md:text-5xl font-serif font-bold tracking-wide">
                                Transparansi Dana Umat
                            </h1>
                            <p className="mt-4 text-emerald-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                                Laporan keuangan terbuka, akuntabel, dan dapat diakses publik demi menjaga amanah donatur.
                            </p>
                        </div>
                    </section>

                    <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20 pb-20">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            {[
                                {
                                    label: "Total Pemasukan",
                                    val: summary.total_masuk,
                                    color: "text-emerald-600",
                                    border: "border-emerald-200",
                                    bg: "bg-white",
                                    icon: <ArrowDownLeft className="text-emerald-600" size={22} />,
                                },
                                {
                                    label: "Total Pengeluaran",
                                    val: summary.total_keluar,
                                    color: "text-red-600",
                                    border: "border-red-200",
                                    bg: "bg-white",
                                    icon: <ArrowUpRight className="text-red-600" size={22} />,
                                },
                                {
                                    label: "Saldo Saat Ini",
                                    val: summary.saldo_akhir,
                                    color: "text-blue-600",
                                    border: "border-blue-200",
                                    bg: "bg-white shadow-lg",
                                    icon: <Wallet className="text-blue-600" size={22} />,
                                },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`${item.bg} p-5 rounded-2xl shadow-md border-t-4 ${item.border} transform hover:-translate-y-1 transition duration-300`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-xs text-gray-500 uppercase font-bold tracking-[0.18em]">
                                            {item.label}
                                        </div>
                                        <div className="p-2 rounded-xl bg-gray-50">{item.icon}</div>
                                    </div>
                                    <div className={`text-2xl md:text-3xl font-bold ${item.color}`}>
                                        {formatRupiah(item.val)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                            <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-100 p-2 rounded-lg">
                                        <FileText size={20} className="text-emerald-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-lg">Mutasi Terakhir</h3>
                                </div>
                                <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                                    5 Transaksi Terakhir
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm md:text-base">
                                    <thead className="bg-emerald-50/60 text-gray-600">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">Tanggal</th>
                                            <th className="px-6 py-4 font-semibold">Uraian Transaksi</th>
                                            <th className="px-6 py-4 font-semibold text-center">Jenis</th>
                                            <th className="px-6 py-4 font-semibold text-right">Nominal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {mutasi.map((m) => (
                                            <tr key={m.id} className="hover:bg-emerald-50/30 transition duration-150">
                                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{m.tanggal}</td>
                                                <td className="px-6 py-4 font-medium text-gray-800">{m.uraian}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                            m.tipe === "masuk"
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                    >
                                                        {m.tipe === "masuk" ? "Masuk" : "Keluar"}
                                                    </span>
                                                </td>
                                                <td
                                                    className={`px-6 py-4 font-bold text-right ${
                                                        m.tipe === "masuk" ? "text-emerald-600" : "text-red-600"
                                                    }`}
                                                >
                                                    {m.tipe === "masuk" ? "+" : "-"}{formatRupiah(m.nominal)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 text-center">
                                <button className="text-emerald-600 text-sm font-semibold hover:underline">
                                    Lihat Laporan Lengkap &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FOOTER ASLI --- */}
                <footer className="w-full mt-10 relative">
                    <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/5 to-transparent pointer-events-none"></div>
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
                                        Kontak kami
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
                                                href="tel:081234567890"
                                                className="text-green-800 hover:text-green-600 transition"
                                            >
                                                081234567890
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white py-4 text-center border-t border-green-200">
                        <p className="text-sm text-gray-700 font-medium flex items-center justify-center">
                            <span className="text-lg mr-1">©</span> 2025 MINHAJ
                            PEDULI. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                </footer>

                {/* --- Style untuk Animasi (Tetap dibutuhkan) --- */}
                <style>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-up {
                        animation: fadeInUp 0.8s ease-out forwards;
                    }
                `}</style>
            </div>
        </>
    );
}
