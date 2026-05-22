<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ZernioService
{
    private string $baseUrl;
    private string $apiKey;

    public function __construct()
    {
        $this->baseUrl = env('ZERNIO_BASE_URL');
        $this->apiKey = env('ZERNIO_API_KEY');
    }

    // ─── HTTP Client helper ──────────────────────────────────────────────────

    private function client()
    {
        return Http::withHeaders([
            'Authorization' => "Bearer {$this->apiKey}",
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->baseUrl($this->baseUrl);
    }

    // ─── Social Set (Profile) ────────────────────────────────────────────────
    public function createSocialSet(string $businessName, string $description = ''): ?string
    {
        try {
            $response = $this->client()->post('/profiles', [
                'name' => $businessName,
                'description' => $description,
            ]);

            if ($response->successful()) {
                return $response->json('profile._id');
            }

            Log::error('Zernio createSocialSet failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (\Throwable $e) {
            Log::error('Zernio createSocialSet exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    // ─── OAuth Connect ───────────────────────────────────────────────────────
    public function getConnectUrl(
        string $platform, 
        string $socialSetId, 
        string $redirectUrl,
    ): ?string
    {
        try {
            $params = [
                'profileId' => $socialSetId,
                'redirect_url' => $redirectUrl,
            ];

            Log::info('Zernio getConnectUrl request', [
                'platform' => $platform,
                'params' => $params,
                'url' => "/connect/{$platform}",
            ]);

            $response = $this->client()->get("/connect/{$platform}", $params);

            if ($response->successful()) {
                return $response->json('authUrl');
            }

            Log::error('Zernio getConnectUrl failed', [
                'platform' => $platform,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (\Throwable $e) {
            Log::error('Zernio getConnectUrl exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    // ─── Accounts ────────────────────────────────────────────────────────────

    /**
     * List semua accounts yang sudah diconnect di Zernio.
     * Returns array of account objects.
     */
    public function listAccounts(): array
    {
        try {
            $response = $this->client()->get('/accounts');

            if ($response->successful()) {
                return $response->json('accounts') ?? [];
            }

            Log::error('Zernio listAccounts failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [];
        } catch (\Throwable $e) {
            Log::error('Zernio listAccounts exception', ['error' => $e->getMessage()]);
            return [];
        }
    }

    // ─── Posts ───────────────────────────────────────────────────────────────

    /**
     * Buat post di Zernio.
     */
    public function createPost(array $payload): ?array
    {
        try {
            $response = $this->client()->post('/posts', $payload);

            if ($response->successful()) {
                return $response->json('post');
            }

            Log::error('Zernio createPost failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (\Throwable $e) {
            Log::error('Zernio createPost exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Delete post dari Zernio (untuk strategi Delete & Recreate).
     */
    public function deletePost(string $zernioPostId): bool
    {
        try {
            $response = $this->client()->delete("/posts/{$zernioPostId}");
            return $response->successful();
        } catch (\Throwable $e) {
            Log::error('Zernio deletePost exception', ['error' => $e->getMessage()]);
            return false;
        }
    }

    // ─── Media Upload ────────────────────────────────────────────────────────

    /**
     * Step 1: Minta presigned URL dari Zernio.
     * Returns ['uploadUrl' => '...', 'publicUrl' => '...'] atau null.
     */
    public function getPresignedUrl(string $filename, string $contentType): ?array
    {
        try {
            $response = $this->client()->post('/media/presign', [
                'filename' => $filename,
                'contentType' => $contentType,
            ]);

            if ($response->successful()) {
                return [
                    'uploadUrl' => $response->json('uploadUrl'),
                    'publicUrl' => $response->json('publicUrl'),
                ];
            }

            Log::error('Zernio getPresignedUrl failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (\Throwable $e) {
            Log::error('Zernio getPresignedUrl exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Step 2: Upload file binary ke presigned URL (tanpa Authorization header).
     */
    public function uploadToPresignedUrl(string $uploadUrl, string $filePath, string $contentType): bool
    {
        try {
            $response = Http::withHeaders(['Content-Type' => $contentType])
                ->withBody(file_get_contents($filePath), $contentType)
                ->put($uploadUrl);

            return $response->successful();
        } catch (\Throwable $e) {
            Log::error('Zernio uploadToPresignedUrl exception', ['error' => $e->getMessage()]);
            return false;
        }
    }

    public function deleteAccount(string $zernioAccountId): bool
    {
        try {
            $response = $this->client()->delete("/accounts/{$zernioAccountId}");
            return $response->successful();
        } catch (\Throwable $e) {
            Log::error('Zernio deleteAccount exception', ['error' => $e->getMessage()]);
            return false;
        }
    }
}