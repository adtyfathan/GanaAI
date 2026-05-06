<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ContentIdea extends Model
{
    use HasUlids;

    protected $fillable = [
        'user_id',
        'product_id',
        'content_theme',
        'content_type',
        'holiday_name',
        'generation_month',
        'media_preference',
        'status',
        'regenerate_count',
        'last_regenerated_at',
    ];

    protected $casts = [
        'last_regenerated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the content idea.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product associated with the content idea.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }

    /**
     * Get the generated content for this idea.
     */
    public function generatedContent(): HasOne
    {
        return $this->hasOne(GeneratedContent::class);
    }

    /**
     * Get the post schedules for this content idea.
     */
    public function postSchedules(): HasMany
    {
        return $this->hasMany(PostSchedule::class);
    }
}
