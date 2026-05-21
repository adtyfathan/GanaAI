import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import {
    Store01Icon,
    Package01Icon,
    ArrowRight01Icon,
    Tick02Icon,
    SparklesIcon,
    ImageIcon,
    Location01Icon,
    BrushIcon,
    Target01Icon,
    InstagramIcon,
    Calendar01Icon,
    ArrowLeft01Icon,
    RocketIcon,
    Medal06Icon,
    BubbleChatQuestionIcon,
} from '@hugeicons/core-free-icons';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PLATFORM_META = {
    instagram: {
        label: 'Instagram',
        color: '#E1306C',
        bgClass: 'bg-pink-50',
        borderClass: 'border-pink-100',
        icon: () => (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <defs>
                    <linearGradient id="ig-prev" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f09433" />
                        <stop offset="50%" stopColor="#dc2743" />
                        <stop offset="100%" stopColor="#bc1888" />
                    </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-prev)" />
                <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none" />
                <circle cx="17" cy="7" r="1.2" fill="white" />
            </svg>
        ),
    },
    tiktok: {
        label: 'TikTok',
        color: '#010101',
        bgClass: 'bg-neutral-100',
        borderClass: 'border-neutral-200',
        icon: () => (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <rect width="24" height="24" rx="5" fill="#010101" />
                <path
                    d="M16.5 5.5c.3 1.8 1.4 3 3 3.3v2.3c-1 0-2.1-.3-3-.9v5.2c0 2.6-2 4.6-4.6 4.6s-4.6-2-4.6-4.6 2-4.6 4.6-4.6c.2 0 .4 0 .6.1v2.4c-.2 0-.4-.1-.6-.1-1.2 0-2.2 1-2.2 2.2s1 2.2 2.2 2.2 2.2-1 2.2-2.2V5.5h2.4z"
                    fill="white"
                />
            </svg>
        ),
    },
};

function formatPrice(price) {
    if (!price && price !== 0) return '—';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
}

// ─── Section Card wrapper ──────────────────────────────────────────────────────

function SectionCard({ icon, title, badge, children, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1], delay }}
            className="rounded-2xl border border-neutral-100 bg-white overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-50">
                <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={icon} size={15} className="text-orange-500" />
                </div>
                <span className="font-jakarta font-bold text-[14px] text-neutral-800 flex-1">{title}</span>
                {badge && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-[11px] font-bold">
                        {badge}
                    </span>
                )}
            </div>
            <div className="px-5 py-4">{children}</div>
        </motion.div>
    );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({ icon, label, value, mono = false }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 py-2 border-b border-neutral-50 last:border-0">
            <HugeiconsIcon icon={icon} size={13} className="text-neutral-400 mt-0.5 shrink-0" />
            <span className="text-[12px] text-neutral-400 w-28 shrink-0">{label}</span>
            <span
                className={`text-[13px] text-neutral-700 font-medium flex-1 leading-snug ${mono ? 'font-mono' : ''
                    }`}
            >
                {value}
            </span>
        </div>
    );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, index }) {
    const firstImage = product.images?.[0];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, delay: index * 0.07 }}
            className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 bg-neutral-50/60 hover:bg-white hover:border-neutral-200 transition-all duration-200"
        >
            {/* Thumbnail */}
            <div className="w-11 h-11 rounded-lg bg-neutral-100 overflow-hidden shrink-0 flex items-center justify-center">
                {firstImage ? (
                    <img
                        src={`/storage/${firstImage.image_path}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <HugeiconsIcon icon={ImageIcon} size={16} className="text-neutral-300" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-neutral-800 truncate">{product.name}</p>
                <p className="text-[11px] text-neutral-400 truncate">{product.product_type}</p>
            </div>

            {/* Price */}
            <div className="shrink-0">
                <span className="text-[12px] font-bold text-orange-500 font-mono">
                    {formatPrice(product.price)}
                </span>
            </div>
        </motion.div>
    );
}

// ─── Connected Platform Badge ──────────────────────────────────────────────────

function PlatformBadge({ account }) {
    const meta = PLATFORM_META[account.platform] ?? {
        label: account.platform,
        bgClass: 'bg-neutral-100',
        borderClass: 'border-neutral-200',
        icon: () => null,
    };
    const Icon = meta.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border ${meta.bgClass} ${meta.borderClass}`}
        >
            <Icon />
            <div>
                <p className="text-[12px] font-semibold text-neutral-800">{meta.label}</p>
                {account.account_username && (
                    <p className="text-[11px] text-neutral-500">@{account.account_username}</p>
                )}
            </div>
            <HugeiconsIcon icon={Tick02Icon} size={12} className="text-green-500 ml-auto" />
        </motion.div>
    );
}

