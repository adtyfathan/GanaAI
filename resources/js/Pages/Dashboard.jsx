import { Head, router } from "@inertiajs/react";
import { useState, useEffect, useRef, useCallback } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import idLocale from "@fullcalendar/core/locales/id";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HugeiconsIcon } from '@hugeicons/react';
import {
    AiIdeaIcon, ImageAdd02Icon, Clock02Icon, AlertCircleIcon, VideoReplayIcon, Image01Icon
} from '@hugeicons/core-free-icons';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PLATFORM_COLORS = {
    instagram: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200", dot: "#ec4899" },
    tiktok: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", dot: "#64748b" },
};

const POST_TYPE_LABELS = {
    feed: "Feed",
    reels: "Reels",
    story: "Story",
    video: "Video",
};

const STATUS_CONFIG = {
    idea: { bg: "bg-gray-100", text: "text-gray-600", label: "Draft", dot: "#9ca3af" },
    generating: { bg: "bg-amber-100", text: "text-amber-700", label: "Memproses", dot: "#f59e0b" },
    ready: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Siap", dot: "#10b981" },
    failed: { bg: "bg-red-100", text: "text-red-600", label: "Gagal", dot: "#ef4444" },
};

function getEventColor(status) {
    const map = {
        idea: { background: "#f3f4f6", border: "#e5e7eb", text: "#374151" },
        generating: { background: "#fef3c7", border: "#fde68a", text: "#92400e" },
        ready: { background: "#d1fae5", border: "#6ee7b7", text: "#065f46" },
        failed: { background: "#fee2e2", border: "#fca5a5", text: "#991b1b" },
    };
    return map[status] ?? map.idea;
}

