<?php

namespace App\Services\AI;

use App\Contracts\AiGeneratorInterface;
use App\Exceptions\AiGenerationException;
use Generator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GeminiAiService implements AiGeneratorInterface
{
    protected string $apiKey;
    protected string $model;
    protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key');
        if (empty($this->apiKey)) {
            throw new AiGenerationException('Google Gemini API key is not configured.');
        }
        $this->model = config('services.gemini.model', 'gemini-flash-latest');
    }

    /**
     * Generate a complete response string.
     */
    public function generate(string $prompt): string
    {
        $url = "{$this->baseUrl}/{$this->model}:generateContent?key={$this->apiKey}";

        $payload = $this->buildPayload($prompt);

        try {
            $response = Http::timeout(60)->post($url, $payload);

            if ($response->failed()) {
                Log::error('Gemini API Error', ['response' => $response->body()]);
                throw new AiGenerationException('Failed to generate content from Gemini API.');
            }

            $data = $response->json();
            
            return $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
            
        } catch (\Exception $e) {
            Log::error('Gemini API Exception', ['message' => $e->getMessage()]);
            throw new AiGenerationException('An error occurred while generating content: ' . $e->getMessage());
        }
    }

    /**
     * Stream the response back in chunks using a Generator.
     */
    public function stream(string $prompt): Generator
    {
        $url = "{$this->baseUrl}/{$this->model}:streamGenerateContent?alt=sse&key={$this->apiKey}";
        
        $payload = $this->buildPayload($prompt);

        try {
            $response = Http::withOptions([
                'stream' => true,
            ])->timeout(60)->post($url, $payload);

            if ($response->failed()) {
                $errorBody = $response->body();
                $status = $response->status();
                Log::error('Gemini API Streaming Error', ['status' => $status, 'response' => $errorBody]);
                
                $errorMessage = 'Failed to stream content from Gemini API.';
                
                if ($status === 400) {
                    $errorMessage = 'Invalid API Request. Please check your prompt or API key configuration.';
                } elseif ($status === 401 || $status === 403) {
                    $errorMessage = 'Invalid API key or authentication failed.';
                } elseif ($status === 429) {
                    $errorMessage = 'API quota exceeded. Please try again later.';
                } elseif ($status === 408 || $status === 504 || $status === 503) {
                    $errorMessage = 'Network timeout or service unavailable. Please try again.';
                } else {
                    $decoded = json_decode($errorBody, true);
                    if (isset($decoded['error']['message'])) {
                        $errorMessage = $decoded['error']['message'];
                    }
                }
                
                throw new AiGenerationException($errorMessage);
            }

            $stream = $response->toPsrResponse()->getBody();

            $buffer = '';
            while (!$stream->eof()) {
                $buffer .= $stream->read(1024);
                
                // Normalize \r\n to \n to avoid boundary splitting issues
                $buffer = str_replace("\r\n", "\n", $buffer);

                // Process lines ending in \n\n
                while (($pos = strpos($buffer, "\n\n")) !== false) {
                    $chunk = substr($buffer, 0, $pos);
                    $buffer = substr($buffer, $pos + 2); // skip \n\n
                    
                    $lines = explode("\n", $chunk);
                    foreach ($lines as $line) {
                        if (Str::startsWith($line, 'data: ')) {
                            $jsonData = substr($line, 6);
                            
                            if (trim($jsonData) === '[DONE]') {
                                break 3;
                            }

                            $data = json_decode($jsonData, true);
                            if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                                yield $data['candidates'][0]['content']['parts'][0]['text'];
                            }
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('Gemini API Streaming Exception', ['message' => $e->getMessage()]);
            throw new AiGenerationException('An error occurred while streaming content: ' . $e->getMessage());
        }
    }

    /**
     * Build the standard payload for Gemini API.
     */
    protected function buildPayload(string $prompt): array
    {
        return [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ],
            // Optional generation config
            'generationConfig' => [
                'temperature' => 0.7,
                'topK' => 40,
                'topP' => 0.95,
            ]
        ];
    }
}
