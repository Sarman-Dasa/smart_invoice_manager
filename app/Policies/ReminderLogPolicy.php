<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\ReminderLog;
use App\Models\User;

class ReminderLogPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ReminderLog $reminderLog, Invoice $invoice): bool
    {
        return $user->id === $invoice->user_id && $reminderLog->invoice_id === $invoice->id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ReminderLog $reminderLog, Invoice $invoice): bool
    {
        return $user->id === $invoice->user_id && $reminderLog->invoice_id === $invoice->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ReminderLog $reminderLog, Invoice $invoice): bool
    {
        return $user->id === $invoice->user_id && $reminderLog->invoice_id === $invoice->id;
    }

    /**
     * Determine whether the user can send the reminder.
     */
    public function send(User $user, ReminderLog $reminderLog, Invoice $invoice): bool
    {
        return $user->id === $invoice->user_id && $reminderLog->invoice_id === $invoice->id;
    }
}
