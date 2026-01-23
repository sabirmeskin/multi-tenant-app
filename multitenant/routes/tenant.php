<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
    'web',
])->group(function () {
    Route::get('/', function () {
        return 'This is your multi-tenant application. The id of the current tenant is ' . tenant('id');
    });

    // Auth & Settings (Guest/Public routes like login/register handled inside auth.php + middleware checks)
    require __DIR__ . '/auth.php';

    Route::get('/debug-auth', function () {
        return [
            'db_connection' => \Illuminate\Support\Facades\DB::connection()->getName(),
            'db_name' => \Illuminate\Support\Facades\DB::connection()->getDatabaseName(),
            'default_connection' => \Illuminate\Support\Facades\DB::getDefaultConnection(),
            'session_id' => session()->getId(),
            'auth_id' => auth()->id(),
            'user' => auth()->user(),
            'session_data' => session()->all(),
        ];
    });

    // Dashboard & Protected Routes
    Route::middleware(['auth'])->group(function () {
        Route::get('/dashboard', function () {
            return \Inertia\Inertia::render('dashboard');
        })->name('dashboard');

        require __DIR__ . '/settings.php';

        Route::resource('test-data', \App\Http\Controllers\Tenant\TestDataController::class)->names('tenant.test-data');
    });

    // Test route to verify database isolation
    Route::get('/test-connection', [\App\Http\Controllers\TenantTestController::class, 'index'])
        ->name('tenant.test');
});
