import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-700 py-16 border-t border-gray-200">
            {/* Decorative gradient blur */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/3 via-transparent to-blue-500/3 pointer-events-none"></div>
            
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="md:col-span-1">
                        <div className="flex items-center mb-4">
                            <img src="/logo.png" alt="" className="h-10 w-auto" />
                            <span className="text-2xl font-bold text-orange-500 -ml-3">Gana</span>
                            <span className="text-2xl font-bold text-gray-600">AI</span>
                        </div>
                        <p className="text-base text-gray-600 leading-relaxed">
                            AI Social Media Automation untuk UMKM Indonesia. Otomatiskan, Analisis, dan Tingkatkan Performa Media Sosial Anda.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4 mt-6">
                            <a href="#" className="text-gray-600 hover:text-orange-500 transition text-lg">𝕏</a>
                            <a href="#" className="text-gray-600 hover:text-orange-500 transition text-lg">f</a>
                            <a href="#" className="text-gray-600 hover:text-orange-500 transition text-lg">in</a>
                            <a href="#" className="text-gray-600 hover:text-orange-500 transition text-lg">ig</a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-4 uppercase tracking-wider">Produk</h3>
                        <ul className="space-y-3">
                            <li><a href="#features" className="text-gray-600 hover:text-orange-500 transition text-base">Fitur</a></li>
                            <li><a href="#how-it-works" className="text-gray-600 hover:text-orange-500 transition text-base">Cara Kerja</a></li>
                            <li><a href="#pricing" className="text-gray-600 hover:text-orange-500 transition text-base">Harga</a></li>
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-4 uppercase tracking-wider">Resources</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-600 hover:text-orange-500 transition text-base">FAQ</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-orange-500 transition text-base">Guides</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-orange-500 transition text-base">Blog</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-4 uppercase tracking-wider">Kontak Kami</h3>
                        <ul className="space-y-3">
                            <li><a href="mailto:hello@gana.id" className="text-gray-600 hover:text-orange-500 transition text-base">Email: hello@gana.id</a></li>
                            <li><a href="https://wa.me/628123456789" className="text-gray-600 hover:text-orange-500 transition text-base">WhatsApp: +62 812 3456 789</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-orange-500 transition text-base">Discord Community</a></li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 mb-8"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-sm text-gray-600">
                        © 2026 GanaAI. Semua hak dilindungi.
                    </p>
                    <p className="text-sm text-gray-600">
                        Built for UMKM Indonesia
                    </p>
                </div>
            </div>
        </footer>
    );
}
