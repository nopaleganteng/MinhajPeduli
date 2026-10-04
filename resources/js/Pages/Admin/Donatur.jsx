import AdminLayout from "../../Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { Search, Mail, Phone, Download } from "lucide-react";
import { useEffect, useState } from "react";

// Admin donors list — parses exported CSV and presents searchable aggregated donors
export default function Donatur() {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const url = route("admin.donations.export") + "?status=paid";

        fetch(url, { credentials: "same-origin" })
            .then((res) => {
                if (!res.ok)
                    throw new Error("Gagal mengambil data donasi (CSV)");
                return res.text();
            })
            .then((csvText) => {
                try {
                    const lines = csvText.trim().split("\n");
                    if (lines.length <= 1) {
                        setDonors([]);
                        setLoading(false);
                        return;
                    }

                    const rows = lines.slice(1).map((line) => {
                        const cols = line.split(",");
                        return {
                            invoice: cols[0] ?? "",
                            name: (cols[1] ?? "").trim(),
                            email: (cols[2] ?? "").trim(),
                            phone: (cols[3] ?? "").trim(),
                            nominal:
                                Number(
                                    (cols[4] ?? "0").replace(/[^0-9\-]/g, ""),
                                ) || 0,
                            status: (cols[5] ?? "").trim(),
                            tanggal_raw: (cols[6] ?? "").trim(),
                        };
                    });

                    // aggregate by name+email+phone (simple key)
                    const byDonor = rows.reduce((acc, r) => {
                        const key = `${r.name}|${r.email}|${r.phone}`;
                        if (!acc[key]) {
                            acc[key] = {
                                id: Object.keys(acc).length + 1,
                                name: r.name || "-",
                                email: r.email || "-",
                                phone: r.phone || "-",
                                total_donasi: 0,
                                last_donation: r.tanggal_raw || "-",
                            };
                        }
                        acc[key].total_donasi += r.nominal || 0;
                        // use latest tanggal_raw if present (string compare ok for ISO-like)
                        if (
                            r.tanggal_raw &&
                            r.tanggal_raw > (acc[key].last_donation || "")
                        ) {
                            acc[key].last_donation = r.tanggal_raw;
                        }
                        return acc;
                    }, {});

                    setDonors(Object.values(byDonor));
                } catch (e) {
                    setError(String(e));
                } finally {
                    setLoading(false);
                }
            })
            .catch((err) => {
                setError(err.message || String(err));
                setLoading(false);
            });
    }, []);

    const filtered = (() => {
        const q = searchTerm.toLowerCase().trim();
        if (!q) return donors;
        return donors.filter(
            (d) =>
                (d.name || "").toLowerCase().includes(q) ||
                (d.email || "").toLowerCase().includes(q) ||
                (d.phone || "").toLowerCase().includes(q),
        );
    })();

    return (
        <AdminLayout>
            <Head title="Database Donatur" />

            <div className="p-0 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between mb-4">
                    <h1 className="text-lg font-bold">Database Donatur</h1>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="relative w-full sm:w-auto">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={16}
                            />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari nama, email, atau telepon"
                                className="pl-9 pr-3 py-2 border rounded w-full sm:w-64"
                            />
                        </div>
                        <a
                            href={
                                route("admin.donations.export") + "?status=paid"
                            }
                            className="flex items-center justify-center gap-2 text-sm text-blue-600"
                        >
                            <Download size={16} /> Ekspor CSV
                        </a>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white border rounded">
                    <table className="min-w-[720px] w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-3 py-3 md:px-6">Nama</th>
                                <th className="text-left px-3 py-3 md:px-6">Kontak</th>
                                <th className="text-left px-3 py-3 md:px-6">
                                    Total Donasi
                                </th>
                                <th className="text-left px-3 py-3 md:px-6">
                                    Terakhir Donasi
                                </th>
                                <th className="text-center px-3 py-3 md:px-6">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {error ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-3 py-6 md:px-6 text-center text-red-600"
                                    >
                                        Gagal memuat data donatur: {error}
                                    </td>
                                </tr>
                            ) : loading ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-3 py-6 md:px-6 text-center text-gray-500"
                                    >
                                        Memuat data donatur…
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-3 py-6 md:px-6 text-center text-gray-500"
                                    >
                                        Tidak ada hasil.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-3 py-4 md:px-6">
                                            <div className="font-bold text-gray-800">
                                                {item.name}
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 md:px-6">
                                            <div className="flex flex-col gap-1 text-xs">
                                                {item.email &&
                                                    item.email !== "-" && (
                                                        <div className="flex items-center gap-1">
                                                            <Mail
                                                                size={12}
                                                                className="text-gray-400"
                                                            />{" "}
                                                            {item.email}
                                                        </div>
                                                    )}
                                                {item.phone &&
                                                    item.phone !== "-" && (
                                                        <div className="flex items-center gap-1">
                                                            <Phone
                                                                size={12}
                                                                className="text-gray-400"
                                                            />{" "}
                                                            {item.phone}
                                                        </div>
                                                    )}
                                                {(!item.email ||
                                                    item.email === "-") &&
                                                    (!item.phone ||
                                                        item.phone === "-") && (
                                                        <span className="text-gray-400 italic">
                                                            Tidak ada data
                                                        </span>
                                                    )}
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 md:px-6 font-semibold text-green-600">
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                            }).format(item.total_donasi || 0)}
                                        </td>
                                        <td className="px-3 py-4 md:px-6 text-gray-500">
                                            {item.last_donation}
                                        </td>
                                        <td className="px-3 py-4 md:px-6 text-center">
                                            <button className="text-blue-600 hover:underline text-xs font-bold bg-blue-50 px-3 py-1 rounded">
                                                Lihat Riwayat
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
