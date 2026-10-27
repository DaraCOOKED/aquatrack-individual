<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->json([
    'name' => 'AquaTrack API',
    'status' => 'ok',
]));
