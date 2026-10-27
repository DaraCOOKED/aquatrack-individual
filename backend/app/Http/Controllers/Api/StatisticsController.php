<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\HydrationData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    public function __construct(private HydrationData $hydration) {}

    public function daily(Request $request): JsonResponse
    {
        $validated = $request->validate(['date' => ['nullable', 'date_format:Y-m-d']]);
        $day = $this->hydration->localDate($request->user(), $validated['date'] ?? null);
        $total = $this->hydration->recordsForLocalRange($request->user(), $day, $day->addDay())->sum('amount_ml');

        return response()->json(['data' => [
            'date' => $day->toDateString(),
            'total_ml' => (int) $total,
            'goal_ml' => (int) $request->user()->settings->daily_goal_ml,
        ]]);
    }

    public function weekly(Request $request): JsonResponse
    {
        $validated = $request->validate(['end_date' => ['nullable', 'date_format:Y-m-d']]);
        $end = $this->hydration->localDate($request->user(), $validated['end_date'] ?? null);
        $series = $this->hydration->dailySeries($request->user(), $end->subDays(6), $end);
        $total = array_sum(array_column($series, 'total_ml'));

        return response()->json(['data' => [
            'start_date' => $series[0]['date'],
            'end_date' => $series[6]['date'],
            'total_ml' => $total,
            'daily_average_ml' => (int) round($total / 7),
            'days' => $series,
        ]]);
    }

    public function monthly(Request $request): JsonResponse
    {
        $validated = $request->validate(['month' => ['nullable', 'date_format:Y-m']]);
        $anchor = isset($validated['month'])
            ? $this->hydration->localDate($request->user(), $validated['month'].'-01')
            : $this->hydration->localDate($request->user());
        $start = $anchor->startOfMonth();
        $end = $anchor->endOfMonth()->startOfDay();
        $series = $this->hydration->dailySeries($request->user(), $start, $end);
        $total = array_sum(array_column($series, 'total_ml'));

        return response()->json(['data' => [
            'month' => $start->format('Y-m'),
            'total_ml' => $total,
            'daily_average_ml' => (int) round($total / count($series)),
            'days' => $series,
        ]]);
    }
}
