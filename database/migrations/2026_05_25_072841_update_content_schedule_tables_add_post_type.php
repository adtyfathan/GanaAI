<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('post_schedules', function (Blueprint $table) {
            $table->enum('post_type', ['feed', 'reels', 'story', 'video'])
                ->after('social_account_id');
        });

        Schema::table('content_ideas', function (Blueprint $table) {
            $table->text('content_description')
                ->nullable()
                ->after('content_theme');
        });

        Schema::table('content_ideas', function (Blueprint $table) {
            $table->enum('media_preference', ['image', 'video'])
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('post_schedules', function (Blueprint $table) {
            $table->dropColumn('post_type');
        });

        Schema::table('content_ideas', function (Blueprint $table) {
            $table->dropColumn('content_description');
            $table->enum('media_preference', ['image', 'video', 'auto'])
                ->change();
        });
    }
};
