<?php

namespace App\Jobs;

use App\Mail\PaymentReminderMail;
use App\Models\Invoice;
use App\Models\ReminderLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendPaymentReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 60;

    protected Invoice $invoice;
    protected ReminderLog $reminderLog;

    /**
     * Create a new job instance.
     */
    public function __construct(Invoice $invoice, ReminderLog $reminderLog)
    {
        $this->invoice = $invoice;
        $this->reminderLog = $reminderLog;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if (!$this->invoice->client || !$this->invoice->client->email) {
            Log::error('Cannot send payment reminder: Client email is missing.', [
                'invoice_id' => $this->invoice->id,
            ]);
            return;
        }

        Mail::to($this->invoice->client->email)
            ->send(new PaymentReminderMail($this->invoice, $this->reminderLog->content));

        // Note: we might update sent_at here, or in the controller before dispatching.
        // It's usually better in the job so it only updates if sending succeeds.
        $this->reminderLog->update(['sent_at' => now()]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(Throwable $exception): void
    {
        Log::error('Payment reminder job failed.', [
            'invoice_id' => $this->invoice->id,
            'reminder_log_id' => $this->reminderLog->id,
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}
