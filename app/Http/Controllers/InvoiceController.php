<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $invoices = $request->user()->invoices()
            ->with('client:id,name,company_name') // Eager load client
            ->withCount('reminderLogs')
            ->when($search, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('invoice_number', 'like', "%{$search}%")
                      ->orWhereHas('client', function($cq) use ($search) {
                          $cq->where('name', 'like', "%{$search}%")
                             ->orWhere('company_name', 'like', "%{$search}%");
                      });
                });
            })
            ->when($status, function ($query, $status) {
                if ($status === 'paid') return $query->paid();
                if ($status === 'pending') return $query->pending();
                if ($status === 'overdue') return $query->overdue();
                return $query;
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('Invoices/Create', [
            'clients' => $request->user()->clients()->select('id', 'name', 'company_name')->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInvoiceRequest $request)
    {
        $request->user()->invoices()->create($request->validated());

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        return Inertia::render('Invoices/Edit', [
            'invoice' => $invoice,
            'clients' => $request->user()->clients()->select('id', 'name', 'company_name')->get()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInvoiceRequest $request, Invoice $invoice)
    {
        $this->authorize('update', $invoice);

        $invoice->update($request->validated());

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice updated successfully.');
    }

    /**
     * Mark the invoice as paid.
     */
    public function markAsPaid(Request $request, Invoice $invoice)
    {
        $this->authorize('update', $invoice);

        $invoice->update(['paid_at' => now()]);

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice marked as paid.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Invoice $invoice)
    {
        $this->authorize('delete', $invoice);

        $invoice->delete();

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice deleted successfully.');
    }
}
