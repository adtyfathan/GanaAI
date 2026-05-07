# AI Social Media Automation untuk UMKM — Dokumentasi Proyek

---

## Bagian 1 — Rangkuman Lengkap Proyek

---

### Konsep Platform
Website AI-based untuk otomasi pembuatan, penjadwalan, dan pengunggahan konten di sosial media (IG, TT, X, FB) yang berfokus pada UMKM lokal Indonesia.

---

### Fitur Utama
1. Scheduling dan ide konten otomatis sesuai identitas bisnis dan tren social media (30 hari ke depan) — Gemini sekaligus menentukan waktu posting yang disarankan per platform untuk setiap ide konten
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
   - Mendeteksi hari besar di bulan tersebut → sisipkan sebagai konten greeting
   - Menentukan waktu posting yang disarankan per platform untuk setiap ide konten
   - Output: `content_ideas` + `post_schedules` per platform langsung terisi
6. User kelola jadwal di dashboard:
   - Lihat jadwal 30 hari
   - Generate konten sekarang (tekan tombol generate di salah satu ide konten)
   - Regenerate konten yang sudah ada (max 3x, via Delete & Recreate di Zernio)
   - Hapus/skip ide posting di tanggal tertentu (permanen, tidak digenerate ulang otomatis)
7. Pada hari H → Laravel Scheduler trigger generate konten:
   - Gemini generate caption
   - Imagen 4 generate gambar dan JSON2Video generate video (khusus tiktok) → disimpan lokal di VPS
   - File diupload ke Zernio via presigned URL → simpan `media_url` dan `media_video_url`
   - Kirim ke Zernio createPost per platform sesuai `scheduled_at` masing-masing
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
| Hosting | VPS  |

---

### API Stack

| Fungsi | API | Catatan |
|---|---|---|
| Generate ide, jadwal per platform, caption, deteksi hari besar | Gemini 3 Flash + Google Search Grounding | 5 RPM, 250k TPM, 20 RPD |
| Generate gambar konten | Imagen 4 Fast | 25 RPD |
| Generate video konten | JSON2Video | Free tier: 600 detik rendering, 1 detik video = 1 credit |
| Posting otomatis + source analytics | Zernio | Free tier: 2 Social Sets |

> Semua API menggunakan free tier.
> RPM = Request per Minute | TPM = Token per Minute | RPD = Request per Day

---

### Keputusan Teknis Penting

**Zernio sebagai jembatan sosmed:**
- Sudah menjadi Meta, TikTok, dan X Official Partner — tidak perlu Meta App Review sendiri
- Support 15+ platform, handle semua OAuth dan approval platform
- Free tier: 2 Social Sets, 20 posts/bulan (cukup untuk development & testing)
- 1 user UMKM = 1 Zernio Social Set (ID disimpan di `business_profiles.zernio_social_set_id`)
- Setiap akun sosmed per platform menghasilkan `zernio_account_id` tersendiri (disimpan di `social_accounts`)
- Facebook: `zernio_account_id` berisi Page ID (bukan User ID) karena butuh secondary selection setelah OAuth

**Zernio tidak punya endpoint update post.** Solusi: strategi **Delete & Recreate** — saat user regenerate konten, platform DELETE `zernio_post_id` lama lalu CREATE post baru dengan jadwal yang sama. `zernio_post_id` baru disimpan kembali di `post_schedules`.

**Post yang sudah `published`** tidak bisa diedit atau dihapus dari sosmed via Zernio. Fitur regenerate dan hapus hanya berlaku untuk post berstatus `pending` atau `scheduled`.

**Jadwal per platform dibuat saat Gemini generate**, bukan saat hari H. `post_schedules` langsung terisi bersamaan dengan `content_ideas` saat Gemini selesai output. `generated_content_id` di `post_schedules` masih NULL saat ini, baru diisi saat hari H ketika konten selesai digenerate.

**Konten digenerate di hari H** oleh Laravel Scheduler — bukan saat Gemini generate jadwal — karena generate gambar/video 30 hari di muka tidak efisien dari sisi biaya API dan storage.

