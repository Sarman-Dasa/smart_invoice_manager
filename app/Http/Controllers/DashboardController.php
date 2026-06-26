<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        $invoicesQuery = $user->invoices();

        $totalInvoices = (clone $invoicesQuery)->count();
        $paidInvoices = (clone $invoicesQuery)->paid()->count();
        $overdueInvoices = (clone $invoicesQuery)->overdue()->count();
        $pendingInvoices = (clone $invoicesQuery)->pending()->count();

        $totalClients = $user->clients()->count();

        $recentInvoices = $user->invoices()
            ->with('client')
            ->latest()
            ->take(5)
            ->get();

        $recentReminders = \App\Models\ReminderLog::whereHas('invoice', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with('invoice.client')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'clients' => [
                    'total' => $totalClients,
                ],
                'invoices' => [
                    'total' => $totalInvoices,
                    'paid' => $paidInvoices,
                    'overdue' => $overdueInvoices,
                    'pending' => $pendingInvoices,
                ]
            ],
            'recentInvoices' => $recentInvoices,
            'recentReminders' => $recentReminders,
        ]);
    }
}
