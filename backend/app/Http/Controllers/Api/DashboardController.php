<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WaterIntakeResource;
use App\Services\HydrationData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private HydrationData $hydration) {}

    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user()->load('settings');
        $today = $this->hydration->localDate($user);
        $records = $this->hydration->recordsForLocalRange($user, $today, $today->addDay());
        $total = (int) $records->sum('amount_ml');
        $goal = (int) $user->settings->daily_goal_ml;
        $weekly = $this->hydration->dailySeries($user, $today->subDays(6), $today);

        return response()->json(['data' => [
            'date' => $today->toDateString(),
            'timezone' => $this->hydration->timezone($user),
            'total_ml' => $total,
            'goal_ml' => $goal,
            'remaining_ml' => max(0, $goal - $total),
            'progress_percent' => $goal > 0 ? round(($total / $goal) * 100, 1) : 0,
            'recent_intakes' => WaterIntakeResource::collection($records->sortByDesc('consumed_at')->take(5)->values())->resolve(),
            'weekly' => $weekly,
        ]]);
    }
}
