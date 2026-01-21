<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class TenantController extends Controller
{
    /**
     * Display a listing of tenants.
     */
    public function index(): Response
    {
        $Domain = config('tenancy.domain_model');

        $tenants = Tenant::all()->map(function ($tenant) use ($Domain) {
            // Get domains directly from the Domain model
            $domains = $Domain::where('tenant_id', $tenant->id)->pluck('domain')->toArray();

            return [
                'id' => $tenant->id,
                'created_at' => $tenant->created_at->format('Y-m-d H:i'),
                'domains' => $domains,
                'data' => [
                    'name' => $tenant->name,
                ],
            ];
        });

        return Inertia::render('Admin/Tenants/Index', [
            'tenants' => $tenants,
        ]);
    }

    /**
     * Show the form for creating a new tenant.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Tenants/Create');
    }

    /**
     * Store a newly created tenant in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        \Log::info('Tenant creation started', $request->all());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:255|unique:domains,domain',
        ]);

        \Log::info('Validation passed', $validated);

        DB::beginTransaction();

        try {
            $Domain = config('tenancy.domain_model');

            // Create the tenant with name in data
            $tenant = Tenant::create([
                'id' => \Illuminate\Support\Str::uuid()->toString(),
            ]);
            $tenant->name = $validated['name'];  // This stores in data JSONB via magic setter
            $tenant->save();

            \Log::info('Tenant created', ['id' => $tenant->id, 'name' => $tenant->name]);

            // Create the domain directly
            $domain = new $Domain();
            $domain->domain = $validated['domain'];
            $domain->tenant_id = $tenant->id;
            $domain->save();

            \Log::info('Domain created', ['domain' => $domain->domain]);

            // Run tenant migrations
            \Artisan::call('tenants:migrate', [
                '--tenants' => [$tenant->id],
            ]);

            \Log::info('Migrations completed');

            // Add test data to tenant database
            $tenant->run(function () use ($tenant, $validated) {
                DB::table('test_data')->insert([
                    'message' => 'Welcome to ' . $validated['name'],
                    'tenant_identifier' => $tenant->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            });

            \Log::info('Test data inserted');

            DB::commit();

            \Log::info('Transaction committed successfully');

            return redirect()->route('admin.tenants.index')
                ->with('success', 'Tenant created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

            \Log::error('Tenant creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'error' => 'Failed to create tenant: ' . $e->getMessage(),
            ])->withInput();
        }
    }

    /**
     * Show the form for editing the specified tenant.
     */
    public function edit(Tenant $tenant): Response
    {
        $Domain = config('tenancy.domain_model');
        $domains = $Domain::where('tenant_id', $tenant->id)->pluck('domain')->toArray();

        return Inertia::render('Admin/Tenants/Edit', [
            'tenant' => [
                'id' => $tenant->id,
                'name' => $tenant->data['name'] ?? '',
                'domains' => $domains,
            ],
        ]);
    }

    /**
     * Update the specified tenant in storage.
     */
    public function update(Request $request, Tenant $tenant): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $tenant->update([
            'data' => [
                'name' => $validated['name'],
            ],
        ]);

        return redirect()->route('admin.tenants.index')
            ->with('success', 'Tenant updated successfully!');
    }

    /**
     * Remove the specified tenant from storage.
     */
    public function destroy(Tenant $tenant): RedirectResponse
    {
        try {
            // Delete tenant database and all data
            $tenant->delete();

            return redirect()->route('admin.tenants.index')
                ->with('success', 'Tenant deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Failed to delete tenant: ' . $e->getMessage(),
            ]);
        }
    }
}
