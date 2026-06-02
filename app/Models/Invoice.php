<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    protected static function booted()
    {
        static::creating(function ($invoice) {
            if (empty($invoice->invoice_number)) {
                $lastInvoice = self::query()->where('user_id', $invoice->user_id)
                    ->latest('id')
                    ->first();

                if ($lastInvoice && preg_match('/INV-(\d+)/', $lastInvoice->invoice_number, $matches)) {
                    $nextId = (int) $matches[1] + 1;
                } else {
                    $nextId = 1;
                }

                $invoice->invoice_number = 'INV-' . str_pad($nextId, 5, '0', STR_PAD_LEFT);
            }
        });
    }

    public function getStatusAttribute()
    {
        if ($this->paid_at) {
            return 'Paid';
        }

        if ($this->due_date && $this->due_date->isPast()) {
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
