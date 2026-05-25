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
Route::middleware(['auth', 'verified', 'onboarding.redirect'])
    ->prefix('onboarding')
    ->name('onboarding.')
    ->group(function () {

        // Single onboarding page (business profile + products + social connect)
        Route::get('/', [OnboardingController::class, 'showOnboarding'])
            ->name('form');

        // Business profile
        Route::post('/bisnis', [OnboardingController::class, 'storeBusinessProfile'])
            ->name('business.store');

        // Products
        Route::prefix('produk')->name('product.')->group(function () {
            Route::post('/', [OnboardingController::class, 'storeProduct'])
                ->name('store');
            Route::patch('/{product}', [OnboardingController::class, 'updateProduct'])
                ->name('update');
            Route::delete('/{product}', [OnboardingController::class, 'deleteProduct'])
                ->name('delete');
        });

        // ── Zernio OAuth — Social Media Connect (step 3 onboarding) ──────────
        Route::prefix('zernio')->name('zernio.')->group(function () {

            // Buat Social Set di Zernio (dipanggil sekali saat masuk step 3)
            Route::post('/social-set', [ZernioController::class, 'createSocialSet'])
                ->name('social-set');

            // Dapatkan OAuth URL per platform
            Route::post('/connect-url', [ZernioController::class, 'getConnectUrl'])
                ->name('connect-url');

            // Sync accounts manual (tombol refresh di frontend)
            Route::post('/sync', [ZernioController::class, 'syncAccounts'])
                ->name('sync');

            // Disconnect akun sosmed
            Route::delete('/accounts/{account}', [ZernioController::class, 'disconnectAccount'])
                ->name('disconnect');
        });
        // ─────────────────────────────────────────────────────────────────────
    
        // Final step — marks onboarding complete
        Route::post('/selesai', [OnboardingController::class, 'completeOnboarding'])
            ->name('complete');
    });

// ── Dashboard (requires completed onboarding) ─────────────────────────────────
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', 'onboarding.complete'])->name('dashboard');

// ── Profile ───────────────────────────────────────────────────────────────────
Route::middleware('auth')
    ->prefix('profile')
    ->name('profile.')
    ->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

Route::get('/onboarding/zernio/callback', [ZernioController::class, 'handleCallback'])
    ->middleware(['auth', 'verified'])
    ->name('onboarding.zernio.callback');

require __DIR__ . '/auth.php';