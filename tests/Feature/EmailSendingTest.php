<?php

namespace Tests\Feature;

use App\Jobs\SendPaymentReminderJob;
use App\Mail\PaymentReminderMail;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\ReminderLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class EmailSendingTest extends TestCase
{
    use RefreshDatabase;

    public function test_send_endpoint_dispatches_job(): void
    {
        Bus::fake();

        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        $invoice = Invoice::factory()->create(['user_id' => $user->id, 'client_id' => $client->id]);
        $reminder = ReminderLog::factory()->create(['invoice_id' => $invoice->id]);

        $response = $this->actingAs($user)->post(route('invoices.reminders.send', [$invoice->id, $reminder->id]));

        $response->assertRedirect(route('invoices.reminders.index', $invoice->id));

        Bus::assertDispatched(SendPaymentReminderJob::class, function ($job) use ($invoice, $reminder) {
            // Because we used dependency injection, properties might be accessible or we can just assert it was dispatched
            return true; 
        });
    }

    public function test_job_sends_email_and_updates_status(): void
    {
        Mail::fake();

        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id, 'email' => 'client@test.com']);
        $invoice = Invoice::factory()->create(['user_id' => $user->id, 'client_id' => $client->id]);
        $reminder = ReminderLog::factory()->create(['invoice_id' => $invoice->id, 'content' => 'Please pay me.']);

        $job = new SendPaymentReminderJob($invoice, $reminder);
        $job->handle();

        Mail::assertSent(PaymentReminderMail::class, function ($mail) use ($invoice) {
            return $mail->hasTo('client@test.com') && 
                   $mail->invoice->id === $invoice->id &&
                   $mail->content === 'Please pay me.';
        });

        $this->assertNotNull($reminder->fresh()->sent_at);
    }
}
