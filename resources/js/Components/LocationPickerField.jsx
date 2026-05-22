import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
} from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Location01Icon,
    MapsLocation01Icon,
    Target01Icon,
    Search01Icon,
    Cancel01Icon,
    Loading02Icon,
} from '@hugeicons/core-free-icons';

import { reverseGeocode, searchPlaces } from '@/services/geocoding';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: '/images/marker-icon.webp',
    iconRetinaUrl: '/images/marker-icon-2x.webp',
    shadowUrl: '/images/marker-shadow.webp',
});

const BRAND_ICON = new L.DivIcon({
    className: '',
    html: `<div style="
        width:28px;height:28px;
        background:#FF6D2C;
        border:3px solid #fff;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 2px 10px rgba(255,109,44,0.5);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
});

// Default center: Jakarta
const DEFAULT_CENTER = [-6.1756183, 106.8256155];

// Pesan error GPS yang user-friendly
const GPS_ERRORS = {
    1: 'Izin lokasi ditolak. Aktifkan izin lokasi di pengaturan browser Anda.',
    2: 'Posisi tidak dapat ditentukan saat ini. Coba lagi sebentar.',
    3: 'Waktu deteksi lokasi habis. Pastikan GPS aktif lalu coba lagi.',
};

// ─── Sub-komponen: sinkronkan view peta ──────────────────────────────────────
function MapFlyTo({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 17, { duration: 1.2, easeLinearity: 0.25 });
        }
    }, [position]); // eslint-disable-line react-hooks/exhaustive-deps
    return null;
}

// ─── Sub-komponen: tangkap klik di peta ──────────────────────────────────────
function MapClickHandler({ onSelect }) {
    useMapEvents({
        click(e) { onSelect(e.latlng.lat, e.latlng.lng); },
    });
    return null;
}

function MapResizeHandler() {
    const map = useMap();

    useEffect(() => {
        // Paksa Leaflet hitung ulang ukuran kontainer
        // setelah animasi framer-motion selesai (~350ms)
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 350);

        return () => clearTimeout(timer);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return null;
}

// ─── Style konstanta ──────────────────────────────────────────────────────────
const inputBase = [
    'w-full py-3 px-4 pl-9 text-[14px]',
    'bg-neutral-50 border border-neutral-200 rounded-xl',
    'focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400',
    'placeholder:text-neutral-400 transition-all duration-200 font-dm',
].join(' ');

const btnBase = [
    'shrink-0 cursor-pointer flex items-center justify-center gap-1.5',
    'px-3 py-3 rounded-xl border text-[13px] font-semibold',
    'transition-all duration-200 shadow-sm',
].join(' ');

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function LocationPickerField({ value = '', onChange, error }) {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState([]);
    const [position, setPosition] = useState(null);   // [lat, lng] | null
    const [mapOpen, setMapOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [gpsError, setGpsError] = useState(null);
    const [dropOpen, setDropOpen] = useState(false);

    const debounceRef = useRef(null);
    const abortRef = useRef(null);  // AbortController untuk cancel fetch
    const wrapperRef = useRef(null);

    // ── Cleanup saat unmount ──────────────────────────────────────────────
    useEffect(() => {
        return () => {
            clearTimeout(debounceRef.current);
            abortRef.current?.abort();
        };
    }, []);

    // ── Tutup dropdown saat klik di luar komponen ─────────────────────────
    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setSuggestions([]);
                setDropOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── Autocomplete dengan debounce + AbortController ────────────────────
    const handleQueryChange = useCallback((e) => {
        const val = e.target.value;
        setQuery(val);
        onChange(val);
        setGpsError(null);

        // Batalkan debounce & request sebelumnya
        clearTimeout(debounceRef.current);
        abortRef.current?.abort();

        if (val.length < 3) {
            setSuggestions([]);
            setDropOpen(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            abortRef.current = new AbortController();
            try {
                const data = await searchPlaces(val, abortRef.current.signal);
                setSuggestions(data);
                setDropOpen(data.length > 0);
            } catch (err) {
                // AbortError normal terjadi saat user masih mengetik — abaikan
                if (err.name !== 'AbortError') {
                    console.warn('[LocationPickerField] searchPlaces error:', err);
                }
            }
        }, 420);
    }, [onChange]);

    // ── Pilih saran dari dropdown ─────────────────────────────────────────
    const selectSuggestion = useCallback((item) => {
        const addr = item.display_name;
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);

        setQuery(addr);
        setPosition([lat, lng]);
        setSuggestions([]);
        setDropOpen(false);
        setMapOpen(true);
        onChange(addr);
    }, [onChange]);

    // ── Klik di peta → reverse geocode ───────────────────────────────────
    const handleMapClick = useCallback(async (lat, lng) => {
        // Batalkan reverse geocode sebelumnya jika masih berjalan
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        setLoading(true);
        setPosition([lat, lng]);

        try {
            const addr = await reverseGeocode(lat, lng, abortRef.current.signal);
            setQuery(addr);
            onChange(addr);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.warn('[LocationPickerField] reverseGeocode error:', err);
            }
        } finally {
            setLoading(false);
        }
    }, [onChange]);

    // ── Deteksi lokasi via GPS ────────────────────────────────────────────
    const detectGPS = useCallback(() => {
        if (!navigator.geolocation) {
            setGpsError('Browser ini tidak mendukung Geolocation.');
            return;
        }

        setLoading(true);
        setGpsError(null);
        setMapOpen(true);

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                const { latitude: lat, longitude: lng } = coords;
                setPosition([lat, lng]);

                abortRef.current?.abort();
                abortRef.current = new AbortController();

                try {
                    const addr = await reverseGeocode(lat, lng, abortRef.current.signal);
                    setQuery(addr);
                    onChange(addr);
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.warn('[LocationPickerField] GPS reverseGeocode error:', err);
                    }
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setLoading(false);
                setGpsError(GPS_ERRORS[err.code] ?? 'Gagal mendapatkan lokasi GPS.');
            },
            {
                enableHighAccuracy: true,  // pakai GPS hardware, bukan WiFi/IP
                timeout: 10_000,
                maximumAge: 0,     // selalu ambil posisi terbaru
            }
        );
    }, [onChange]);

    // ── Reset semua state ─────────────────────────────────────────────────
    const handleClear = useCallback(() => {
        clearTimeout(debounceRef.current);
        abortRef.current?.abort();

        setQuery('');
        setPosition(null);
        setSuggestions([]);
        setDropOpen(false);
        setGpsError(null);
        setMapOpen(false);
        onChange('');
    }, [onChange]);

    // ── Derived values ────────────────────────────────────────────────────
    const mapCenter = useMemo(() => position ?? DEFAULT_CENTER, [position]);
    const mapZoom = position ? 17 : 13;
    const hasConfirmed = Boolean(query && position);

    // ─────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────
    return (
        <div ref={wrapperRef} className="space-y-2">

            {/* ── Baris input + tombol ── */}
            <div className="flex gap-2">

                {/* Search input */}
                <div className="relative flex-1">
                    {/* Icon lokasi kiri */}
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <HugeiconsIcon icon={Location01Icon} size={15} className="text-neutral-400" />
                    </div>

                    <input
                        type="text"
                        value={query}
                        onChange={handleQueryChange}
                        onFocus={() => suggestions.length > 0 && setDropOpen(true)}
                        placeholder="Ketik nama jalan, kelurahan, atau kota..."
                        aria-label="Cari lokasi bisnis"
                        className={[
                            inputBase,
                            'pr-9',
                            error
                                ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                                : '',
                        ].join(' ')}
                    />

                    {/* Loading spinner / tombol clear */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                        {loading ? (
                            <HugeiconsIcon
                                icon={Loading02Icon}
                                size={15}
                                className="text-orange-400 animate-spin"
                                aria-label="Memuat..."
                            />
                        ) : query ? (
                            <button
                                type="button"
                                onClick={handleClear}
                                aria-label="Hapus lokasi"
                                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                                <HugeiconsIcon icon={Cancel01Icon} size={15} />
                            </button>
                        ) : null}
                    </div>

                    {/* Autocomplete dropdown */}
                    <AnimatePresence>
                        {dropOpen && suggestions.length > 0 && (
                            <motion.ul
                                role="listbox"
                                aria-label="Saran lokasi"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.16 }}
                                className="absolute z-50 w-full mt-1.5 bg-white border border-neutral-100 rounded-xl shadow-xl max-h-56 overflow-auto divide-y divide-neutral-50"
                            >
                                {suggestions.map((item) => (
                                    <li key={item.place_id} role="option">
                                        <button
                                            type="button"
                                            onClick={() => selectSuggestion(item)}
                                            className="w-full flex items-start gap-2.5 px-3.5 py-2.5 text-left hover:bg-orange-50 transition-colors group"
                                        >
                                            <HugeiconsIcon
                                                icon={Search01Icon}
                                                size={13}
                                                className="text-neutral-300 group-hover:text-orange-400 mt-0.5 shrink-0 transition-colors"
                                            />
                                            <span className="text-[13px] text-neutral-700 leading-snug line-clamp-2">
                                                {item.display_name}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>

                {/* Tombol GPS */}
                <button
                    type="button"
                    onClick={detectGPS}
                    disabled={loading}
                    title="Gunakan lokasi saya sekarang"
                    aria-label="Gunakan lokasi GPS"
                    className={[
                        btnBase,
                        'border-orange-200 bg-orange-50 text-orange-500',
                        'hover:bg-orange-100 hover:border-orange-300',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                    ].join(' ')}
                >
                    <HugeiconsIcon icon={Target01Icon} size={16} />
                    <span className="hidden sm:inline">Lokasi Saya</span>
                </button>

                {/* Toggle peta */}
                <button
                    type="button"
                    onClick={() => setMapOpen((s) => !s)}
                    title={mapOpen ? 'Sembunyikan peta' : 'Buka peta interaktif'}
                    aria-expanded={mapOpen}
                    aria-label="Toggle peta"
                    className={[
                        btnBase,
                        mapOpen
                            ? 'bg-neutral-800 border-neutral-800 text-white'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:bg-neutral-100',
                    ].join(' ')}
                >
                    <HugeiconsIcon icon={MapsLocation01Icon} size={16} />
                    <span className="hidden sm:inline">
                        {mapOpen ? 'Tutup Peta' : 'Buka Peta'}
                    </span>
                </button>
            </div>

            {/* ── Error GPS ── */}
            <AnimatePresence>
                {gpsError && (
                    <motion.p
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-1.5 text-xs text-red-500 font-dm"
                    >
                        <span aria-hidden="true">⚠</span> {gpsError}
                    </motion.p>
                )}
            </AnimatePresence>

            {/* ── Error validasi dari Laravel ── */}
            {error && (
                <p role="alert" className="flex items-center gap-1.5 text-xs text-red-500 font-dm">
                    <span aria-hidden="true">⚠</span> {error}
                </p>
            )}

            {/* ── Peta interaktif (lazy: hanya render saat mapOpen) ── */}
            <AnimatePresence>
                {mapOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 280 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        onAnimationComplete={() => {
                            window.dispatchEvent(new Event('resize'));
                        }}
                        className="overflow-hidden rounded-2xl border border-neutral-200 shadow-sm relative"
                    >
                        {/* Badge instruksi — pointer-events-none agar tidak block klik peta */}
                        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm border border-neutral-200/80 rounded-full text-[11px] font-semibold text-neutral-500 shadow-sm tracking-wide">
                                <HugeiconsIcon icon={Location01Icon} size={11} className="text-orange-400" />
                                Klik peta untuk memilih lokasi
                            </span>
                        </div>

                        <MapContainer
                            center={mapCenter}
                            zoom={mapZoom}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom
                        // key tidak perlu diubah — MapFlyTo menangani pergerakan
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                            />
                            <MapResizeHandler />
                            <MapFlyTo position={position} />
                            <MapClickHandler onSelect={handleMapClick} />
                            {position && <Marker position={position} icon={BRAND_ICON} />}
                        </MapContainer>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}