// ─── AI Ready Banner ──────────────────────────────────────────────────────────

function AIReadyBanner() {
    const items = [
        { icon: Calendar01Icon, text: '30 ide konten otomatis tiap bulan' },
        { icon: SparklesIcon, text: 'Caption & visual dibuat AI' },
        { icon: RocketIcon, text: 'Posting otomatis ke semua platform' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="rounded-2xl bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 border border-orange-100 p-5"
        >
            <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={SparklesIcon} size={13} className="text-white" />
                </div>
                <p className="font-jakarta font-extrabold text-[14px] text-orange-700 tracking-tight">
                    AI siap bekerja untuk bisnis kamu!
                </p>
            </div>
            <div className="flex flex-col gap-2">
                {items.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                        className="flex items-center gap-2.5"
                    >
                        <div className="w-5 h-5 rounded-md bg-orange-100 flex items-center justify-center shrink-0">
                            <HugeiconsIcon icon={item.icon} size={11} className="text-orange-500" />
                        </div>
                        <p className="text-[12.5px] text-orange-700">{item.text}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function Preview({
    businessProfile = null,
    products = [],
    productCount = 0,
    onBack,
    connectedAccounts = [],
    onComplete,
}) {
    const [isCompleting, setIsCompleting] = useState(false);

    const handleComplete = async () => {
        if (!onComplete) return;
        setIsCompleting(true);
        try {
            await onComplete();
        } catch {
            setIsCompleting(false);
        }
    };

    const activeAccounts = connectedAccounts.filter(a => a.is_active !== false);

    // ── Checklist items ──────────────────────────────────────────────────────
    const checks = [
        {
            done: !!businessProfile,
        },
        {
            done: products.length > 0,
        },
        {
            done: activeAccounts.length > 0,
        },
    ];

    const allDone = checks.every(c => c.done);

    const BUSINESS_TYPE_LABELS = {
        fashion: 'Fashion & Pakaian',
        food_beverage: 'Makanan & Minuman',
        electronics: 'Elektronik',
        beauty: 'Kecantikan & Perawatan',
        home_decor: 'Dekorasi Rumah',
        handmade: 'Kerajinan Tangan',
        education: 'Pendidikan & Kursus',
        services: 'Jasa & Konsultasi',
    };

    const CONTENT_TONE_LABELS = {
        professional: 'Profesional & Serius',
        friendly: 'Ramah & Santai',
        inspirational: 'Inspiratif & Motivasi',
        humorous: 'Lucu & Menghibur',
        educational: 'Edukatif & Informatif',
        luxurious: 'Mewah & Premium',
        minimalist: 'Minimalis & Elegan',
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-5"
        >
            {/* ── Page header ── */}
            <div className="mb-2">
                <h1 className="font-jakarta font-extrabold text-[26px] leading-tight tracking-tight text-neutral-900">
                    Ringkasan Setup
                </h1>
                <p className="text-[14px] text-neutral-500 mt-1">
                    Periksa kembali informasi bisnismu sebelum AI mulai bekerja.
                </p>
            </div>

            {/* ── Business Profile ── */}
            {businessProfile && (
                <SectionCard icon={Store01Icon} title="Profil Bisnis" delay={0.1}>
                    {/* Logo + name hero */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 overflow-hidden flex items-center justify-center shrink-0">
                            {businessProfile.logo_path ? (
                                <img
                                    src={`/storage/${businessProfile.logo_path}`}
                                    alt="Logo"
                                    className="w-full h-full object-cover"
                                    onError={e => { e.currentTarget.style.display = 'none'; }}
                                />
                            ) : (
                                <HugeiconsIcon icon={Store01Icon} size={20} className="text-orange-300" />
                            )}
                        </div>
                        <div>
                            <p className="font-jakarta font-bold text-[16px] text-neutral-900 leading-tight">
                                {businessProfile.business_name}
                            </p>
                            <p className="text-[12px] text-neutral-400 mt-0.5">{BUSINESS_TYPE_LABELS[businessProfile.business_type] ?? businessProfile.business_type}</p>
                        </div>
                    </div>

                    <div className="space-y-0">
                        <InfoRow icon={BrushIcon} label="Nuansa konten" value={CONTENT_TONE_LABELS[businessProfile.content_tone] ?? businessProfile.content_tone} />
                        <InfoRow icon={Target01Icon} label="Target audiens" value={businessProfile.target_audience} />
                        <InfoRow icon={Location01Icon} label="Lokasi" value={businessProfile.location} />
                        <InfoRow icon={Medal06Icon} label="Visi & Misi" value={businessProfile.vision_mission} />
                        <InfoRow icon={BubbleChatQuestionIcon} label="Keunikan" value={businessProfile.uniqueness} />
                        {businessProfile.description && (
                            <InfoRow icon={Store01Icon} label="Deskripsi" value={businessProfile.description} />
                        )}
                    </div>
                </SectionCard>
            )}

            {/* ── Products ── */}
            <SectionCard
                icon={Package01Icon}
                title="Produk"
                badge={products.length > 0 ? products.length : null}
                delay={0.18}
            >
                {products.length === 0 ? (
                    <div className="flex flex-col items-center py-6 gap-2 text-center">
                        <HugeiconsIcon icon={Package01Icon} size={28} className="text-neutral-200" />
                        <p className="text-[13px] text-neutral-400">Belum ada produk yang ditambahkan.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <AnimatePresence>
                            {products.map((product, i) => (
                                <ProductCard key={product.id} product={product} index={i} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </SectionCard>

            {/* ── Social Accounts ── */}
            <SectionCard
                icon={InstagramIcon}
                title="Sosial Media"
                badge={activeAccounts.length > 0 ? activeAccounts.length : null}
                delay={0.26}
            >
                {activeAccounts.length === 0 ? (
                    <div className="flex flex-col items-center py-6 gap-2 text-center">
                        <HugeiconsIcon icon={InstagramIcon} size={28} className="text-neutral-200" />
                        <p className="text-[13px] text-neutral-400">Belum ada platform yang terhubung.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeAccounts.map((account, i) => (
                            <PlatformBadge key={account.id} account={account} />
                        ))}
                    </div>
                )}
            </SectionCard>

            <AIReadyBanner />

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="group inline-flex items-center gap-2 h-auto bg-orange-500 hover:bg-orange-600 text-white font-jakarta font-bold text-[15px] px-7 py-3.5 rounded-xl shadow-[0_4px_14px_rgba(249,115,22,0.28)] hover:shadow-[0_8px_22px_rgba(249,115,22,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                    <HugeiconsIcon
                        icon={ArrowLeft01Icon}
                        size={15}
                        className="transition-transform duration-200 group-hover:-translate-x-0.5"
                    />
                    Kembali ke Akun
                </button>

                <Button
                    type="button"
                    onClick={handleComplete}
                    disabled={!allDone || isCompleting}
                    className="group inline-flex items-center gap-2 h-auto bg-orange-500 hover:bg-orange-600 text-white font-jakarta font-bold text-[15px] px-7 py-3.5 rounded-xl shadow-[0_4px_14px_rgba(249,115,22,0.28)] hover:shadow-[0_8px_22px_rgba(249,115,22,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                    Mulai Sekarang
                    <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={16}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                </Button>
                {/* <CompletionCTA onComplete={handleComplete} isCompleting={isCompleting} allDone={allDone} /> */}
            </div>
        </motion.div>
    );
}