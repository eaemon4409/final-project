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
            'groq_model' => config('ai.groq.model', 'openai/gpt-oss-120b'),
            'openrouter_configured' => !empty(config('ai.openrouter.api_key')),
        ]);
    });

    Route::get('/test-ai', function () {
        try {
            $provider = new \App\Services\AI\GroqProvider();
            $res = $provider->compare([
                'systemPrompt' => 'You are a test. Return JSON: {"test":"ok"}',
                'userPrompt' => 'Test',
            ]);
            return response()->json(['status' => 'success', 'result' => $res]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'class' => get_class($e),
                'file' => $e->getFile() . ':' . $e->getLine(),
            ], 500);
        }
    });

    // Core Comparison Endpoint (Protected by Rate Limiter)
    Route::post('/compare', [ComparisonController::class, 'compare'])
        ->middleware(CompareRateLimiter::class);
});
