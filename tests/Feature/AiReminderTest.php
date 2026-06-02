<?php

namespace Tests\Feature;

use App\Contracts\AiGeneratorInterface;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiReminderTest extends TestCase
{
    use RefreshDatabase;

    public function test_streaming_endpoint_returns_sse_chunks_and_saves_draft(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $user->id]);
        $invoice = Invoice::factory()->create(['user_id' => $user->id, 'client_id' => $client->id]);

        // Mock the AI Generator Interface
        $this->mock(AiGeneratorInterface::class, function ($mock) {
            $generator = function () {
                yield "Hello";
                yield " World";
            };
            $mock->shouldReceive('stream')->once()->andReturn($generator());
        });

        // Hitting the SSE endpoint might be tricky to test with standard HTTP tests because it streams.
        // However, Laravel's TestResponse captures output buffers.
        $response = $this->actingAs($user)->get(route('ai.stream-reminder', $invoice->id));

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/event-stream; charset=UTF-8');
        
        // The controller calls ob_end_clean() to disable buffering for SSE.
        // During testing, this destroys the buffer that PHPUnit uses to capture output.
        // By creating an extra dummy buffer here, the controller cleans the dummy,
        // and our outer buffer successfully captures the echoed SSE data!
        ob_start(); // Outer buffer to capture output
        ob_start(); // Dummy buffer for the controller to clean
        
        $response->baseResponse->sendContent();
        
        $output = ob_get_clean();

        $this->assertStringContainsString('data: {"text":"Hello"}', $output);
        $this->assertStringContainsString('data: {"text":" World"}', $output);
        $this->assertStringContainsString('event: end', $output);

        // Assert the draft was automatically saved
        $this->assertDatabaseHas('reminder_logs', [
            'invoice_id' => $invoice->id,
            'content' => 'Hello World',
            'sent_at' => null,
        ]);
    }

    public function test_user_cannot_generate_reminder_for_others_invoice(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $client2 = Client::factory()->create(['user_id' => $user2->id]);
        $invoice2 = Invoice::factory()->create(['user_id' => $user2->id, 'client_id' => $client2->id]);

        $response = $this->actingAs($user1)->get(route('ai.stream-reminder', $invoice2->id));

        $response->assertStatus(403);
    }
}
