<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::resource('clients', \App\Http\Controllers\ClientController::class);
    
    Route::post('invoices/{invoice}/mark-as-paid', [\App\Http\Controllers\InvoiceController::class, 'markAsPaid'])->name('invoices.markAsPaid');
    Route::resource('invoices', \App\Http\Controllers\InvoiceController::class);
    
    // AI Routes
    Route::get('invoices/{invoice}/ai/stream-reminder', [\App\Http\Controllers\AiController::class, 'streamReminder'])->name('ai.stream-reminder');
    
    // Global Reminders
    Route::get('reminders', [\App\Http\Controllers\ReminderLogController::class, 'globalIndex'])->name('reminders.index');
    
    Route::post('invoices/{invoice}/reminders/{reminder}/send', [\App\Http\Controllers\ReminderLogController::class, 'send'])->name('invoices.reminders.send');
    Route::resource('invoices.reminders', \App\Http\Controllers\ReminderLogController::class)->except(['create', 'store', 'show']);
});

require __DIR__.'/auth.php';
