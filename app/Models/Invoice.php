<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Invoice extends Model
{
    use HasFactory;
    protected $fillable = [
        'client_id',
        'issue_date',
        'due_date',
        'amount',
        'notes',
        'paid_at',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
        'paid_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    protected $appends = [
        'status'
    ];

    public function save(array $options = [])
    {
        if (!$this->exists && empty($this->invoice_number)) {
            return DB::transaction(function () use ($options) {
                $lastInvoice = self::query()->where('user_id', $this->user_id)
                    ->lockForUpdate()
                    ->latest('id')
                    ->first();

                if ($lastInvoice && preg_match('/INV-(\d+)/', $lastInvoice->invoice_number, $matches)) {
                    $nextId = (int) $matches[1] + 1;
                } else {
                    $nextId = 1;
                }

                $this->invoice_number = 'INV-' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

                return parent::save($options);
            });
        }

        return parent::save($options);
    }

    /**
     * Scope a query to only include paid invoices.
     */
    public function scopePaid($query)
    {
        return $query->whereNotNull('paid_at');
    }

    /**
     * Scope a query to only include pending invoices (not paid, not overdue).
     */
    public function scopePending($query)
    {
        return $query->whereNull('paid_at')
                     ->where(function ($q) {
                         $q->where('due_date', '>=', now()->toDateString())
                           ->orWhereNull('due_date');
                     });
    }

    /**
     * Scope a query to only include overdue invoices.
     */
    public function scopeOverdue($query)
    {
        return $query->whereNull('paid_at')
                     ->where('due_date', '<', now()->toDateString());
    }

    public function getStatusAttribute()
    {
        if ($this->paid_at) {
            return 'Paid';
        }

        if ($this->due_date && $this->due_date->lt(today())) {
            return 'Overdue';
        }

        return 'Pending';
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function reminderLogs()
    {
        return $this->hasMany(ReminderLog::class);
    }
}
