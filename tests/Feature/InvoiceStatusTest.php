<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_invoice_status_is_paid_when_paid_at_is_set(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        
        $invoice = Invoice::factory()->create([
            'user_id' => $user->id,
            'client_id' => $client->id,
            'due_date' => now()->addDays(5)->format('Y-m-d'),
            'paid_at' => now(),
        ]);

        $this->assertEquals('Paid', $invoice->status);
    }

    public function test_invoice_status_is_overdue_when_past_due_date(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        
        $invoice = Invoice::factory()->create([
            'user_id' => $user->id,
            'client_id' => $client->id,
            'due_date' => now()->subDays(1)->format('Y-m-d'),
            'paid_at' => null,
        ]);

        $this->assertEquals('Overdue', $invoice->status);
    }

    public function test_invoice_status_is_pending_when_before_due_date_and_not_paid(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        
        $invoice = Invoice::factory()->create([
            'user_id' => $user->id,
            'client_id' => $client->id,
            'due_date' => now()->addDays(1)->format('Y-m-d'),
            'paid_at' => null,
        ]);

        $this->assertEquals('Pending', $invoice->status);
    }

    public function test_user_can_mark_invoice_as_paid_via_endpoint(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        $invoice = Invoice::factory()->create([
            'user_id' => $user->id, 
            'client_id' => $client->id,
            'paid_at' => null,
        ]);

        $response = $this->actingAs($user)->post(route('invoices.markAsPaid', $invoice->id));

        $response->assertRedirect();
        $this->assertNotNull($invoice->fresh()->paid_at);
        $this->assertEquals('Paid', $invoice->fresh()->status);
    }
}
