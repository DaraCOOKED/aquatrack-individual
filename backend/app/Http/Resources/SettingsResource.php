<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'daily_goal_ml' => $this->daily_goal_ml,
            'timezone' => $this->timezone,
            'reminder_enabled' => $this->reminder_enabled,
            'reminder_start_time' => substr($this->reminder_start_time, 0, 5),
            'reminder_end_time' => substr($this->reminder_end_time, 0, 5),
            'reminder_interval_minutes' => $this->reminder_interval_minutes,
        ];
    }
}
