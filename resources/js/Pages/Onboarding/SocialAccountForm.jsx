import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import {
    ArrowRight01Icon,
    ArrowLeft01Icon,
    CheckmarkCircle01Icon,
    Cancel01Icon,
    RefreshIcon,
    Loading03Icon,
    LinkSquare01Icon,
    Tick02Icon,
    InformationCircleIcon,
} from '@hugeicons/core-free-icons';

// ─── Platform Config ───────────────────────────────────────────────────────────

const PLATFORMS = [
    {
        id: 'instagram',
        label: 'Instagram',
        description: 'Feed, Reels & Stories',
        accentColor: '#E1306C',
        bg: 'bg-pink-50',
        border: 'border-pink-100',
        badgeBg: 'bg-pink-100',
        badgeText: 'text-pink-600',
        icon: () => (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <defs>
                    <linearGradient id="ig-grad-sa" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f09433" />
                        <stop offset="25%" stopColor="#e6683c" />
                        <stop offset="50%" stopColor="#dc2743" />
                        <stop offset="75%" stopColor="#cc2366" />
                        <stop offset="100%" stopColor="#bc1888" />
                    </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-grad-sa)" />
                <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none" />
                <circle cx="17" cy="7" r="1.2" fill="white" />
            </svg>
        ),
    },
    {
        id: 'tiktok',
        label: 'TikTok',
        description: 'Video & Duet',
        accentColor: '#010101',
        bg: 'bg-neutral-100',
        border: 'border-neutral-200',
        badgeBg: 'bg-neutral-200',
        badgeText: 'text-neutral-700',
        icon: () => (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <rect width="24" height="24" rx="5" fill="#010101" />
                <path
                    d="M16.5 5.5c.3 1.8 1.4 3 3 3.3v2.3c-1 0-2.1-.3-3-.9v5.2c0 2.6-2 4.6-4.6 4.6s-4.6-2-4.6-4.6 2-4.6 4.6-4.6c.2 0 .4 0 .6.1v2.4c-.2 0-.4-.1-.6-.1-1.2 0-2.2 1-2.2 2.2s1 2.2 2.2 2.2 2.2-1 2.2-2.2V5.5h2.4z"
                    fill="white"
                />
            </svg>
        ),
    },
];

// ─── Platform Card ─────────────────────────────────────────────────────────────

