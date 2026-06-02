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

        $context = "You are a professional, polite, yet firm AI accounting assistant.";
        $task = "Write a short email draft to remind a client about an invoice.";
        
        $details = "
        - Client: {$target}
        - Invoice Number: {$invoiceNumber}
        - Amount Due: \${$amount}
        - Due Date: {$dueDate}";

        if ($daysOverdue > 0) {
            $details .= "\n- Note: The invoice is currently {$daysOverdue} days overdue.";
        } else {
            $details .= "\n- Note: The invoice is due soon.";
        }

        $constraints = "
        - Keep it under 150 words.
        - Do not include subject lines.
        - Use a professional and polite tone.
        - Sign off as 'Your Smart Invoice Manager'.";

        return "{$context}\n\nTask: {$task}\n\nDetails: {$details}\n\nConstraints: {$constraints}";
    }
}
