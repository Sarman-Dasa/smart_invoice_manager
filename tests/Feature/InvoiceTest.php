<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_their_invoices(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        $invoice = Invoice::factory()->create(['user_id' => $user->id, 'client_id' => $client->id]);

        $response = $this->actingAs($user)->get(route('invoices.index'));

        $response->assertStatus(200);
        $response->assertSee($invoice->invoice_number);
    }

    public function test_invoice_number_is_auto_generated_on_creation(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->post(route('invoices.store'), [
            'client_id' => $client->id,
            'issue_date' => now()->format('Y-m-d'),
            'due_date' => now()->addDays(14)->format('Y-m-d'),
            'amount' => 1500.50,
        ]);

        $response->assertRedirect(route('invoices.index'));

        $invoice = Invoice::first();
        $this->assertNotNull($invoice);
        $this->assertStringStartsWith('INV-', $invoice->invoice_number);
        $this->assertEquals(1500.50, $invoice->amount);
    }

    public function test_user_can_update_their_invoice(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        $invoice = Invoice::factory()->create(['user_id' => $user->id, 'client_id' => $client->id, 'amount' => 100]);

        $response = $this->actingAs($user)->put(route('invoices.update', $invoice->id), [
            'client_id' => $client->id,
            'issue_date' => $invoice->issue_date,
            'due_date' => $invoice->due_date,
            'amount' => 500,
        ]);

        $response->assertRedirect(route('invoices.index'));
        $this->assertDatabaseHas('invoices', [
            'id' => $invoice->id,
            'amount' => 500,
        ]);
    }

    public function test_user_cannot_update_other_users_invoice(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $client2 = Client::factory()->create(['user_id' => $user2->id]);
        $invoice2 = Invoice::factory()->create(['user_id' => $user2->id, 'client_id' => $client2->id, 'amount' => 100]);

        $response = $this->actingAs($user1)->put(route('invoices.update', $invoice2->id), [
            'client_id' => $client2->id,
            'issue_date' => $invoice2->issue_date,
            'due_date' => $invoice2->due_date,
            'amount' => 500,
        ]);

        $response->assertStatus(403);
        $this->assertEquals(100, $invoice2->fresh()->amount);
    }
}
