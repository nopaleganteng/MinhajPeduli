import AdminLayout from '../../Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, ShieldCheck, Users as UsersIcon, Save, X } from 'lucide-react';
import { useState } from 'react';

const formatDate = (value) => value || '-';

export default function Users({ users = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        role: 'admin',
        password: '',
        password_confirmation: '',
    });

    const openCreateModal = () => {
        setEditingUser(null);
        clearErrors();
        reset();
        setData('role', 'admin');
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        clearErrors();
        setData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'admin',
            password: '',
            password_confirmation: '',
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
        clearErrors();
        reset();
    };

    const submit = (e) => {
        e.preventDefault();

        const payload = { ...data };

        if (editingUser) {
            put(route('admin.users.update', editingUser.id), {
                data: payload,
                onSuccess: closeModal,
            });
            return;
        }

        post(route('admin.users.store'), {
            data: payload,
            onSuccess: closeModal,
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus admin ini?')) return;
        router.delete(route('admin.users.destroy', id), { preserveScroll: true });
    };

    const handleApprove = (id) => {
        router.post(route('admin.users.approve', id), {}, { preserveScroll: true });
    };

    const handleReject = (id) => {
        router.post(route('admin.users.reject', id), {}, { preserveScroll: true });
    };

    const statusStyles = {
        approved: 'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
        rejected: 'bg-red-100 text-red-700',
    };

    const statusLabels = {
        approved: 'Disetujui',
        pending: 'Menunggu',
        rejected: 'Ditolak',
    };

    return (
        <AdminLayout>
            <Head title="Kelola Admin" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Kelola Admin</h2>
                    <p className="text-sm text-gray-500">Atur akun admin di bawah superadmin.</p>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition"
                >
                    <Plus size={18} /> Tambah Admin
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <UsersIcon size={16} className="text-green-600" /> Total Admin
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{users.length}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm md:col-span-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <ShieldCheck size={16} className="text-blue-600" /> Hak Akses
                    </div>
                    <p className="text-sm text-gray-600">Superadmin memiliki kontrol penuh, sementara admin bawahan punya akses terbatas sesuai tugas operasional.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Peran Superadmin</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Mengelola seluruh akun admin</li>
                        <li>• Menambah, mengedit, dan menghapus admin</li>
                        <li>• Mengakses semua data donasi, program, dan laporan</li>
                        <li>• Mengelola pengaturan website dan informasi publik</li>
                    </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Peran Admin Bawahan</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Mengelola donasi masuk dan validasi</li>
                        <li>• Mengelola program dan pengeluaran</li>
                        <li>• Melihat laporan keuangan</li>
                        <li>• Tidak bisa menambah atau menghapus akun admin lain</li>
                    </ul>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-[900px] w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-widest">
                            <tr>
                                <th className="px-5 py-3">Nama</th>
                                <th className="px-5 py-3">Email</th>
                                <th className="px-5 py-3">Telepon</th>
                                <th className="px-5 py-3">Role</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">Tanggal Buat</th>
                                <th className="px-5 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-5 py-12 text-center text-gray-500">
                                        Belum ada data admin.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4 font-semibold text-gray-800">{user.name}</td>
                                        <td className="px-5 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-5 py-4 text-gray-600">{user.phone || '-'}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {user.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[user.status] || 'bg-gray-100 text-gray-700'}`}>
                                                {statusLabels[user.status] || 'Approved'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">{formatDate(user.created_at)}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2 flex-wrap">
                                                {user.status !== 'approved' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleApprove(user.id)}
                                                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition text-xs font-medium"
                                                    >
                                                        Setujui
                                                    </button>
                                                )}
                                                {user.status !== 'rejected' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleReject(user.id)}
                                                        className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-600 hover:text-white transition text-xs font-medium"
                                                    >
                                                        Tolak
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(user)}
                                                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                                                    title="Edit"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    {editingUser ? 'Edit Admin' : 'Tambah Admin'}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Pendaftaran admin dilakukan di bawah superadmin untuk menjaga keamanan akses.</p>
                            </div>
                            <button type="button" onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={`w-full border rounded-lg px-3 py-2.5 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                                    />
                                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="superadmin">Super Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`w-full border rounded-lg px-3 py-2.5 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                                />
                            </div>

                            {!editingUser && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-2.5 ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                                        />
                                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                                        <input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-3">
                                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-60"
                                >
                                    {processing ? <Save size={16} className="animate-spin" /> : <Save size={16} />}
                                    {processing ? 'Menyimpan...' : editingUser ? 'Update Admin' : 'Simpan Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
