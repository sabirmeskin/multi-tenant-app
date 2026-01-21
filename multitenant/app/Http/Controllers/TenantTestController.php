<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TenantTestController extends Controller
{
    /**
     * Display tenant connection test page.
     */
    public function index(): Response
    {
        $currentTenant = tenant();

        // Get all test data from the current tenant's database
        $testData = DB::table('test_data')->get();

        // Get database connection info
        $databaseInfo = [
            'database' => DB::connection()->getDatabaseName(),
            'connection' => DB::connection()->getName(),
        ];

        return Inertia::render('Tenant/TestConnection', [
            'tenant' => $currentTenant ? [
                'id' => $currentTenant->id,
                'name' => $currentTenant->name ?? 'Unknown',
                'domains' => $currentTenant->domains->pluck('domain')->toArray(),
            ] : null,
            'database_info' => $databaseInfo,
            'test_data' => $testData,
        ]);
    }
}
