<?php

namespace App\Services\AI;

use App\Models\Invoice;

class PromptBuilder
{
    /**
     * Build a prompt for generating a payment reminder.
     * 
     * @param Invoice $invoice
     * @return string
     */
    public function buildPaymentReminder(Invoice $invoice): string
    {
        $clientName = $invoice->client->name ?? 'Client';
        $companyName = $invoice->client->company_name ?? '';
        $amount = number_format($invoice->amount, 2);
        $dueDate = $invoice->due_date ? $invoice->due_date->format('F j, Y') : 'N/A';
        $invoiceNumber = $invoice->invoice_number;

        $target = $companyName ? "$clientName from $companyName" : $clientName;

        $daysOverdue = 0;
        if ($invoice->due_date && $invoice->due_date->isPast()) {
            $daysOverdue = now()->diffInDays($invoice->due_date);
        }

        $config = config('ai_prompts.payment_reminder');

        $context = $config['context'];
        $task = $config['task'];
        
        $details = str_replace(
            ['{{ target }}', '{{ invoiceNumber }}', '{{ amount }}', '{{ dueDate }}'],
            [$target, $invoiceNumber, $amount, $dueDate],
            $config['details_template']
        );

        if ($daysOverdue > 0) {
            $note = str_replace('{{ daysOverdue }}', $daysOverdue, $config['overdue_note']);
            $details .= "\n" . $note;
        } else {
            $details .= "\n" . $config['due_soon_note'];
        }

        $constraints = $config['constraints'];

        return "{$context}\n\nTask: {$task}\n\nDetails: {$details}\n\nConstraints: {$constraints}";
    }
}
