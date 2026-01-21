<?php

use Stancl\Tenancy\Database\Models\Tenant;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

// Create tenant
$tenant = Tenant::create([
    'data' => [
        'name' => 'Demo Tenant',
    ],
]);


echo "Tenant created with ID: {$tenant->id}\n";


// Create domain
$tenant->domains()->create([
    'domain' => 'demo.localhost',
]);

echo "Domain created: demo.localhost\n";

// Run migrations for this tenant
Artisan::call('tenants:migrate', [
    '--tenants' => [$tenant->id],
]);

echo "Migrations completed\n";

// Add test data
$tenant->run(function () use ($tenant) {
    DB::table('test_data')->insert([
        'message' => 'Welcome to Demo Tenant',
        'tenant_identifier' => $tenant->id,
        'created_at' => now(),
        'updated_at' => now(),
    ]);
});

echo "Test data inserted\n";
echo "SUCCESS! Tenant is ready.\n";
echo "Visit: http://demo.localhost:8000/test-connection\n";
