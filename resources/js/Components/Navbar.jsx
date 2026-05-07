import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Navbar({ auth }) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`sticky top-0 z-50 w-full flex justify-center transition-all duration-700 ${
            isScrolled ? 'py-2' : 'py-0'
        }`}>
            <header className={`h-16 backdrop-blur-xl bg-white/40 border-b border-white/60 shadow-md transition-all duration-700 ease-out ${
                isScrolled 
                    ? 'w-3/5 rounded-2xl bg-white/30 border-white/50 shadow-lg' 
                    : 'w-full'
            }`}>
                <div className="px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex h-full items-center justify-between">
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center hover:opacity-80 transition">
                            <img src="/logo.png" alt="" className="h-10 w-auto" />
                            <span className="text-2xl font-bold text-orange-500 -ml-3">Gana</span>
                            <span className="text-2xl font-bold text-gray-500">AI</span>
                        </Link>
                    </div>
                    <nav className={`hidden md:flex items-center transition-all duration-700 ${isScrolled ? 'gap-6' : 'gap-8'}`}>
                        <a href="#features" className="text-base font-medium text-gray-600 hover:text-gray-900 transition">Fitur</a>
                        <a href="#how-it-works" className="text-base font-medium text-gray-600 hover:text-gray-900 transition">Cara Kerja</a>
                        <a href="#pricing" className="text-base font-medium text-gray-600 hover:text-gray-900 transition">Harga</a>
                    </nav>
                    <div className={`flex items-center transition-all duration-700 ${isScrolled ? 'gap-2' : 'gap-4'}`}>
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-lg bg-orange-500 hover:bg-orange-600 px-4 py-2 text-base text-white font-bold transition"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('register')}
                                className="rounded-lg bg-orange-500 hover:bg-orange-600 px-4 py-2 text-base text-white font-bold transition"
                            >
                                Daftar Gratis
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
        </div>
    );
}
