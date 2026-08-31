import AdminLayout from '../../Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { TrendingUp, Users, AlertCircle, CheckCircle, Eye, Wallet, Landmark } from 'lucide-react';

export default function Dashboard({ stats, recentDonations }) {
    const statsConfig = [
        { label: 'Total Donasi Masuk', val: stats.total_donation, icon: <TrendingUp size={24} />, color: 'bg-emerald-500' },
        { label: 'Total Pengeluaran', val: stats.total_pengeluaran, icon: <Wallet size={24} />, color: 'bg-red-500' },
        { label: 'Saldo Akhir', val: stats.saldo_akhir, icon: <Landmark size={24} />, color: 'bg-blue-500' },
        { label: 'Perlu Verifikasi', val: `${stats.need_verification} Transaksi`, icon: <AlertCircle size={24} />, color: 'bg-yellow-500' },
        { label: 'Program Aktif', val: `${stats.program_active} Program`, icon: <CheckCircle size={24} />, color: 'bg-violet-500' },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            {/* Header Dashboard */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Ikhtisar</h2>
                <p className="text-gray-500">Selamat datang kembali, Admin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
                {statsConfig.map((item, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                        <div className={`p-3 rounded-xl text-white shadow-md ${item.color}`}>
                            {item.icon}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{item.label}</p>
                            <h3 className="text-lg font-bold text-gray-800 truncate">{item.val}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabel Donasi Terbaru */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">Donasi Terbaru</h3>
                    <Link
                        href={route('admin.donations')}
                        className="text-sm text-green-600 hover:text-green-800 font-medium transition"
                    >
                        Lihat Semua
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-green-50 text-green-800 uppercase font-bold text-xs border-b border-green-100">
                            <tr>
                                <th className="px-6 py-4">Invoice</th>
                                <th className="px-6 py-4">Donatur</th>
                                <th className="px-6 py-4">Program</th>
                                <th className="px-6 py-4">Jumlah</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentDonations && recentDonations.length > 0 ? (
                                recentDonations.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {item.invoice_no}
                                        </td>
                                        <td className="px-6 py-4 font-medium">{item.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{item.program}</td>
                                        <td className="px-6 py-4 font-bold text-green-600">{item.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                                                item.status === 'paid'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                <span className={`w-2 h-2 rounded-full ${item.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                                {item.status === 'paid' ? 'Success' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {/* TOMBOL AKSI: Mengarah ke showDonation di Controller */}
                                            <Link
                                                href={route('admin.donations.show', item.id)}
                                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
                                            >
                                                <Eye size={14} />
                                                Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400 italic">
                                        Belum ada data donasi terbaru.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
