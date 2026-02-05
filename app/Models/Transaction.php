<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'customer_id',
        'cashier_id',
        'amount',
        'status',
        'type',
        'offer_status',
        'notes',
        'items',
        'subtotal',
        'discount_amount',
        'grand_total',
        'transaction_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'items' => 'array',
        'transaction_date' => 'datetime',
    ];

    /**
     * Get the customer that owns the transaction.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Get the cashier who processed the transaction.
     */
    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    /**
     * Scope a query to only include paid transactions.
     */
    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    /**
     * Scope a query to only include debt transactions.
     */
    public function scopeDebt($query)
    {
        return $query->where('status', 'debt');
    }

    /**
     * Scope a query to only include transactions (not offers).
     */
    public function scopeTransactions($query)
    {
        return $query->where('type', 'transaction');
    }

    /**
     * Scope a query to only include offers.
     */
    public function scopeOffers($query)
    {
        return $query->where('type', 'offer');
    }

    /**
     * Scope a query to only include pending offers.
     */
    public function scopePendingOffers($query)
    {
        return $query->where('type', 'offer')->where('offer_status', 'pending');
    }

    /**
     * Scope a query to only include accepted offers.
     */
    public function scopeAcceptedOffers($query)
    {
        return $query->where('type', 'offer')->whereIn('offer_status', ['accepted_paid', 'accepted_debt']);
    }

    /**
     * Scope a query to only include rejected offers.
     */
    public function scopeRejectedOffers($query)
    {
        return $query->where('type', 'offer')->where('offer_status', 'rejected');
    }



    /**
     * Scope a query to filter by date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('transaction_date', [$startDate, $endDate]);
    }

    /**
     * Scope a query to filter by customer.
     */
    public function scopeForCustomer($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    /**
     * Generate a unique order ID in format YEAR-0000001 (e.g. 2026-0000001).
     * Year is always the current calendar year (e.g. 2027 → 2027-0000001, 2028 → 2028-0000001).
     * Sequence is 7 digits (two extra zeros); 1–9999999 per year; after that we roll over to next year.
     */
    public static function generateOrderId(): string
    {
        $seqLength = 7;
        $maxSeqPerYear = 9999999;

        // Use current date so when the year changes (2027, 2028, …) IDs automatically use the new year
        $currentYear = (int) now()->year;
        $prefix = $currentYear . '-';

        $maxSeq = self::query()
            ->where('order_id', 'like', $prefix . '%')
            ->selectRaw("MAX(CAST(SUBSTRING_INDEX(order_id, '-', -1) AS UNSIGNED)) as max_seq")
            ->value('max_seq');

        $nextSeq = $maxSeq ? (int) $maxSeq + 1 : 1;

        if ($nextSeq > $maxSeqPerYear) {
            $currentYear++;
            $nextSeq = 1;
        }

        do {
            $nextOrderId = $currentYear . '-' . str_pad((string) $nextSeq, $seqLength, '0', STR_PAD_LEFT);
            if (! self::where('order_id', $nextOrderId)->exists()) {
                return $nextOrderId;
            }
            $nextSeq++;
            if ($nextSeq > $maxSeqPerYear) {
                $currentYear++;
                $nextSeq = 1;
            }
        } while (true);
    }

    /**
     * Generate a unique offer ID.
     */
    public static function generateOfferId(): string
    {
        do {
            $offerId = 'OFFER-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
        } while (self::where('order_id', $offerId)->exists());

        return $offerId;
    }

    /**
     * Accept offer as paid transaction.
     */
    public function acceptAsPaid(): bool
    {
        if ($this->type !== 'offer' || $this->offer_status !== 'pending') {
            return false;
        }

        // Create new transaction record
        $newTransaction = self::create([
            'order_id' => self::generateOrderId(),
            'customer_id' => $this->customer_id,
            'cashier_id' => $this->cashier_id ?? auth()->id(),
            'amount' => $this->amount,
            'status' => 'paid',
            'type' => 'transaction',
            'offer_status' => null, // Transactions don't have offer status
            'notes' => 'Converted from offer: ' . $this->order_id . ($this->notes ? ' | ' . $this->notes : ''),
            'items' => $this->items,
            'subtotal' => $this->subtotal,
            'discount_amount' => $this->discount_amount,
            'grand_total' => $this->grand_total,
            'transaction_date' => now(),
        ]);

        if ($newTransaction) {
            // Delete the original offer completely
            $this->delete();
            return true;
        }

        return false;
    }

    /**
     * Accept offer as debt transaction.
     */
    public function acceptAsDebt(): bool
    {
        if ($this->type !== 'offer' || $this->offer_status !== 'pending') {
            return false;
        }

        // Create new transaction record
        $newTransaction = self::create([
            'order_id' => self::generateOrderId(),
            'customer_id' => $this->customer_id,
            'cashier_id' => $this->cashier_id ?? auth()->id(),
            'amount' => $this->amount,
            'status' => 'debt',
            'type' => 'transaction',
            'offer_status' => null, // Transactions don't have offer status
            'notes' => 'Converted from offer: ' . $this->order_id . ($this->notes ? ' | ' . $this->notes : ''),
            'items' => $this->items,
            'subtotal' => $this->subtotal,
            'discount_amount' => $this->discount_amount,
            'grand_total' => $this->grand_total,
            'transaction_date' => now(),
        ]);

        if ($newTransaction) {
            // Delete the original offer completely
            $this->delete();
            return true;
        }

        return false;
    }

    /**
     * Reject offer and fully delete it.
     */
    public function rejectOffer(): bool
    {
        if ($this->type !== 'offer' || $this->offer_status !== 'pending') {
            return false;
        }

        // Delete the offer record completely
        return $this->delete();
    }

    /**
     * Check if transaction is an offer.
     */
    public function isOffer(): bool
    {
        return $this->type === 'offer';
    }

    /**
     * Check if offer is pending.
     */
    public function isPendingOffer(): bool
    {
        return $this->type === 'offer' && $this->offer_status === 'pending';
    }

    /**
     * Get formatted transaction date.
     */
    public function getFormattedDateAttribute(): string
    {
        return $this->transaction_date->format('M d, Y H:i');
    }

    /**
     * Get customer name.
     */
    public function getCustomerNameAttribute(): string
    {
        return $this->customer ? $this->customer->name : 'Unknown Customer';
    }

    /**
     * Get customer email.
     */
    public function getCustomerEmailAttribute(): ?string
    {
        return $this->customer ? $this->customer->email : null;
    }

    /**
     * Get customer phone.
     */
    public function getCustomerPhoneAttribute(): ?string
    {
        return $this->customer ? $this->customer->phone : null;
    }

    /**
     * Get status badge color.
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'paid' => 'green',
            'debt' => 'red',
            default => 'gray'
        };
    }

    /**
     * Get status badge text.
     */
    public function getStatusTextAttribute(): string
    {
        return match($this->status) {
            'paid' => 'Paid',
            'debt' => 'Debt',
            default => 'Unknown'
        };
    }

    /**
     * Get the cashier's name.
     */
    public function getCashierNameAttribute(): ?string
    {
        return $this->cashier->name ?? null;
    }

    /**
     * Get the cashier's email.
     */
    public function getCashierEmailAttribute(): ?string
    {
        return $this->cashier->email ?? null;
    }

    /**
     * Get the cashier's role.
     */
    public function getCashierRoleAttribute(): ?string
    {
        return $this->cashier->role ?? null;
    }

}
