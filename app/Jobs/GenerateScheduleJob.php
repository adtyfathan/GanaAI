<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\ScheduleGeneratorService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateScheduleJob implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    /**
     * Jumlah maksimal percobaan jika job gagal.
     * Dibatasi 1 — generate ulang manual lebih aman daripada retry otomatis
     * yang bisa double-insert content_ideas.
     */
    public int $tries = 1;

    /**
     * Timeout dalam detik — Gemini dengan Search Grounding bisa lambat.
     */
    public int $timeout = 180;

    public function __construct(public readonly User $user)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(ScheduleGeneratorService $generator): void
    {
        Log::info("GenerateScheduleJob dimulai", ['user_id' => $this->user->id]);

        try {
            $generator->generateForUser($this->user);

            Log::info("GenerateScheduleJob selesai", ['user_id' => $this->user->id]);

        } catch (\Exception $e) {
            Log::error("GenerateScheduleJob gagal", [
                'user_id' => $this->user->id,
                'error' => $e->getMessage(),
            ]);

            // Re-throw agar job ditandai sebagai failed di queue
            throw $e;
        }
    }

    /**
     * Handle job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("GenerateScheduleJob failed permanently", [
            'user_id' => $this->user->id,
            'error' => $exception->getMessage(),
        ]);

        // TODO (opsional): kirim notifikasi ke user bahwa generate gagal
    }
}