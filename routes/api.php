<?php

use App\Http\Controllers\Api\ComparisonController;
use App\Http\Middleware\CompareRateLimiter;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Version 1 API endpoints for the Compare Anything Chrome Extension.
|
*/

Route::prefix('v1')->group(function () {
    // Health check endpoint
    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'service' => 'Compare Anything AI Backend',
            'version' => '1.0.0',
            'default_provider' => config('ai.default_provider', 'groq'),
            'groq_configured' => !empty(config('ai.groq.api_key')),
            'openrouter_configured' => !empty(config('ai.openrouter.api_key')),
        ]);
    });

    // Core Comparison Endpoint (Protected by Rate Limiter)
    Route::post('/compare', [ComparisonController::class, 'compare'])
        ->middleware(CompareRateLimiter::class);
});
