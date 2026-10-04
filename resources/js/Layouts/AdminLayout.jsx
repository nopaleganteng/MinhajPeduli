import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Wallet,
    Users,
    FileText,
    LogOut,
    Settings,
    Menu,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";

function normalizeStorageImage(path) {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    return `/storage/${String(path).replace(/^\/+/, '')}`;
}

export default function AdminLayout({ children }) {
    const { url, props } = usePage();
    const authUser = props?.auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

    const labelsVisible = sidebarOpen || mobileOpen;

    // Tutup drawer mobile saat route berganti
    useEffect(() => {
        setMobileOpen(false);
    }, [url]);

    const handleToggleSidebar = () => {
        if (window.innerWidth < 1024) {
            setMobileOpen((v) => !v);
        } else {
            setSidebarOpen((v) => !v);
        }
    };

    const operationalMenu = [
        {
            label: "Dashboard",
            icon: <LayoutDashboard size={18} />,
            href: route("admin.dashboard"),
        },
        {
            label: "Donasi Masuk",
            icon: <Wallet size={18} />,
            href: route("admin.donations"),
        },
        {
            label: "Kelola Program",
            icon: <FileText size={18} />,
            href: route("admin.programs"),
        },
        {
            label: "Pengeluaran",
            icon: <Wallet size={18} />,
            href: route("admin.expenses"),
        },
        {
            label: "Data Donatur",
            icon: <Users size={18} />,
            href: route("admin.donatur"),
        },
    ];

    const isSuperAdmin = authUser?.role === "superadmin";
    const roleLabel = isSuperAdmin ? "Super Admin" : "Administrator";
    const roleBadgeClass = isSuperAdmin
        ? "bg-amber-100 text-amber-800 border border-amber-200"
        : "bg-blue-100 text-blue-800 border border-blue-200";

    const managementMenu = [];

    if (authUser?.role === "superadmin") {
        managementMenu.push({
            label: "Kelola Admin",
            icon: <Users size={18} />,
            href: route("admin.users"),
        });
    }

    managementMenu.push({
        label: "Profil & Pengaturan",
        icon: <Settings size={18} />,
        href: route("admin.settings"),
    });

    const renderMenu = (items) => items.map((item) => {
        const isActive = url.startsWith(item.href);
        return (
            <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive ? "bg-green-700 text-white shadow-md" : "text-green-100 hover:bg-green-800 hover:text-white"}`}
            >
                <div>{item.icon}</div>
                <span className={`${!labelsVisible && "hidden"} font-medium whitespace-nowrap`}>
                    {item.label}
                </span>
            </Link>
        );
    });

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-slate-800">
            {/* Backdrop mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`${(sidebarOpen || mobileOpen) ? "w-64" : "w-20"} bg-green-900 text-white transition-all duration-300 fixed h-full z-40 flex flex-col
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
            >
                <div className="h-20 flex items-center justify-center border-b border-green-800 px-3">
                    {labelsVisible ? (
                        <div className="text-center">
                            <h1 className="text-xl font-bold italic">
                                Minhaj<span className="text-green-400">Admin</span>
                            </h1>
                            <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${roleBadgeClass}`}>
                                {roleLabel}
                            </span>
                        </div>
                    ) : (
                        <span className="font-bold text-xl">MP</span>
                    )}
                </div>

                <div className="px-3 pt-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-200/80 px-2 pb-2">
                        Operasional
                    </div>
                </div>

                <nav className="py-2 space-y-2 px-3 overflow-y-auto">
                    {renderMenu(operationalMenu)}
                </nav>

                {managementMenu.length > 0 && (
                    <>
                        <div className="px-3 pt-4 pb-2">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-200/80 px-2 pb-2">
                                Manajemen
                            </div>
                        </div>
                        <nav className="pb-2 space-y-2 px-3 overflow-y-auto">
                            {renderMenu(managementMenu)}
                        </nav>
                    </>
                )}

                {/* Footer Sidebar (Logout) */}
                <div
                    className={`p-4 border-t border-green-800 ${!labelsVisible && "flex justify-center"}`}
                >
                    <button
                        type="button"
                        onClick={() => setLogoutConfirmOpen(true)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-colors text-red-100 hover:bg-red-800 ${!labelsVisible && "w-auto"}`}
                    >
                        <LogOut size={20} />
                        <span
                            className={`${!labelsVisible && "hidden"} font-medium`}
                        >
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            {/* Logout confirmation modal (di luar aside agar fixed tidak tergeser transform) */}
            {logoutConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 border border-gray-200">
                        <h3 className="text-lg font-bold mb-2 text-black">
                            Konfirmasi Logout
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Apakah Anda yakin ingin logout?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setLogoutConfirmOpen(false)}
                                className="px-4 py-2 rounded bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                            >
                                Tidak
                            </button>
                            <Link
                                href={route("admin.logout")}
                                method="post"
                                as="button"
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                                onClick={() => setLogoutConfirmOpen(false)}
                            >
                                Iya
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main
                className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}
            >
                {/* Top Header/Navbar */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 border-b border-gray-100">
                    {/* Tombol Toggle Sidebar */}
                    <button
                        type="button"
                        onClick={handleToggleSidebar}
                        aria-label="Toggle menu"
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded transition"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    {/* Profil User */}
                    <div className="flex items-center gap-3 cursor-pointer">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-gray-700">
                                {authUser?.name || "Admin Yayasan"}
                            </p>
                            <div className="flex justify-end mt-1">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${roleBadgeClass}`}>
                                    {roleLabel}
                                </span>
                            </div>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold border border-green-200 shrink-0 overflow-hidden">
                            {authUser?.image ? (
                                <img
                                    src={normalizeStorageImage(authUser.image)}
                                    alt={authUser.name || "Admin"}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                (authUser?.name || "AY").slice(0, 2).toUpperCase()
                            )}
                        </div>
                    </div>
                </header>

                {/* Konten Halaman (Children) */}
                <div className="p-6 md:p-8">{children}</div>
            </main>
        </div>
    );
}
