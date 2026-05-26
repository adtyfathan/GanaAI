# AI Social Media Automation untuk UMKM — Dokumentasi Proyek

---

## Bagian 1 — Rangkuman Lengkap Proyek

---

### Konsep Platform
Website AI-based untuk otomasi pembuatan, penjadwalan, dan pengunggahan konten di sosial media (Instagram dan TikTok) yang berfokus pada UMKM lokal Indonesia.

---

### Fitur Utama
1. Scheduling dan ide konten otomatis sesuai identitas bisnis dan tren social media (30 hari ke depan) — Gemini sekaligus menentukan waktu posting dan tipe post yang disarankan per platform untuk setiap ide konten
2. Pembuatan konten foto dan video berbasis AI — user upload produk di awal sebagai referensi visual untuk Imagen 4
3. Konten hari besar otomatis — Gemini mendeteksi hari besar dan menyisipkan konten greeting ke jadwal secara otomatis bersamaan saat generate jadwal bulanan, tanpa tabel holidays di database
4. Upload konten otomatis ke semua sosmed yang terconnect via Zernio, dengan jadwal posting yang berbeda per platform
5. Dashboard analytics performa per sosmed

---

### Alur User
1. Buat akun → isi nama pengguna, email, password
2. Setup profil bisnis → isi data bisnis lengkap
3. Upload data produk
4. Connect akun sosmed via Zernio OAuth
5. Gemini generate jadwal + ide konten 30 hari sekaligus:
   - Menggunakan Google Search Grounding untuk mendeteksi tren konten terkini dan hari besar akurat
   - Mendeteksi hari besar di periode tersebut → sisipkan sebagai konten greeting
   - Menentukan waktu posting dan `post_type` yang disarankan per platform untuk setiap ide konten
   - Output: `content_ideas` + `post_schedules` per platform langsung terisi
6. User kelola jadwal di dashboard:
   - Lihat jadwal 30 hari
   - Generate konten sekarang (tekan tombol generate di salah satu ide konten)
   - Regenerate konten yang sudah ada (max 3x, via Delete & Recreate di Zernio)
   - Hapus/skip ide posting di tanggal tertentu (permanen, tidak digenerate ulang otomatis)
7. Pada hari H → Laravel Scheduler trigger generate konten:
   - Gemini generate caption
   - Imagen 4 generate gambar → disimpan lokal di VPS
   - JSON2Video generate video dari gambar (untuk post_type `reels`, `video` TikTok, dan `story` video)
   - File diupload ke Zernio via presigned URL → simpan `media_url` dan `media_video_url`
   - Kirim ke Zernio createPost per platform sesuai `scheduled_at` dan `post_type` masing-masing
   - File lokal dipertahankan di VPS sebagai backup dan untuk efisiensi regenerate

---

### Tech Stack

| Layer | Teknologi |
|---|---|
| Backend Framework | Laravel 13 |
| Frontend | React JS via Inertia.js |
| Styling | Tailwind CSS |
| Database | MySQL |
| Auth | Laravel Breeze |
| Queue & Background Jobs | Laravel Queue + Supervisor |
| Scheduler | Laravel Scheduler (cron setiap menit) |
| Hosting | VPS |

---

### API Stack

| Fungsi | API | Catatan |
|---|---|---|
| Generate ide, jadwal per platform, caption, deteksi hari besar | Gemini 2.5 Flash + Google Search Grounding | Free tier |
| Generate gambar konten | Imagen 4 Fast | 25 RPD |
| Generate video konten | JSON2Video | Free tier: 600 detik rendering, 1 detik video = 1 credit |
| Posting otomatis + source analytics | Zernio | Free tier: 2 Social Sets, 20 posts/bulan |

> Semua API menggunakan free tier.
> RPM = Request per Minute | TPM = Token per Minute | RPD = Request per Day

---

### Keputusan Teknis Penting

**Integrasi Gemini menggunakan HTTP Client Laravel langsung (bukan package laravel/ai).**
- `laravel/ai` tidak support Google Search Grounding karena abstraksinya provider-agnostic
- `laravel/ai` belum support Imagen 4 via Gemini provider
- HTTP Client Laravel memberikan kontrol penuh atas payload, timeout, dan parameter spesifik Gemini
- Semua call ke Gemini dipusatkan di `app/Services/GeminiService.php`

