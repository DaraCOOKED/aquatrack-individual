<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WaterIntakeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $timezone = $request->user()?->settings?->timezone ?? 'Asia/Phnom_Penh';

        return [
            'id' => $this->id,
            'amount_ml' => $this->amount_ml,
            'consumed_at' => $this->consumed_at->setTimezone($timezone)->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
