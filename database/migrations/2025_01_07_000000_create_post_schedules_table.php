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
        Schema::create('post_schedules', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('content_idea_id')->constrained('content_ideas')->onDelete('cascade');
            $table->foreignUlid('generated_content_id')->nullable()->constrained('generated_contents')->onDelete('set null');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUlid('social_account_id')->constrained('social_accounts')->onDelete('cascade');
            $table->timestamp('scheduled_at');
            $table->enum('status', ['pending', 'scheduled', 'published', 'failed'])->default('pending');
            $table->string('zernio_post_id', 150)->nullable();
            $table->timestamp('zernio_scheduled_at')->nullable();
            $table->text('failure_reason')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_schedules');
    }
};