**Endpoint Gemini API yang digunakan:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}
```
Header: `Content-Type: application/json` — API key dikirim via query param, bukan Bearer token.

**Google Search Grounding wajib diaktifkan untuk generate jadwal**, namun tidak bisa dikombinasikan dengan `responseMimeType: application/json`. Solusinya: instruksikan output JSON murni via system prompt, lalu lakukan defensive parsing di backend untuk membersihkan markdown code block yang mungkin membungkus JSON output Gemini.

**Parsing output Gemini:**
- Output Gemini kadang dibungkus markdown: ` ```json ... ``` `
- Backend wajib strip markdown sebelum `json_decode()`
- Jika `json_last_error() !== JSON_ERROR_NONE` → tandai job sebagai failed dan log error-nya

**Field `month` dari output Gemini tidak dipercaya.** Nilai `generation_month` di `content_ideas` dihitung di backend dari tanggal generate, bukan dari field `month` output Gemini, karena Gemini kadang mengisi `month` dengan bulan awal periode bukan bulan dominan konten.

**Periode generate jadwal dinyatakan eksplisit di prompt** (bukan "1 bulan ke depan") untuk menghindari ambiguitas, misalnya: *"Buatlah konten untuk periode 26 Mei 2026 hingga 25 Juni 2026"*.

**Post type per platform:**
- Instagram memiliki 3 tipe: `feed` (foto/carousel statis), `reels` (video pendek), `story` (konten sementara 24 jam)
- TikTok hanya memiliki 1 tipe: `video`
- Satu `content_idea` bisa memiliki beberapa `post_schedules` dengan platform dan `post_type` berbeda (misalnya ide yang sama diposting sebagai `reels` di Instagram DAN `video` di TikTok)
- Distribusi post_type untuk Instagram: ~40% feed, ~40% reels, ~20% story

**Aturan `media_preference` berdasarkan `post_type` dominan:**
- `post_type: feed` → `media_preference: image`
- `post_type: reels` → `media_preference: video`
- `post_type: story` → `media_preference: image`
- `post_type: video` (TikTok) → `media_preference: video`
- Jika satu `content_idea` punya campuran (misal reels + story) → gunakan `media_preference: video` (dominan)

**Zernio sebagai jembatan sosmed:**
- Sudah menjadi Meta, TikTok Official Partner — tidak perlu Meta App Review sendiri
- Support 15+ platform, handle semua OAuth dan approval platform
- Free tier: 2 Social Sets, 20 posts/bulan (cukup untuk development & testing)
- 1 user UMKM = 1 Zernio Social Set (ID disimpan di `business_profiles.zernio_social_set_id`)
- Setiap akun sosmed per platform menghasilkan `zernio_account_id` tersendiri (disimpan di `social_accounts`)

**Zernio tidak punya endpoint update post.** Solusi: strategi **Delete & Recreate** — saat user regenerate konten, platform DELETE `zernio_post_id` lama lalu CREATE post baru dengan jadwal yang sama. `zernio_post_id` baru disimpan kembali di `post_schedules`.

**Post yang sudah `published`** tidak bisa diedit atau dihapus dari sosmed via Zernio. Fitur regenerate dan hapus hanya berlaku untuk post berstatus `pending` atau `scheduled`.

**Jadwal per platform dibuat saat Gemini generate**, bukan saat hari H. `post_schedules` langsung terisi bersamaan dengan `content_ideas` saat Gemini selesai output. `generated_content_id` di `post_schedules` masih NULL saat ini, baru diisi saat hari H ketika konten selesai digenerate.

**Konten digenerate di hari H** oleh Laravel Scheduler — bukan saat Gemini generate jadwal — karena generate gambar/video 30 hari di muka tidak efisien dari sisi biaya API dan storage.

**Media disimpan dua tempat:**
- Lokal di VPS (`media_path`, `media_video_path`) — sebagai backup dan efisiensi regenerate tanpa perlu panggil Imagen 4 lagi
- Zernio storage via presigned URL (`media_url`, `media_video_url`) — URL ini yang dipakai di payload `createPost` Zernio

**Logika generate media di hari H berdasarkan `post_type`:**
- `post_type: feed` → Imagen 4 generate gambar → upload ke Zernio
- `post_type: story` → Imagen 4 generate gambar → upload ke Zernio
- `post_type: reels` → Imagen 4 generate gambar → JSON2Video convert ke video → upload ke Zernio
- `post_type: video` (TikTok) → Imagen 4 generate gambar → JSON2Video convert ke video → upload ke Zernio
- Satu `content_idea` dengan campuran `reels` (IG) + `video` (TikTok) → generate media sekali, dipakai kedua platform

**Hari besar tidak disimpan di database.** Gemini mendeteksi hari besar secara otomatis via Google Search Grounding dalam satu prompt yang sama saat generate jadwal bulanan. Hasilnya disimpan di field `holiday_name` pada `content_ideas`. Tidak ada tabel `holidays`.

**Distribusi konten regular:** 80% konten edukasi, hiburan, dan interaksi — 20% konten promosi langsung. Untuk konten promosi, produk dipilih bergantian dan merata berdasarkan `product_index` dari array produk yang dikirim ke Gemini.

**Jenis bisnis dan jenis produk** menggunakan dropdown (bukan free text) agar Gemini mendapat konteks yang konsisten dan terstruktur saat generate konten.

**Timezone** disimpan di `business_profiles.timezone` menggunakan format IANA (misal `Asia/Jakarta`) — dipakai sebagai parameter `timezone` saat kirim createPost ke Zernio agar waktu posting tidak salah.

**Soft delete** diterapkan di tabel `products` via field `deleted_at` — produk yang dihapus user tidak benar-benar dihapus dari database agar relasi ke `content_ideas.product_id` tetap aman (onDelete set null).

**Laravel Queue + Supervisor** wajib dijalankan di VPS untuk menangani proses async: generate konten AI, upload ke Zernio presigned URL, kirim createPost, dan sync analytics. Shared hosting tidak mendukung ini.

---

### Struktur Service Layer

```
app/Services/
├── GeminiService.php              — wrapper HTTP Client, semua call ke Gemini API
│     ├── generateSchedule()       — generate jadwal 30 hari + Search Grounding
│     └── generateCaption()        — generate caption di hari H (tanpa Search Grounding)
├── ImagenService.php              — generate gambar via Imagen 4
├── Json2VideoService.php          — convert gambar ke video via JSON2Video
└── ScheduleGeneratorService.php   — orkestrasi: ambil data → build prompt → parse → simpan DB
```

---

### Data yang Dikumpulkan dari User

**Signup**
- Nama pengguna
- Email
- Password

**Profil Bisnis**
- Logo bisnis
- Nama bisnis
- Jenis bisnis *(dropdown)*
- Deskripsi bisnis
- Visi dan Misi
- Keunikan bisnis
- Sasaran audiens
- Nuansa konten *(dropdown)*
- Lokasi bisnis
- Timezone *(otomatis dari lokasi bisnis, format IANA)*
- Warna brand *(pilihan tone warna yang disediakan platform, user pilih salah satu — untuk konsistensi visual Imagen 4 dan JSON2Video)*

**Produk**
- Nama produk
- Jenis produk *(dropdown)*
- Deskripsi produk
- Harga produk
- Gambar produk *(multiple, min 1 max 5 — referensi visual untuk Imagen 4)*

---

### Kemampuan User di Dashboard Jadwal

| Aksi | Keterangan |
|---|---|
| Lihat jadwal 30 hari | Default view — menampilkan semua `content_ideas` bulan ini |
| Generate konten sekarang | Tekan tombol generate di salah satu ide konten — trigger generate caption + media langsung |
| Regenerate konten | Max 3x per ide konten — Delete & Recreate di Zernio, file lokal lama diganti |
| Hapus ide posting | Hapus permanen dari `content_ideas` + delete dari Zernio jika `post_schedules` sudah `scheduled` |

---

### Struktur Relasi Database (Ringkasan)

```
users
├── business_profiles (1-to-1) — menyimpan zernio_social_set_id & timezone
├── products (1-to-many, soft delete)
│   └── product_images (1-to-many)
├── social_accounts (1-to-many) — menyimpan zernio_account_id per platform
└── content_ideas (1-to-many) — ide konten dari Gemini
    │       ↓ (1-to-1, dibuat saat hari H)
    │   generated_contents — caption + media_path + media_url + video variants
    │
    └── post_schedules (1-to-many, dibuat saat Gemini generate)
            ├── post_type → feed | reels | story | video
            ├── generated_content_id nullable → diisi saat hari H
            ├── zernio_post_id → untuk Delete & Recreate
            └── post_analytics (1-to-1) — data performa dari Zernio
