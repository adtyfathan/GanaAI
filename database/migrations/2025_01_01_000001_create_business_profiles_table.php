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
        Schema::create('business_profiles', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('zernio_social_set_id', 100)->nullable();
            $table->string('logo_path', 255)->nullable();
            $table->string('business_name', 150);
            $table->string('business_type', 100);
            $table->text('description');
            $table->text('vision_mission')->nullable();
            $table->text('uniqueness')->nullable();
            $table->string('target_audience', 255);
            $table->string('content_tone', 100);
            $table->string('location', 255);
            $table->string('timezone', 100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_profiles');
    }
};
