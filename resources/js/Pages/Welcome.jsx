import { Head, Link } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export default function Welcome({ auth }) {
    return (
        <>
            <div className="min-h-screen font-dm" style={{ backgroundColor: '#FAFAF8' }}>
                <Navbar auth={auth} />

                {/* ── Hero Section ── */}
                <section
                    className="relative overflow-hidden"
                    style={{ background: 'linear-gradient(160deg, #E8F7F4 0%, #FAFAF8 55%, #FDF3EA 100%)' }}
                >
                    <div
                        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-30 pointer-events-none"
                        style={{ background: 'radial-gradient(circle, #B2E8DF 0%, transparent 70%)' }}
                    />
                    <div
                        className="absolute bottom-0 -left-16 w-64 h-64 rounded-full opacity-20 pointer-events-none"
                        style={{ background: 'radial-gradient(circle, #FDE8C4 0%, transparent 70%)' }}
                    />

                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-36">
                        <div className="text-center max-w-4xl mx-auto">
                            <h1
                                className="font-jakarta mb-6 text-4xl md:text-5xl lg:text-6xl font-bold"
                                style={{ color: '#2E2F35', lineHeight: '1.15' }}
                            >
                                Buat Konten, Posting Otomatis{' '}
                                <span style={{ color: '#0A6B5E' }}>ke Semua Sosmed</span>
                            </h1>
                            <p
                                className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed"
                                style={{ color: '#58595D' }}
                            >
                                Powered by AI. Generate jadwal konten 30 hari, caption, foto, dan video. Posting otomatis ke Instagram dan TikTok dengan satu klik.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={route('register')}
                                    className="font-dm rounded-xl px-8 py-4 text-base font-semibold text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                    style={{ background: '#FF6D2C' }}
                                >
                                    Mulai Gratis Sekarang →
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="font-dm rounded-xl px-8 py-4 text-base font-semibold transition-all border-2"
                                    style={{ borderColor: '#0A6B5E', color: '#0A6B5E', background: 'transparent' }}
                                >
                                    Lihat Cara Kerja
                                </a>
                            </div>

                            <p className="mt-8 text-sm" style={{ color: '#8A8B8F' }}>
                                Gratis selamanya · Tidak perlu kartu kredit · Setup 5 menit
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── Kenapa GanaAI ── */}
                <section className="py-20 md:py-28" style={{ background: '#FAFAF8' }}>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-14 text-center">
                            <h2
                                className="font-jakarta mb-3 text-3xl md:text-4xl font-bold"
                                style={{ color: '#2E2F35' }}
                            >
                                Kenapa Pilih GanaAI?
                            </h2>
                            <p className="text-base" style={{ color: '#58595D' }}>
                                Buat, jadwal, dan posting konten sosmed lebih cepat dan efisien
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {[
                                { icon: '⚡', title: '28x Lebih Cepat', desc: 'Generate jadwal konten 30 hari hanya dalam hitungan menit, bukan jam atau hari.', accent: '#E0F8F2', border: '#A4DDD4' },
                                { icon: '🤖', title: 'AI Powered', desc: 'AI generate ide konten, caption, dan jadwal posting yang optimal per platform.', accent: '#FDF3EA', border: '#F5D9AF' },
                                { icon: '📸', title: 'Media Otomatis', desc: 'AI generate foto produk dan video. Semua otomatis!', accent: '#E0F8F2', border: '#A4DDD4' },
                                { icon: '📱', title: 'Multi-Platform', desc: 'Posting ke Instagram dan TikTok dengan satu klik.', accent: '#FDF3EA', border: '#F5D9AF' },
                                { icon: '📅', title: 'Hari Besar Otomatis', desc: 'AI mendeteksi hari besar (Lebaran, Natal, dll) dan sisipkan konten greeting otomatis.', accent: '#E0F8F2', border: '#A4DDD4' },
                                { icon: '📊', title: 'Analytics Real-Time', desc: 'Monitor performa konten per platform. Lihat likes, views, reach, dan engagement.', accent: '#FDF3EA', border: '#F5D9AF' },
                            ].map((card) => (
                                <div
                                    key={card.title}
                                    className="rounded-2xl p-8 border transition-all hover:-translate-y-1 hover:shadow-md"
                                    style={{ background: '#FFFFFF', borderColor: '#E8E8E4' }}
                                >
                                    <div
                                        className="mb-4 h-11 w-11 rounded-xl flex items-center justify-center text-xl"
                                        style={{ background: card.accent, border: `1px solid ${card.border}` }}
                                    >
                                        {card.icon}
                                    </div>
                                    <h3
                                        className="font-jakarta mb-2 text-lg font-semibold"
                                        style={{ color: '#2E2F35' }}
                                    >
                                        {card.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed" style={{ color: '#58595D' }}>
                                        {card.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Use Cases ── */}
                <section className="py-20 md:py-28" style={{ background: '#F5F5F1' }}>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-14 text-center">
                            <h2
                                className="font-jakarta mb-3 text-3xl md:text-4xl font-bold"
                                style={{ color: '#2E2F35' }}
                            >
                                Cocok untuk Semua Jenis Bisnis
                            </h2>
                            <p className="text-base" style={{ color: '#58595D' }}>
                                GanaAI membantu berbagai industri mengelola sosial media dengan lebih efisien
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                            {[
                                { icon: '👗', label: 'Fashion & Retail', desc: 'Post foto produk, styling tips, dan promosi flash sale secara konsisten', bg: '#FDF3EA', border: '#F5D9AF', text: '#7A4A10' },
                                { icon: '🍔', label: 'Food & Beverage', desc: 'Showcase menu baru, behind-the-scenes, dan customer reviews dengan mudah', bg: '#E0F8F2', border: '#A4DDD4', text: '#0A4A3E' },
                                { icon: '💄', label: 'Beauty & Cosmetics', desc: 'Tutorial makeup, before-after, dan product launch dijadwalkan otomatis', bg: '#FDF3EA', border: '#F5D9AF', text: '#7A4A10' },
                                { icon: '✨', label: 'Services & Consulting', desc: 'Share tips, case studies, dan promo layanan dengan posting schedule terencana', bg: '#E0F8F2', border: '#A4DDD4', text: '#0A4A3E' },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-2xl p-7 border transition-all hover:-translate-y-1 hover:shadow-sm"
                                    style={{ background: item.bg, borderColor: item.border }}
                                >
                                    <div className="text-4xl mb-4">{item.icon}</div>
                                    <h3
                                        className="font-jakarta text-base font-semibold mb-2"
                                        style={{ color: item.text }}
                                    >
                                        {item.label}
                                    </h3>
                                    <p className="text-sm leading-relaxed" style={{ color: item.text, opacity: 0.8 }}>
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Features ── */}
                <section id="features" className="py-20 md:py-28" style={{ background: '#FAFAF8' }}>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-14 text-center">
                            <h2
                                className="font-jakarta mb-3 text-3xl md:text-4xl font-bold"
                                style={{ color: '#2E2F35' }}
                            >
                                Fitur Unggulan
                            </h2>
                            <p className="text-base" style={{ color: '#58595D' }}>
                                Semua yang UMKM butuhkan untuk dominasi sosial media
                            </p>
                        </div>

                        <div className="space-y-16">
                            {/* Feature 1 */}
                            <div className="grid gap-10 md:grid-cols-2 items-center">
                                <div>
                                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4" style={{ background: '#E0F8F2', color: '#0A6B5E', letterSpacing: '0.08em' }}>
                                        JADWAL OTOMATIS
                                    </span>
                                    <h3 className="font-jakarta mb-4 text-2xl font-bold" style={{ color: '#2E2F35' }}>
                                        Jadwal Konten 30 Hari Otomatis
                                    </h3>
                                    <p className="mb-6 leading-relaxed text-sm" style={{ color: '#58595D' }}>
                                        Upload produk, isi data bisnis, tekan tombol. AI akan generate jadwal konten lengkap selama 30 hari ke depan — termasuk waktu posting optimal per platform.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            'Ide konten sesuai bisnis & tren',
                                            'Waktu posting yang sudah di-optimize per platform',
                                            'Deteksi hari besar otomatis (Lebaran, Natal, dst)',
                                        ].map((item) => (
                                            <li key={item} className="flex items-start gap-3 text-sm" style={{ color: '#58595D' }}>
                                                <span className="mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0" style={{ background: '#E0F8F2' }}>
                                                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#0A6B5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="rounded-2xl h-64 flex items-center justify-center border" style={{ background: 'linear-gradient(135deg, #E0F8F2 0%, #C5EEE6 100%)', borderColor: '#A4DDD4' }}>
                                    <div className="text-center">
                                        <span className="text-6xl">📅</span>
                                        <p className="mt-3 text-sm font-medium" style={{ color: '#0A6B5E' }}>30 Hari Jadwal</p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="grid gap-10 md:grid-cols-2 items-center">
                                <div className="rounded-2xl h-64 flex items-center justify-center border order-2 md:order-1" style={{ background: 'linear-gradient(135deg, #FDF3EA 0%, #F9E3C7 100%)', borderColor: '#F5D9AF' }}>
                                    <div className="text-center">
                                        <span className="text-6xl">🎨</span>
                                        <p className="mt-3 text-sm font-medium" style={{ color: '#7A4A10' }}>Konten Visual</p>
                                    </div>
                                </div>
                                <div className="order-1 md:order-2">
                                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4" style={{ background: '#FDF3EA', color: '#7A4A10', letterSpacing: '0.08em' }}>
                                        AI VISUAL
                                    </span>
                                    <h3 className="font-jakarta mb-4 text-2xl font-bold" style={{ color: '#2E2F35' }}>
                                        Generate Konten Visual AI
                                    </h3>
                                    <p className="mb-6 leading-relaxed text-sm" style={{ color: '#58595D' }}>
                                        Saat jadwal posting tiba, system auto generate caption dan media.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            'Caption unik yang di-generate AI',
                                            'Foto produk pro dari AI generation',
                                            'Video otomatis untuk TikTok',
                                        ].map((item) => (
                                            <li key={item} className="flex items-start gap-3 text-sm" style={{ color: '#58595D' }}>
                                                <span className="mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0" style={{ background: '#FDF3EA' }}>
                                                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#C27A20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="grid gap-10 md:grid-cols-2 items-center">
                                <div>
                                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4" style={{ background: '#E0F8F2', color: '#0A6B5E', letterSpacing: '0.08em' }}>
                                        MULTI-PLATFORM
                                    </span>
                                    <h3 className="font-jakarta mb-4 text-2xl font-bold" style={{ color: '#2E2F35' }}>
                                        Posting Otomatis ke Semua Platform
                                    </h3>
                                    <p className="mb-6 leading-relaxed text-sm" style={{ color: '#58595D' }}>
                                        Konten yang sudah jadi, langsung post otomatis ke Instagram dan TikTok sesuai jadwal.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            'Posting otomatis ke 4 platform sekaligus',
                                            'Jadwal bisa berbeda per platform',
                                            'Otomatis naik saat jadwal tiba',
                                        ].map((item) => (
                                            <li key={item} className="flex items-start gap-3 text-sm" style={{ color: '#58595D' }}>
                                                <span className="mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0" style={{ background: '#E0F8F2' }}>
                                                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#0A6B5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="rounded-2xl h-64 flex items-center justify-center border" style={{ background: 'linear-gradient(135deg, #E0F8F2 0%, #C5EEE6 100%)', borderColor: '#A4DDD4' }}>
                                    <div className="text-center">
                                        <span className="text-6xl">📤</span>
                                        <p className="mt-3 text-sm font-medium" style={{ color: '#0A6B5E' }}>Posting Otomatis</p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 4 */}
                            <div className="grid gap-10 md:grid-cols-2 items-center">
                                <div className="rounded-2xl h-64 flex items-center justify-center border order-2 md:order-1" style={{ background: 'linear-gradient(135deg, #FDF3EA 0%, #F9E3C7 100%)', borderColor: '#F5D9AF' }}>
                                    <div className="text-center">
                                        <span className="text-6xl">📊</span>
                                        <p className="mt-3 text-sm font-medium" style={{ color: '#7A4A10' }}>Dashboard Analytics</p>
                                    </div>
                                </div>
                                <div className="order-1 md:order-2">
                                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4" style={{ background: '#FDF3EA', color: '#7A4A10', letterSpacing: '0.08em' }}>
                                        ANALYTICS
                                    </span>
                                    <h3 className="font-jakarta mb-4 text-2xl font-bold" style={{ color: '#2E2F35' }}>
                                        Analytics & Performance Tracking
                                    </h3>
                                    <p className="mb-6 leading-relaxed text-sm" style={{ color: '#58595D' }}>
                                        Lihat performa setiap konten real-time. Likes, views, comments, reach — semua terpusat di satu dashboard.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            'Metric lengkap: likes, views, reach, engagement',
                                            'Data sync real-time',
                                            'Bandingkan performa antar platform',
                                        ].map((item) => (
                                            <li key={item} className="flex items-start gap-3 text-sm" style={{ color: '#58595D' }}>
                                                <span className="mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0" style={{ background: '#FDF3EA' }}>
                                                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#C27A20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── How It Works ── */}
                <section id="how-it-works" style={{ background: '#0D2B27' }} className="py-20 md:py-28">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-14 text-center">
                            <h2 className="font-jakarta mb-3 text-3xl md:text-4xl font-bold text-white">
                                Cara Kerja GanaAI
                            </h2>
                            <p className="text-base" style={{ color: '#8FCDC5' }}>
                                4 langkah mudah untuk mulai dominasi sosial media
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-4">
                            {[
                                { step: '01', title: 'Daftar & Setup', desc: 'Buat akun, isi data bisnis, upload produk' },
                                { step: '02', title: 'Connect Sosmed', desc: 'Connect akun IG dan TikTok.' },
                                { step: '03', title: 'Generate Jadwal', desc: 'AI generate jadwal 30 hari otomatis' },
                                { step: '04', title: 'Posting Otomatis', desc: 'Konten posting otomatis sesuai jadwal' },
                            ].map((item, i) => (
                                <div key={item.step} className="text-center relative">
                                    {i < 3 && (
                                        <div
                                            className="hidden md:block absolute top-7 left-[60%] w-[80%] h-px"
                                            style={{ background: 'linear-gradient(90deg, #1A5048 0%, transparent 100%)' }}
                                        />
                                    )}
                                    <div
                                        className="font-mono mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold"
                                        style={{ background: '#FF6D2C', color: 'white' }}
                                    >
                                        {item.step}
                                    </div>
                                    <h3 className="font-jakarta mb-2 text-base font-semibold text-white">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed" style={{ color: '#8FCDC5' }}>
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA Banner ── */}
                <section style={{ background: 'linear-gradient(135deg, #FF6D2C 0%, #E55A20 100%)' }} className="py-20">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="font-jakarta mb-4 text-4xl md:text-5xl font-bold text-white">
                            Siap Otomasi Konten Sosmed Anda?
                        </h2>
                        <p className="mb-8 text-base leading-relaxed" style={{ color: '#FFD9C4' }}>
                            Gratis selamanya. Bayar hanya saat butuh. Tidak ada kartu kredit yang dibutuhkan.
                        </p>
                        <Link
                            href={route('register')}
                            className="font-dm inline-block rounded-xl px-10 py-4 text-base font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            style={{ background: 'white', color: '#FF6D2C' }}
                        >
                            Daftar Sekarang →
                        </Link>
                    </div>
                </section>

                {/* ── Pricing ── */}
                <section id="pricing" className="py-20 md:py-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="font-jakarta mb-4 text-3xl md:text-4xl font-bold text-gray-900">
                                Harga Sederhana
                            </h2>
                            <p className="text-lg text-gray-600">
                                Semua fitur gratis di awal untuk testing. Bayar hanya saat butuh scale.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
                            {/* Starter */}
                            <div className="rounded-xl border border-gray-200 p-8 bg-white hover:shadow-lg transition">
                                <h3 className="font-jakarta mb-2 text-xl font-bold text-gray-900">Starter</h3>
                                <p className="mb-6 text-gray-600 text-sm">Perfect untuk mulai</p>
                                <div className="mb-6">
                                    <span className="font-jakarta text-4xl font-bold text-gray-900">Gratis</span>
                                    <p className="text-sm text-gray-600 mt-2">Selamanya gratis untuk testing</p>
                                </div>
                                <ul className="space-y-3 mb-8 text-sm text-gray-600">
                                    <li className="flex items-start gap-3"><span className="text-orange-500 font-bold mt-0.5">✓</span><span>Jadwal konten 30 hari</span></li>
                                    <li className="flex items-start gap-3"><span className="text-orange-500 font-bold mt-0.5">✓</span><span>2 Social Sets</span></li>
                                    <li className="flex items-start gap-3"><span className="text-orange-500 font-bold mt-0.5">✓</span><span>20 posts/bulan</span></li>
                                    <li className="flex items-start gap-3"><span className="text-gray-400 font-bold mt-0.5">✗</span><span className="text-gray-400">Advanced analytics</span></li>
                                </ul>
                                <button className="font-dm w-full rounded-lg border-2 border-gray-300 px-4 py-2 font-medium text-gray-900 hover:border-gray-400 transition">
                                    Mulai Gratis
                                </button>
                            </div>

                            {/* Professional */}
                            <div className="rounded-xl border-2 border-orange-500 p-8 bg-white shadow-xl transform scale-105">
                                <div className="mb-4 inline-block rounded-full bg-orange-500 px-4 py-1 text-sm font-medium text-white">
                                    Paling Populer
                                </div>
                                <h3 className="font-jakarta mb-2 text-xl font-bold text-gray-900">Professional</h3>
                                <p className="mb-6 text-gray-600 text-sm">Untuk UMKM berkembang</p>
                                <div className="mb-6">
                                    <span className="font-jakarta text-4xl font-bold text-gray-900">299k</span>
                                    <p className="text-sm text-gray-600 mt-2">/bulan</p>
                                </div>
                                <ul className="space-y-3 mb-8 text-sm text-gray-600">
                                    <li className="flex items-start gap-3"><span className="text-orange-500 font-bold mt-0.5">✓</span><span>Semua fitur Starter</span></li>
                                    <li className="flex items-start gap-3"><span className="text-orange-500 font-bold mt-0.5">✓</span><span>Unlimited Social Sets</span></li>
                                    <li className="flex items-start gap-3"><span className="text-orange-500 font-bold mt-0.5">✓</span><span>Unlimited posts</span></li>
                                    <li className="flex items-start gap-3"><span className="text-orange-500 font-bold mt-0.5">✓</span><span>Advanced analytics</span></li>
                                </ul>
                                <button className="font-dm w-full rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600 transition">
                                    Upgrade Sekarang
                                </button>
                            </div>

                            {/* Enterprise */}
                            <div className="rounded-xl border border-gray-200 p-8 bg-white hover:shadow-lg transition">
                                <h3 className="font-jakarta mb-2 text-xl font-bold text-gray-900">Enterprise</h3>
                                <p className="mb-6 text-gray-600 text-sm">Custom solution</p>
                                <div className="mb-6">
                                    <span className="font-jakarta text-4xl font-bold text-gray-900">Hubungi</span>
                                    <p className="text-sm text-gray-600 mt-2">Tim kami untuk quotes</p>
                                </div>
                                <ul className="space-y-3 mb-8 text-sm text-gray-600">
                                    <li className="flex items-start gap-3"><span className="text-orange-500 font-bold mt-0.5">✓</span><span>Semua fitur Pro</span></li>
                                    <li className="flex items-start gap-3"><span className="text-orange-500 font-bold mt-0.5">✓</span><span>Dedicated support</span></li>
                                    <li className="flex items-start gap-3"><span className="text-orange-500 font-bold mt-0.5">✓</span><span>Custom integration</span></li>
                                    <li className="flex items-start gap-3"><span className="text-orange-500 font-bold mt-0.5">✓</span><span>SLA Guarantee</span></li>
                                </ul>
                                <button className="font-dm w-full rounded-lg border-2 border-gray-300 px-4 py-2 font-medium text-gray-900 hover:border-gray-400 transition">
                                    Hubungi Sales
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section className="py-20 md:py-28" style={{ background: '#F5F5F1' }}>
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-14 text-center">
                            <h2 className="font-jakarta mb-3 text-3xl md:text-4xl font-bold" style={{ color: '#2E2F35' }}>
                                Pertanyaan Umum
                            </h2>
                            <p className="text-base" style={{ color: '#58595D' }}>
                                Jawaban untuk pertanyaan yang sering kami terima
                            </p>
                        </div>

                        <div className="space-y-3">
                            {[
                                { q: 'Apakah GanaAI aman untuk akun sosial media saya?', a: 'Ya, GanaAI 100% aman. Kami tidak pernah menyimpan password Anda. Data Anda terenkripsi dan kami mematuhi GDPR.' },
                                { q: 'Berapa lama untuk setup awal?', a: 'Sangat cepat! Setup hanya butuh 5 menit: (1) Daftar, (2) Isi data bisnis, (3) Connect akun sosmed, (4) Upload produk. Setelah itu, AI otomatis generate jadwal konten 30 hari untuk Anda.' },
                                { q: 'Apakah bisa edit konten sebelum posting?', a: 'Tentu! Anda bisa preview dan edit semua caption dan jadwal posting sebelum konten naik. Fleksibel penuh — mau ubah text, ganti foto, atau reschedule? Semua bisa diatur dari dashboard.' },
                                { q: 'Apakah saya perlu bayar sekarang?', a: 'Tidak perlu! Tier Starter gratis selamanya untuk testing. Bayar hanya saat Anda butuh fitur lebih. Tidak ada kartu kredit yang dibutuhkan untuk mulai.' },
                                { q: 'Berapa banyak platform yang bisa dikoneksi?', a: 'Saat ini kami support 4 platform utama: Instagram dan TikTok. Tier Starter bisa koneksi 2 Social Sets, tier Professional bisa unlimited.' },
                                { q: 'Bagaimana jika AI generate konten yang tidak sesuai?', a: 'Anda punya kontrol penuh! Edit atau hapus konten yang tidak sesuai. Feedback Anda juga membantu AI belajar preferensi Anda untuk generate yang lebih baik ke depannya.' },
                            ].map((faq) => (
                                <details
                                    key={faq.q}
                                    className="rounded-xl border bg-white group cursor-pointer"
                                    style={{ borderColor: '#E8E8E4' }}
                                >
                                    <summary
                                        className="font-jakarta flex items-center justify-between p-6 font-semibold transition-colors list-none"
                                        style={{ color: '#2E2F35' }}
                                    >
                                        <span className="pr-4">{faq.q}</span>
                                        <span
                                            className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center transition-transform group-open:rotate-45"
                                            style={{ background: '#E0F8F2', color: '#0A6B5E' }}
                                        >
                                            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="#0A6B5E" strokeWidth="1.5" strokeLinecap="round" /></svg>
                                        </span>
                                    </summary>
                                    <p className="px-6 pb-6 text-sm leading-relaxed" style={{ color: '#58595D' }}>
                                        {faq.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}