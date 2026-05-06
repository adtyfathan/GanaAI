<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GeneratedContent extends Model
{
    use HasUlids;

    protected $fillable = [
        'content_idea_id',
        'user_id',
        'caption',
        'media_type',
        'media_path',
        'media_url',
        'media_video_path',
        'media_video_url',
    ];

    /**
     * Get the content idea that this generated content belongs to.
     */
    public function contentIdea(): BelongsTo
    {
        return $this->belongsTo(ContentIdea::class);
    }

    /**
     * Get the user that owns this generated content.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the post schedules that use this generated content.
     */
    public function postSchedules(): HasMany
    {
        return $this->hasMany(PostSchedule::class);
    }
}
