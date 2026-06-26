<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\ReminderLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReminderLogController extends Controller
{
    /**
     * Display a global listing of the resource for all invoices of the user.
     */
    public function globalIndex(Request $request)
    {
        $user = $request->user();
        
        $reminders = ReminderLog::whereHas('invoice', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with('invoice.client')
        ->latest()
        ->paginate(15);

        return Inertia::render('Reminders/GlobalIndex', [
            'reminders' => $reminders,
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Invoice $invoice)
    {
        // Ensure the user owns this invoice
        $this->authorize('view', $invoice);

        $reminders = $invoice->reminderLogs()->latest()->paginate(10);

        return Inertia::render('Reminders/Index', [
            'invoice' => $invoice,
            'reminders' => $reminders,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Invoice $invoice)
    {
        $this->authorize('update', $invoice);

        $validated = $request->validate([
            'content' => ['required', 'string'],
            'send_email' => ['boolean']
        ]);

        $reminder = $invoice->reminderLogs()->create([
            'content' => $validated['content'],
            'sent_at' => $request->boolean('send_email') ? now() : null,
        ]);

        if ($request->boolean('send_email')) {
            \App\Jobs\SendPaymentReminderJob::dispatch($invoice, $reminder);
            return back()->with('success', 'Reminder saved and queued for sending.');
        }

        return back()->with('success', 'Reminder drafted successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Invoice $invoice, ReminderLog $reminder)
    {
        $this->authorize('view', [$reminder, $invoice]);

        // Only allow editing if not sent yet
        if ($reminder->sent_at !== null) {
            return redirect()->route('invoices.reminders.index', $invoice->id)
                ->with('error', 'Cannot edit a reminder that has already been sent.');
        }

        return Inertia::render('Reminders/Edit', [
            'invoice' => $invoice,
            'reminder' => $reminder,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice, ReminderLog $reminder)
    {
        $this->authorize('update', [$reminder, $invoice]);

        if ($reminder->sent_at !== null) {
            return back()->with('error', 'Cannot edit a sent reminder.');
        }

        $validated = $request->validate([
            'content' => ['required', 'string'],
        ]);

        $reminder->update($validated);

        return redirect()->route('invoices.reminders.index', $invoice->id)
            ->with('success', 'Draft updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Invoice $invoice, ReminderLog $reminder)
    {
        $this->authorize('delete', [$reminder, $invoice]);

        $reminder->delete();

        return redirect()->route('invoices.reminders.index', $invoice->id)
            ->with('success', 'Reminder deleted successfully.');
    }

    /**
     * Dispatch the job to send the email.
     */
    public function send(Request $request, Invoice $invoice, ReminderLog $reminder)
    {
        $this->authorize('send', [$reminder, $invoice]);

        if ($reminder->sent_at !== null) {
            return back()->with('error', 'This reminder has already been sent.');
        }

        // Update the sent_at immediately for optimistic UI updates
        $reminder->update(['sent_at' => now()]);

        \App\Jobs\SendPaymentReminderJob::dispatch($invoice, $reminder);

        return back()->with('success', 'Payment reminder queued for sending.');
    }
}
