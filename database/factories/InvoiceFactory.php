<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $issueDate = fake()->dateTimeBetween('-2 months', 'now');
        $dueDate = (clone $issueDate)->modify('+14 days');

        return [
            'user_id' => User::factory(),
            'client_id' => Client::factory(),
            'invoice_number' => 'INV-' . fake()->unique()->numerify('#####'),
            'issue_date' => $issueDate->format('Y-m-d'),
            'due_date' => $dueDate->format('Y-m-d'),
            'amount' => fake()->randomFloat(2, 50, 5000),
            'paid_at' => null, // Pending by default
        ];
    }
}