```

---

## Bagian 2 — Rancangan Struktur Database Final

---

### 1. `users`

| Field | Tipe | Keterangan |
|---|---|---|
| id | ULID PK | |
| name | varchar(100) | Nama pengguna |
| email | varchar(150) unique | |
| password | varchar(255) | bcrypt |
| email_verified_at | timestamp | nullable |
| remember_token | varchar(100) | nullable |
| timestamps | | created_at, updated_at |

---

### 2. `business_profiles`

| Field | Tipe | Keterangan |
|---|---|---|
| id | ULID PK | |
| user_id | ULID FK → users | one-to-one |
| zernio_social_set_id | varchar(100) | nullable — ID Social Set dari Zernio |
| logo_path | varchar(255) | nullable |
| business_name | varchar(150) | |
| business_type | varchar(100) | nilai dari dropdown |
| description | text | |
| vision_mission | text | nullable |
| uniqueness | text | nullable |
| target_audience | varchar(255) | |
| content_tone | varchar(100) | nilai dari dropdown |
| location | varchar(255) | |
| timezone | varchar(100) | format IANA, misal `Asia/Jakarta` — dipakai saat kirim ke Zernio |
| timestamps | | |

---

### 3. `products`

| Field | Tipe | Keterangan |
|---|---|---|
| id | ULID PK | |
| user_id | ULID FK → users | |
| name | varchar(150) | |
| product_type | varchar(100) | nilai dari dropdown |
| description | text | |
| price | decimal(15,2) | |
| deleted_at | timestamp | nullable — soft delete Laravel |
| timestamps | | |

---

### 4. `product_images`

| Field | Tipe | Keterangan |
|---|---|---|
| id | ULID PK | |
| product_id | ULID FK → products | |
| image_path | varchar(255) | |
| sort_order | tinyint | urutan tampil, 1–5 |
| timestamps | | |

---

### 5. `social_accounts`

Menyimpan akun sosmed yang sudah di-connect via Zernio OAuth.

| Field | Tipe | Keterangan |
|---|---|---|
| id | ULID PK | |
| user_id | ULID FK → users | |
| platform | varchar(50) | `instagram`, `tiktok` |
| zernio_account_id | varchar(100) | account ID dari Zernio |
| account_username | varchar(100) | nullable, untuk display |
| is_active | boolean | default true |
| connected_at | timestamp | |
| timestamps | | |

---

### 6. `content_ideas`

Ide konten 30 hari dari Gemini. Satu baris = satu ide posting. Murni urusan AI, tidak menyimpan data jadwal atau Zernio.

| Field | Tipe | Keterangan |
|---|---|---|
| id | ULID PK | |
| user_id | ULID FK → users | |
| product_id | ULID FK → products | nullable — kosong jika holiday_greeting atau konten non-promosi, onDelete set null |
| content_theme | varchar(255) | judul/tema ide konten dari Gemini (mapping dari `content_title` output Gemini) |
| content_description | text | nullable — deskripsi singkat konten dari Gemini |
| content_type | enum | `regular`, `holiday_greeting` |
| holiday_name | varchar(150) | nullable — diisi jika content_type = holiday_greeting |
| generation_month | char(7) | format `YYYY-MM` — dihitung di backend dari tanggal generate, bukan dari field `month` output Gemini |
| media_preference | enum | `image`, `video` — ditentukan Gemini berdasarkan post_type dominan |
| status | enum | `idea`, `generating`, `ready`, `failed` |
| regenerate_count | tinyint | default 0, max 3 |
| last_regenerated_at | timestamp | nullable |
| timestamps | | |

> **Status flow:** `idea` → (trigger generate) → `generating` → `ready` / `failed`

> **Catatan `media_preference`:** Nilai ini mengikuti `post_type` dominan dari `post_schedules` terkait. Jika ada `reels` atau TikTok `video` → `video`. Jika hanya `feed` dan/atau `story` → `image`.

> **Catatan `generation_month`:** Selalu dihitung di backend (`Carbon::now()->format('Y-m')` atau dari tanggal mulai periode generate), tidak mengambil dari field `month` output Gemini karena Gemini kadang mengisi nilai yang tidak konsisten.

---

### 7. `generated_contents`

Hasil generate AI. Satu baris = satu aset konten (caption + media). Generate sekali, dipakai semua platform dari `content_idea` yang sama.

| Field | Tipe | Keterangan |
|---|---|---|
| id | ULID PK | |
| content_idea_id | ULID FK → content_ideas | one-to-one |
| user_id | ULID FK → users | untuk query langsung tanpa join |
| caption | text | caption base dari Gemini |
| media_type | enum | `image`, `video` |
| media_path | varchar(255) | nullable — path file gambar lokal di VPS |
| media_url | varchar(500) | nullable — publicUrl gambar dari Zernio setelah upload, dipakai di createPost feed/story |
| media_video_path | varchar(255) | nullable — path file video lokal di VPS, diisi jika ada post_type reels atau video |
| media_video_url | varchar(500) | nullable — publicUrl video dari Zernio, dipakai di createPost reels/video TikTok |
| timestamps | | |

> **Catatan media:** File lokal dipertahankan di VPS sebagai backup dan efisiensi regenerate. `media_url` dipakai untuk `post_type: feed` dan `story`. `media_video_url` dipakai untuk `post_type: reels` dan TikTok `video`. Kedua file di-generate dalam satu proses: Imagen 4 → gambar, JSON2Video → video (jika diperlukan).

---

### 8. `post_schedules`

Jadwal posting per platform per post type. Satu baris = satu jadwal untuk satu platform dengan satu post type. Dibuat bersamaan dengan `content_ideas` saat Gemini selesai generate.

| Field | Tipe | Keterangan |
|---|---|---|
| id | ULID PK | |
| content_idea_id | ULID FK → content_ideas | |
| generated_content_id | ULID FK → generated_contents | nullable — NULL saat Gemini generate, diisi saat hari H |
| user_id | ULID FK → users | untuk query langsung tanpa join |
| social_account_id | ULID FK → social_accounts | platform tujuan posting — di-resolve dari `platform` string output Gemini saat insert |
| post_type | enum | `feed`, `reels`, `story`, `video` — dari output Gemini |
| scheduled_at | timestamp | waktu posting per platform — ditentukan Gemini saat generate jadwal |
| status | enum | `pending`, `scheduled`, `published`, `failed` |
| zernio_post_id | varchar(150) | nullable — untuk Delete & Recreate |
| zernio_scheduled_at | timestamp | nullable — waktu jadwal yang dikonfirmasi Zernio |
| failure_reason | text | nullable — pesan error dari Zernio jika failed |
| published_at | timestamp | nullable — waktu actual publish |
| timestamps | | |

> **Status flow:** `pending` → (konten ready + kirim ke Zernio) → `scheduled` → `published` / `failed`

> **Catatan `social_account_id`:** Gemini output hanya berisi string `platform` (`"instagram"`, `"tiktok"`). Saat backend mem-parsing output Gemini dan insert ke `post_schedules`, backend melakukan lookup ke tabel `social_accounts` untuk mendapatkan `id` yang sesuai berdasarkan `user_id` + `platform` + `is_active = true`.

> **Catatan Delete & Recreate:** Saat user regenerate konten, sistem DELETE `zernio_post_id` lama dari Zernio lalu CREATE post baru. `zernio_post_id` di baris ini di-update dengan ID baru. `generated_content_id` juga di-update ke record `generated_contents` yang baru.

---

### 9. `post_analytics`

Data performa per posting per platform, di-sync dari Zernio Analytics API.

| Field | Tipe | Keterangan |
|---|---|---|
| id | ULID PK | |
| post_schedule_id | ULID FK → post_schedules | |
| user_id | ULID FK → users | untuk query langsung tanpa join |
| platform | varchar(50) | `instagram`, `tiktok` — denormalisasi untuk performa query |
| likes | int | default 0 |
| comments | int | default 0 |
| shares | int | default 0 |
| video_views | int | nullable, default 0 — khusus TikTok dan reels |
| impressions | int | default 0 |
| reach | int | default 0 |
| synced_at | timestamp | waktu terakhir sync dari Zernio |
| timestamps | | |

---

### Catatan Desain Database

- **ULID** dipilih vs UUID biasa karena time-sortable, lebih friendly untuk indexing di MySQL.
- `user_id` disertakan di beberapa tabel anak (`generated_contents`, `post_schedules`, `post_analytics`) sebagai **denormalisasi ringan** — menghindari join berlapis saat query dashboard.
- Tidak ada tabel `holidays` — deteksi hari besar sepenuhnya oleh Gemini via Google Search Grounding, hasilnya disimpan di field `holiday_name` pada `content_ideas`.
- `zernio_post_id` di `post_schedules` adalah field kritis untuk strategi Delete & Recreate — harus selalu diisi saat post berhasil dikirim ke Zernio.
- `generation_month` di `content_ideas` pakai format `YYYY-MM` (char(7)) untuk memudahkan grouping saat tampil kalender bulanan. Nilainya **selalu dihitung di backend**, bukan dari output Gemini.
- `post_type` di `post_schedules` adalah field baru yang wajib diisi — menentukan format post yang dikirim ke Zernio dan logika generate media di hari H.
- `content_description` di `content_ideas` adalah field baru — menyimpan deskripsi singkat konten dari Gemini sebagai panduan saat generate caption di hari H.
- `media_preference` di `content_ideas` tidak lagi memiliki nilai `auto` — selalu `image` atau `video`, ditentukan dari `post_type` dominan.
- `post_schedules` dibuat saat Gemini generate (bersamaan dengan `content_ideas`), bukan saat hari H. `generated_content_id` masih NULL saat itu, diisi setelah proses generate konten selesai di hari H.
- `timezone` di `business_profiles` menggunakan format IANA dan wajib dikirim ke Zernio sebagai parameter `timezone` di setiap createPost request.

---

## Bagian 3 — Desain Prompt Gemini untuk Generate Jadwal

---

### System Instruction

```
Kamu adalah AI content strategist untuk platform otomasi konten UMKM Indonesia.
Tugasmu adalah membuat jadwal konten media sosial selama 30 hari untuk sebuah bisnis UMKM berdasarkan data bisnis yang diberikan.

