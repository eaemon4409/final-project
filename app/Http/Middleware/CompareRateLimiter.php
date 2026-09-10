<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CompareRateLimiter
{
    /**
     * Handle an incoming request and enforce installation & IP daily comparison limits.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $installId = $request->input('installId');
        $ip = $request->ip() ?? 'unknown_ip';
        $today = now()->format('Y-m-d');

        $installLimit = (int) config('ai.rate_limit.daily_per_install', 10);
        $ipLimit = (int) config('ai.rate_limit.daily_per_ip', 30);

        $ttl = now()->endOfDay()->diffInSeconds(now());
        if ($ttl <= 0) {
            $ttl = 86400;
        }

        // 1. Check Install ID Rate Limit
        if (!empty($installId)) {
            $installKey = "compare_limit:install:" . hash('sha256', $installId) . ":{$today}";
            $installCount = (int) Cache::get($installKey, 0);

            if ($installCount >= $installLimit) {
                return response()->json([
                    'success' => false,
                    'message' => "Today's free comparison limit has been reached. Please try again later.",
                    'error_code' => 'RATE_LIMIT_EXCEEDED',
                ], 429, [
                    'X-RateLimit-Limit' => $installLimit,
                    'X-RateLimit-Remaining' => 0,
                    'Retry-After' => $ttl,
                ]);
            }
        }

        // 2. Check IP Rate Limit
        $ipKey = "compare_limit:ip:" . hash('sha256', $ip) . ":{$today}";
        $ipCount = (int) Cache::get($ipKey, 0);

        if ($ipCount >= $ipLimit) {
            return response()->json([
                'success' => false,
                'message' => "Today's free comparison limit has been reached. Please try again later.",
                'error_code' => 'IP_RATE_LIMIT_EXCEEDED',
            ], 429, [
                'X-RateLimit-Limit' => $ipLimit,
                'X-RateLimit-Remaining' => 0,
                'Retry-After' => $ttl,
            ]);
        }

        /** @var Response $response */
        $response = $next($request);

        // Only count against rate limit if comparison was successfully processed (status 200)
        if ($response->isSuccessful()) {
            if (!empty($installId) && isset($installKey)) {
                if (!Cache::has($installKey)) {
                    Cache::put($installKey, 1, $ttl);
                } else {
                    Cache::increment($installKey);
                }
            }

            if (!Cache::has($ipKey)) {
                Cache::put($ipKey, 1, $ttl);
            } else {
                Cache::increment($ipKey);
            }
        }

        return $response;
    }
}