**Media disimpan dua tempat:**
- Lokal di VPS (`media_path`, `media_video_path`) — sebagai backup dan efisiensi regenerate tanpa perlu panggil Imagen 4 lagi
- Zernio storage via presigned URL (`media_url`, `media_video_url`) — URL ini yang dipakai di payload `createPost` Zernio

**TikTok menerima foto carousel**  Jika `media_type = image` dan user punya akun Tiktok aktif → JSON2Video dipanggil untuk generate `media_video_path`.

**Google Search Grounding** diaktifkan di Gemini 3 Flash agar bisa mengakses tren real-time saat generate ide konten (knowledge cutoff Gemini 3 Flash adalah Januari 2025).

**Hari besar tidak disimpan di database.** Gemini mendeteksi hari besar secara otomatis dalam satu prompt yang sama saat generate jadwal bulanan. Hasilnya disimpan di field `holiday_name` pada `content_ideas`. Tidak ada tabel `holidays`.

**Jenis bisnis dan jenis produk** menggunakan dropdown (bukan free text) agar Gemini mendapat konteks yang konsisten dan terstruktur saat generate konten.

**Timezone** disimpan di `business_profiles.timezone` menggunakan format IANA (misal `Asia/Jakarta`) — dipakai sebagai parameter `timezone` saat kirim createPost ke Zernio agar waktu posting tidak salah.

**Soft delete** diterapkan di tabel `products` via field `deleted_at` — produk yang dihapus user tidak benar-benar dihapus dari database agar relasi ke `content_ideas.product_id` tetap aman (onDelete set null).

**Laravel Queue + Supervisor** wajib dijalankan di VPS untuk menangani proses async: generate konten AI, upload ke Zernio presigned URL, kirim createPost, dan sync analytics. Shared hosting tidak mendukung ini.

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
            ├── generated_content_id nullable → diisi saat hari H
            ├── zernio_post_id → untuk Delete & Recreate
            └── post_analytics (1-to-1) — data performa dari Zernio
