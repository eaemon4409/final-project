<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AlternativeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class AlternativeController extends Controller
{
    protected AlternativeService $alternativeService;

    public function __construct(AlternativeService $alternativeService)
    {
        $this->alternativeService = $alternativeService;
    }

    /**
     * Suggest 2-3 direct alternatives and better deals for a product.
     * POST /api/v1/alternatives
     */
    public function suggest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:500',
            'url' => 'nullable|string|max:2000',
            'domain' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'importantText' => 'nullable|string|max:5000',
            'price' => 'nullable|string|max:100',
        ]);

        $requestId = (string) Str::uuid();
        $startTime = microtime(true);

        try {
            $result = $this->alternativeService->findAlternatives($validated);
            $durationMs = round((microtime(true) - $startTime) * 1000, 2);

            Log::info('Alternatives generated successfully', [
                'requestId' => $requestId,
                'durationMs' => $durationMs,
            ]);

            return response()->json([
                'success' => true,
                'requestId' => $requestId,
                'data' => $result,
            ], 200);

        } catch (Throwable $e) {
            Log::error('Alternative generation failed', [
                'requestId' => $requestId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'requestId' => $requestId,
                'message' => 'Could not generate alternatives at this moment. Please try again.',
            ], 500);
        }
    }
}
