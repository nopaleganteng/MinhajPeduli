import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Filter, Eye, Check, X, ArrowDownWideNarrow, ArrowUpWideNarrow, Edit2, Save, Download } from 'lucide-react';

export default function Donations({ pendingDonations = {}, paidDonations = {}, filters = {} }) {
    const [tab, setTab] = useState(filters.tab || 'pending');
    const [processingId, setProcessingId] = useState(null);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // State untuk Koreksi Nominal
    const [editingId, setEditingId] = useState(null);
    const [tempNominal, setTempNominal] = useState('');

    // Fungsi Sortir
    const handleSort = (direction) => {
        router.get(route('admin.donations'),
            { ...filters, sort: 'nominal', direction: direction, tab: tab },
            { preserveState: true, replace: true }
        );
        setShowFilterMenu(false);
    };

    // Fungsi Export CSV
    const handleExport = () => {
        const params = new URLSearchParams({
            start_date: filters.start_date || '',
            end_date: filters.end_date || '',
            tab: tab // Mengekspor sesuai tab yang sedang aktif (pending/paid)
        }).toString();

        window.location.href = `/admin/donations/export?${params}`;
    };

    // Fungsi Update Status (Terima/Tolak)
    const handleUpdateStatus = (id, status) => {
        if (!confirm(`Yakin ingin mengubah status menjadi ${status.toUpperCase()}?`)) return;
        setProcessingId(id);
        router.post(route('admin.donations.update-status', id), { status }, {
            preserveScroll: true,
            onSuccess: () => setProcessingId(null),
            onError: () => setProcessingId(null),
        });
    };

    // Fungsi Simpan Koreksi Nominal
    const saveNominal = (id) => {
        router.post(route('admin.donations.update-nominal', id), {
            nominal: tempNominal
        }, {
            preserveScroll: true,
            onSuccess: () => setEditingId(null),
        });
    };

    const renderTable = (list, type) => {
        if (!list || !list.data || list.data.length === 0) {
            return (
                <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <p className="text-sm">Tidak ada data donasi ditemukan.</p>
                    </td>
                </tr>
            );
        }

        return list.data.map((donation) => (
            <tr key={donation.id} className="hover:bg-gray-50 transition border-b text-gray-800">
                <td className="px-3 py-4 md:px-6 font-mono text-xs font-bold">{donation.invoice_no}</td>
                <td className="px-3 py-4 md:px-6">
                    <div className="font-bold">{donation.name}</div>
                    <div className="text-xs text-gray-500">{donation.phone}</div>
                </td>
                <td className="px-3 py-4 md:px-6">
                    <span className="text-gray-700 truncate block max-w-[200px]" title={donation.program?.title}>
                        {donation.program?.title || '-'}
                    </span>
                </td>

                <td className="px-3 py-4 md:px-6">
                    <div className="flex items-center justify-between min-w-[160px]">
                        {editingId === donation.id ? (
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    className="border border-green-500 rounded px-2 py-1 text-sm w-32 text-gray-800 focus:ring-2 focus:ring-green-100 outline-none"
                                    value={tempNominal}
                                    onChange={(e) => setTempNominal(e.target.value)}
                                    autoFocus
                                />
                                <button onClick={() => saveNominal(donation.id)} className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition">
                                    <Save size={14} />
                                </button>
                                <button onClick={() => setEditingId(null)} className="p-1.5 bg-gray-400 text-white rounded hover:bg-gray-500 transition">
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className="font-bold text-green-600">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(donation.nominal)}
                                </span>
                                <button
                                    onClick={() => {
                                        setEditingId(donation.id);
                                        setTempNominal(donation.nominal);
                                    }}
                                    className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-all"
                                    title="Koreksi Nominal"
                                >
                                    <Edit2 size={12} />
                                </button>
                            </>
                        )}
                    </div>
                </td>

                <td className="px-3 py-4 md:px-6 text-gray-600 text-sm">{donation.date}</td>
                <td className="px-3 py-4 md:px-6 text-center">
                    {type === 'pending' ? (
                        <div className="flex items-center justify-center gap-2">
                            <button
                                disabled={processingId === donation.id}
                                onClick={() => handleUpdateStatus(donation.id, 'paid')}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition shadow-sm"
                                title="Terima Donasi"
                            >
                                <Check size={16} />
                            </button>
                            <button
                                disabled={processingId === donation.id}
                                onClick={() => handleUpdateStatus(donation.id, 'failed')}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm"
                                title="Tolak Donasi"
                            >
                                <X size={16} />
                            </button>
                            <Link href={route('admin.donations.show', donation.id)} className="p-2 text-gray-400 hover:text-blue-600 transition">
                                <Eye size={18} />
                            </Link>
                        </div>
                    ) : (
                        <Link href={route('admin.donations.show', donation.id)} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition">
                            <Eye size={14} /> Detail
                        </Link>
                    )}
                </td>
            </tr>
        ));
    };

    return (
        <AdminLayout>
            <Head title="Kelola Donasi" />

            {/* Header & Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Manajemen Donasi</h2>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Tombol Export */}
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-50 transition shadow-sm"
                    >
                        <Download size={16} />
                        Export CSV
                    </button>

                    {/* Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className={`flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm ${showFilterMenu ? 'bg-gray-100' : 'bg-white'}`}
                        >
                            <Filter size={16} />
                            Filter & Urutkan
                        </button>

                        {showFilterMenu && (
                            <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white border rounded-xl shadow-xl z-50 p-5">
                                <div className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.1em]">Urutkan Nominal</div>
                                <div className="flex flex-col gap-1 mb-5">
                                    <button onClick={() => handleSort('desc')} className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 ${filters.direction === 'desc' ? 'bg-green-50 text-green-700 font-bold' : 'hover:bg-gray-50'}`}>
                                        <ArrowDownWideNarrow size={16} /> Terbesar ke Terkecil
                                    </button>
                                    <button onClick={() => handleSort('asc')} className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 ${filters.direction === 'asc' ? 'bg-green-50 text-green-700 font-bold' : 'hover:bg-gray-50'}`}>
                                        <ArrowUpWideNarrow size={16} /> Terkecil ke Terbesar
                                    </button>
                                </div>

                                <hr className="my-4 border-gray-100" />

                                <div className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.1em]">Rentang Tanggal</div>
                                <div className="space-y-3 mb-5">
                                    <div>
                                        <label className="text-[10px] text-gray-400 uppercase font-bold ml-1">Dari Tanggal</label>
                                        <input
                                            type="date"
                                            value={filters.start_date || ''}
                                            onChange={(e) => router.get(route('admin.donations'), { ...filters, start_date: e.target.value, tab }, { preserveState: true })}
                                            className="w-full border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 uppercase font-bold ml-1">Sampai Tanggal</label>
                                        <input
                                            type="date"
                                            value={filters.end_date || ''}
                                            onChange={(e) => router.get(route('admin.donations'), { ...filters, end_date: e.target.value, tab }, { preserveState: true })}
                                            className="w-full border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none mt-1"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        router.get(route('admin.donations'), { tab }, { replace: true });
                                        setShowFilterMenu(false);
                                    }}
                                    className="w-full text-center py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg font-bold border border-transparent hover:border-red-100 transition"
                                >
                                    Reset Semua Filter
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6 flex p-1 bg-gray-100 rounded-xl w-fit max-w-full overflow-x-auto">
                <button
                    onClick={() => { setTab('pending'); router.get(route('admin.donations'), { ...filters, tab: 'pending' }, { preserveState: true }); }}
                    className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${tab === 'pending' ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Donasi Masuk <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px]">{pendingDonations?.total ?? 0}</span>
                </button>
                <button
                    onClick={() => { setTab('paid'); router.get(route('admin.donations'), { ...filters, tab: 'paid' }, { preserveState: true }); }}
                    className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${tab === 'paid' ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Donasi Terbayar <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-[10px]">{paidDonations?.total ?? 0}</span>
                </button>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-[860px] w-full text-left text-sm">
                        <thead className="bg-gray-50/50 text-gray-400 font-black uppercase text-[10px] tracking-widest border-b">
                            <tr>
                                <th className="px-3 py-4 md:px-6">Invoice</th>
                                <th className="px-3 py-4 md:px-6">Donatur</th>
                                <th className="px-3 py-4 md:px-6">Program</th>
                                <th className="px-3 py-4 md:px-6">Nominal</th>
                                <th className="px-3 py-4 md:px-6">Tanggal</th>
                                <th className="px-3 py-4 md:px-6 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {tab === 'pending' ? renderTable(pendingDonations, 'pending') : renderTable(paidDonations, 'paid')}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Placeholder (Opsional: Tambahkan komponen paginasi Inertia di sini jika data banyak) */}
        </AdminLayout>
    );
}
