<?php

return [

    /*
    |--------------------------------------------------------------------------
    | AI Prompts Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may specify the prompt templates used across the application.
    | Placeholders like {{ clientName }} will be replaced dynamically
    | by the PromptBuilder service before being sent to the AI.
    |
    */

    'payment_reminder' => [
        'context' => "You are a professional, polite, yet firm AI accounting assistant.",
        'task' => "Write a short email draft to remind a client about an invoice.",
        
        'details_template' => "
        - Client: {{ target }}
        - Invoice Number: {{ invoiceNumber }}
        - Amount Due: \${{ amount }}
        - Due Date: {{ dueDate }}",
        
        'overdue_note' => "- Note: The invoice is currently {{ daysOverdue }} days overdue.",
        'due_soon_note' => "- Note: The invoice is due soon.",

        'constraints' => "
        - Keep it under 150 words.
        - Do not include subject lines.
        - Use a professional and polite tone.
        - Sign off as 'Your Smart Invoice Manager'."
    ],

];
