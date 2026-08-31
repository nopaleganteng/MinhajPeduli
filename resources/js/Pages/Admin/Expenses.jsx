import AdminLayout from '../../Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Wallet, FileText, X, Save, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(Number(value || 0));

export default function Expenses({ expenses = [], filters = {} }) {
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [editingExpense, setEditingExpense] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(filters.category || 'all');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'transaction_date');
    const [direction, setDirection] = useState(filters.direction || 'desc');
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm({
        title: '',
        category: 'operasional',
        nominal: '',
        transaction_date: new Date().toISOString().slice(0, 10),
        description: '',
    });

    const filteredExpenses = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return expenses;

        return (expenses || []).filter((expense) =>
            [expense.title, expense.category, expense.description]
                .join(' ')
                .toLowerCase()
                .includes(q)
        );
    }, [expenses, search]);

    const openCreateModal = () => {
        setEditingExpense(null);
        clearErrors();
        reset();
        setShowModal(true);
    };

    const openEditModal = (expense) => {
        setEditingExpense(expense);
        clearErrors();
        setData({
            title: expense.title || '',
            category: expense.category || 'operasional',
            nominal: expense.nominal || '',
            transaction_date: expense.transaction_date || new Date().toISOString().slice(0, 10),
            description: expense.description || '',
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingExpense(null);
        clearErrors();
        reset();
    };

    const submit = (e) => {
        e.preventDefault();

        const payload = {
            ...data,
            nominal: Number(data.nominal),
        };

        if (editingExpense) {
            put(route('admin.expenses.update', editingExpense.id), {
                data: payload,
                onSuccess: closeModal,
            });
            return;
        }

        post(route('admin.expenses.store'), {
            data: payload,
            onSuccess: closeModal,
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) {
            return;
        }

        router.delete(route('admin.expenses.destroy', id), {
            preserveScroll: true,
        });
    };

    const totalExpense = (expenses || []).reduce((sum, item) => sum + Number(item.nominal || 0), 0);
    const submitLabel = editingExpense ? 'Update' : 'Simpan';

    const applyFilters = (next = {}) => {
        const params = {
            category: next.category ?? categoryFilter,
            start_date: next.start_date ?? startDate,
            end_date: next.end_date ?? endDate,
            sort_by: next.sort_by ?? sortBy,
            direction: next.direction ?? direction,
        };

        router.get(route('admin.expenses'), params, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setCategoryFilter('all');
        setStartDate('');
        setEndDate('');
        setSortBy('transaction_date');
        setDirection('desc');
        setShowFilterMenu(false);
        router.get(route('admin.expenses'), {}, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout>
            <Head title="Pengeluaran Keuangan" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Pengeluaran Keuangan</h2>
                    <p className="text-sm text-gray-500">Kelola catatan pengeluaran untuk laporan keuangan.</p>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition"
                >
                    <Plus size={18} /> Tambah Pengeluaran
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <Wallet size={16} className="text-green-600" /> Total Pengeluaran
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{formatRupiah(totalExpense)}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm md:col-span-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <FileText size={16} className="text-blue-600" /> Catatan
                    </div>
                    <p className="text-sm text-gray-600">Semua pengeluaran yang tercatat akan otomatis masuk ke ringkasan laporan keuangan publik.</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="relative w-full md:w-72">
                        <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari pengeluaran..."
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowFilterMenu((prev) => !prev)}
                                className="inline-flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Filter & Sort
                            </button>

                            {showFilterMenu && (
                                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-20 p-4">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Kategori</label>
                                            <select
                                                value={categoryFilter}
                                                onChange={(e) => {
                                                    const next = e.target.value;
                                                    setCategoryFilter(next);
                                                    applyFilters({ category: next });
                                                }}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                            >
                                                <option value="all">Semua</option>
                                                <option value="operasional">Operasional</option>
                                                <option value="konsumsi">Konsumsi</option>
                                                <option value="pendidikan">Pendidikan</option>
                                                <option value="program">Program</option>
                                                <option value="lainnya">Lainnya</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Dari</label>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => {
                                                        setStartDate(e.target.value);
                                                        applyFilters({ start_date: e.target.value });
                                                    }}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Sampai</label>
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => {
                                                        setEndDate(e.target.value);
                                                        applyFilters({ end_date: e.target.value });
                                                    }}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Urutkan</label>
                                            <select
                                                value={sortBy}
                                                onChange={(e) => {
                                                    const next = e.target.value;
                                                    setSortBy(next);
                                                    applyFilters({ sort_by: next });
                                                }}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                            >
                                                <option value="transaction_date">Tanggal</option>
                                                <option value="nominal">Nominal</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Arah</label>
                                            <select
                                                value={direction}
                                                onChange={(e) => {
                                                    const next = e.target.value;
                                                    setDirection(next);
                                                    applyFilters({ direction: next });
                                                }}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                            >
                                                <option value="desc">Terbaru dulu</option>
                                                <option value="asc">Terlama dulu</option>
                                            </select>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="w-full mt-1 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium"
                                        >
                                            Reset Filter
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-sm text-gray-500">{filteredExpenses.length} data</div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-widest">
                            <tr>
                                <th className="px-5 py-3">Judul</th>
                                <th className="px-5 py-3">Kategori</th>
                                <th className="px-5 py-3">Tanggal</th>
                                <th className="px-5 py-3">Nominal</th>
                                <th className="px-5 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-5 py-12 text-center text-gray-500">
                                        Belum ada data pengeluaran.
                                    </td>
                                </tr>
                            ) : (
                                filteredExpenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-gray-800">{expense.title}</div>
                                            <div className="text-xs text-gray-500 mt-1">{expense.description || 'Tidak ada deskripsi'}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium capitalize">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">{expense.transaction_date}</td>
                                        <td className="px-5 py-4 font-bold text-red-600">{formatRupiah(expense.nominal)}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(expense)}
                                                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                                                    title="Edit"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(expense.id)}
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
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingExpense ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
                            </h3>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div>
                                <label htmlFor="expense-title" className="block text-sm font-medium text-gray-700 mb-1">Judul Pengeluaran</label>
                                <input
                                    id="expense-title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className={`w-full border rounded-lg px-3 py-2.5 ${errors.title ? 'border-red-400' : 'border-gray-300'}`}
                                />
                                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="expense-category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                    <select
                                        id="expense-category"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                                    >
                                        <option value="operasional">Operasional</option>
                                        <option value="konsumsi">Konsumsi</option>
                                        <option value="pendidikan">Pendidikan</option>
                                        <option value="program">Program</option>
                                        <option value="lainnya">Lainnya</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="expense-nominal" className="block text-sm font-medium text-gray-700 mb-1">Nominal</label>
                                    <input
                                        id="expense-nominal"
                                        type="number"
                                        min="0"
                                        value={data.nominal}
                                        onChange={(e) => setData('nominal', e.target.value)}
                                        className={`w-full border rounded-lg px-3 py-2.5 ${errors.nominal ? 'border-red-400' : 'border-gray-300'}`}
                                    />
                                    {errors.nominal && <p className="text-xs text-red-500 mt-1">{errors.nominal}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="expense-date" className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                                <input
                                    id="expense-date"
                                    type="date"
                                    value={data.transaction_date}
                                    onChange={(e) => setData('transaction_date', e.target.value)}
                                    className={`w-full border rounded-lg px-3 py-2.5 ${errors.transaction_date ? 'border-red-400' : 'border-gray-300'}`}
                                />
                                {errors.transaction_date && <p className="text-xs text-red-500 mt-1">{errors.transaction_date}</p>}
                            </div>

                            <div>
                                <label htmlFor="expense-description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea
                                    id="expense-description"
                                    rows="3"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-60"
                                >
                                    {processing ? <Save size={16} className="animate-spin" /> : <Save size={16} />}
                                    {processing ? 'Menyimpan...' : submitLabel}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
