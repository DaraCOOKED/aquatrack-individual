<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWaterIntakeRequest;
use App\Http\Requests\UpdateWaterIntakeRequest;
use App\Http\Resources\WaterIntakeResource;
use App\Models\WaterIntake;
use App\Services\HydrationData;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WaterIntakeController extends Controller
{
    public function __construct(private HydrationData $hydration) {}

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => ['nullable', 'date_format:Y-m-d'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);
        $query = $request->user()->waterIntakes()->latest('consumed_at');

        if ($date = ($validated['date'] ?? null)) {
            $start = $this->hydration->localDate($request->user(), $date);
            $query->where('consumed_at', '>=', $start->utc())
                ->where('consumed_at', '<', $start->addDay()->utc());
        }

        $page = $query->paginate((int) ($validated['per_page'] ?? 20));

        return response()->json([
            'data' => WaterIntakeResource::collection($page->items())->resolve(),
            'meta' => [
                'current_page' => $page->currentPage(),
                'last_page' => $page->lastPage(),
                'per_page' => $page->perPage(),
                'total' => $page->total(),
            ],
        ]);
    }

    public function store(StoreWaterIntakeRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['consumed_at'] = CarbonImmutable::parse($data['consumed_at'])->utc();
        $intake = $request->user()->waterIntakes()->create($data);

        return response()->json([
            'message' => 'Water intake added.',
            'data' => (new WaterIntakeResource($intake))->resolve(),
        ], 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        return response()->json([
            'data' => (new WaterIntakeResource($this->owned($request, $id)))->resolve(),
        ]);
    }

    public function update(UpdateWaterIntakeRequest $request, int $id): JsonResponse
    {
        $intake = $this->owned($request, $id);
        $data = $request->validated();
        if (isset($data['consumed_at'])) {
            $data['consumed_at'] = CarbonImmutable::parse($data['consumed_at'])->utc();
        }
        $intake->update($data);

        return response()->json([
            'message' => 'Water intake updated.',
            'data' => (new WaterIntakeResource($intake->refresh()))->resolve(),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->owned($request, $id)->delete();

        return response()->json(['message' => 'Water intake deleted.']);
    }

    private function owned(Request $request, int $id): WaterIntake
    {
        return $request->user()->waterIntakes()->findOrFail($id);
    }
}
