import AdminLayout from '../../Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function EditProgram({ program }) {
    // Inisialisasi Form Inertia
    const { data, setData, post, processing, errors } = useForm({
        title: program.title || '',
        target_amount: program.target_amount || '',
        image: null,
        description: program.desc_short || '',
        _method: 'put',
    });

    // Fungsi Submit
    const submit = (e) => {
        e.preventDefault();
        post(route('admin.programs.update', program.id), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Edit Program" />
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg mt-4 sm:mt-10 p-5 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Program Donasi</h2>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Program</label>
                        <input
                            type="text"
                            className={`w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 ${errors.title ? 'border-red-500' : ''}`}
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Dana (Rp)</label>
                        <input
                            type="number"
                            className={`w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 ${errors.target_amount ? 'border-red-500' : ''}`}
                            value={data.target_amount}
                            onChange={e => setData('target_amount', e.target.value)}
                        />
                        {errors.target_amount && <p className="text-red-500 text-xs mt-1">{errors.target_amount}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Program</label>
                        <input
                            type="file"
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            onChange={e => setData('image', e.target.files[0])}
                        />
                        {program.image_path && (() => {
                            const clean = program.image_path.replace(/^\//, '');
                            const src = program.image_path.startsWith('http')
                                ? program.image_path
                                : (clean.startsWith('images/') ? `/${clean}` : `/storage/${clean}`);
                            return <img src={src} alt="Preview" className="w-32 h-20 object-cover mt-2 rounded" />;
                        })()}
                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                        <textarea
                            rows="3"
                            className="w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <a href={route('admin.programs')} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition">Batal</a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
