<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Contracts\AiGeneratorInterface;
use App\Services\AI\GeminiAiService;

class AiServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(AiGeneratorInterface::class, GeminiAiService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
