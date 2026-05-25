<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'completed_onboarding'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's business profile.
     */
    public function businessProfile(): HasOne
    {
        return $this->hasOne(BusinessProfile::class);
    }

    /**
     * Get the user's products.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function socialAccounts(): HasMany
    {
        return $this->hasMany(SocialAccount::class);
    }

    /**
     * Check if user has completed onboarding (setup business profile and added at least one product).
     */
    public function hasCompletedOnboarding(): bool
    {
        return (bool) $this->completed_onboarding
            && $this->businessProfile()->exists()
            && $this->products()->exists()
            && $this->socialAccounts()->exists();
    }

    public function hasCompletedOnboardingForm(): bool
    {
        return (bool) $this->businessProfile()->exists()
            && $this->products()->exists()
            && $this->socialAccounts()->exists();
    }

    /**
     * Check if user has setup business profile.
     */ 
    public function hasBusinessProfile(): bool
    {
        return $this->businessProfile()->exists();
    }
}
