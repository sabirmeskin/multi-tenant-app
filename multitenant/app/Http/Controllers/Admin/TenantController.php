<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Stancl\Tenancy\Database\Models\Tenant;
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
        $tenants = Tenant::with('domains')->get()->map(function ($tenant) {
            return [
                'id' => $tenant->id,
                'created_at' => $tenant->created_at->format('Y-m-d H:i'),
                'domains' => $tenant->domains->pluck('domain')->toArray(),
                'data' => $tenant->data,
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:255|unique:domains,domain',
        ]);

        DB::beginTransaction();

        try {
            // Create the tenant
            $tenant = Tenant::create([
                'data' => [
                    'name' => $validated['name'],
                ],
            ]);

            // Create the domain
            $tenant->domains()->create([
                'domain' => $validated['domain'],
            ]);

            // Run tenant migrations
            \Artisan::call('tenants:migrate', [
                '--tenants' => [$tenant->id],
            ]);

            // Add test data to tenant database
            $tenant->run(function () use ($tenant, $validated) {
                DB::table('test_data')->insert([
                    'message' => 'Welcome to ' . $validated['name'],
                    'tenant_identifier' => $tenant->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            });

            DB::commit();

            return redirect()->route('admin.tenants.index')
                ->with('success', 'Tenant created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

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
        return Inertia::render('Admin/Tenants/Edit', [
            'tenant' => [
                'id' => $tenant->id,
                'name' => $tenant->data['name'] ?? '',
                'domains' => $tenant->domains->pluck('domain')->toArray(),
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
