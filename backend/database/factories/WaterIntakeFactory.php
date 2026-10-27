<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class WaterIntakeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'amount_ml' => fake()->randomElement([150, 250, 300, 500]),
            'consumed_at' => fake()->dateTimeBetween('-30 days'),
        ];
    }
}
