import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar({ auth }) {
    const { url } = usePage();
    const [isOpen, setIsOpen] = useState(false);

    // --- LOGIC STYLE ---
    const isActive = (path) => {
        // Cek apakah URL saat ini cocok dengan path menu
        const isCurrent =
            (path !== '/' && url.startsWith(path)) ||
            (path === '/' && url === '/');

        // Base class: Padding dan Rounded agar bentuknya konsisten
        const baseClass = "px-4 py-2 rounded-full transition duration-300 font-semibold";

        return isCurrent
            ? `${baseClass} bg-green-600 text-white shadow-md` // JIKA AKTIF: Hijau, Teks Putih (Tombol)
            : `${baseClass} text-gray-600 hover:text-green-700 hover:bg-green-50`; // JIKA TIDAK: Teks Abu, Hover Hijau Pudar
    };

    const mobileActive = (path) => {
        const isCurrent =
            (path !== '/' && url.startsWith(path)) ||
            (path === '/' && url === '/');

        return isCurrent
            ? "block px-3 py-2 text-white font-bold bg-green-600 rounded-md shadow-sm"
            : "block px-3 py-2 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-md transition";
    };

    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-green-100 shadow-sm sticky top-0 z-50">
            {/* Logo */}
            <div className="text-2xl font-bold text-green-700 italic flex items-center gap-2">
                <Link href="/" className="flex items-center hover:opacity-80 transition">
                    <span>Minhaj<span className="text-green-900">Peduli</span></span>
                </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2 text-sm font-semibold">
                <Link href="/" className={isActive('/')}>
                    Beranda
                </Link>

                <Link href="/about" className={isActive('/about')}>
                    Tentang
                </Link>

                <Link href="/laporan" className={isActive('/laporan')}>
                    Laporan Keuangan
                </Link>

                {/* Donasi sekarang menjadi menu biasa (hanya hijau jika aktif) */}
                <Link href="/donasi" className={isActive('/donasi')}>
                    Donasi
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="text-green-800 focus:outline-none p-2 rounded-md hover:bg-green-200 transition">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden border-t border-gray-100 transition-all duration-300 ease-in-out">
                    <div className="px-4 py-4 space-y-2">
                        <Link href="/" className={mobileActive('/')}>Beranda</Link>
                        <Link href="/about" className={mobileActive('/about')}>Tentang</Link>
                        <Link href="/laporan" className={mobileActive('/laporan')}>Laporan Keuangan</Link>
                        <Link href="/donasi" className={mobileActive('/donasi')}>Donasi</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
