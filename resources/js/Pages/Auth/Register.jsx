import { Head, useForm, Link } from '@inertiajs/react';
import { User, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // Mengirim data ke route register bawaan Laravel Breeze/Auth
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Daftar Donatur" />

            <div className="min-h-screen w-full flex bg-gray-50">

                {/* --- BAGIAN KIRI: Form Register --- */}
                <div className="w-full lg:w-1/2 flex flex-col justify-start items-center px-8 pt-24 pb-12 sm:justify-center sm:pt-8 lg:p-12 relative">

                    {/* Tombol Kembali ke Login */}
                    <Link href={route('login')} className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-green-700 transition text-sm font-medium">
                        <ArrowLeft size={18} className="mr-2" /> Kembali ke Login
                    </Link>

                    <div className="w-full max-w-md">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-green-800 italic mb-2">
                                Daftar<span className="text-green-600">Donatur</span>
                            </h1>
                            <p className="text-gray-500">Halaman ini khusus untuk pengguna umum dan donatur. Akun admin dibuat lewat panel superadmin.</p>
                        </div>

                        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                            Catatan: akun untuk mengelola sistem tidak dibuat dari halaman ini.
                        </div>

                        {/* Form */}
                        <form onSubmit={submit} className="space-y-5">

                            {/* Input Nama */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition shadow-sm placeholder-gray-400"
                                        placeholder="Nama Admin"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                            </div>

                            {/* Input Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition shadow-sm placeholder-gray-400"
                                        placeholder="admin@minhaj.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                            </div>

                            {/* Input Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition shadow-sm placeholder-gray-400"
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition shadow-sm placeholder-gray-400"
                                        placeholder="••••••••"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.password_confirmation && <div className="text-red-500 text-xs mt-1">{errors.password_confirmation}</div>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition transform active:scale-95 disabled:opacity-50 mt-6"
                            >
                                {processing ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                                {!processing && <ArrowRight className="ml-2 h-4 w-4" />}
                            </button>

                            <div className="text-center mt-4">
                                <p className="text-sm text-gray-600">
                                    Sudah punya akun?{' '}
                                    <Link href={route('login')} className="text-green-700 hover:text-green-900 font-bold hover:underline">
                                        Masuk di sini
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* --- BAGIAN KANAN: Gambar Dekorasi --- */}
                <div className="hidden lg:block w-1/2 bg-green-800 relative overflow-hidden">
                    <img
                        src="/images/pesantren2.png" // Menggunakan gambar yang berbeda dari login agar variatif
                        alt="Pesantren View"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-green-900/90 to-green-800/60"></div>

                    <div className="relative z-10 flex flex-col justify-center items-center h-full text-white px-16 text-center">
                        <h2 className="text-3xl font-bold mb-4 font-serif leading-tight">Bergabunglah Membangun Generasi Qur'ani</h2>
                        <p className="text-green-100 text-base leading-relaxed opacity-90">
                            "Barangsiapa yang menunjuki kepada kebaikan maka dia akan mendapatkan pahala seperti pahala orang yang mengerjakannya."
                        </p>
                        <p className="text-green-200 text-sm mt-2 italic">- HR. Muslim</p>
                    </div>
                </div>

            </div>
        </>
    );
}
