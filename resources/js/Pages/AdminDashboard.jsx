import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Users, FileText, Settings, BarChart3, Search, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

export default function AdminDashboard({ auth, users, submissions, stats }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [editingUser, setEditingUser] = useState(null);
    const [showAddUser, setShowAddUser] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        status: 'active'
    });

    const roles = ['admin', 'editor', 'moderator', 'user'];
    const statuses = ['active', 'inactive', 'suspended'];

    // Filter users berdasarkan search
    const filteredUsers = users?.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Handle tambah user
    const handleAddUser = (e) => {
        e.preventDefault();
        router.post(route('admin.users.store'), newUser, {
            onSuccess: () => {
                setNewUser({ name: '', email: '', password: '', role: 'user', status: 'active' });
                setShowAddUser(false);
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            }
        });
    };

    // Handle update user
    const handleSaveEdit = () => {
        router.put(route('admin.users.update', editingUser.id), editingUser, {
            onSuccess: () => {
                setEditingUser(null);
            },
            onError: (errors) => {
                console.error('Update errors:', errors);
            }
        });
    };

    // Handle delete user
    const handleDeleteUser = (userId) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            router.delete(route('admin.users.destroy', userId));
        }
    };

    // Handle update submission status
    const handleUpdateStatus = (submissionId, status) => {
        router.put(route('admin.submissions.update-status', submissionId), {
            status: status
        });
    };

    // Default stats jika tidak ada dari backend
    const defaultStats = [
        { label: 'Total Users', value: users?.length || 0, icon: Users, color: 'bg-blue-500' },
        { label: 'Total Submissions', value: submissions?.length || 0, icon: FileText, color: 'bg-green-500' },
        { label: 'Pending Review', value: submissions?.filter(s => s.status === 'pending').length || 0, icon: BarChart3, color: 'bg-yellow-500' },
        { label: 'Active Users', value: users?.filter(u => u.status === 'active').length || 0, icon: Users, color: 'bg-purple-500' }
    ];

    const displayStats = stats || defaultStats;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Admin Dashboard
                    </h2>
                    {auth.user.role === 'admin' && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            Administrator
                        </span>
                    )}
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Navigation Tabs */}
                    <div className="bg-white rounded-t-lg shadow">
                        <nav className="flex border-b overflow-x-auto">
                            {['dashboard', 'users', 'submissions'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-4 sm:px-6 font-medium text-sm capitalize whitespace-nowrap ${
                                        activeTab === tab
                                            ? 'border-b-2 border-blue-500 text-blue-600'
                                            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <div className="bg-white rounded-b-lg shadow p-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {displayStats.map((stat, idx) => (
                                    <div key={idx} className="bg-white border rounded-lg p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-500 text-sm">{stat.label}</p>
                                                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                            </div>
                                            <div className={`${stat.color} p-3 rounded-lg`}>
                                                <stat.icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Activity */}
                            <div className="border rounded-lg">
                                <div className="p-4 border-b bg-gray-50">
                                    <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
                                </div>
                                <div className="divide-y">
                                    {submissions?.slice(0, 5).map(sub => (
                                        <div key={sub.id} className="p-4 hover:bg-gray-50">
                                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">{sub.user_name}</p>
                                                    <p className="text-sm text-gray-500 truncate">{sub.type} - {sub.content}</p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(sub.created_at).toLocaleDateString('id-ID')}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                                                        sub.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {sub.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="bg-white rounded-b-lg shadow">
                            <div className="p-6 border-b">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Manajemen User & Role</h3>
                                    <button
                                        onClick={() => setShowAddUser(!showAddUser)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Tambah User</span>
                                    </button>
                                </div>
                                <div className="relative">
                                    <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari user..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Form Tambah User */}
                            {showAddUser && (
                                <form onSubmit={handleAddUser} className="p-6 bg-blue-50 border-b">
                                    <h4 className="font-semibold mb-4">Tambah User Baru</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Nama"
                                            required
                                            value={newUser.name}
                                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                            className="px-4 py-2 border rounded-lg"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            required
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            className="px-4 py-2 border rounded-lg"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            required
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            className="px-4 py-2 border rounded-lg"
                                        />
                                        <select
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                            className="px-4 py-2 border rounded-lg"
                                        >
                                            {roles.map(role => (
                                                <option key={role} value={role} className="capitalize">{role}</option>
                                            ))}
                                        </select>
                                        <div className="flex space-x-2">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                            >
                                                Simpan
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddUser(false)}
                                                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* Tabel Users */}
                            <div className="overflow-x-auto">
                                <table className="min-w-[760px] w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                            <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                            <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filteredUsers.map(user => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                {editingUser?.id === user.id ? (
                                                    <>
                                                        <td className="px-3 py-4 sm:px-6">
                                                            <input
                                                                type="text"
                                                                value={editingUser.name}
                                                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                                                className="px-2 py-1 border rounded w-full"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-4 sm:px-6">
                                                            <input
                                                                type="email"
                                                                value={editingUser.email}
                                                                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                                                className="px-2 py-1 border rounded w-full"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-4 sm:px-6">
                                                            <select
                                                                value={editingUser.role}
                                                                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                                                className="px-2 py-1 border rounded w-full"
                                                            >
                                                                {roles.map(role => (
                                                                    <option key={role} value={role} className="capitalize">{role}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-4 sm:px-6">
                                                            <select
                                                                value={editingUser.status}
                                                                onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                                                                className="px-2 py-1 border rounded w-full"
                                                            >
                                                                {statuses.map(status => (
                                                                    <option key={status} value={status} className="capitalize">{status}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-4 sm:px-6">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={handleSaveEdit}
                                                                    className="text-green-600 hover:text-green-800"
                                                                >
                                                                    <Save className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingUser(null)}
                                                                    className="text-gray-600 hover:text-gray-800"
                                                                >
                                                                    <X className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="px-3 py-4 sm:px-6 font-medium text-gray-900">{user.name}</td>
                                                        <td className="px-3 py-4 sm:px-6 text-gray-500">{user.email}</td>
                                                        <td className="px-3 py-4 sm:px-6">
                                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-4 sm:px-6">
                                                            <span className={`px-3 py-1 rounded-full text-sm capitalize ${
                                                                user.status === 'active' ? 'bg-green-100 text-green-800' :
                                                                user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                                                'bg-red-100 text-red-800'
                                                            }`}>
                                                                {user.status || 'active'}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-4 sm:px-6">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => setEditingUser({ ...user })}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <Edit2 className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteUser(user.id)}
                                                                    className="text-red-600 hover:text-red-800"
                                                                    disabled={user.id === auth.user.id}
                                                                >
                                                                    <Trash2 className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Submissions Tab */}
                    {activeTab === 'submissions' && (
                        <div className="bg-white rounded-b-lg shadow">
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-semibold text-gray-900">Data Inputan</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-[900px] w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                            <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                            <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                                            <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase">Konten</th>
                                            <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                            <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {submissions?.map(sub => (
                                            <tr key={sub.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-4 sm:px-6 text-sm text-gray-900">#{sub.id}</td>
                                                <td className="px-3 py-4 sm:px-6 font-medium text-gray-900">{sub.user_name}</td>
                                                <td className="px-3 py-4 sm:px-6 text-gray-500">{sub.type}</td>
                                                <td className="px-3 py-4 sm:px-6 text-gray-500">{sub.content}</td>
                                                <td className="px-3 py-4 sm:px-6 text-gray-500">
                                                    {new Date(sub.created_at).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-3 py-4 sm:px-6">
                                                    <select
                                                        value={sub.status}
                                                        onChange={(e) => handleUpdateStatus(sub.id, e.target.value)}
                                                        className={`px-3 py-1 rounded-full text-sm border-0 font-medium capitalize ${
                                                            sub.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                            sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="approved">Approved</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </td>
                                                <td className="px-3 py-4 sm:px-6">
                                                    <button
                                                        onClick={() => router.visit(route('admin.submissions.show', sub.id))}
                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        Lihat Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
