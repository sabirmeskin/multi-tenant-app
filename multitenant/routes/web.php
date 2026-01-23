<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Admin\TenantController;

Route::domain('localhost')->group(function () {
    Route::get('/', function () {
        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    })->name('home');

    // Dashboard route (required by Laravel starter kit)
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');
    });

    // Admin Routes (Central Domain Only)
    Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
        // Tenant Management
        Route::resource('tenants', TenantController::class);
    });

    require __DIR__ . '/auth.php';
    require __DIR__ . '/settings.php';
});
