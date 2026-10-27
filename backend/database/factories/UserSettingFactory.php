<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserSettingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'daily_goal_ml' => 1500,
            'timezone' => 'Asia/Phnom_Penh',
            'reminder_enabled' => false,
            'reminder_start_time' => '07:00',
            'reminder_end_time' => '21:00',
            'reminder_interval_minutes' => 60,
        ];
    }
}
