<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostAnalytic extends Model
{
    use HasUlids;

    protected $table = 'post_analytics';

    protected $fillable = [
        'post_schedule_id',
        'user_id',
        'platform',
        'likes',
        'comments',
        'shares',
        'video_views',
        'impressions',
        'reach',
        'synced_at',
    ];

    protected $casts = [
        'synced_at' => 'datetime',
    ];

    /**
     * Get the post schedule associated with these analytics.
     */
    public function postSchedule(): BelongsTo
    {
        return $this->belongsTo(PostSchedule::class);
    }

    /**
     * Get the user that owns these analytics.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
