<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\WaterIntake;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AquaTrackApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_receives_a_session(): void
    {
        $response = $this->fromFrontend()->postJson('/api/register', [
            'name' => 'Dara',
            'email' => 'dara@example.com',
            'password' => 'water1234',
            'password_confirmation' => 'water1234',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Dara')
            ->assertJsonPath('data.settings.timezone', 'Asia/Phnom_Penh');
        $this->assertAuthenticated();
        $this->assertDatabaseHas('user_settings', ['daily_goal_ml' => 1500]);
        $this->assertTrue(Hash::check('water1234', User::first()->password));
    }

    public function test_user_can_login_get_their_profile_and_logout(): void
    {
        $user = User::factory()->create(['email' => 'dara@example.com', 'password' => 'water1234']);

        $this->fromFrontend()->postJson('/api/login', [
            'email' => 'dara@example.com',
            'password' => 'water1234',
        ])->assertOk()->assertJsonPath('data.id', $user->id);

        $this->fromFrontend()->getJson('/api/me')->assertOk()->assertJsonPath('data.email', 'dara@example.com');
        $this->fromFrontend()->postJson('/api/logout')->assertOk();
        $this->assertGuest();
    }

    public function test_private_routes_require_authentication(): void
    {
        $this->getJson('/api/dashboard')->assertUnauthorized();
        $this->postJson('/api/water-intakes', [])->assertUnauthorized();
        $this->getJson('/api/settings')->assertUnauthorized();
    }

    public function test_user_can_create_update_and_delete_a_water_intake(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $created = $this->postJson('/api/water-intakes', [
            'amount_ml' => 250,
            'consumed_at' => '2026-10-27T07:00:00+07:00',
        ])->assertCreated()->assertJsonPath('data.amount_ml', 250);
        $id = $created->json('data.id');

        $this->patchJson("/api/water-intakes/{$id}", ['amount_ml' => 300])
            ->assertOk()->assertJsonPath('data.amount_ml', 300);
        $this->deleteJson("/api/water-intakes/{$id}")->assertOk();
        $this->assertDatabaseMissing('water_intakes', ['id' => $id]);
    }

    public function test_invalid_water_amounts_are_rejected(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/water-intakes', [
            'amount_ml' => 0,
            'consumed_at' => now()->toIso8601String(),
        ])->assertUnprocessable()->assertJsonValidationErrors('amount_ml');
    }

    public function test_user_cannot_access_another_users_records(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $intake = WaterIntake::factory()->for($owner)->create();
        Sanctum::actingAs($other);

        $this->getJson("/api/water-intakes/{$intake->id}")->assertNotFound();
        $this->patchJson("/api/water-intakes/{$intake->id}", ['amount_ml' => 999])->assertNotFound();
        $this->deleteJson("/api/water-intakes/{$intake->id}")->assertNotFound();
        $this->assertDatabaseHas('water_intakes', ['id' => $intake->id, 'amount_ml' => $intake->amount_ml]);
    }

    public function test_dashboard_calculates_daily_total_from_individual_records(): void
    {
        CarbonImmutable::setTestNow('2026-10-27 12:00:00');
        $user = User::factory()->create();
        WaterIntake::factory()->for($user)->create(['amount_ml' => 250, 'consumed_at' => '2026-10-27 00:00:00']);
        WaterIntake::factory()->for($user)->create(['amount_ml' => 300, 'consumed_at' => '2026-10-27 03:30:00']);
        WaterIntake::factory()->for($user)->create(['amount_ml' => 500, 'consumed_at' => '2026-10-26 10:00:00']);
        Sanctum::actingAs($user);

        $this->getJson('/api/dashboard')->assertOk()
            ->assertJsonPath('data.date', '2026-10-27')
            ->assertJsonPath('data.total_ml', 550)
            ->assertJsonPath('data.remaining_ml', 950)
            ->assertJsonCount(2, 'data.recent_intakes');
    }

    public function test_daily_total_respects_the_users_timezone_boundary(): void
    {
        $user = User::factory()->create();
        $user->settings->update(['timezone' => 'Asia/Phnom_Penh']);
        WaterIntake::factory()->for($user)->create(['amount_ml' => 250, 'consumed_at' => '2026-10-26 17:30:00']); // 00:30 local
        WaterIntake::factory()->for($user)->create(['amount_ml' => 500, 'consumed_at' => '2026-10-26 16:30:00']); // 23:30 prior day
        Sanctum::actingAs($user);

        $this->getJson('/api/statistics/daily?date=2026-10-27')->assertOk()
            ->assertJsonPath('data.total_ml', 250);
    }

    public function test_user_can_update_settings_and_display_name(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->patchJson('/api/settings', [
            'name' => 'Dara Sok',
            'daily_goal_ml' => 2200,
            'timezone' => 'Europe/Paris',
            'reminder_enabled' => true,
            'reminder_start_time' => '08:00',
            'reminder_end_time' => '20:00',
            'reminder_interval_minutes' => 90,
        ])->assertOk()
            ->assertJsonPath('data.name', 'Dara Sok')
            ->assertJsonPath('data.daily_goal_ml', 2200)
            ->assertJsonPath('data.reminder_enabled', true);
    }

    private function fromFrontend(): static
    {
        return $this->withHeader('Origin', 'http://localhost:5173');
    }
}
