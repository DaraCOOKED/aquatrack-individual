<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->unsignedInteger('daily_goal_ml')->default(1500);
            $table->string('timezone')->default('Asia/Phnom_Penh');
            $table->boolean('reminder_enabled')->default(false);
            $table->time('reminder_start_time')->default('07:00');
            $table->time('reminder_end_time')->default('21:00');
            $table->unsignedSmallInteger('reminder_interval_minutes')->default(60);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_settings');
    }
};
