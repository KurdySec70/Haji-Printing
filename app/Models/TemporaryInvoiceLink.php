<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class TemporaryInvoiceLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'temp_id',
        'transaction_data',
        'expires_at',
        'is_used',
        'access_count',
    ];

    protected $casts = [
        'transaction_data' => 'array',
        'expires_at' => 'datetime',
        'is_used' => 'boolean',
    ];

    /**
     * Check if the link is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Check if the link is valid (not expired and not used)
     */
    public function isValid(): bool
    {
        return !$this->isExpired() && !$this->is_used;
    }

    /**
     * Increment access count
     */
    public function incrementAccess(): void
    {
        $this->increment('access_count');
    }

    /**
     * Mark as used
     */
    public function markAsUsed(): void
    {
        $this->update(['is_used' => true]);
    }

    /**
     * Scope for valid links
     */
    public function scopeValid($query)
    {
        return $query->where('expires_at', '>', now())
                    ->where('is_used', false);
    }

    /**
     * Scope for expired links
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', now());
    }

    /**
     * Clean up expired links
     */
    public static function cleanupExpired(): int
    {
        return self::expired()->delete();
    }
}
