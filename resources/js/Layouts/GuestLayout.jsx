import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-white font-dm text-gray-900">

            {/* ─── Panel Kiri: Gambar Custom ─── */}
            <div className="hidden lg:block lg:flex-1 relative">
                <img
                    src="/images/auth-cover.webp"
                    alt="GanaAI cover"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay gelap tipis */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Logo overlay — kiri atas, transparan */}
                <Link
                    href="/"
                    className="absolute top-8 left-8 z-10 flex items-center gap-1 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-2.5 hover:bg-white/25 transition"
                >
                    <img src="/images/logo.png" alt="" className="h-8 w-auto" />
                    <span className="text-xl font-bold text-orange-400 -ml-2">Gana</span>
                    <span className="text-xl font-bold text-white">AI</span>
                </Link>
            </div>

            {/* ─── Panel Kanan: Form ─── */}
            <div className="flex w-full flex-col items-center justify-center overflow-y-auto px-6 py-12 lg:w-[480px] lg:flex-shrink-0 lg:px-14 lg:border-l lg:border-gray-200">
                <div className="w-full max-w-sm">

                    {/* Logo mobile — hanya tampil < lg */}
                    <Link
                        href="/"
                        className="mb-8 flex items-center justify-center lg:hidden"
                    >
                        <img src="/images/logo.png" alt="" className="h-9 w-auto" />
                        <span className="text-2xl font-bold text-orange-500 -ml-3">Gana</span>
                        <span className="text-2xl font-bold text-gray-500">AI</span>
                    </Link>

                    {children}
                </div>
            </div>
        </div>
    );
}