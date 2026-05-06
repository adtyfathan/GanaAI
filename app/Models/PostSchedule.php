<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PostSchedule extends Model
{
    use HasUlids;

    protected $fillable = [
        'content_idea_id',
        'generated_content_id',
        'user_id',
        'social_account_id',
        'scheduled_at',
        'status',
        'zernio_post_id',
        'zernio_scheduled_at',
        'failure_reason',
        'published_at',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'zernio_scheduled_at' => 'datetime',
        'published_at' => 'datetime',
    ];

    /**
     * Get the content idea associated with this post schedule.
     */
    public function contentIdea(): BelongsTo
    {
        return $this->belongsTo(ContentIdea::class);
    }

    /**
     * Get the generated content for this post schedule.
     */
    public function generatedContent(): BelongsTo
    {
        return $this->belongsTo(GeneratedContent::class);
    }

    /**
     * Get the user that owns this post schedule.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the social account associated with this post schedule.
     */
    public function socialAccount(): BelongsTo
    {
        return $this->belongsTo(SocialAccount::class);
    }

    /**
     * Get the analytics for this post schedule.
     */
    public function analytics(): HasOne
    {
        return $this->hasOne(PostAnalytic::class);
    }
}
