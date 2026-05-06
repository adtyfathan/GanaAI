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
        Schema::create('content_ideas', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUlid('product_id')->nullable()->constrained('products')->onDelete('set null');
            $table->string('content_theme', 255);
            $table->enum('content_type', ['regular', 'holiday_greeting']);
            $table->string('holiday_name', 150)->nullable();
            $table->char('generation_month', 7);
            $table->enum('media_preference', ['image', 'video', 'auto']);
            $table->enum('status', ['idea', 'generating', 'ready', 'failed'])->default('idea');
            $table->tinyInteger('regenerate_count')->default(0);
            $table->timestamp('last_regenerated_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_ideas');
    }
};
