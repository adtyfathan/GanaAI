<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SocialAccount extends Model
{
    use HasUlids;

    protected $fillable = [
        'user_id',
        'platform',
        'zernio_account_id',
        'account_username',
        'is_active',
        'connected_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'connected_at' => 'datetime',
    ];

    /**
     * Get the user that owns the social account.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the post schedules for this social account.
     */
    public function postSchedules(): HasMany
    {
        return $this->hasMany(PostSchedule::class);
    }
}
