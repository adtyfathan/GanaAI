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
        Schema::create('generated_contents', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('content_idea_id')->unique()->constrained('content_ideas')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('caption');
            $table->enum('media_type', ['image', 'video']);
            $table->string('media_path', 255)->nullable();
            $table->string('media_url', 500)->nullable();
            $table->string('media_video_path', 255)->nullable();
            $table->string('media_video_url', 500)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('generated_contents');
    }
};
