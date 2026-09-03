import AdminLayout from "../../Layouts/AdminLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { Plus, Edit, Trash2, Search, Filter, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Program({ programs = [] }) {
    // State untuk mengontrol Modal
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    const [showFlash, setShowFlash] = useState(true);
    const { flash = {} } = usePage().props;

    useEffect(() => {
        if (flash.success || flash.error) {
            setShowFlash(true);
        }
    }, [flash.success, flash.error]);

    // Inisialisasi Form Inertia
    const { data, setData, post, processing, reset, errors } = useForm({
        title: "",
        target_amount: "",
        image: null,
        description: "",
    });

    // Fungsi Submit
    const submit = (e) => {
        e.preventDefault();
        post(route("admin.programs.store"), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm("Program beserta seluruh donasinya akan dihapus permanen dan total donasi ikut berkurang. Lanjut?")) {
            return;
        }

        router.delete(route("admin.donasi.destroy", id), {
            preserveScroll: true,
        });
    };

    const visiblePrograms = (programs || []).filter((item) => {
        const q = searchQuery.trim().toLowerCase();
        const matchesText = !q || (item.title || "").toLowerCase().includes(q);
        const matchesStatus =
            statusFilter === "all" ||
            (item.status || "").toLowerCase() === statusFilter.toLowerCase();

        return matchesText && matchesStatus;
    });

    return (
        <AdminLayout>
            <Head title="Kelola Program" />

            {/* Header Halaman */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Daftar Program Donasi
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Kelola kampanye donasi yang sedang berjalan.
                    </p>
                </div>
                {/* MODIFIKASI: Menambahkan fungsi onClick untuk buka modal */}
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition flex items-center gap-2"
                >
                    <Plus size={18} /> Tambah Program
                </button>
            </div>

            {/* Filter & Pencarian */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Cari nama program..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowStatusMenu((prev) => !prev)}
                        className="flex items-center gap-2 bg-gray-50 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 text-gray-700"
                    >
                        <Filter size={16} />
                        {statusFilter === "all" ? "Filter Status" : `Status: ${statusFilter}`}
                    </button>

                    {showStatusMenu && (
                        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                            {[
                                { value: "all", label: "Semua" },
                                { value: "Aktif", label: "Aktif" },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        setStatusFilter(option.value);
                                        setShowStatusMenu(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                                        statusFilter === option.value ? "bg-green-50 text-green-700 font-semibold" : "text-gray-700"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Notifikasi Flash */}
            {showFlash && (flash.success || flash.error) && (
                <div
                    className={`mb-6 flex items-center justify-between gap-4 px-4 py-3 rounded-lg border text-sm font-medium ${
                        flash.error
                            ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-green-50 border-green-200 text-green-700"
                    }`}
                >
                    <span>{flash.error || flash.success}</span>
                    <button
                        type="button"
                        onClick={() => setShowFlash(false)}
                        className="shrink-0 opacity-60 hover:opacity-100 transition"
                        aria-label="Tutup notifikasi"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Grid Program (Kode asli Anda tetap dipertahankan) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visiblePrograms.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition duration-300 group"
                        >
                            {/* Gambar */}
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                                <div
                                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                        item.status === "Aktif"
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-500 text-white"
                                    }`}
                                >
                                    {item.status}
                                </div>
                            </div>

                            {/* Konten */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-gray-800 text-lg mb-3 leading-snug line-clamp-2">
                                    {item.title}
                                </h3>

                                <div className="space-y-4 mb-6">
                                    {/* Progress Bar */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-500">
                                                Terkumpul
                                            </span>
                                            <span className="font-bold text-green-700">
                                                {item.collected_formatted}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div
                                                className="bg-green-500 h-2.5 rounded-full"
                                                style={{
                                                    width: `${item.progress}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>
                                                Target: {item.target_formatted}
                                            </span>
                                            <span>{item.progress}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol Aksi */}
                                <div className="mt-auto flex gap-3 pt-4 border-t border-gray-100">
                                    <a
                                        href={route(
                                            "admin.donasi.edit",
                                            item.id,
                                        )}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 hover:text-green-700 font-medium transition"
                                    >
                                        <Edit size={16} /> Edit
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item.id)}
                                        className="flex-none p-2.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition tooltip"
                                        title="Hapus Program"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {/* MODAL FORM TAMBAH PROGRAM */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-bold text-gray-800">
                                Tambah Program Baru
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Program
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Pembangunan Masjid"
                                    className={`w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 ${errors.title ? "border-red-500" : ""}`}
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Target Dana (Rp)
                                </label>
                                <input
                                    type="number"
                                    placeholder="Masukkan angka saja"
                                    className={`w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 ${errors.target_amount ? "border-red-500" : ""}`}
                                    value={data.target_amount}
                                    onChange={(e) =>
                                        setData("target_amount", e.target.value)
                                    }
                                />
                                {errors.target_amount && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.target_amount}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gambar Program
                                </label>
                                <input
                                    type="file"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                    onChange={(e) =>
                                        setData("image", e.target.files[0])
                                    }
                                />
                                {errors.image && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.image}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 text-sm">
                                    Deskripsi Singkat
                                </label>
                                <textarea
                                    rows="3"
                                    className="w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition disabled:opacity-50"
                                >
                                    {processing
                                        ? "Menyimpan..."
                                        : "Simpan Program"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
