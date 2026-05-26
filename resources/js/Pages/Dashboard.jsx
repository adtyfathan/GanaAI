import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PLATFORM_COLORS = {
    instagram: "bg-pink-100 text-pink-700 border-pink-200",
    tiktok: "bg-slate-100 text-slate-700 border-slate-200",
};

const POST_TYPE_LABELS = {
    feed: "Feed",
    reels: "Reels",
    story: "Story",
    video: "Video",
};

const STATUS_STYLES = {
    idea: "bg-gray-100 text-gray-600",
    generating: "bg-amber-100 text-amber-700",
    ready: "bg-emerald-100 text-emerald-700",
    failed: "bg-red-100 text-red-600",
};

const STATUS_LABELS = {
    idea: "Ide",
    generating: "Memproses...",
    ready: "Siap",
    failed: "Gagal",
};

function formatDate(isoString) {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatMonthYear(yyyyMM) {
    const [year, month] = yyyyMM.split("-");
    return new Date(year, month - 1).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
    });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScheduleBadge({ platform, postType }) {
    return (
        <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border tracking-wide uppercase ${PLATFORM_COLORS[platform] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
        >
            {platform === "instagram" ? "IG" : "TT"} ·{" "}
            {POST_TYPE_LABELS[postType] ?? postType}
        </span>
    );
}

function ContentCard({ idea }) {
    const [expanded, setExpanded] = useState(false);

    // Ambil scheduled_at pertama sebagai tanggal referensi kartu
    const firstSchedule = idea.post_schedules?.[0];
    const dateLabel = firstSchedule
        ? formatDate(firstSchedule.scheduled_at)
        : "-";

    return (
        <div
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
            {/* Header */}
            <div className="p-4 flex items-start gap-3">
                {/* Ikon tipe konten */}
                <div
                    className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                        idea.content_type === "holiday_greeting"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-emerald-50 text-emerald-600"
                    }`}
                >
                    {idea.content_type === "holiday_greeting" ? "🎉" : "📝"}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-widest ${STATUS_STYLES[idea.status]}`}
                        >
                            {STATUS_LABELS[idea.status]}
                        </span>
                        {idea.holiday_name && (
                            <span className="text-[11px] text-amber-600 font-medium">
                                {idea.holiday_name}
                            </span>
                        )}
                    </div>

                    <p className="text-sm font-semibold text-gray-800 leading-snug">
                        {idea.content_theme}
                    </p>

                    <p className="text-xs text-gray-400 mt-0.5">{dateLabel}</p>
                </div>

                <button
                    onClick={() => setExpanded((v) => !v)}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    aria-label="Toggle detail"
                >
                    <svg
                        className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
            </div>

            {/* Platform badges */}
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                {idea.post_schedules?.map((s) => (
                    <ScheduleBadge
                        key={s.id}
                        platform={s.platform}
                        postType={s.post_type}
                    />
                ))}
                {idea.media_preference === "video" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border bg-violet-50 text-violet-600 border-violet-100 uppercase tracking-wide">
                        🎬 Video
                    </span>
                )}
            </div>

            {/* Expanded detail */}
            {expanded && (
                <div className="border-t border-gray-50 px-4 py-3 space-y-2 bg-gray-50/50">
                    {idea.content_description && (
                        <p className="text-xs text-gray-600 leading-relaxed">
                            {idea.content_description}
                        </p>
                    )}

                    {idea.product && (
                        <p className="text-xs text-gray-500">
                            <span className="font-medium text-gray-700">Produk:</span>{" "}
                            {idea.product.name}
                        </p>
                    )}

                    {/* Semua jadwal per platform */}
                    <div className="space-y-1">
                        {idea.post_schedules?.map((s) => (
                            <div key={s.id} className="flex items-center justify-between text-xs text-gray-500">
                                <span className="capitalize">
                                    {s.platform} · {POST_TYPE_LABELS[s.post_type]}
                                </span>
                                <span>{formatDate(s.scheduled_at)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Generated content preview */}
                    {idea.generated_content?.caption && (
                        <div className="bg-white rounded-xl p-3 border border-gray-100">
                            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1">
                                Caption
                            </p>
                            <p className="text-xs text-gray-700 whitespace-pre-line line-clamp-4">
                                {idea.generated_content.caption}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function EmptyState({ isLoading }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            {isLoading ? (
                <>
                    {/* Spinner */}
                    <div className="relative w-16 h-16 mb-5">
                        <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
                        <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-base font-semibold text-gray-800 mb-1">
                        AI sedang menyiapkan jadwal konten kamu
                    </p>
                    <p className="text-sm text-gray-500 max-w-xs">
                        Proses ini membutuhkan 1–2 menit. Halaman akan otomatis
                        terupdate begitu jadwal siap.
                    </p>
                </>
            ) : (
                <>
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl mb-4">
                        📅
                    </div>
                    <p className="text-base font-semibold text-gray-800 mb-1">
                        Belum ada jadwal bulan ini
                    </p>
                    <p className="text-sm text-gray-500 max-w-xs">
                        Jadwal konten akan muncul setelah AI selesai memproses
                        data bisnis kamu.
                    </p>
                </>
            )}
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard({
    businessName,
    currentMonth,
    timezone,
    contentIdeas = [],
    hasSchedule,
}) {
    const [isPolling, setIsPolling] = useState(!hasSchedule);

    // Polling setiap 10 detik selama jadwal belum ada
    useEffect(() => {
        if (hasSchedule) {
            setIsPolling(false);
            return;
        }

        const interval = setInterval(() => {
            router.reload({ only: ["contentIdeas", "hasSchedule"] });
        }, 10000);

        return () => clearInterval(interval);
    }, [hasSchedule]);

    // Grup konten berdasarkan tanggal
    const groupedByDate = contentIdeas.reduce((acc, idea) => {
        const firstSchedule = idea.post_schedules?.[0];
        if (!firstSchedule) return acc;

        const dateKey = firstSchedule.scheduled_at?.split("T")[0] ?? "unknown";
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(idea);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedByDate).sort();

    const totalIdeas = contentIdeas.length;
    const readyCount = contentIdeas.filter((i) => i.status === "ready").length;
    const pendingCount = contentIdeas.filter((i) => i.status === "idea").length;

    return (
        <AuthenticatedLayout header="Dashboard">
            {/* Page header */}
            <div className="mb-6">
                <h1
                    className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    Jadwal Konten
                </h1>
                <p className="text-sm text-gray-500">
                    {formatMonthYear(currentMonth)} · {timezone}
                </p>
            </div>

            {/* Stats strip — hanya tampil kalau ada jadwal */}
            {hasSchedule && (
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                        {
                            label: "Total Ide",
                            value: totalIdeas,
                            color: "text-gray-900",
                        },
                        {
                            label: "Siap Posting",
                            value: readyCount,
                            color: "text-emerald-600",
                        },
                        {
                            label: "Menunggu",
                            value: pendingCount,
                            color: "text-amber-600",
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center"
                        >
                            <p
                                className={`text-2xl font-bold ${stat.color}`}
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                {stat.value}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 font-medium">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty / Loading state */}
            {!hasSchedule && <EmptyState isLoading={isPolling} />}

            {/* Jadwal per tanggal */}
            {hasSchedule && sortedDates.length > 0 && (
                <div className="space-y-8">
                    {sortedDates.map((dateKey) => {
                        const ideas = groupedByDate[dateKey];
                        const dateObj = new Date(dateKey + "T00:00:00");
                        const dayLabel = dateObj.toLocaleDateString(
                            "id-ID",
                            {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                            }
                        );

                        return (
                            <section key={dateKey}>
                                {/* Tanggal header */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#E0F8F2] flex items-center justify-center flex-shrink-0">
                                        <span
                                            className="text-sm font-bold text-emerald-700"
                                            style={{
                                                fontFamily:
                                                    "'JetBrains Mono', monospace",
                                            }}
                                        >
                                            {dateObj.getDate()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {dayLabel}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {ideas.length} konten
                                        </p>
                                    </div>
                                </div>

                                {/* Cards */}
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {ideas.map((idea) => (
                                        <ContentCard
                                            key={idea.id}
                                            idea={idea}
                                        />
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}
        </AuthenticatedLayout>
    );
}