Aturan penting:
1. Output HARUS berupa JSON valid saja — tidak ada teks lain, tidak ada markdown, tidak ada penjelasan di luar JSON.
2. Deteksi hari besar nasional / internasional yang relevan di periode tersebut dan sisipkan sebagai konten "holiday_greeting". Gunakan kemampuan pencarianmu untuk memastikan hari besar yang akurat.
3. Untuk konten "regular" gunakan pembagian: 80% konten edukasi, hiburan, dan interaksi — 20% konten promosi langsung.
4. Untuk konten promosi, pilih produk yang akan difokuskan secara bergantian dan merata.
5. Gunakan pencarianmu untuk mengetahui tren terkini konten pada platform terkait, lalu sisipkan tren tersebut ke dalam ide konten.
6. Frekuensi posting: 4–6 kali per minggu (tidak harus setiap hari).
7. Waktu posting per platform harus realistis dan sesuai jam aktif audiens di Indonesia:
   - Instagram feed & reels: pagi (07.00–09.00) atau sore (17.00–20.00)
   - Instagram story: fleksibel antara 07.00–21.00
   - TikTok: siang (12.00–14.00) atau malam (19.00–22.00)
8. Jika hari besar jatuh di hari yang sudah ada konten regular, tambahkan konten holiday_greeting sebagai entri terpisah di tanggal yang sama.
9. Hanya generate jadwal untuk platform yang tersedia di daftar "social_accounts".
10. product_index mengacu ke index array "products" yang diberikan (dimulai dari 0). Isi null jika konten bukan promosi produk langsung.
11. Aturan post_type per platform:
    - Instagram: "feed" (foto/carousel statis), "reels" (video pendek), "story" (konten sementara 24 jam)
    - TikTok: hanya "video"
    - Satu content_idea bisa memiliki beberapa post_schedules dengan platform dan post_type berbeda
    - Distribusi Instagram: ~40% feed, ~40% reels, ~20% story
    - Story cocok untuk: flash sale, polling interaktif, behind the scenes singkat, reminder konten sebelumnya
    - Reels dan TikTok video cocok untuk: tutorial, proses pembuatan, tren audio, storytelling video
