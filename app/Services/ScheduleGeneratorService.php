<?php

namespace App\Services;

use App\Models\ContentIdea;
use App\Models\PostSchedule;
use App\Models\SocialAccount;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ScheduleGeneratorService
{
    public function __construct(private GeminiService $gemini)
    {
    }

    /**
     * Entry point utama — generate jadwal 30 hari untuk user.
     * Dipanggil dari GenerateScheduleJob.
     *
     * @throws \Exception jika data bisnis tidak lengkap atau Gemini gagal
     */
    public function generateForUser(User $user): void
    {
        // ── 1. Kumpulkan semua data yang dibutuhkan ──────────────────────────
        $profile = $user->businessProfile;

        if (!$profile) {
            throw new \Exception("User {$user->id} belum memiliki profil bisnis.");
        }

        $products = $user->products()->with('images')->get();

        if ($products->isEmpty()) {
            throw new \Exception("User {$user->id} belum memiliki produk.");
        }

        $socialAccounts = $user->socialAccounts()
            ->where('is_active', true)
            ->get();

        if ($socialAccounts->isEmpty()) {
            throw new \Exception("User {$user->id} belum memiliki akun sosmed aktif.");
        }

        $timezone = $profile->timezone ?? 'Asia/Jakarta';
        $now = Carbon::now($timezone);
        $startDate = $now->copy()->addDay()->format('Y-m-d'); // mulai besok
        $endDate = $now->copy()->addDays(30)->format('Y-m-d');

        // ── 2. Build payload untuk Gemini ────────────────────────────────────
        $businessData = [
            'business_name' => $profile->business_name,
            'business_type' => $profile->business_type,
            'description' => $profile->description,
            'vision_mission' => $profile->vision_mission ?? '-',
            'uniqueness' => $profile->uniqueness ?? '-',
            'target_audience' => $profile->target_audience,
            'content_tone' => $profile->content_tone,
            'location' => $profile->location,
        ];

        // Format produk untuk prompt — index-based agar Gemini bisa pakai product_index
        $productsPayload = $products->values()->map(fn($p, $i) => [
            'index' => $i,
            'name' => $p->name,
            'product_type' => $p->product_type,
            'description' => $p->description,
            'price' => (float) $p->price,
        ])->toArray();

        // Format social accounts untuk prompt
        $accountsPayload = $socialAccounts->map(fn($a) => [
            'platform' => $a->platform,
            'username' => $a->account_username ?? $a->platform,
        ])->toArray();

        $output = $this->gemini->generateSchedule(
            $businessData,
            $productsPayload,
            $accountsPayload,
            $startDate,
            $endDate,
            $timezone
        );

        if (!$output) {
            throw new \Exception("Gemini gagal generate jadwal untuk user {$user->id}.");
        }

        if (empty($output['content_ideas'])) {
            throw new \Exception("Output Gemini tidak memiliki content_ideas untuk user {$user->id}.");
        }

        // ── 4. Parsing + simpan ke DB ─────────────────────────────────────────
        $this->persistSchedule(
            $user,
            $output['content_ideas'],
            $products->values()->toArray(),  // array indexed untuk resolve product_id
            $socialAccounts,
            $timezone
        );
    }

    // ─── Internal: Persist ke Database ───────────────────────────────────────

    /**
     * Simpan semua content_ideas + post_schedules dari output Gemini ke database.
     * Dibungkus dalam satu DB transaction.
     */
    private function persistSchedule(
        User $user,
        array $contentIdeas,
        array $products,
        $socialAccounts,
        string $timezone
    ): void {
        // Buat map platform → SocialAccount untuk lookup cepat
        $accountMap = $socialAccounts->keyBy('platform');

        // generation_month selalu dari backend, bukan dari field "month" output Gemini
        $generationMonth = Carbon::now($timezone)->format('Y-m');

        DB::transaction(function () use ($user, $contentIdeas, $products, $accountMap, $generationMonth) {
            foreach ($contentIdeas as $idea) {
                // Validasi minimal field wajib ada
                if (empty($idea['date']) || empty($idea['content_title'])) {
                    Log::warning('Skipping idea dengan field tidak lengkap', ['idea' => $idea]);
                    continue;
                }

                // Resolve product_id dari product_index
                $productId = null;
                if (isset($idea['product_index']) && $idea['product_index'] !== null) {
                    $idx = (int) $idea['product_index'];
                    $productId = $products[$idx]['id'] ?? null;
                }

                // Insert ContentIdea
                $contentIdea = ContentIdea::create([
                    'user_id' => $user->id,
                    'product_id' => $productId,
                    'content_theme' => $idea['content_title'],
                    'content_description' => $idea['content_description'] ?? null,
                    'content_type' => $this->sanitizeEnum(
                        $idea['content_type'] ?? 'regular',
                        ['regular', 'holiday_greeting'],
                        'regular'
                    ),
                    'holiday_name' => $idea['holiday_name'] ?? null,
                    'generation_month' => $generationMonth,
                    'media_preference' => $this->sanitizeEnum(
                        $idea['media_preference'] ?? 'image',
                        ['image', 'video'],
                        'image'
                    ),
                    'status' => 'idea',
                    'regenerate_count' => 0,
                ]);

                // Insert PostSchedules
                if (empty($idea['post_schedules'])) {
                    Log::warning("ContentIdea {$contentIdea->id} tidak memiliki post_schedules.");
                    continue;
                }

                foreach ($idea['post_schedules'] as $schedule) {
                    $platform = $schedule['platform'] ?? null;
                    $postType = $schedule['post_type'] ?? null;

                    if (!$platform || !$postType) {
                        Log::warning('Skipping schedule dengan platform/post_type kosong', [
                            'schedule' => $schedule,
                        ]);
                        continue;
                    }

                    // Resolve social_account_id dari platform string
                    $socialAccount = $accountMap->get($platform);

                    if (!$socialAccount) {
                        Log::warning("Platform '{$platform}' tidak ditemukan di social accounts user {$user->id}");
                        continue;
                    }

                    // Validasi post_type sesuai platform
                    $validPostTypes = $this->getValidPostTypes($platform);
                    $sanitizedPostType = $this->sanitizeEnum($postType, $validPostTypes, $validPostTypes[0]);

                    PostSchedule::create([
                        'content_idea_id' => $contentIdea->id,
                        'generated_content_id' => null, // diisi saat hari H
                        'user_id' => $user->id,
                        'social_account_id' => $socialAccount->id,
                        'post_type' => $sanitizedPostType,
                        'scheduled_at' => $schedule['scheduled_at'],
                        'status' => 'pending',
                    ]);
                }
            }
        });
    }

    // ─── Helper ──────────────────────────────────────────────────────────────

    /**
     * Sanitize nilai enum — pastikan nilainya ada di daftar yang valid.
     * Kalau tidak valid, return fallback.
     */
    private function sanitizeEnum(string $value, array $validValues, string $fallback): string
    {
        return in_array($value, $validValues, strict: true) ? $value : $fallback;
    }

    /**
     * Return daftar post_type valid per platform.
     */
    private function getValidPostTypes(string $platform): array
    {
        return match ($platform) {
            'instagram' => ['feed', 'reels', 'story'],
            'tiktok' => ['video'],
            default => ['feed'],
        };
    }
}