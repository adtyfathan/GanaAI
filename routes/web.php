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

// Onboarding routes (after signup)
Route::middleware(['auth', 'verified'])->group(function () {
    // Business profile setup
    Route::get('/onboarding/bisnis', [OnboardingController::class, 'showBusinessForm'])
        ->name('onboarding.business.form');
    Route::post('/onboarding/bisnis', [OnboardingController::class, 'storeBusinessProfile'])
        ->name('onboarding.business.store');

    // Product setup
    Route::get('/onboarding/produk', [OnboardingController::class, 'showProductForm'])
        ->name('onboarding.product.form');
    Route::post('/onboarding/produk', [OnboardingController::class, 'storeProduct'])
        ->name('onboarding.product.store');
    Route::patch('/onboarding/produk/{product}', [OnboardingController::class, 'updateProduct'])
        ->name('onboarding.product.update');
    Route::delete('/onboarding/produk/{product}', [OnboardingController::class, 'deleteProduct'])
        ->name('onboarding.product.delete');

    // Complete onboarding
    Route::post('/onboarding/selesai', [OnboardingController::class, 'completeOnboarding'])
        ->name('onboarding.complete');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', 'onboarding.complete'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
