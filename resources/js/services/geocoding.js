const BASE_URL = import.meta.env.VITE_NOMINATIM_BASE_URL;

const HEADERS = {
    'Accept-Language': 'id',
    'User-Agent': 'GanaAI',
};

// ─── In-memory cache ──────────────────────────────────────────────────────────
// Hindari request duplikat untuk query / koordinat yang sama.
// Cache di-reset otomatis saat halaman di-refresh (tidak persisten).
const cache = new Map();

/**
 * Konversi koordinat → string alamat (reverse geocoding).
 * Koordinat dibulatkan 5 desimal (~1 meter presisi) sebagai cache key.
 *
 * @param {number} lat
 * @param {number} lng
 * @param {AbortSignal} [signal] - untuk membatalkan request
 * @returns {Promise<string>} alamat lengkap
 */
export async function reverseGeocode(lat, lng, signal) {
    const key = `rev:${lat.toFixed(5)},${lng.toFixed(5)}`;

    if (cache.has(key)) return cache.get(key);

    const res = await fetch(
        `${BASE_URL}/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: HEADERS, signal }
    );

    if (!res.ok) throw new Error(`Reverse geocode gagal: HTTP ${res.status}`);

    const data = await res.json();
    const result = data.display_name ?? `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    cache.set(key, result);
    return result;
}

/**
 * Cari tempat berdasarkan teks (forward geocoding / autocomplete).
 * Dibatasi countrycodes=id agar hasil fokus di Indonesia.
 *
 * @param {string} query - teks pencarian
 * @param {AbortSignal} [signal] - untuk membatalkan request
 * @returns {Promise<Array>} array hasil dari Nominatim
 */
export async function searchPlaces(query, signal) {
    const key = `search:${query.toLowerCase().trim()}`;

    if (cache.has(key)) return cache.get(key);

    const res = await fetch(
        `${BASE_URL}/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=id`,
        { headers: HEADERS, signal }
    );

    if (!res.ok) throw new Error(`Search gagal: HTTP ${res.status}`);

    const data = await res.json();
    cache.set(key, data);
    return data;
}