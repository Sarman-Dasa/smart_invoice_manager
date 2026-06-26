<?php

use App\Http\Controllers\AiController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReminderLogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::middleware('auth')->group(function () {
    
    // Profile Management
    Route::controller(ProfileController::class)->prefix('profile')->name('profile.')->group(function () {
        Route::get('/', 'edit')->name('edit');
        Route::patch('/', 'update')->name('update');
        Route::delete('/', 'destroy')->name('destroy');
    });

    // Client Management
    Route::resource('clients', ClientController::class)->except(['show']);

    // Invoice Management (Custom Routes)
    Route::prefix('invoices')->group(function () {
        Route::post('{invoice}/mark-as-paid', [InvoiceController::class, 'markAsPaid'])->name('invoices.markAsPaid');
        
        // AI Integration
        Route::get('{invoice}/ai/stream-reminder', [AiController::class, 'streamReminder'])->name('ai.stream-reminder');
        
        // Reminder History (Custom Routes)
        Route::post('{invoice}/reminders/{reminder}/send', [ReminderLogController::class, 'send'])->name('invoices.reminders.send');
    });

    // Invoice & Reminder Resources
    Route::resource('invoices', InvoiceController::class)->except(['show']);
    Route::resource('invoices.reminders', ReminderLogController::class)->except(['create', 'show']);

    // Global Reminders
    Route::get('reminders', [ReminderLogController::class, 'globalIndex'])->name('reminders.index');
});

require __DIR__.'/auth.php';
