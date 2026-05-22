

/**
 * Mengubah angka integer → tampilan Rupiah lengkap
 *
 * @param {number|string|null} value - Angka mentah (misal: 100000)
 * @param {Object} options
 * @param {boolean} options.showSymbol  - Tampilkan "Rp" di depan (default: true)
 * @param {boolean} options.showDecimal - Tampilkan desimal (default: false)
 * @returns {string} "Rp 100.000" | "100.000" | "Rp 100.000,50"
 *
 * @example
 * formatRupiah(100000)              → "Rp 100.000"
 * formatRupiah(100000, { showSymbol: false }) → "100.000"
 * formatRupiah(null)                → "—"
 * formatRupiah(0)                   → "Rp 0"
 */
export function formatRupiah(value, options = {}) {
    const { showSymbol = true, showDecimal = false } = options;

    if (value === null || value === undefined || value === '') return '—';

    const num = typeof value === 'string' ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : Number(value);

    if (isNaN(num)) return '—';

    const formatted = new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: showDecimal ? 2 : 0,
        maximumFractionDigits: showDecimal ? 2 : 0,
    }).format(num);

    return showSymbol ? `Rp ${formatted}` : formatted;
}

/**
 * Mengubah angka integer → tampilan Rupiah singkat (dipakai di badge/chip kecil)
 *
 * @param {number|string|null} value
 * @returns {string} "100 rb" | "1,5 jt" | "2 M"
 *
 * @example
 * formatRupiahCompact(100000)   → "Rp 100 rb"
 * formatRupiahCompact(1500000)  → "Rp 1,5 jt"
 * formatRupiahCompact(2000000000) → "Rp 2 M"
 */
export function formatRupiahCompact(value) {
    if (value === null || value === undefined || value === '') return '—';

    const num = Number(value);
    if (isNaN(num)) return '—';

    if (num >= 1_000_000_000) {
        const val = num / 1_000_000_000;
        return `Rp ${val % 1 === 0 ? val : val.toFixed(1)} M`;
    }
    if (num >= 1_000_000) {
        const val = num / 1_000_000;
        return `Rp ${val % 1 === 0 ? val : val.toFixed(1)} jt`;
    }
    if (num >= 1_000) {
        const val = num / 1_000;
        return `Rp ${val % 1 === 0 ? val : val.toFixed(1)} rb`;
    }
    return `Rp ${num}`;
}

/**
 * Mengubah string input user (terformat) → integer bersih
 * Dipakai secara internal oleh RupiahInput, jarang dipakai langsung.
 *
 * @param {string} value - String seperti "Rp 100.000" atau "100.000" atau "100000"
 * @returns {number} Integer bersih: 100000
 *
 * @example
 * parseRupiah("Rp 100.000")  → 100000
 * parseRupiah("100.000")     → 100000
 * parseRupiah("100000")      → 100000
 * parseRupiah("")            → 0
 */
export function parseRupiah(value) {
    if (!value && value !== 0) return 0;

    // Hapus "Rp", spasi, titik (separator ribuan di id-ID)
    // Lalu ganti koma (jika ada desimal) dengan titik agar parseFloat bisa baca
    const cleaned = String(value)
        .replace(/Rp\s?/gi, '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim();

    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : Math.round(num);
}