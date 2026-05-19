<?php

use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\ProfileController;
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

// ── Onboarding (auth + verified users who haven't finished setup) ─────────────
Route::middleware(['auth', 'verified'])->group(function () {

    // Single onboarding page (business profile + products in one view)
    Route::get('/onboarding', [OnboardingController::class, 'showOnboarding'])
        ->name('onboarding.form');

    // Business profile — POST saves and redirects back to onboarding.form
    Route::post('/onboarding/bisnis', [OnboardingController::class, 'storeBusinessProfile'])
        ->name('onboarding.business.store');

    // Products — POST saves and redirects back to onboarding.form
    Route::post('/onboarding/produk', [OnboardingController::class, 'storeProduct'])
        ->name('onboarding.product.store');

    Route::patch('/onboarding/produk/{product}', [OnboardingController::class, 'updateProduct'])
        ->name('onboarding.product.update');

    Route::delete('/onboarding/produk/{product}', [OnboardingController::class, 'deleteProduct'])
        ->name('onboarding.product.delete');

    // Final step — marks onboarding as complete and returns redirect URL
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