function formatTime(isoString) {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function formatFullDate(isoString) {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleDateString("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
}

// ─── Calendar Custom CSS ──────────────────────────────────────────────────────

const calendarStyles = `
    .fc { font-family: 'DM Sans', sans-serif; }
    .fc .fc-toolbar { display: none; }

    .fc .fc-col-header-cell {
        padding: 6px 0;
        border: none;
        background: transparent;
    }
    .fc .fc-col-header-cell-cushion {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #9ca3af;
        text-decoration: none !important;
        padding: 0;
    }

    .fc .fc-daygrid-body { width: 100% !important; }
    .fc table { width: 100% !important; }
    .fc .fc-scrollgrid {
        border: none;
        border-collapse: separate;
        border-spacing: 2px;
    }
    .fc .fc-scrollgrid-section > td,
    .fc .fc-scrollgrid td,
    .fc .fc-scrollgrid th { border: none; }

    .fc .fc-daygrid-day {
        border: none;
        border-radius: 8px;
        background: transparent;
        transition: background 0.15s ease;
    }
    .fc .fc-daygrid-day:hover { background: #f9fafb; }
    .fc .fc-daygrid-day.fc-day-today {
        background: #FFDED0 !important;
    }
    .fc .fc-daygrid-day-frame {
        padding: 2px;
        min-height: 60px;
    }

    .fc .fc-daygrid-day-number {
        font-size: 11px;
        font-weight: 600;
        color: #6b7280;
        padding: 3px 4px;
        text-decoration: none !important;
        font-family: 'JetBrains Mono', monospace;
    }
    .fc .fc-day-today .fc-daygrid-day-number {
        color: #FF6D2C;
        font-weight: 700;
    }
    .fc .fc-day-other .fc-daygrid-day-number { color: #d1d5db; }

    .fc .fc-event {
        border-radius: 4px;
        border-width: 1px;
        cursor: pointer;
        margin-bottom: 1px;
        transition: transform 0.1s ease, box-shadow 0.1s ease;
    }
    .fc .fc-event:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        z-index: 10 !important;
    }
    .fc .fc-event-title {
        font-size: 10px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 2px;
    }
    .fc .fc-daygrid-event-dot { display: none; }
    .fc .fc-event-time { display: none; }

    .fc .fc-daygrid-more-link {
        font-size: 10px;
        font-weight: 600;
        color: #FF6D2C;
        background: #fff7f5;
        border-radius: 4px;
        padding: 1px 4px;
        text-decoration: none;
    }
    .fc .fc-daygrid-more-link:hover { background: #ffede5; }
    .fc .fc-daygrid-day-bottom { padding: 1px 2px; }

    .fc .fc-popover {
        border-radius: 12px;
        border: 1px solid #f3f4f6;
        box-shadow: 0 10px 25px rgba(0,0,0,0.12);
        overflow: hidden;
        max-width: 220px;
    }
    .fc .fc-popover-header {
        background: #f9fafb;
        padding: 8px 12px;
        font-size: 11px;
        font-weight: 700;
        color: #374151;
        font-family: 'JetBrains Mono', monospace;
    }
    .fc .fc-popover-body { padding: 6px; background: white; }

    /* Mobile overrides */
    @media (max-width: 640px) {
        .fc .fc-scrollgrid { border-spacing: 1px; }
        .fc .fc-daygrid-day-frame { min-height: 48px; padding: 1px; }
        .fc .fc-col-header-cell-cushion { font-size: 9px; letter-spacing: 0; }
        .fc .fc-daygrid-day-number { font-size: 10px; padding: 2px 3px; }
        .fc .fc-event { border-radius: 3px; }
        .fc .fc-event-title { font-size: 9px; padding: 0 1px; }
        .fc .fc-daygrid-more-link { font-size: 9px; padding: 0 3px; }
        .fc .fc-daygrid-day-bottom { padding: 0 1px; }
    }
`;

function CalendarEventContent({ eventInfo }) {
    const { idea } = eventInfo.event.extendedProps;
    const platforms = [...new Set(idea.post_schedules?.map((s) => s.platform) ?? [])];
    const isVideo = idea.media_preference === "video";

    return (
        <div className="px-1 py-0.5 w-full overflow-hidden">
            <span
                className="text-[9px] sm:text-[11px] font-semibold truncate leading-tight block"
                style={{ color: getEventColor(idea.status).text }}
            >
                {idea.content_theme}
            </span>

            {/* Badge row — hidden on very small screens */}
            <div className="hidden sm:flex items-center justify-between mt-2">
                {/* Kiri: media preference */}
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md ${isVideo ? "bg-violet-100" : "bg-blue-100"}`}>
                    <HugeiconsIcon
                        icon={isVideo ? VideoReplayIcon : Image01Icon}
                        size={8}
                        color={isVideo ? "#7c3aed" : "#2563eb"}
                    />
                    <span className={`text-[9px] font-semibold leading-none ${isVideo ? "text-violet-700" : "text-blue-700"}`}>
                        {isVideo ? "Video" : "Gambar"}
                    </span>
                </div>

                {/* Kanan: platform logos */}
                <div className="flex items-center gap-0.5">
                    {platforms.slice(0, 2).map((p) => (
                        <img
                            key={p}
                            src={p === "instagram" ? "/images/instagram.webp" : "/images/tiktok.webp"}
                            alt={p}
                            className="w-3 h-3 object-contain"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Detail Dialog (shadcn) ────────────────────────────────────────────────────

function DetailDialog({ idea, open, onOpenChange }) {
    if (!idea) return null;

    const statusCfg = STATUS_CONFIG[idea.status] ?? STATUS_CONFIG.idea;
    const isHoliday = idea.content_type === "holiday_greeting";
    const firstSchedule = idea.post_schedules?.[0];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Full-width on mobile, capped on larger screens */}
            <DialogContent className="p-0 gap-0 overflow-hidden w-[calc(100%-2rem)] sm:max-w-lg rounded-2xl bg-white mx-auto">

                {/* Header */}
                <DialogHeader className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-gray-100 flex-row items-start gap-3 space-y-0">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${statusCfg.bg} ${statusCfg.text}`}>
                                {statusCfg.label}
                            </span>
                            {isHoliday && idea.holiday_name && (
                                <span className="text-[10px] sm:text-[11px] text-amber-600 font-semibold">
                                    {idea.holiday_name}
                                </span>
                            )}
                        </div>
                        <DialogTitle
                            className="text-sm sm:text-base font-bold text-gray-900 leading-snug text-left"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            {idea.content_theme}
                        </DialogTitle>
                        {firstSchedule && (
                            <DialogDescription className="text-[11px] sm:text-xs text-gray-400 mt-0.5 text-left">
                                {formatFullDate(firstSchedule.scheduled_at)}
                            </DialogDescription>
                        )}
                    </div>
                </DialogHeader>

                {/* Scrollable body */}
                <ScrollArea className="max-h-[60vh] sm:max-h-[55vh]">
                    <div className="px-4 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4">

                        {/* Deskripsi konten */}
                        {idea.content_description && (
                            <div>
                                <p className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                                    Deskripsi Konten
                                </p>
                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3">
                                    {idea.content_description}
                                </p>
                            </div>
                        )}

                        {/* Produk */}
                        {idea.product && (
    <div>
        <p className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
            Produk yang Dipromosikan
        </p>
        <div className="flex items-center gap-3 bg-[#FDF3EA] rounded-xl p-3">
            {/* Gambar produk — fallback ke placeholder jika tidak ada */}
            {idea.product.images?.[0]?.image_path ? (
                <img
                    src={`/storage/${idea.product.images[0].image_path}`}
                    alt={idea.product.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-orange-100"
                />
            ) : (
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🛍️</span>
                </div>
            )}
            <div className="min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-orange-800 block truncate">
                    {idea.product.name}
                </span>
                {idea.product.format_product_type && (
                    <span className="text-[10px] sm:text-[11px] text-orange-500 font-medium">
                        {idea.product.format_product_type}
                    </span>
                )}
            </div>
        </div>
    </div>
)}

                        {/* Jadwal per platform */}
                        <div>
                            <p className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                Jadwal Posting
                            </p>
                            <div className="space-y-2">
                                {idea.post_schedules?.map((s) => {
                                    const platCfg = PLATFORM_COLORS[s.platform] ?? PLATFORM_COLORS.instagram;
                                    return (
                                        <div
                                            key={s.id}
                                            className={`flex items-center justify-between rounded-xl px-3 py-2 sm:py-2.5 border ${platCfg.bg} ${platCfg.border}`}
                                        >
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                <img
                                                    key={s.platform}
                                                    src={s.platform === "instagram" ? "/images/instagram.webp" : "/images/tiktok.webp"}
                                                    alt={s.platform}
                                                    className="w-4 h-4 object-contain"
                                                />
                                                <span className={`text-[11px] sm:text-xs font-bold uppercase ${platCfg.text}`}>
                                                    {s.platform === "instagram" ? "Instagram" : "TikTok"}
                                                </span>
                                                <span className={`text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md font-medium bg-white/70 ${platCfg.text}`}>
                                                    {POST_TYPE_LABELS[s.post_type] ?? s.post_type}
                                                </span>
                                            </div>
                                            <span
                                                className={`text-[11px] sm:text-xs font-mono font-semibold ${platCfg.text}`}
                                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                            >
                                                {formatTime(s.scheduled_at)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Media preference */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                                Format Media:
                            </span>
                            <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${idea.media_preference === "video"
                                    ? "bg-violet-100 text-violet-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}>
                                {idea.media_preference === "video" ? "🎬 Video" : "🖼️ Gambar"}
                            </span>
                        </div>

                        {/* Caption */}
                        {idea.generated_content?.caption && (
                            <div>
                                <p className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                                    Caption
                                </p>
                                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <p className="text-[11px] sm:text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                                        {idea.generated_content.caption}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Preview gambar */}
                        {idea.generated_content?.media_url && (
                            <div>
                                <p className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                                    Preview Media
                                </p>
                                <img
                                    src={idea.generated_content.media_url}
                                    alt="Preview konten"
                                    className="w-full rounded-xl object-cover aspect-square border border-gray-100"
                                />
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Footer actions */}
                <DialogFooter className="px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100 flex-row gap-2 sm:justify-start">
                    {idea.status === "idea" && (
                        <button
                            className="flex-1 cursor-pointer bg-[#FF6D2C] hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold rounded-xl py-2 sm:py-2.5 transition-colors"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            ✨ Generate Konten
                        </button>
                    )}
                    {idea.status === "ready" && idea.regenerate_count < 3 && (
                        <button
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-semibold rounded-xl py-2 sm:py-2.5 transition-colors"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            🔄 Regenerate ({idea.regenerate_count}/3)
                        </button>
                    )}
                    {idea.status === "failed" && (
                        <button
                            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs sm:text-sm font-semibold rounded-xl py-2 sm:py-2.5 transition-colors"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            🔁 Coba Lagi
                        </button>
                    )}
                    <DialogClose asChild>
                        <button
                            className="px-3 sm:px-4 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs sm:text-sm font-semibold rounded-xl py-2 sm:py-2.5 transition-colors"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Tutup
                        </button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Empty / Loading State ─────────────────────────────────────────────────────

function EmptyState({ isLoading }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4">
            {isLoading ? (
                <>
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 mb-4 sm:mb-5">
                        <div className="absolute inset-0 rounded-full border-4 border-[#E0F8F2]" />
                        <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-gray-800 mb-1"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        AI sedang menyiapkan jadwal konten kamu
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 max-w-xs">
                        Proses ini membutuhkan 1–2 menit. Halaman akan otomatis
                        terupdate begitu jadwal siap.
                    </p>
                </>
            ) : (
                <>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">
                        📅
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-gray-800 mb-1"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Belum ada jadwal bulan ini
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 max-w-xs">
                        Jadwal konten akan muncul setelah AI selesai memproses
                        data bisnis kamu.
                    </p>
                </>
            )}
        </div>
    );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard({
    businessName,
    currentMonth,
    timezone,
    contentIdeas = [],
    hasSchedule,
}) {
    const [isPolling, setIsPolling] = useState(!hasSchedule);
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const calendarRef = useRef(null);

    useEffect(() => {
        if (hasSchedule) { setIsPolling(false); return; }
        const interval = setInterval(() => {
            router.reload({ only: ["contentIdeas", "hasSchedule"] });
        }, 10000);
        return () => clearInterval(interval);
    }, [hasSchedule]);

    const calendarEvents = contentIdeas.flatMap((idea) => {
        const firstSchedule = idea.post_schedules?.[0];
        if (!firstSchedule?.scheduled_at) return [];
        const colors = getEventColor(idea.status);
        return [{
            id: idea.id,
            title: idea.content_theme,
            date: firstSchedule.scheduled_at.split("T")[0],
            backgroundColor: colors.background,
            borderColor: colors.border,
            textColor: colors.text,
            extendedProps: { idea },
        }];
    });

    const totalIdeas = contentIdeas.length;
    const readyCount = contentIdeas.filter((i) => i.status === "ready").length;
    const pendingCount = contentIdeas.filter((i) => i.status === "idea").length;
    const failedCount = contentIdeas.filter((i) => i.status === "failed").length;

    const handlePrev = useCallback(() => calendarRef.current?.getApi().prev(), []);
    const handleNext = useCallback(() => calendarRef.current?.getApi().next(), []);
    const handleToday = useCallback(() => calendarRef.current?.getApi().today(), []);

    return (
        <AuthenticatedLayout header="Dashboard">
            <style>{calendarStyles}</style>

            {/* Page header */}
            <div className="mb-4 sm:mb-6">
                <h1
                    className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    Jadwal Konten
                </h1>
            </div>

            {/* Stats strip — 2×2 on mobile, 4×1 on sm+ */}
            {hasSchedule && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {[
                        { label: "Total Ide", value: totalIdeas, icon: AiIdeaIcon },
                        { label: "Siap Posting", value: readyCount, icon: ImageAdd02Icon },
                        { label: "Menunggu", value: pendingCount, icon: Clock02Icon },
                        { label: "Gagal", value: failedCount, icon: AlertCircleIcon },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 flex items-center justify-between"
                        >
                            <div className="flex gap-1.5 sm:gap-2 items-center">
                                <HugeiconsIcon
                                    icon={stat.icon}
                                    size={16}
                                    color='#f97316'
                                    className="flex-shrink-0"
                                />
                                <p className="text-xs sm:text-sm text-gray-800 font-medium leading-tight">
                                    {stat.label}
                                </p>
                            </div>
                            <p
                                className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-500 ml-2"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Legend + nav */}
            {hasSchedule && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    {/* Legend — scrollable row on mobile */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                            <div key={key} className="flex items-center gap-1">
                                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.dot }} />
                                <span className="text-[10px] sm:text-xs text-gray-500 font-medium">{cfg.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Nav — pushed right */}
                    <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
                        <button
                            onClick={handlePrev}
                            aria-label="Bulan sebelumnya"
                            className="w-7 h-7 cursor-pointer sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors shadow-sm"
                        >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={handleToday}
                            className="px-2 sm:px-3 h-7 sm:h-8 rounded-lg sm:rounded-xl bg-white border border-gray-200 text-[10px] sm:text-xs font-semibold text-gray-600 hover:border-orange-300 hover:text-orange-500 transition-colors shadow-sm"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Bulan
                        </button>
                        <button
                            onClick={handleNext}
                            aria-label="Bulan berikutnya"
                            className="w-7 h-7 cursor-pointer sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors shadow-sm"
                        >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Empty / Loading */}
            {!hasSchedule && <EmptyState isLoading={isPolling} />}

            {/* FullCalendar */}
            {hasSchedule && (
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-2 sm:p-4 lg:p-6">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locale={idLocale}
                        headerToolbar={false}
                        initialDate={`${currentMonth}-01`}
                        events={calendarEvents}
                        dayMaxEvents={2}
                        eventContent={(eventInfo) => <CalendarEventContent eventInfo={eventInfo} />}
                        eventClick={(info) => {
                            setSelectedIdea(info.event.extendedProps.idea);
                            setDialogOpen(true);
                        }}
                        height="auto"
                        fixedWeekCount={false}
                        showNonCurrentDates={true}
                        firstDay={0}
                    />
                </div>
            )}

            {/* Detail Dialog */}
            <DetailDialog
                idea={selectedIdea}
                open={dialogOpen}
                onOpenChange={(v) => {
                    setDialogOpen(v);
                    if (!v) setSelectedIdea(null);
                }}
            />
        </AuthenticatedLayout>
    );
}