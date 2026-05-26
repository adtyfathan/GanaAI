<?php

namespace App\Http\Controllers;

use App\Models\ContentIdea;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Tampilkan dashboard jadwal konten.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $profile = $user->businessProfile;
        $timezone = $profile?->timezone ?? 'Asia/Jakarta';

        // generation_month bulan ini (format YYYY-MM)
        $currentMonth = Carbon::now($timezone)->format('Y-m');

        // Ambil semua content_ideas bulan ini + post_schedules-nya
        $contentIdeas = ContentIdea::with([
            'postSchedules.socialAccount',
            'product',
            'generatedContent',
        ])
            ->where('user_id', $user->id)
            ->where('generation_month', $currentMonth)
            ->orderBy('content_theme') // akan diurutkan di frontend by scheduled_at
            ->get()
            ->map(fn($idea) => [
                'id' => $idea->id,
                'content_theme' => $idea->content_theme,
                'content_description' => $idea->content_description,
                'content_type' => $idea->content_type,
                'holiday_name' => $idea->holiday_name,
                'media_preference' => $idea->media_preference,
                'status' => $idea->status,
                'regenerate_count' => $idea->regenerate_count,
                'product' => $idea->product ? [
                    'id' => $idea->product->id,
                    'name' => $idea->product->name,
                ] : null,
                'post_schedules' => $idea->postSchedules->map(fn($s) => [
                    'id' => $s->id,
                    'platform' => $s->socialAccount?->platform,
                    'post_type' => $s->post_type,
                    'scheduled_at' => $s->scheduled_at?->toIso8601String(),
                    'status' => $s->status,
                    'published_at' => $s->published_at?->toIso8601String(),
                ])->values(),
                'generated_content' => $idea->generatedContent ? [
                    'caption' => $idea->generatedContent->caption,
                    'media_type' => $idea->generatedContent->media_type,
                    'media_url' => $idea->generatedContent->media_url,
                    'media_video_url' => $idea->generatedContent->media_video_url,
                ] : null,
            ]);

        // Cek apakah jadwal sudah ada atau masih loading (job baru dispatch)
        $hasSchedule = $contentIdeas->isNotEmpty();

        return Inertia::render('Dashboard', [
            'businessName' => $profile?->business_name,
            'currentMonth' => $currentMonth,
            'timezone' => $timezone,
            'contentIdeas' => $contentIdeas,
            'hasSchedule' => $hasSchedule,
        ]);
    }
}