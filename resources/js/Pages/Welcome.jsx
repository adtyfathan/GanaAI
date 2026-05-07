import { Head, Link } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export default function Welcome({ auth }) {
    // GanaAI Homepage Component
    // Modern landing page untuk AI Social Media Automation
    return (
        <>
            <Head title="GanaAI - AI Social Media Automation untuk UMKM" />
            <div className="min-h-screen bg-white">
                <Navbar auth={auth} />

                {/* Hero Section */}
                <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <div className="text-center">
                        <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Buat Konten, Posting Otomatis ke Semua Sosmed
                        </h1>
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
                            Powered by AI. Generate jadwal konten 30 hari, caption, foto, dan video. Posting otomatis ke Instagram, TikTok, Facebook, dan X dengan satu klik.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={route('register')}
                                className="rounded-lg bg-orange-500 px-8 py-4 text-lg font-medium text-white hover:bg-orange-600 transition shadow-lg"
                            >
                                Mulai Gratis Sekarang
                            </Link>
                            <a
                                href="#how-it-works"
                                className="rounded-lg border-2 border-gray-300 px-8 py-4 text-lg font-medium text-gray-900 hover:border-gray-400 transition"
                            >
                                Lihat Cara Kerja
                            </a>
                        </div>
                    </div>
                </section>

                {/* Why GanaAI Section */}
                <section className="bg-gradient-to-b from-orange-50 to-white py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900">
                                Kenapa Pilih GanaAI?
                            </h2>
                            <p className="text-lg text-gray-600">
                                Buat, jadwal, dan posting konten sosmed lebih cepat dan efisien
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {/* Card 1 */}
                            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 hover:shadow-lg transition">
                                <div className="mb-4 h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900">28x Lebih Cepat</h3>
                                <p className="text-gray-600">
                                    Generate jadwal konten 30 hari hanya dalam hitungan menit, bukan jam atau hari.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 hover:shadow-lg transition">
                                <div className="mb-4 h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <span className="text-2xl">🤖</span>
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900">AI Powered</h3>
                                <p className="text-gray-600">
                                    AI generate ide konten, caption, dan jadwal posting yang optimal per platform.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 hover:shadow-lg transition">
                                <div className="mb-4 h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <span className="text-2xl">📸</span>
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900">Media Otomatis</h3>
                                <p className="text-gray-600">
                                    AI generate foto produk dan video. Semua otomatis!
                                </p>
                            </div>

                            {/* Card 4 */}
                            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 hover:shadow-lg transition">
                                <div className="mb-4 h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <span className="text-2xl">📱</span>
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900">Multi-Platform</h3>
                                <p className="text-gray-600">
                                    Posting ke Instagram, TikTok, Facebook, dan X dengan satu klik. Jadwal berbeda per platform.
                                </p>
                            </div>

                            {/* Card 5 */}
                            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 hover:shadow-lg transition">
                                <div className="mb-4 h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900">Hari Besar Otomatis</h3>
                                <p className="text-gray-600">
                                    AI mendeteksi hari besar (Lebaran, Natal, dll) dan sisipkan konten greeting otomatis.
                                </p>
                            </div>

                            {/* Card 6 */}
                            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 hover:shadow-lg transition">
                                <div className="mb-4 h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900">Analytics Real-Time</h3>
                                <p className="text-gray-600">
                                    Monitor performa konten per platform. Lihat likes, views, reach, dan engagement.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Use Cases Section */}
                <section className="py-20 md:py-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900">
                                Cocok untuk Semua Jenis Bisnis
                            </h2>
                            <p className="text-lg text-gray-600">
                                GanaAI membantu berbagai industri mengelola sosial media dengan lebih efisien
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {/* Fashion */}
                            <div className="rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 p-8 border border-pink-200 hover:shadow-lg transition">
                                <div className="text-4xl mb-4">👗</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fashion & Retail</h3>
                                <p className="text-sm text-gray-600">
                                    Post foto produk, styling tips, dan promosi flash sale secara konsisten
                                </p>
                            </div>

                            {/* Food & Beverage */}
                            <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-8 border border-orange-200 hover:shadow-lg transition">
                                <div className="text-4xl mb-4">🍔</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Food & Beverage</h3>
                                <p className="text-sm text-gray-600">
                                    Showcase menu baru, behind-the-scenes, dan customer reviews dengan mudah
                                </p>
                            </div>

                            {/* Beauty & Cosmetics */}
                            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-8 border border-purple-200 hover:shadow-lg transition">
                                <div className="text-4xl mb-4">💄</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Beauty & Cosmetics</h3>
                                <p className="text-sm text-gray-600">
                                    Tutorial makeup, before-after, dan product launch dijadwalkan otomatis
                                </p>
                            </div>

                            {/* Services */}
                            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-8 border border-blue-200 hover:shadow-lg transition">
                                <div className="text-4xl mb-4">✨</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Services & Consulting</h3>
                                <p className="text-sm text-gray-600">
                                    Share tips, case studies, dan promo layanan dengan posting schedule terencana
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 md:py-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900">
                                Fitur Unggulan
                            </h2>
                            <p className="text-lg text-gray-600">
                                Semua yang UMKM butuhkan untuk dominasi sosial media
                            </p>
                        </div>

                        <div className="space-y-12">
                            {/* Feature 1 */}
                            <div className="grid gap-8 md:grid-cols-2 items-center">
                                <div>
                                    <h3 className="mb-4 text-2xl font-bold text-gray-900">
                                        Jadwal Konten 30 Hari Otomatis
                                    </h3>
                                    <p className="mb-6 text-gray-600 leading-relaxed">
                                        Upload produk, isi data bisnis, tekan tombol. AI akan generate jadwal konten lengkap selama 30 hari ke depan — termasuk waktu posting optimal per platform.
                                    </p>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-start gap-3">
                                            <span className="text-orange-500 font-bold mt-1">✓</span>
                                            <span>Ide konten sesuai bisnis & tren</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-orange-500 font-bold mt-1">✓</span>
                                            <span>Waktu posting yang sudah di-optimize per platform</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-orange-500 font-bold mt-1">✓</span>
                                            <span>Deteksi hari besar otomatis (Lebaran, Natal, dst)</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 p-8 h-64 flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-6xl">📅</span>
                                        <p className="mt-4 text-gray-600">30 Hari Jadwal</p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="grid gap-8 md:grid-cols-2 items-center">
                                <div className="rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 p-8 h-64 flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-6xl">🎨</span>
                                        <p className="mt-4 text-gray-600">Konten Visual</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="mb-4 text-2xl font-bold text-gray-900">
                                        Generate Konten Visual AI
                                    </h3>
                                    <p className="mb-6 text-gray-600 leading-relaxed">
                                        Saat jadwal posting tiba, system auto generate caption dan media.
                                    </p>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-start gap-3">
                                            <span className="text-orange-500 font-bold mt-1">✓</span>
                                            <span>Caption unik yang di-generate AI</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-orange-500 font-bold mt-1">✓</span>
                                            <span>Foto produk pro dari AI generation</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-orange-500 font-bold mt-1">✓</span>
                                            <span>Video otomatis untuk TikTok</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="grid gap-8 md:grid-cols-2 items-center">
                                <div>
                                    <h3 className="mb-4 text-2xl font-bold text-gray-900">
                                        Posting Otomatis ke Semua Platform
                                    </h3>
                                    <p className="mb-6 text-gray-600 leading-relaxed">
                                        Konten yang sudah jadi, langsung post otomatis ke Instagram, TikTok, Facebook, dan X sesuai jadwal.
                                    </p>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-start gap-3">
                                            <span className="text-orange-500 font-bold mt-1">✓</span>
                                            <span>Posting otomatis ke 4 platform sekaligus</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-orange-500 font-bold mt-1">✓</span>
                                            <span>Jadwal bisa berbeda per platform</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-orange-500 font-bold mt-1">✓</span>
                                            <span>Otomatis naik saat jadwal tiba</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 p-8 h-64 flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-6xl">📤</span>
                                        <p className="mt-4 text-gray-600">Posting Otomatis</p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 4 */}
                            <div className="grid gap-8 md:grid-cols-2 items-center">
                                <div className="rounded-xl bg-gradient-to-br from-green-100 to-green-50 p-8 h-64 flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-6xl">📊</span>
                                        <p className="mt-4 text-gray-600">Dashboard Analytics</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="mb-4 text-2xl font-bold text-gray-900">
                                        Analytics & Performance Tracking
                                    </h3>
                                    <p className="mb-6 text-gray-600 leading-relaxed">
                                        Lihat performa setiap konten real-time. Likes, views, comments, reach — semua terpusat di satu dashboard.
                                    </p>
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-start gap-3">
                                            <span className="text-orange-500 font-bold mt-1">✓</span>
                                            <span>Metric lengkap: likes, views, reach, engagement</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-orange-500 font-bold mt-1">✓</span>
                                            <span>Data sync real-time</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-orange-500 font-bold mt-1">✓</span>
                                            <span>Bandingkan performa antar platform</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="bg-gray-50 py-12 md:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900">
                                Cara Kerja GanaAI
                            </h2>
                            <p className="text-lg text-gray-600">
                                4 langkah mudah untuk mulai dominasi sosial media
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-4">
                            <div className="text-center">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white">
                                    1
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">Daftar & Setup</h3>
                                <p className="text-sm text-gray-600">
                                    Buat akun, isi data bisnis, upload produk
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white">
                                    2
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">Connect Sosmed</h3>
                                <p className="text-sm text-gray-600">
                                    Connect akun IG, TikTok, FB, X.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white">
                                    3
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">Generate Jadwal</h3>
                                <p className="text-sm text-gray-600">
                                    AI generate jadwal 30 hari otomatis
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white">
                                    4
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">Posting Otomatis</h3>
                                <p className="text-sm text-gray-600">
                                    Konten posting otomatis sesuai jadwal
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-20">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="mb-4 text-4xl md:text-5xl font-bold text-white">
                            Siap Otomasi Konten Sosmed Anda?
                        </h2>
                        <p className="mb-8 text-lg text-orange-50">
                            Gratis selamanya. Bayar hanya saat butuh. Tidak ada kartu kredit yang dibutuhkan.
                        </p>
                        <Link
                            href={route('register')}
                            className="inline-block rounded-lg bg-white px-8 py-4 text-lg font-medium text-orange-600 hover:bg-gray-100 transition"
                        >
                            Daftar Sekarang
                        </Link>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-20 md:py-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900">
                                Harga Sederhana
                            </h2>
                            <p className="text-lg text-gray-600">
                                Semua fitur gratis di awal untuk testing. Bayar hanya saat butuh scale.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
                            {/* Starter */}
                            <div className="rounded-xl border border-gray-200 p-8 bg-white hover:shadow-lg transition">
                                <h3 className="mb-2 text-xl font-bold text-gray-900">Starter</h3>
                                <p className="mb-6 text-gray-600 text-sm">Perfect untuk mulai</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-gray-900">Gratis</span>
                                    <p className="text-sm text-gray-600 mt-2">Selamanya gratis untuk testing</p>
                                </div>
                                <ul className="space-y-3 mb-8 text-sm text-gray-600">
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-500 font-bold mt-0.5">✓</span>
                                        <span>Jadwal konten 30 hari</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-500 font-bold mt-0.5">✓</span>
                                        <span>2 Social Sets</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-500 font-bold mt-0.5">✓</span>
                                        <span>20 posts/bulan</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-gray-400 font-bold mt-0.5">✗</span>
                                        <span className="text-gray-400">Advanced analytics</span>
                                    </li>
                                </ul>
                                <button className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 font-medium text-gray-900 hover:border-gray-400 transition">
                                    Mulai Gratis
                                </button>
                            </div>

                            {/* Professional */}
                            <div className="rounded-xl border-2 border-orange-500 p-8 bg-white shadow-xl transform scale-105">
                                <div className="mb-4 inline-block rounded-full bg-orange-500 px-4 py-1 text-sm font-medium text-white">
                                    Paling Populer
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-gray-900">Professional</h3>
                                <p className="mb-6 text-gray-600 text-sm">Untuk UMKM berkembang</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-gray-900">299k</span>
                                    <p className="text-sm text-gray-600 mt-2">/bulan</p>
                                </div>
                                <ul className="space-y-3 mb-8 text-sm text-gray-600">
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-500 font-bold mt-0.5">✓</span>
                                        <span>Semua fitur Starter</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-500 font-bold mt-0.5">✓</span>
                                        <span>Unlimited Social Sets</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-500 font-bold mt-0.5">✓</span>
                                        <span>Unlimited posts</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-500 font-bold mt-0.5">✓</span>
                                        <span>Advanced analytics</span>
                                    </li>
                                </ul>
                                <button className="w-full rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600 transition">
                                    Upgrade Sekarang
                                </button>
                            </div>

                            {/* Enterprise */}
                            <div className="rounded-xl border border-gray-200 p-8 bg-white hover:shadow-lg transition">
                                <h3 className="mb-2 text-xl font-bold text-gray-900">Enterprise</h3>
                                <p className="mb-6 text-gray-600 text-sm">Custom solution</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-gray-900">Hubungi</span>
                                    <p className="text-sm text-gray-600 mt-2">Tim kami untuk quotes</p>
                                </div>
                                <ul className="space-y-3 mb-8 text-sm text-gray-600">
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-500 font-bold mt-0.5">✓</span>
                                        <span>Semua fitur Pro</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-500 font-bold mt-0.5">✓</span>
                                        <span>Dedicated support</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-500 font-bold mt-0.5">✓</span>
                                        <span>Custom integration</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-500 font-bold mt-0.5">✓</span>
                                        <span>SLA Guarantee</span>
                                    </li>
                                </ul>
                                <button className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 font-medium text-gray-900 hover:border-gray-400 transition">
                                    Hubungi Sales
                                </button>
                            </div>
                        </div>
                    </div>
                </section>



                {/* FAQ Section */}
                <section className="bg-gray-50 py-20 md:py-32">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900">
                                Pertanyaan Umum
                            </h2>
                            <p className="text-lg text-gray-600">
                                Jawaban untuk pertanyaan yang sering kami terima
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* FAQ 1 */}
                            <details className="rounded-lg border border-gray-200 bg-white p-6 cursor-pointer group">
                                <summary className="flex items-center justify-between font-semibold text-gray-900 hover:text-orange-500 transition">
                                    <span>Apakah GanaAI aman untuk akun sosial media saya?</span>
                                    <span className="text-xl text-gray-400 group-open:rotate-180 transition">▼</span>
                                </summary>
                                <p className="mt-4 text-gray-600 leading-relaxed">
                                    Ya, GanaAI 100% aman. Kami tidak pernah menyimpan password Anda. Data Anda terenkripsi dan kami mematuhi GDPR.
                                </p>
                            </details>

                            {/* FAQ 2 */}
                            <details className="rounded-lg border border-gray-200 bg-white p-6 cursor-pointer group">
                                <summary className="flex items-center justify-between font-semibold text-gray-900 hover:text-orange-500 transition">
                                    <span>Berapa lama untuk setup awal?</span>
                                    <span className="text-xl text-gray-400 group-open:rotate-180 transition">▼</span>
                                </summary>
                                <p className="mt-4 text-gray-600 leading-relaxed">
                                    Sangat cepat! Setup hanya butuh 5 menit: (1) Daftar, (2) Isi data bisnis, (3) Connect akun sosmed, (4) Upload produk. Setelah itu, AI otomatis generate jadwal konten 30 hari untuk Anda.
                                </p>
                            </details>

                            {/* FAQ 3 */}
                            <details className="rounded-lg border border-gray-200 bg-white p-6 cursor-pointer group">
                                <summary className="flex items-center justify-between font-semibold text-gray-900 hover:text-orange-500 transition">
                                    <span>Apakah bisa edit konten sebelum posting?</span>
                                    <span className="text-xl text-gray-400 group-open:rotate-180 transition">▼</span>
                                </summary>
                                <p className="mt-4 text-gray-600 leading-relaxed">
                                    Tentu! Anda bisa preview dan edit semua caption dan jadwal posting sebelum konten naik. Fleksibel penuh — mau ubah text, ganti foto, atau reschedule? Semua bisa diatur dari dashboard.
                                </p>
                            </details>

                            {/* FAQ 4 */}
                            <details className="rounded-lg border border-gray-200 bg-white p-6 cursor-pointer group">
                                <summary className="flex items-center justify-between font-semibold text-gray-900 hover:text-orange-500 transition">
                                    <span>Apakah saya perlu bayar sekarang?</span>
                                    <span className="text-xl text-gray-400 group-open:rotate-180 transition">▼</span>
                                </summary>
                                <p className="mt-4 text-gray-600 leading-relaxed">
                                    Tidak perlu! Tier Starter gratis selamanya untuk testing. Bayar hanya saat Anda butuh fitur lebih (unlimited posts, advanced analytics, dll). Tidak ada kartu kredit yang dibutuhkan untuk mulai.
                                </p>
                            </details>

                            {/* FAQ 5 */}
                            <details className="rounded-lg border border-gray-200 bg-white p-6 cursor-pointer group">
                                <summary className="flex items-center justify-between font-semibold text-gray-900 hover:text-orange-500 transition">
                                    <span>Berapa banyak platform yang bisa dikoneksi?</span>
                                    <span className="text-xl text-gray-400 group-open:rotate-180 transition">▼</span>
                                </summary>
                                <p className="mt-4 text-gray-600 leading-relaxed">
                                    Saat ini kami support 4 platform utama: Instagram, TikTok, Facebook, dan X (Twitter). Tier Starter bisa koneksi 2 Social Sets, tier Professional bisa unlimited.
                                </p>
                            </details>

                            {/* FAQ 6 */}
                            <details className="rounded-lg border border-gray-200 bg-white p-6 cursor-pointer group">
                                <summary className="flex items-center justify-between font-semibold text-gray-900 hover:text-orange-500 transition">
                                    <span>Bagaimana jika AI generate konten yang tidak sesuai?</span>
                                    <span className="text-xl text-gray-400 group-open:rotate-180 transition">▼</span>
                                </summary>
                                <p className="mt-4 text-gray-600 leading-relaxed">
                                    Anda punya kontrol penuh! Edit atau hapus konten yang tidak sesuai. Feedback Anda juga membantu AI belajar preferensi Anda untuk generate yang lebih baik ke depannya. Iterasi otomatis berdasarkan preferensi Anda.
                                </p>
                            </details>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        </>
    );
}
                               