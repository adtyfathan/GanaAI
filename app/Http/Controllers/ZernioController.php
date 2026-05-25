<?php

namespace App\Http\Controllers;

use App\Models\SocialAccount;
use App\Services\ZernioService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ZernioController extends Controller
{
    public function __construct(private ZernioService $zernio)
    {
    }

    // ─── Step: Buat Social Set ───────────────────────────────────────────────

    /**
     * Buat Social Set di Zernio jika belum ada.
     * Dipanggil dari frontend sebelum user klik connect platform.
     */
    public function createSocialSet(Request $request)
    {
        $user = $request->user();
        $profile = $user->businessProfile;

        if (!$profile) {
            return response()->json(['error' => 'Profil bisnis belum diisi.'], 422);
        }

        // Sudah ada, return langsung
        if ($profile->zernio_social_set_id) {
            return response()->json(['social_set_id' => $profile->zernio_social_set_id]);
        }

        $socialSetId = $this->zernio->createSocialSet(
            $profile->business_name,
            $profile->description ?? ''
        );

        if (!$socialSetId) {
            return response()->json(['error' => 'Gagal membuat Social Set di Zernio. Coba lagi.'], 500);
        }

        $profile->update(['zernio_social_set_id' => $socialSetId]);

        return response()->json(['social_set_id' => $socialSetId]);
    }

    // ─── Step: Get OAuth Connect URL ────────────────────────────────────────

    /**
     * Dapatkan authUrl untuk platform tertentu.
     * Frontend redirect user ke URL ini.
     */
    public function getConnectUrl(Request $request)
    {
        $request->validate([
            'platform' => 'required|string|in:instagram,tiktok',
        ]);

        $user = $request->user();
        $profile = $user->businessProfile;

        if (!$profile || !$profile->zernio_social_set_id) {
            return response()->json(['error' => 'Social Set belum dibuat.'], 422);
        }

        $platform = $request->platform;
        $redirectUrl = route('onboarding.zernio.callback');

        $authUrl = $this->zernio->getConnectUrl(
            $platform,
            $profile->zernio_social_set_id,
            $redirectUrl,
        );

        if (!$authUrl) {
            return response()->json(['error' => 'Gagal mendapatkan URL OAuth. Coba lagi.'], 500);
        }

        return response()->json(['auth_url' => $authUrl]);
    }

    // ─── Step: Handle OAuth Callback ────────────────────────────────────────

    /**
     * Zernio redirect balik ke sini setelah user authorize di platform.
     * Kita sync accounts lalu redirect ke step connect dengan flash message.
     */
    public function handleCallback(Request $request)
    {
        $user = $request->user();

        // Sync semua accounts dari Zernio ke database lokal
        $this->doSyncAccounts($user);

        return redirect()->route('onboarding.form')
            ->with('success', 'Akun berhasil dihubungkan!');
    }

    // ─── Step: Sync Accounts ─────────────────────────────────────────────────

    /**
     * Sync manual — dipanggil dari frontend tombol "Refresh" atau setelah callback.
     */
    public function syncAccounts(Request $request)
    {
        $user = $request->user();
        $synced = $this->doSyncAccounts($user);

        return response()->json([
            'success' => true,
            'accounts' => $synced,
        ]);
    }

    // ─── Step: Disconnect Account ────────────────────────────────────────────

    /**
     * Disconnect (soft delete) akun sosmed dari local DB.
     * Zernio tidak punya endpoint disconnect, jadi kita hanya hapus record lokal.
     */
    public function disconnectAccount(Request $request, SocialAccount $account)
    {
        if ($account->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Hapus dari Zernio terlebih dahulu
        $deleted = $this->zernio->deleteAccount($account->zernio_account_id);

        if (!$deleted) {
            return response()->json(['error' => 'Gagal memutus koneksi akun. Coba lagi.'], 500);
        }

        $account->delete();

        return response()->json(['success' => true]);
    }

    // ─── Internal helper ─────────────────────────────────────────────────────

    /**
     * Sync accounts dari Zernio ke tabel social_accounts.
     * Upsert berdasarkan zernio_account_id.
     */
    private function doSyncAccounts($user): array
    {
        $zernioAccounts = $this->zernio->listAccounts();
        $synced = [];

        foreach ($zernioAccounts as $account) {
            $record = SocialAccount::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'zernio_account_id' => $account['_id'],
                ],
                [
                    'platform' => $account['platform'],
                    'account_username' => $account['username'] ?? null,
                    'is_active' => true,
                    'connected_at' => now(),
                ]
            );

            $synced[] = $record;
        }

        return $synced;
    }
}