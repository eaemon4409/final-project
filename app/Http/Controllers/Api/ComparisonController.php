<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompareRequest;
use App\Services\ComparisonService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class ComparisonController extends Controller
{
    protected ComparisonService $comparisonService;

    public function __construct(ComparisonService $comparisonService)
    {
        $this->comparisonService = $comparisonService;
    }

    /**
     * Handle the comparison request.
     * POST /api/v1/compare
     */
    public function compare(CompareRequest $request): JsonResponse
    {
        $requestId = (string) Str::uuid();
        $startTime = microtime(true);
        $installId = (string) $request->input('installId');
        $pages = (array) $request->input('pages', []);
        $pageCount = count($pages);

        try {
            $result = $this->comparisonService->compare($request->validated());

            $durationMs = round((microtime(true) - $startTime) * 1000, 2);
            $usage = $result['_usage'] ?? [];
            unset($result['_usage']);

            // Section 26: Privacy-Preserving Logging (Do NOT log webpage content or user goal)
            Log::info('Comparison processed successfully', [
                'requestId' => $requestId,
                'installIdHash' => hash('sha256', $installId),
                'numberOfPages' => $pageCount,
                'durationMs' => $durationMs,
                'aiProvider' => $usage['provider'] ?? config('ai.default_provider', 'groq'),
                'model' => $usage['model'] ?? config('ai.groq.model', 'default'),
                'inputTokens' => $usage['prompt_tokens'] ?? null,
                'outputTokens' => $usage['completion_tokens'] ?? null,
                'status' => 200,
            ]);

            return response()->json([
                'success' => true,
                'requestId' => $requestId,
                'data' => $result,
            ], 200);

        } catch (Throwable $e) {
            $durationMs = round((microtime(true) - $startTime) * 1000, 2);
            $errorMessage = $e->getMessage();
            $statusCode = 500;

            // Handle rate limit messages
            if (str_contains($errorMessage, '429') || str_contains(strtolower($errorMessage), 'rate limit')) {
                $statusCode = 429;
                $userFriendlyMessage = 'Free AI capacity is temporarily unavailable. Please try again later.';
            } elseif (str_contains($errorMessage, 'Add at least one more page') || str_contains($errorMessage, 'Maximum 4 pages')) {
                $statusCode = 422;
                $userFriendlyMessage = $errorMessage;
            } elseif (str_contains($errorMessage, 'API key')) {
                $statusCode = 503;
                $userFriendlyMessage = 'AI backend service configuration is temporarily incomplete.';
            } else {
                $userFriendlyMessage = 'Comparison couldn\'t be generated. Please try again.';
            }

            Log::error('Comparison processing failed', [
                'requestId' => $requestId,
                'installIdHash' => hash('sha256', $installId),
                'numberOfPages' => $pageCount,
                'durationMs' => $durationMs,
                'error' => $errorMessage,
                'status' => $statusCode,
            ]);

            return response()->json([
                'success' => false,
                'requestId' => $requestId,
                'message' => $userFriendlyMessage,
                'error_detail' => config('app.debug') ? $errorMessage : null,
            ], $statusCode);
        }
    }
}
