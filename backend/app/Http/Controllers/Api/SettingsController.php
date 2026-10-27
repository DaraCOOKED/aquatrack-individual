<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSettingsRequest;
use App\Http\Resources\SettingsResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class SettingsController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json(['data' => [
            'name' => $request->user()->name,
            ...(new SettingsResource($request->user()->settings))->resolve(),
        ]]);
    }

    public function update(UpdateSettingsRequest $request): JsonResponse
    {
        $validated = $request->validated();
        DB::transaction(function () use ($request, $validated) {
            if (isset($validated['name'])) {
                $request->user()->update(['name' => $validated['name']]);
            }
            $request->user()->settings()->updateOrCreate([], Arr::except($validated, 'name'));
        });

        $request->user()->refresh()->load('settings');

        return response()->json([
            'message' => 'Settings saved.',
            'data' => [
                'name' => $request->user()->name,
                ...(new SettingsResource($request->user()->settings))->resolve(),
            ],
        ]);
    }
}
