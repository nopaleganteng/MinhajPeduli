/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Check, X, Calendar, User, CreditCard, MessageCircle, Upload, Eye } from 'lucide-react';

export default function DonasiDetail({ donation }) {
    const [isProcessing, setIsProcessing] = useState(false);

    // --- LOGIKA TAMBAHAN UNTUK UPLOAD GAMBAR ---
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsProcessing(true);
            router.post(route('admin.donations.update-proof', donation.id), {
                _method: 'PUT',
                proof_image: file,
            }, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsProcessing(false);
                    alert('Bukti pembayaran berhasil diperbarui');
                },
                onError: () => setIsProcessing(false),
            });
        }
    };
    // ------------------------------------------

    const statusBadgeClass = donation.status === 'paid'
        ? 'bg-green-100 text-green-700'
        : donation.status === 'failed'
            ? 'bg-red-100 text-red-700'
            : 'bg-yellow-100 text-yellow-700';

    const handleUpdateStatus = (newStatus) => {
        if (confirm(`Apakah Anda yakin ingin mengubah status menjadi ${newStatus}?`)) {
            setIsProcessing(true);

            router.post(
                route('admin.donations.update-status', donation.id),
                { status: newStatus },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsProcessing(false);
                        alert("Status berhasil diperbarui!");
                    },
                    onError: (errors) => {
                        setIsProcessing(false);
                        console.error("Error:", errors);
                        alert("Gagal mengubah status. Silakan coba lagi.");
                    }
                }
            );
        }
    };

    return (
        <AdminLayout>
            <Head title={`Detail Donasi - ${donation.invoice_no}`} />

            <div className="mb-6">
                <Link href={route('admin.donations')} className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition font-medium">
                    <ArrowLeft size={18} />
                    <span>Kembali ke Daftar Donasi</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 break-words">{donation.invoice_no}</h2>
                                <p className="text-gray-500 italic">Dibuat pada {donation.date}</p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${statusBadgeClass}`}>
                                {donation.status.toUpperCase()}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6">
                            <div className="space-y-4">
                                <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Informasi Donatur</label>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><User size={20}/></div>
                                    <div>
                                        <p className="text-sm text-gray-500">Nama Lengkap</p>
                                        <p className="font-semibold text-gray-800">{donation.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><MessageCircle size={20}/></div>
                                    <div>
                                        <p className="text-sm text-gray-500">Kontak</p>
                                        <p className="font-semibold text-gray-800 text-xs">{donation.email} / {donation.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Detail Program</label>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Calendar size={20}/></div>
                                    <div>
                                        <p className="text-sm text-gray-500">Program</p>
                                        <p className="font-semibold text-gray-800">{donation.program?.title || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><CreditCard size={20}/></div>
                                    <div>
                                        <p className="text-sm text-gray-500">Metode</p>
                                        <p className="font-semibold text-gray-800">Transfer Manual</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                            <p className="text-xs text-blue-400 font-bold mb-1 uppercase">Pesan / Doa:</p>
                            <p className="text-sm text-blue-700 font-medium italic">" {donation.notes || 'Tidak ada pesan doa.'} "</p>
                        </div>

                        {/* --- BAGIAN UI BUKTI PEMBAYARAN (GABUNGAN) --- */}
                        <div className="mt-6 p-6 border rounded-2xl bg-gray-50">
                            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <Upload size={16} className="text-gray-400" /> Bukti Pembayaran
                            </h3>

                            {donation.proof_image ? (
                                <div className="space-y-4">
                                    <p className="text-xs text-gray-500">Donatur telah mengunggah bukti berikut:</p>
                                    <div className="relative group w-full max-w-xs overflow-hidden rounded-xl shadow-md border bg-white">
                                        <a href={donation.proof_image} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={donation.proof_image}
                                                alt="Bukti Bayar"
                                                className="w-full h-auto cursor-pointer hover:scale-105 transition duration-300"
                                            />
                                        </a>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                                            <Eye className="text-white" size={24} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 italic">*Klik gambar untuk memperbesar</p>

                                    <div>
                                        <label className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                                            <Upload size={14} /> Ganti Bukti Pembayaran
                                            <input type="file" className="hidden" onChange={handleImageUpload} accept=".jpg,.jpeg,.png,image/jpeg,image/png" disabled={isProcessing} />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 bg-white">
                                    <Upload size={32} className="mb-2 opacity-20" />
                                    <p className="text-sm mb-4">Donatur belum mengunggah bukti pembayaran.</p>
                                    <label className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-green-700 transition shadow-sm">
                                        Unggah Bukti Sekarang
                                        <input type="file" className="hidden" onChange={handleImageUpload} accept=".jpg,.jpeg,.png,image/jpeg,image/png" disabled={isProcessing} />
                                    </label>
                                </div>
                            )}
                        </div>
                        {/* -------------------------------------------- */}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-100 text-center lg:sticky lg:top-6">
                        <p className="text-gray-500 mb-2">Total Donasi</p>
                        <h1 className="text-2xl sm:text-4xl font-black text-green-600 mb-6 break-words">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(donation.nominal)}
                        </h1>

                        <div className="space-y-3 pt-4 border-t">
                            {donation.status === 'pending' ? (
                                <>
                                    <button
                                        onClick={() => handleUpdateStatus('paid')}
                                        disabled={isProcessing}
                                        className="w-full py-3 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Check size={20} /> {isProcessing ? 'Memproses...' : 'Terima Donasi'}
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus('failed')}
                                        disabled={isProcessing}
                                        className="w-full py-3 bg-white text-red-600 border border-red-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <X size={20} /> {isProcessing ? 'Memproses...' : 'Tolak / Gagal'}
                                    </button>
                                </>
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-xl text-gray-500 text-sm italic border border-dashed border-gray-200">
                                    Selesai diproses sebagai: <span className="font-bold text-gray-700">{donation.status.toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
