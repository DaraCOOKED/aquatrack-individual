<?php

namespace App\Services;

use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

class HydrationData
{
    public function timezone(User $user): string
    {
        return $user->settings?->timezone ?? 'Asia/Phnom_Penh';
    }

    public function localDate(User $user, ?string $date = null): CarbonImmutable
    {
        $timezone = $this->timezone($user);

        return $date
            ? CarbonImmutable::createFromFormat('!Y-m-d', $date, $timezone)
            : CarbonImmutable::now($timezone)->startOfDay();
    }

    public function recordsForLocalRange(User $user, CarbonImmutable $start, CarbonImmutable $end): Collection
    {
        return $user->waterIntakes()
            ->where('consumed_at', '>=', $start->utc())
            ->where('consumed_at', '<', $end->utc())
            ->orderBy('consumed_at')
            ->get();
    }

    public function dailySeries(User $user, CarbonImmutable $start, CarbonImmutable $endInclusive): array
    {
        $timezone = $this->timezone($user);
        $records = $this->recordsForLocalRange($user, $start->startOfDay(), $endInclusive->addDay()->startOfDay());
        $totals = $records->groupBy(fn ($record) => $record->consumed_at->setTimezone($timezone)->toDateString())
            ->map(fn ($day) => $day->sum('amount_ml'));

        $series = [];
        for ($day = $start->startOfDay(); $day->lte($endInclusive); $day = $day->addDay()) {
            $date = $day->toDateString();
            $series[] = [
                'date' => $date,
                'label' => $day->format('D'),
                'total_ml' => (int) ($totals[$date] ?? 0),
            ];
        }

        return $series;
    }
}
