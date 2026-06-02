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

        // Optimized query: Single database hit to compute all invoice aggregations
        $invoiceStats = clone $user->invoices()
            ->selectRaw('
                COUNT(id) as total,
                SUM(CASE WHEN paid_at IS NOT NULL THEN 1 ELSE 0 END) as paid,
                SUM(CASE WHEN paid_at IS NULL AND due_date < ? THEN 1 ELSE 0 END) as overdue,
                SUM(CASE WHEN paid_at IS NULL AND (due_date >= ? OR due_date IS NULL) THEN 1 ELSE 0 END) as pending
            ', [$today, $today])
            ->first();

        $totalClients = $user->clients()->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'clients' => [
                    'total' => $totalClients,
                ],
                'invoices' => [
                    'total' => (int) ($invoiceStats->total ?? 0),
                    'paid' => (int) ($invoiceStats->paid ?? 0),
                    'overdue' => (int) ($invoiceStats->overdue ?? 0),
                    'pending' => (int) ($invoiceStats->pending ?? 0),
                ]
            ]
        ]);
    }
}
