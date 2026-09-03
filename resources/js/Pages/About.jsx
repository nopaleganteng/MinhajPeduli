import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import { MapPin, Phone, Mail } from "lucide-react";

export default function About({ auth }) {
    return (
        <>
            <Head title="Tentang Kami" />

            <div className="min-h-screen bg-[#dcfce7] text-slate-800 font-sans overflow-x-hidden">
                <Navbar auth={auth} />

                {/* --- Header / Hero Section --- */}
                <section className="bg-green-50 py-12 px-6">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                        {/* Teks Animasi Masuk */}
                        <div className="md:w-1/2 animate-slide-in-left">
                            <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-2">
                                Selamat Datang di Pondok Pesantren Al-Minhaj
                            </h1>
                            <p className="text-xl text-green-700 font-medium italic">
                                Mari Berkenalan Lebih Jauh!
                            </p>
                        </div>

                        {/* Gambar Animasi Masuk & Hover */}
                        <div className="md:w-1/2 flex justify-center md:justify-end animate-fade-in-up delay-200">
                            <div className="bg-green-200 p-2 rounded-3xl shadow-lg w-full max-w-md h-64 overflow-hidden relative group cursor-pointer transition-transform duration-500 hover:scale-[1.02] hover:shadow-2xl">
                                <img
                                    src="/images/pesantren1.png"
                                    alt="Konstruksi Pesantren"
                                    className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Efek Kilau saat hover */}
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Tentang Kami Section --- */}
                <section className="bg-green-700 py-16 px-6 text-white">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold uppercase border-b-2 border-green-400 inline-block mb-8 animate-fade-in">
                            Tentang Kami
                        </h2>

                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Gambar Pondasi dengan Efek Zoom */}
                            <div className="md:w-1/3 w-full animate-fade-in-up">
                                <div className="overflow-hidden rounded-xl border-4 border-green-600 shadow-xl group">
                                    <img
                                        src="/images/pesantren2.png"
                                        alt="Pondasi Pesantren"
                                        className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                                    />
                                </div>
                            </div>

                            {/* Teks Deskripsi */}
                            <div className="md:w-2/3 text-sm md:text-base leading-relaxed space-y-4 text-green-50 text-justify animate-fade-in-up delay-100">
                                <p>
                                    Pondok Pesantren Al-Minhaj adalah lembaga
                                    pendidikan Islam yang berfokus pada
                                    pembinaan generasi Qur'ani melalui program
                                    tahfidz Al-Qur'an tingkat SD dan SMP. Kami
                                    memberikan pendidikan gratis bagi anak
                                    yatim, dhuafa, dan muallaf, sebagai bentuk
                                    kepedulian dan dakwah pendidikan.
                                </p>
                                <p>
                                    Dengan bimbingan ustadz berpengalaman,
                                    lingkungan yang asri, serta kurikulum
                                    tahfidz yang terarah, Al-Minhaj berkomitmen
                                    mencetak hafidz dan hafidzah yang berakhlak
                                    mulia dan bermanfaat bagi umat.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Visi & Misi Section --- */}
                <section className="bg-[#dcfce7] py-16 px-6">
                    <div className="max-w-5xl mx-auto space-y-16">
                        {/* VISI */}
                        <div className="text-center animate-fade-in-up">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div className="h-px w-20 bg-green-700"></div>
                                <h2 className="text-2xl font-bold text-green-800 uppercase">
                                    VISI
                                </h2>
                                <div className="h-px w-20 bg-green-700"></div>
                            </div>
                            {/* Card Hover Lift */}
                            <div className="bg-green-600 text-white p-8 rounded-xl shadow-lg italic text-lg leading-relaxed transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-green-700 cursor-default">
                                "Membangun pusat pendidikan Islam dengan model
                                pesantren dengan dukungan bangunan fisik (gedung
                                pendidikan dan masjid) yang berkualitas serta
                                sarana dan prasarana modern yang mendukung
                                proses pembelajaran para santri"
                            </div>
                        </div>

                        {/* MISI */}
                        <div>
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div className="h-px w-20 bg-green-700"></div>
                                <h2 className="text-2xl font-bold text-green-800 uppercase">
                                    MISI
                                </h2>
                                <div className="h-px w-20 bg-green-700"></div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-green-600 text-white p-6 rounded-xl shadow-lg text-sm md:text-base text-justify transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-green-700">
                                    Menjadikan pesantren (ma'had) sebagai tempat
                                    yang memadai sekaligus menyenangkan bagi
                                    para santri maupun para pendidik
                                    (ustadz/guru) dalam proses belajar-mengajar,
                                    baik menghafal al-Quran maupun mengkaji
                                    kitab kuning.
                                </div>
                                <div className="bg-green-600 text-white p-6 rounded-xl shadow-lg text-sm md:text-base text-justify transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-green-700">
                                    Menjadikan pesantren (ma'had) sebagai tempat
                                    yang mendukung proses percepatan pembinaan
                                    dan pengkaderan generasi penghapal dan
                                    pejuang al-Quran, khususnya dari kalangan
                                    anak-anak yatim dan dhuafa.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Tujuan Diagram Section --- */}
                <section className="bg-green-100 py-16 px-6 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h2 className="text-2xl font-bold text-green-800 uppercase mb-12 underline decoration-green-500 decoration-4 underline-offset-8">
                            TUJUAN
                        </h2>

                        <div className="flex flex-col items-center relative">
                            {/* Baris Atas */}
                            <div className="flex flex-col md:flex-row justify-between w-full gap-8 mb-8 md:mb-16 relative z-10">
                                <div className="bg-green-200 border-4 border-green-600 p-6 rounded-lg shadow-md w-full md:w-5/12 flex items-center justify-center min-h-[120px] transform transition-transform duration-300 hover:scale-105 hover:bg-green-100">
                                    <p className="text-green-900 font-bold text-sm">
                                        Memberikan pendidikan gratis bagi anak
                                        yatim, dhuafa, dan muallaf
                                    </p>
                                </div>

                                <div className="bg-green-200 border-4 border-green-600 p-6 rounded-lg shadow-md w-full md:w-5/12 flex items-center justify-center min-h-[120px] transform transition-transform duration-300 hover:scale-105 hover:bg-green-100">
                                    <p className="text-green-900 font-bold text-sm">
                                        Al-Minhaj berkomitmen mencetak hafizh
                                        dan hafizhah yang berakhlak mulia dan
                                        bermanfaat bagi umat.
                                    </p>
                                </div>
                            </div>

                            {/* Baris Bawah */}
                            <div className="bg-green-200 border-4 border-green-600 p-6 rounded-lg shadow-md w-full md:w-5/12 flex items-center justify-center min-h-[120px] relative mt-4 z-10 transform transition-transform duration-300 hover:scale-105 hover:bg-green-100">
                                <p className="text-green-900 font-bold text-sm">
                                    Berfokus pada pembinaan generasi Qur'ani
                                    melalui program tahfidz AL-Qur'an tingkat SD
                                    dan SMP.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- PENDIRI Yayasan Section --- */}
                <section className="bg-green-700 py-16 px-6 text-white mt-10">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-center text-2xl font-bold uppercase mb-10 border-b border-green-500 inline-block pb-2 px-10">
                            PENDIRI YAYASAN Al MINHAJ
                        </h2>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-12 xl:gap-24">
                            <div className="bg-white p-3 shadow-2xl transform -rotate-2 hover:rotate-0 hover:scale-105 transition duration-500 ease-in-out cursor-pointer flex flex-col items-center w-72 xl:w-80">
                                <div className="w-60 h-80 bg-gray-300 overflow-hidden relative group rounded-xl">
                                    <img
                                        src="/images/ustadz1.jpeg"
                                        alt="Foto Ustadz 1"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-xl"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors rounded-xl"></div>
                                </div>
                                <div className="mt-4 text-center">
                                    <h3 className="text-xl font-bold font-serif italic text-green-900">
                                        Ustadz Taufik Syahrir
                                    </h3>
                                </div>
                            </div>
                            <div className="bg-white p-3 shadow-2xl transform rotate-1 hover:rotate-0 hover:scale-105 transition duration-500 ease-in-out cursor-pointer flex flex-col items-center w-72 xl:w-80">
                                <div className="w-60 h-80 bg-gray-300 overflow-hidden relative group rounded-xl">
                                    <img
                                        src="/images/ustadz2.jpeg"
                                        alt="Foto Ustadz 2"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-xl"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors rounded-xl"></div>
                                </div>
                                <div className="mt-4 text-center">
                                    <h3 className="text-xl font-bold font-serif italic text-green-900">
                                        Ustadz Muhammad Husni Thamrin S.SSI.
                                    </h3>
                                </div>
                            </div>
                            <div className="bg-white p-3 shadow-2xl transform rotate-3 hover:rotate-0 hover:scale-105 transition duration-500 ease-in-out cursor-pointer flex flex-col items-center w-72 xl:w-80">
                                <div className="w-60 h-80 bg-gray-300 overflow-hidden relative group rounded-xl">
                                    <img
                                        src="/images/ustadz3.jpeg"
                                        alt="Foto Ustadz 3"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-xl"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors rounded-xl"></div>
                                </div>
                                <div className="mt-4 text-center">
                                    <h3 className="text-xl font-bold font-serif italic text-green-900">
                                        Ustadz Idham Khalid
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Footer --- */}
                <footer className="w-full mt-0 bg-green-50">
                    <div className="py-10 px-6 text-green-900">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
                            {/* Kiri */}
                            <div className="flex flex-col justify-start md:w-1/3">
                                <h2 className="text-3xl font-bold italic text-green-700 mb-2">
                                    MinhajPeduli
                                </h2>
                                <p className="text-lg font-medium text-green-800">
                                    Pondok Pesantren AL-Minhaj
                                </p>
                            </div>

                            {/* Kanan */}
                            <div className="flex flex-col md:flex-row gap-8 md:gap-16 md:w-2/3 md:justify-end">
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-green-900">
                                        Alamat
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start group">
                                            <MapPin className="w-6 h-6 text-green-700 mr-3 mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                                            <span className="text-green-800 leading-relaxed">
                                                Desa kuripan Kel.Kuripan
                                                <br />
                                                Kec. Ciseeng, Bogor, Jawa Barat
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-green-900">
                                        Kontak kami
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-center group">
                                            <Mail className="w-6 h-6 text-green-700 mr-3 group-hover:scale-110 transition-transform" />
                                            <a
                                                href="mailto:AlMinhaj@gmail.com"
                                                className="text-green-800 hover:text-green-600 transition"
                                            >
                                                AlMinhaj@gmail.com
                                            </a>
                                        </li>
                                        <li className="flex items-center group">
                                            <Phone className="w-6 h-6 text-green-700 mr-3 group-hover:scale-110 transition-transform" />
                                            <a
                                                href="tel:081234567890"
                                                className="text-green-800 hover:text-green-600 transition"
                                            >
                                                081234567890
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white py-4 text-center border-t border-green-200">
                        <p className="text-sm text-gray-700 font-medium flex items-center justify-center">
                            <span className="text-lg mr-1">©</span>
                            {new Date().getFullYear()} MINHAJ PEDULI. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                </footer>

                {/* STYLE ANIMASI CUSTOM */}
                <style>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes slideInLeft {
                        from { opacity: 0; transform: translateX(-30px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes slideInRight {
                        from { opacity: 0; transform: translateX(30px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .animate-fade-in-up {
                        animation: fadeInUp 0.8s ease-out forwards;
                    }
                    .animate-slide-in-left {
                        animation: slideInLeft 0.8s ease-out forwards;
                    }
                    .animate-slide-in-right {
                        animation: slideInRight 0.8s ease-out forwards;
                    }
                    .animate-fade-in {
                        animation: fadeIn 1s ease-out forwards;
                    }
                    .delay-100 { animation-delay: 0.1s; }
                    .delay-200 { animation-delay: 0.2s; }
                `}</style>
            </div>
        </>
    );
}
