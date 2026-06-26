<?php

namespace App\Http\Controllers;

use App\Contracts\AiGeneratorInterface;
use App\Models\Invoice;
use App\Models\ReminderLog;
use App\Services\AI\PromptBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AiController extends Controller
{
    public function streamReminder(
        Request $request, 
        Invoice $invoice, 
        AiGeneratorInterface $ai, 
        PromptBuilder $promptBuilder
    ) {
        // Ensure user owns invoice
        Gate::authorize('view', $invoice);

        $prompt = $promptBuilder->buildPaymentReminder($invoice);

        return new StreamedResponse(function () use ($ai, $prompt, $invoice) {
            // Needed to prevent buffering
            if (ob_get_level() > 0) {
                ob_end_clean();
            }

            $fullContent = '';

            try {
                $stream = $ai->stream($prompt);

                foreach ($stream as $chunk) {
                    if (connection_aborted()) {
                        break;
                    }

                    $fullContent .= $chunk;

                    // Send chunk as SSE
                    echo "data: " . json_encode(['text' => $chunk]) . "\n\n";
                    flush();
                }

                // Stream fully completed without aborting
                if (!connection_aborted()) {
                    if (empty(trim($fullContent))) {
                        echo "event: error\ndata: " . json_encode(['message' => 'Empty AI response received. Please try again.']) . "\n\n";
                        flush();
                    } else {
                        echo "event: end\ndata: {}\n\n";
                        flush();
                    }
                }

            } catch (\Exception $e) {
                echo "event: error\ndata: " . json_encode(['message' => 'AI Generation Failed: ' . $e->getMessage()]) . "\n\n";
                flush();
            }
        }, 200, [
            'Cache-Control' => 'no-cache',
            'Content-Type' => 'text/event-stream',
            'X-Accel-Buffering' => 'no', // Disable Nginx buffering
        ]);
    }
}
