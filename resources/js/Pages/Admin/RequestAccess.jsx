import { Head, useForm, Link } from '@inertiajs/react';
import { User, Mail, Lock, Phone, ArrowRight, ArrowLeft } from 'lucide-react';

export default function RequestAccess() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.request.store'));
    };

    return (
        <>
            <Head title="Ajukan Akses Admin" />

            <div className="min-h-screen w-full flex bg-gray-50">
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative">
                    <Link
                        href={route('admin.login')}
                        className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-green-700 transition text-sm font-medium"
                    >
                        <ArrowLeft size={18} className="mr-2" /> Kembali ke Login
                    </Link>

                    <div className="w-full max-w-md">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-green-800 italic mb-2">
                                Ajukan<span className="text-green-600"> Akses Admin</span>
                            </h1>
                            <p className="text-gray-500">Isi formulir berikut untuk mengajukan akun admin baru. Akun akan disetujui oleh Super Admin.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition shadow-sm placeholder-gray-400"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition shadow-sm placeholder-gray-400"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition shadow-sm placeholder-gray-400"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                </div>
                                {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition shadow-sm placeholder-gray-400"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition shadow-sm placeholder-gray-400"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.password_confirmation && <div className="text-red-500 text-xs mt-1">{errors.password_confirmation}</div>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition transform active:scale-95 disabled:opacity-50"
                            >
                                {processing ? 'Mengirim...' : 'Ajukan Akses Admin'}
                                {!processing && <ArrowRight className="ml-2 h-4 w-4" />}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="hidden lg:block w-1/2 bg-green-800 relative overflow-hidden">
                    <img
                        src="/images/pesantren1.png"
                        alt="Pesantren Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900 to-green-800/80"></div>
                    <div className="relative z-10 flex flex-col justify-center items-center h-full text-white px-12 text-center">
                        <h2 className="text-4xl font-bold mb-6 font-serif">Akses admin tidak boleh dibuat sembarangan.</h2>
                        <p className="text-green-100 text-lg italic">Ajukan permintaan, lalu Super Admin akan menyetujuinya.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