```

---

### Yang Belum Dibahas (Agenda Session Berikutnya)
- Style & desain UI/UX website
- Setup project Laravel + Inertia + React
- Mulai coding (urutan: migrations → models → auth → onboarding → dst)

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
| zernio_social_set_id | varchar(100) | ID Social Set dari Zernio |
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
| platform | varchar(50) | `instagram`, `tiktok`, `facebook`, `x` |
| zernio_account_id | varchar(100) | account ID dari Zernio — untuk Facebook berisi Page ID |
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
| product_id | ULID FK → products | nullable — kosong jika holiday_greeting, onDelete set null |
| content_theme | varchar(255) | tema/judul ide konten dari Gemini |
| content_type | enum | `regular`, `holiday_greeting` |
| holiday_name | varchar(150) | nullable — diisi jika holiday_greeting |
| generation_month | char(7) | format `YYYY-MM` — untuk grouping per bulan |
| media_preference | enum | `image`, `video`, `auto` — panduan format konten untuk AI |
| status | enum | `idea`, `generating`, `ready`, `failed` |
| regenerate_count | tinyint | default 0 |
| last_regenerated_at | timestamp | nullable |
| timestamps | | |

> **Status flow:** `idea` → (trigger generate) → `generating` → `ready` / `failed`

---

### 7. `generated_contents`

Hasil generate AI. Satu baris = satu aset konten (caption + media). Generate sekali, dipakai semua platform.

| Field | Tipe | Keterangan |
|---|---|---|
| id | ULID PK | |
| content_idea_id | ULID FK → content_ideas | one-to-one |
| user_id | ULID FK → users | untuk query langsung tanpa join |
| caption | text | caption base dari Gemini |
| media_type | enum | `image`, `video` |
| media_path | varchar(255) | nullable — path file lokal di VPS (aset utama) |
| media_url | varchar(500) | nullable — publicUrl dari Zernio setelah upload, dipakai di createPost |
| media_video_path | varchar(255) | nullable — path video lokal di VPS, khusus Tiktok jika media_type = image |
| media_video_url | varchar(500) | nullable — publicUrl video dari Zernio, khusus Tiktok |
| timestamps | | |

> **Catatan media:** File lokal dipertahankan di VPS sebagai backup dan efisiensi regenerate. `media_url` dan `media_video_url` adalah hasil upload ke Zernio presigned URL — URL ini yang dipakai sebagai `mediaItems` di payload createPost Zernio. `media_video_path` dan `media_video_url` hanya diisi jika user punya akun Tiktok aktif dan `media_type = image`.

---

### 8. `post_schedules`

Jadwal posting per platform. Murni urusan waktu dan Zernio. Satu baris = satu jadwal untuk satu platform. Dibuat bersamaan dengan `content_ideas` saat Gemini selesai generate.

| Field | Tipe | Keterangan |
|---|---|---|
| id | ULID PK | |
| content_idea_id | ULID FK → content_ideas | |
| generated_content_id | ULID FK → generated_contents | nullable — NULL saat Gemini generate, diisi saat hari H |
| user_id | ULID FK → users | untuk query langsung tanpa join |
| social_account_id | ULID FK → social_accounts | platform tujuan posting |
| scheduled_at | timestamp | waktu posting per platform — ditentukan Gemini saat generate jadwal |
| status | enum | `pending`, `scheduled`, `published`, `failed` |
| zernio_post_id | varchar(150) | nullable — untuk Delete & Recreate |
| zernio_scheduled_at | timestamp | nullable — waktu jadwal yang dikonfirmasi Zernio |
| failure_reason | text | nullable — pesan error dari Zernio jika failed |
| published_at | timestamp | nullable — waktu actual publish |
| timestamps | | |

> **Status flow:** `pending` → (konten ready + kirim ke Zernio) → `scheduled` → `published` / `failed`

> **Catatan Delete & Recreate:** Saat user regenerate konten, sistem DELETE `zernio_post_id` lama dari Zernio lalu CREATE post baru. `zernio_post_id` di baris ini di-update dengan ID baru dari Zernio. `generated_content_id` juga di-update ke record `generated_contents` yang baru.

---

### 9. `post_analytics`

Data performa per posting per platform, di-sync dari Zernio Analytics API.

| Field | Tipe | Keterangan |
|---|---|---|
| id | ULID PK | |
| post_schedule_id | ULID FK → post_schedules | |
| user_id | ULID FK → users | untuk query langsung tanpa join |
| platform | varchar(50) | `instagram`, `tiktok`, dst — denormalisasi untuk performa query |
| likes | int | default 0 |
| comments | int | default 0 |
| shares | int | default 0 |
| video_views | int | nullable, default 0 — khusus TikTok |
| impressions | int | default 0 |
| reach | int | default 0 |
| synced_at | timestamp | waktu terakhir sync dari Zernio |
| timestamps | | |

---

### Catatan Desain

- **ULID** dipilih vs UUID biasa karena time-sortable, lebih friendly untuk indexing di MySQL.
- `user_id` disertakan di beberapa tabel anak (`generated_contents`, `post_schedules`, `post_analytics`) sebagai **denormalisasi ringan** — menghindari join berlapis saat query dashboard.
- Tidak ada tabel `holidays` — deteksi hari besar sepenuhnya oleh Gemini, hasilnya disimpan di field `holiday_name` pada `content_ideas`.
- `zernio_post_id` di `post_schedules` adalah field kritis untuk strategi Delete & Recreate — harus selalu diisi saat post berhasil dikirim ke Zernio.
- `generation_month` di `content_ideas` pakai format `YYYY-MM` (char(7)) untuk memudahkan grouping saat tampil kalender bulanan.
- `media_path` dan `media_video_path` adalah path lokal di VPS. `media_url` dan `media_video_url` adalah publicUrl dari Zernio storage setelah upload via presigned URL.
- `post_schedules` dibuat saat Gemini generate (bersamaan dengan `content_ideas`), bukan saat hari H. `generated_content_id` masih NULL saat itu, diisi setelah proses generate konten selesai di hari H.
- `timezone` di `business_profiles` menggunakan format IANA dan wajib dikirim ke Zernio sebagai parameter `timezone` di setiap createPost request.
