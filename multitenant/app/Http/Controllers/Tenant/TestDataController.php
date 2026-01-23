<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\TestData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestDataController extends Controller
{
    public function index()
    {
        $data = TestData::latest()->get();
        return Inertia::render('Tenant/TestData/Index', [
            'data' => $data,
        ]);
    }

    public function create()
    {
        return Inertia::render('Tenant/TestData/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:255',
        ]);

        $validated['tenant_identifier'] = tenant('id');

        TestData::create($validated);

        return redirect()->route('tenant.test-data.index')
            ->with('success', 'Data created successfully.');
    }

    public function edit(TestData $testDatum)
    {
        return Inertia::render('Tenant/TestData/Edit', [
            'datum' => $testDatum,
        ]);
    }

    public function update(Request $request, TestData $testDatum)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:255',
        ]);

        $testDatum->update($validated);

        return redirect()->route('tenant.test-data.index')
            ->with('success', 'Data updated successfully.');
    }

    public function destroy(TestData $testDatum)
    {
        $testDatum->delete();

        return redirect()->route('tenant.test-data.index')
            ->with('success', 'Data deleted successfully.');
    }
}
