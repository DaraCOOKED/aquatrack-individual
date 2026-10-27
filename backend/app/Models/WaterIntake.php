<?php

namespace App\Models;

use Database\Factories\WaterIntakeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['amount_ml', 'consumed_at'])]
class WaterIntake extends Model
{
    /** @use HasFactory<WaterIntakeFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return ['consumed_at' => 'immutable_datetime'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
