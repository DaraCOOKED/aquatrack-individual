<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\WaterIntakeController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('water-intakes', WaterIntakeController::class);
    Route::get('/dashboard', DashboardController::class);
    Route::get('/statistics/daily', [StatisticsController::class, 'daily']);
    Route::get('/statistics/weekly', [StatisticsController::class, 'weekly']);
    Route::get('/statistics/monthly', [StatisticsController::class, 'monthly']);
    Route::get('/settings', [SettingsController::class, 'show']);
    Route::patch('/settings', [SettingsController::class, 'update']);
});
