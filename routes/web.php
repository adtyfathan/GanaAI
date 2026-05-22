<?php

use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ZernioController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// ── Onboarding (auth + verified users) ───────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {

    // Single onboarding page (business profile + products + social connect)
    Route::get('/onboarding', [OnboardingController::class, 'showOnboarding'])
        ->name('onboarding.form');

    // Business profile
    Route::post('/onboarding/bisnis', [OnboardingController::class, 'storeBusinessProfile'])
        ->name('onboarding.business.store');

    // Products
    Route::post('/onboarding/produk', [OnboardingController::class, 'storeProduct'])
        ->name('onboarding.product.store');

    Route::patch('/onboarding/produk/{product}', [OnboardingController::class, 'updateProduct'])
        ->name('onboarding.product.update');

    Route::delete('/onboarding/produk/{product}', [OnboardingController::class, 'deleteProduct'])
        ->name('onboarding.product.delete');

    // ── Zernio OAuth — Social Media Connect (step 3 onboarding) ──────────────

    // Buat Social Set di Zernio (dipanggil sekali saat masuk step 3)
    Route::post('/onboarding/zernio/social-set', [ZernioController::class, 'createSocialSet'])
        ->name('onboarding.zernio.social-set');

    // Dapatkan OAuth URL per platform
    Route::post('/onboarding/zernio/connect-url', [ZernioController::class, 'getConnectUrl'])
        ->name('onboarding.zernio.connect-url');

    // Callback dari Zernio setelah user authorize — GET karena Zernio redirect ke sini
    Route::get('/onboarding/zernio/callback', [ZernioController::class, 'handleCallback'])
        ->name('onboarding.zernio.callback');

    // Sync accounts manual (tombol refresh di frontend)
    Route::post('/onboarding/zernio/sync', [ZernioController::class, 'syncAccounts'])
        ->name('onboarding.zernio.sync');

    // Disconnect akun sosmed
    Route::delete('/onboarding/zernio/accounts/{account}', [ZernioController::class, 'disconnectAccount'])
        ->name('onboarding.zernio.disconnect');

    // Show connect page (opsional, sebagai standalone page)
    Route::get('/onboarding/connect', [ZernioController::class, 'showConnect'])
        ->name('onboarding.connect');

    // ─────────────────────────────────────────────────────────────────────────

    // Final step — marks onboarding complete
    Route::post('/onboarding/selesai', [OnboardingController::class, 'completeOnboarding'])
        ->name('onboarding.complete');
});

// ── Dashboard (requires completed onboarding) ─────────────────────────────────
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', 'onboarding.complete'])->name('dashboard');

// ── Profile ───────────────────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';