function PlatformCard({ platform, connectedAccount, onConnect, onDisconnect, isLoading, isDisconnecting }) {
    const Icon = platform.icon;
    const isConnected = !!connectedAccount;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -8 }}
            transition={{ duration: 0.25 }}
            className={`
                relative flex items-center gap-4 rounded-xl border p-4 transition-all duration-200 group
                ${isConnected
                    ? 'bg-green-50/80 border-green-200 shadow-sm'
                    : 'bg-white border-neutral-100 hover:border-neutral-200 hover:shadow-md cursor-default'
                }
            `}
        >
            {/* Platform icon badge */}
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${platform.bg} border ${platform.border}`}>
                <Icon />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[14px] text-neutral-900">{platform.label}</span>
                    {isConnected && (
                        <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-[0.09em] px-2 py-0.5 rounded-full"
                        >
                            <HugeiconsIcon icon={Tick02Icon} size={9} />
                            Terhubung
                        </motion.span>
                    )}
                    {!isConnected && (
                        <span className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.09em] px-2 py-0.5 rounded-full ${platform.badgeBg} ${platform.badgeText}`}>
                            {platform.description}
                        </span>
                    )}
                </div>

                {isConnected ? (
                    <p className="text-[12px] text-green-600 font-medium mt-0.5">
                        {connectedAccount.account_username
                            ? `@${connectedAccount.account_username}`
                            : platform.description}
                    </p>
                ) : (
                    <p className="text-[12px] text-neutral-400 mt-0.5">Belum terhubung</p>
                )}
            </div>

            {/* Action button */}
            <div className="shrink-0">
                {isConnected ? (
                    <button
                        type="button"
                        onClick={() => onDisconnect(connectedAccount.id)}
                        disabled={isDisconnecting}
                        className={`
                            flex items-center gap-2 text-[13px] font-bold px-4 py-2 rounded-lg transition-all duration-200 font-jakarta
                            ${isDisconnecting
                                ? 'bg-red-300 text-white cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-[0_4px_12px_rgba(239,68,68,0.28)] hover:-translate-y-0.5 active:translate-y-0'
                            }
                        `}
                    >
                        {isDisconnecting ? (
                            <>
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                    <HugeiconsIcon icon={Loading03Icon} size={13} />
                                </motion.span>
                                <span>Memutuskan...</span>
                            </>
                        ) : (
                            <>
                                <HugeiconsIcon icon={Cancel01Icon} size={13} />
                                Putuskan
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => onConnect(platform.id)}
                        disabled={isLoading}
                        className={`
                            flex items-center gap-2 text-[13px] font-bold px-4 py-2 rounded-lg transition-all duration-200 font-jakarta
                            ${isLoading
                                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-[0_4px_12px_rgba(249,115,22,0.25)] hover:-translate-y-0.5 active:translate-y-0'
                            }
                        `}
                    >
                        {isLoading ? (
                            <>
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                    <HugeiconsIcon icon={Loading03Icon} size={13} />
                                </motion.span>
                                <span>Menghubungkan...</span>
                            </>
                        ) : (
                            <>
                                <HugeiconsIcon icon={LinkSquare01Icon} size={13} />
                                Hubungkan
                            </>
                        )}
                    </button>
                )}
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function SocialAccountForm({
    connectedAccounts: initialAccounts = [],
    socialSetId: initialSocialSetId = null,
    flash = {},
    onBack,
    onComplete,
    variants,
    direction,
}) {
    const [accounts, setAccounts] = useState(initialAccounts);
    const [socialSetId, setSocialSetId] = useState(initialSocialSetId);
    const [loadingPlatform, setLoadingPlatform] = useState(null);
    const [disconnectingId, setDisconnectingId] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);

    const connectedCount = accounts.filter(a => a.is_active !== false).length;
    const canContinue = connectedCount >= 1;

    // ── Ensure Social Set ─────────────────────────────────────────────────────

    const ensureSocialSet = async () => {
        if (socialSetId) return socialSetId;
        const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
        const res = await fetch(route('onboarding.zernio.social-set'), {
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': csrf, 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal membuat Social Set.');
        setSocialSetId(data.social_set_id);
        return data.social_set_id;
    };

    // ── Connect platform ──────────────────────────────────────────────────────

    const handleConnect = async (platformId) => {
        setLoadingPlatform(platformId);
        try {
            await ensureSocialSet();
            const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
            const res = await fetch(route('onboarding.zernio.connect-url'), {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': csrf, 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform: platformId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Gagal mendapatkan URL.');
            window.location.href = data.auth_url;
        } catch (err) {
            toast.error(err.message);
            setLoadingPlatform(null);
        }
    };

    // ── Disconnect ────────────────────────────────────────────────────────────

    const handleDisconnect = async (accountId) => {
        setDisconnectingId(accountId);
        const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
        try {
            const res = await fetch(route('onboarding.zernio.disconnect', { account: accountId }), {
                method: 'DELETE',
                headers: { 'X-CSRF-TOKEN': csrf },
            });
            if (res.ok) {
                setAccounts(prev => prev.filter(a => a.id !== accountId));
                toast.success('Akun berhasil diputus.');
            }
        } catch {
            toast.error('Gagal memutus akun. Coba lagi.');
        } finally {
            setDisconnectingId(null);
        }
    };

    // ── Sync ──────────────────────────────────────────────────────────────────

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
            const res = await fetch(route('onboarding.zernio.sync'), {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': csrf },
            });
            const data = await res.json();
            if (res.ok) {
                setAccounts(data.accounts);
                toast.success('Akun berhasil disinkronkan.');
            }
        } catch {
            toast.error('Gagal sync akun.');
        } finally {
            setIsSyncing(false);
        }
    };

    const getConnectedAccount = (platformId) =>
        accounts.find(a => a.platform === platformId && a.is_active !== false) ?? null;

    const handleComplete = () => {
        if (!canContinue) {
            toast.error('Hubungkan minimal 1 platform untuk melanjutkan.');
            return;
        }
        onComplete?.();
    };

    return (
        <motion.div
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
        >
            {/* Header — sama persis dengan ProductForm */}
            <div className="flex items-start justify-between mb-1">
                <div>
                    <h1 className="font-jakarta font-extrabold text-[26px] leading-tight tracking-tight text-neutral-900">
                        Hubungkan Sosial Media
                    </h1>
                    <p className="text-[14px] text-neutral-500 mt-1 mb-6">
                        Hubungkan minimal 1 platform agar AI bisa memposting konten bisnis kamu secara otomatis.
                    </p>
                </div>
            </div>

            {/* Connected count — mirip product count banner */}
            <AnimatePresence>
                {connectedCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -6, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden mb-5"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-[14px] font-semibold text-neutral-700">
                                Platform Terhubung
                                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-[11px] font-bold">
                                    {connectedCount}
                                </span>
                            </h2>
                            <p className="text-[11px] text-neutral-400">Tambahkan akun untuk posting konten</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Platform cards — gaya sama dengan product grid */}
            <div className="flex flex-col gap-3 mb-5">
                <AnimatePresence>
                    {PLATFORMS.map((platform) => (
                        <PlatformCard
                            key={platform.id}
                            platform={platform}
                            connectedAccount={getConnectedAccount(platform.id)}
                            onConnect={handleConnect}
                            onDisconnect={handleDisconnect}
                            isLoading={loadingPlatform === platform.id}
                            isDisconnecting={disconnectingId === getConnectedAccount(platform.id)?.id}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Sync button — ringan, seperti link */}
            <button
                type="button"
                onClick={handleSync}
                disabled={isSyncing}
                className="group flex items-center gap-2 text-[13px] text-neutral-400 hover:text-neutral-700 font-medium mb-6 transition-colors disabled:opacity-50"
            >
                <motion.span
                    animate={isSyncing ? { rotate: 360 } : { rotate: 0 }}
                    transition={isSyncing
                        ? { duration: 1, repeat: Infinity, ease: 'linear' }
                        : { duration: 0 }
                    }
                    className="group-hover:text-orange-500 transition-colors"
                >
                    <HugeiconsIcon icon={RefreshIcon} size={14} />
                </motion.span>
                {isSyncing ? 'Menyinkronkan...' : 'Sinkronkan ulang akun'}
            </button>

            {/* Info note — box amber, konsisten dengan gaya notifikasi di form lain */}
            <div className="border border-neutral-100 rounded-xl bg-orange-50/60 px-4 py-3 mb-8 flex items-start gap-3">
                <HugeiconsIcon
                    icon={InformationCircleIcon}
                    size={15}
                    className="text-orange-400 mt-0.5 shrink-0"
                />
                <p className="text-[12.5px] text-orange-700 leading-relaxed">
                    <span className="font-semibold">Catatan:</span>{' '}
                    Setelah klik "Hubungkan", kamu akan diarahkan ke halaman otorisasi platform. Setelah mengizinkan, kamu akan otomatis kembali ke halaman ini.
                </p>
            </div>

            {/* Bottom navigation — identik dengan ProductForm */}
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
                    Kembali ke Produk
                </button>

                <Button
                    type="button"
                    onClick={onComplete}
                    disabled={!canContinue}
                    className="group inline-flex items-center gap-2 h-auto bg-orange-500 hover:bg-orange-600 text-white font-jakarta font-bold text-[15px] px-7 py-3.5 rounded-xl shadow-[0_4px_14px_rgba(249,115,22,0.28)] hover:shadow-[0_8px_22px_rgba(249,115,22,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                    Lihat Preview
                    <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={16}
                        onClick={handleComplete}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                </Button>
            </div>
        </motion.div>
    );
}