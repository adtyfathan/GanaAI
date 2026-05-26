<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    private string $apiKey;
    private string $baseUrl;
    private string $model = 'gemini-2.5-flash';

    public function __construct()
    {
        $this->baseUrl = env('GEMINI_BASE_URL');
        $this->apiKey = env('GEMINI_API_KEY');
    }

    // ─── Public Methods ───────────────────────────────────────────────────────

    /**
     * Generate jadwal konten 30 hari.
     * Menggunakan Google Search Grounding untuk deteksi tren & hari besar.
     *
     * @return array|null  Array decoded dari JSON output Gemini, atau null jika gagal
     */
    public function generateSchedule(
        array $businessData,
        array $products,
        array $socialAccounts,
        string $startDate,
        string $endDate,
        string $timezone
    ): ?array {
        $systemInstruction = $this->buildScheduleSystemInstruction();
        $userPrompt = $this->buildScheduleUserPrompt(
            $businessData,
            $products,
            $socialAccounts,
            $startDate,
            $endDate,
            $timezone
        );

        $payload = [
            'system_instruction' => [
                'parts' => [['text' => $systemInstruction]],
            ],
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [['text' => $userPrompt]],
                ],
            ],
            'tools' => [
                ['google_search' => (object) []],
            ],
            'generationConfig' => [
                'temperature' => 1.0,
            ],
        ];

        $rawText = $this->callApi('generateContent', $payload, timeout: 120);

        if ($rawText === null) {
            return null;
        }

        return $this->parseJsonOutput($rawText, context: 'generateSchedule');
    }

    /**
     * Generate caption untuk sebuah konten idea di hari H.
     * Tidak menggunakan Search Grounding — caption generation tidak butuh data real-time.
     *
     * @return string|null  Caption text, atau null jika gagal
     */
    public function generateCaption(
        array $businessData,
        string $contentTheme,
        string $contentDescription,
        string $contentType,
        ?string $holidayName,
        string $postType,
        string $platform
    ): ?string {
        $prompt = $this->buildCaptionPrompt(
            $businessData,
            $contentTheme,
            $contentDescription,
            $contentType,
            $holidayName,
            $postType,
            $platform
        );

        $payload = [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [['text' => $prompt]],
                ],
            ],
            'generationConfig' => [
                'temperature' => 1.2,
                'responseMimeType' => 'text/plain',
            ],
        ];

        return $this->callApi('generateContent', $payload, timeout: 30);
    }

    // ─── API Call ─────────────────────────────────────────────────────────────

    /**
     * Kirim request ke Gemini API dan return raw text dari response.
     *
     * @return string|null  Raw text content dari kandidat pertama Gemini
     */
    private function callApi(string $endpoint, array $payload, int $timeout = 60): ?string
    {
        $url = "{$this->baseUrl}/{$this->model}:{$endpoint}";

        try {
            $response = Http::timeout($timeout)
                ->withQueryParameters(['key' => $this->apiKey])
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($url, $payload);

            if ($response->failed()) {
                Log::error('Gemini API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'endpoint' => $endpoint,
                ]);
                return null;
            }

            $data = $response->json();

            // Ambil text dari kandidat pertama
            $text = data_get($data, 'candidates.0.content.parts.0.text');

            if (empty($text)) {
                Log::error('Gemini response kosong atau struktur tidak sesuai', [
                    'response' => $data,
                    'endpoint' => $endpoint,
                ]);
                return null;
            }

            return $text;

        } catch (\Illuminate\Http\Client\RequestException $e) {
            Log::error('Gemini HTTP request exception', [
                'message' => $e->getMessage(),
                'endpoint' => $endpoint,
            ]);
            return null;
        } catch (\Exception $e) {
            Log::error('Gemini unexpected exception', [
                'message' => $e->getMessage(),
                'endpoint' => $endpoint,
            ]);
            return null;
        }
    }

    // ─── JSON Parsing ─────────────────────────────────────────────────────────

    /**
     * Parse JSON dari output Gemini.
     * Gemini kadang membungkus output dengan markdown code block — perlu di-strip dulu.
     *
     * @return array|null
     */
    private function parseJsonOutput(string $rawText, string $context = ''): ?array
    {
        // Strip markdown code block: ```json ... ``` atau ``` ... ```
        $cleaned = preg_replace('/^```(?:json)?\s*/m', '', $rawText);
        $cleaned = preg_replace('/\s*```$/m', '', $cleaned);
        $cleaned = trim($cleaned);

        $decoded = json_decode($cleaned, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::error('Gemini JSON parse error', [
                'context' => $context,
                'json_error' => json_last_error_msg(),
                'raw_text' => substr($rawText, 0, 500), // log 500 char pertama saja
            ]);
            return null;
        }

        return $decoded;
    }

    // ─── Prompt Builders ──────────────────────────────────────────────────────

    private function buildScheduleSystemInstruction(): string
    {
        return <<<'SYSTEM'
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
SYSTEM;
    }

    private function buildScheduleUserPrompt(
        array $businessData,
        array $products,
        array $socialAccounts,
        string $startDate,
        string $endDate,
        string $timezone
    ): string {
        $productsJson = json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        $socialJson = json_encode($socialAccounts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        $todayDate = now($timezone)->format('Y-m-d');
        $currentTime = now($timezone)->format('H:i');

        return <<<PROMPT
Buatkan jadwal konten untuk bisnis berikut.

=== DATA BISNIS ===
Nama Bisnis: {$businessData['business_name']}
Jenis Bisnis: {$businessData['business_type']}
Deskripsi: {$businessData['description']}
Visi & Misi: {$businessData['vision_mission']}
Keunikan: {$businessData['uniqueness']}
Target Audiens: {$businessData['target_audience']}
Nuansa Konten: {$businessData['content_tone']}
Lokasi: {$businessData['location']}
Timezone: {$timezone}

=== PRODUK ===
{$productsJson}

=== AKUN SOSIAL MEDIA AKTIF ===
{$socialJson}

=== PERIODE ===
Buatlah konten untuk periode {$startDate} hingga {$endDate}.
Hari ini: {$todayDate} pukul {$currentTime} {$timezone}

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
PROMPT;
    }

    private function buildCaptionPrompt(
        array $businessData,
        string $contentTheme,
        string $contentDescription,
        string $contentType,
        ?string $holidayName,
        string $postType,
        string $platform
    ): string {
        $holidayContext = $holidayName
            ? "Konten ini adalah ucapan hari besar: {$holidayName}."
            : '';

        $platformGuidance = match ($platform) {
            'instagram' => 'Instagram — gunakan emoji secukupnya, maksimal 5 hashtag relevan di akhir caption.',
            'tiktok' => 'TikTok — caption singkat dan energetik, maksimal 3 hashtag trending.',
            default => '',
        };

        $postTypeGuidance = match ($postType) {
            'feed' => 'Post feed statis — caption informatif, bisa lebih panjang.',
            'reels' => 'Reels — caption pendek dan hook yang kuat di kalimat pertama.',
            'story' => 'Story — sangat singkat, CTA yang jelas (swipe up / DM / tap link).',
            'video' => 'Video TikTok — caption singkat, langsung ke poin, gunakan bahasa santai.',
            default => '',
        };

        return <<<PROMPT
Kamu adalah copywriter konten sosial media untuk UMKM Indonesia.

=== DATA BISNIS ===
Nama Bisnis: {$businessData['business_name']}
Jenis Bisnis: {$businessData['business_type']}
Nuansa Konten: {$businessData['content_tone']}
Target Audiens: {$businessData['target_audience']}

=== KONTEN ===
Tema: {$contentTheme}
Deskripsi: {$contentDescription}
{$holidayContext}

=== PLATFORM & FORMAT ===
Platform: {$platform}
Post Type: {$postType}
{$platformGuidance}
{$postTypeGuidance}

Buatkan caption yang menarik, autentik, dan sesuai karakter bisnis. 
Tulis langsung captionnya saja tanpa penjelasan tambahan.
PROMPT;
    }
}