12. Aturan media_preference berdasarkan post_type dominan dalam satu content_idea:
    - Jika ada reels atau TikTok video → media_preference "video"
    - Jika hanya feed dan/atau story → media_preference "image"
```

### User Prompt Template

```
Buatkan jadwal konten untuk bisnis berikut.

=== DATA BISNIS ===
Nama Bisnis: {business_name}
Jenis Bisnis: {business_type}
Deskripsi: {description}
Visi & Misi: {vision_mission}
Keunikan: {uniqueness}
Target Audiens: {target_audience}
Nuansa Konten: {content_tone}
Lokasi: {location}
Timezone: {timezone}

=== PRODUK ===
{products_json}

=== AKUN SOSIAL MEDIA AKTIF ===
{social_accounts_json}

=== PERIODE ===
Buatlah konten untuk periode {start_date} hingga {end_date}.
Hari ini: {today_date} pukul {current_time} {timezone}

=== FORMAT OUTPUT ===
Kembalikan HANYA JSON dengan struktur berikut, tanpa teks apapun di luar JSON:

{
  "month": "YYYY-MM",
  "content_ideas": [
    {
      "date": "YYYY-MM-DD",
      "content_title": "string — judul/tema konten yang spesifik dan kreatif",
      "content_description": "string — deskripsi singkat tentang konten yang akan dibuat",
      "content_type": "regular | holiday_greeting",
      "holiday_name": "string | null",
      "product_index": "number | null",
      "media_preference": "image | video",
      "post_schedules": [
        {
          "platform": "instagram | tiktok",
          "post_type": "feed | reels | story | video",
          "scheduled_at": "YYYY-MM-DD HH:MM:SS"
        }
      ]
    }
  ]
}
```

### Konfigurasi Request ke Gemini API

```json
{
  "tools": [{ "google_search": {} }],
  "generationConfig": {
    "temperature": 1.0
  }
}
```

> **Catatan:** `responseMimeType: "application/json"` tidak bisa dikombinasikan dengan `google_search` tool. JSON output dipaksakan via instruksi di system prompt. Backend wajib melakukan defensive parsing untuk strip markdown code block sebelum `json_decode()`.

### Mapping Output Gemini → Database

| Field Output Gemini | Field Database | Catatan |
|---|---|---|
| `content_title` | `content_ideas.content_theme` | Rename saat insert |
| `content_description` | `content_ideas.content_description` | Langsung insert |
| `content_type` | `content_ideas.content_type` | Langsung insert |
| `holiday_name` | `content_ideas.holiday_name` | Langsung insert |
| `product_index` | `content_ideas.product_id` | Resolve ke actual product ID dari array produk user |
| `media_preference` | `content_ideas.media_preference` | Langsung insert |
| `date` | Dipakai untuk derive `generation_month` | `Carbon::parse($date)->format('Y-m')` |
| `post_schedules[].platform` | `post_schedules.social_account_id` | Lookup ke `social_accounts` by `user_id` + `platform` + `is_active = true` |
| `post_schedules[].post_type` | `post_schedules.post_type` | Langsung insert |
| `post_schedules[].scheduled_at` | `post_schedules.scheduled_at` | Langsung insert |
| *(tidak ada)* | `post_schedules.status` | Default `pending` saat insert |
| *(tidak ada)* | `post_schedules.generated_content_id` | NULL saat insert, diisi saat hari H |

---

## Bagian 4 — Progress Development

| Komponen | Status |
|---|---|
| Autentikasi (Laravel Breeze) | ✅ Selesai |
| Onboarding — Profil Bisnis | ✅ Selesai |
| Onboarding — Upload Produk | ✅ Selesai |
| Onboarding — Connect Sosmed via Zernio OAuth | ✅ Selesai |
| Migrations: `content_ideas`, `post_schedules` | ✅ Selesai |
| Models untuk semua tabel | ✅ Selesai |
| Migration update: `post_type`, `content_description`, revisi `media_preference` | 🔲 Belum |
| `GeminiService` — HTTP Client wrapper | 🔲 Belum |
| `ScheduleGeneratorService` — orkestrasi + parsing | 🔲 Belum |
| API endpoint generate jadwal (untuk testing Postman) | 🔲 Belum |
| Dashboard jadwal 30 hari | 🔲 Belum |
| Pipeline hari H — generate caption + media | 🔲 Belum |
| Upload media ke Zernio + createPost | 🔲 Belum |
| Dashboard analytics | 🔲 Belum |

---

## Bagian 5 — Agenda Development Selanjutnya

1. Jalankan migration update untuk `post_type`, `content_description`, dan revisi enum `media_preference`
2. Update `$fillable` di Model `PostSchedule` dan `ContentIdea`
3. Buat `GeminiService` — wrapper HTTP Client untuk call Gemini API
4. Buat `ScheduleGeneratorService` — orkestrasi generate jadwal + parsing output + insert DB
5. Buat API route + Controller untuk trigger generate jadwal (testing via Postman)
6. Test end-to-end: Postman → Laravel → Gemini → parsing → insert DB → verifikasi data di MySQL