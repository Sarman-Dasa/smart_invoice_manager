<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_their_clients(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('clients.index'));

        $response->assertStatus(200);
        $response->assertSee($client->name);
    }

    public function test_user_cannot_view_other_users_clients(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $client2 = Client::factory()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1)->get(route('clients.index'));

        $response->assertStatus(200);
        $response->assertDontSee($client2->name);
    }

    public function test_user_can_create_a_client(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('clients.store'), [
            'name' => 'Acme Corp',
            'email' => 'contact@acme.com',
            'phone' => '1234567890',
            'address' => '123 Acme St',
        ]);

        $response->assertRedirect(route('clients.index'));
        $this->assertDatabaseHas('clients', [
            'user_id' => $user->id,
            'name' => 'Acme Corp',
            'email' => 'contact@acme.com',
        ]);
    }

    public function test_user_can_update_their_client(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->put(route('clients.update', $client->id), [
            'name' => 'Acme Updated',
            'email' => 'new@acme.com',
            'phone' => '0987654321',
            'address' => '456 New St',
        ]);

        $response->assertRedirect(route('clients.index'));
        $this->assertDatabaseHas('clients', [
            'id' => $client->id,
            'name' => 'Acme Updated',
        ]);
    }

    public function test_user_cannot_update_other_users_client(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $client2 = Client::factory()->create(['user_id' => $user2->id, 'name' => 'Original Name']);

        $response = $this->actingAs($user1)->put(route('clients.update', $client2->id), [
            'name' => 'Hacked Name',
            'email' => 'hacked@acme.com',
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseHas('clients', [
            'id' => $client2->id,
            'name' => 'Original Name',
        ]);
    }
}
