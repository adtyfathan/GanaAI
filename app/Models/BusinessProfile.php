<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BusinessProfile extends Model
{
    use HasUlids;

    protected $fillable = [
        'user_id',
        'zernio_social_set_id',
        'logo_path',
        'business_name',
        'business_type',
        'description',
        'vision_mission',
        'uniqueness',
        'target_audience',
        'content_tone',
        'location',
        'timezone',
    ];

    /**
     * Get the user that owns the business profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the products for this business.
     */
    public function products(): HasMany
    {
        return $this->user->products();
    }
}
