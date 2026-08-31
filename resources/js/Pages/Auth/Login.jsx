import { Head, useForm, Link } from '@inertiajs/react';
import { Mail, Lock, ArrowRight } from 'lucide-react'; // ArrowLeft dihapus karena tidak dipakai

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Login Admin" />

            <div className="min-h-screen w-full flex bg-gray-50">

                {/* --- BAGIAN KIRI: Form Login --- */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative">

                    {/* AREA KOSONG: Link 'Kembali ke Beranda' sudah dihapus disini */}

                    <div className="w-full max-w-md">
                        {/* Logo & Judul */}
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-green-800 italic mb-2">
                                Minhaj<span className="text-green-600">Admin</span>
                            </h1>
                            <p className="text-gray-500">Masuk untuk mengelola data pesantren.</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={submit} className="space-y-6">

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

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
                                </label>

                                <Link href={route('password.request')} className="text-sm font-medium text-green-600 hover:text-green-500 hover:underline">
                                    Lupa password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition transform active:scale-95 disabled:opacity-50"
                            >
                                {processing ? 'Memproses...' : 'Masuk Dashboard'}
                                {!processing && <ArrowRight className="ml-2 h-4 w-4" />}
                            </button>

                            <div className="text-center mt-6 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Akses khusus untuk admin dan petugas operasional.
                                </p>
                            </div>

                        </form>

                        <div className="mt-8 text-center text-xs text-gray-400">
                            &copy; 2025 Minhaj Peduli. Secure Access Area.
                        </div>
                    </div>
                </div>

                {/* --- BAGIAN KANAN: Gambar / Dekorasi --- */}
                <div className="hidden lg:block w-1/2 bg-green-800 relative overflow-hidden">
                    <img
                        src="/images/pesantren1.png"
                        alt="Pesantren Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900 to-green-800/80"></div>

                    <div className="relative z-10 flex flex-col justify-center items-center h-full text-white px-12 text-center">
                        <h2 className="text-4xl font-bold mb-6 font-serif">"Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lain."</h2>
                        <p className="text-green-100 text-lg italic">- HR. Ahmad</p>
                    </div>
                </div>

            </div>
        </>
    );
}
