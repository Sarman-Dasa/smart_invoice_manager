<?php

namespace App\Providers;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\ReminderLog;
use App\Policies\ClientPolicy;
use App\Policies\InvoicePolicy;
use App\Policies\ReminderLogPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Client::class, ClientPolicy::class);
        Gate::policy(Invoice::class, InvoicePolicy::class);
        Gate::policy(ReminderLog::class, ReminderLogPolicy::class);

        Vite::prefetch(concurrency: 3);

        Password::defaults(function () {
            $rule = Password::min(8)->letters()->mixedCase()->numbers();

            return app()->isProduction()
                        ? $rule->uncompromised()
                        : $rule;
        });
    }
}
