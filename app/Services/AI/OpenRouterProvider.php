<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenRouterProvider implements IAIProvider
{
    protected string $apiKey;
    protected string $model;
    protected string $baseUrl;
    protected int $timeout;

    public function __construct(?string $apiKey = null, ?string $model = null, ?string $baseUrl = null, ?int $timeout = null)
    {
        $this->apiKey = $apiKey ?? config('ai.openrouter.api_key', '');
        $this->model = $model ?? config('ai.openrouter.model', 'meta-llama/llama-3.3-70b-instruct');
        $this->baseUrl = rtrim($baseUrl ?? config('ai.openrouter.base_url', 'https://openrouter.ai/api/v1'), '/');
        $this->timeout = $timeout ?? config('ai.openrouter.timeout', 45);
    }

    public function getName(): string
    {
        return 'OpenRouter';
    }

    public function compare(array $payload): array
    {
        if (empty($this->apiKey)) {
            throw new RuntimeException('OPENROUTER_API_KEY is not configured on the backend server.');
        }

        $systemPrompt = $payload['systemPrompt'];
        $userPrompt = $payload['userPrompt'];

        $endpoint = "{$this->baseUrl}/chat/completions";

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->apiKey}",
            'Content-Type' => 'application/json',
            'HTTP-Referer' => config('app.url', 'http://localhost'),
            'X-Title' => 'Compare Anything Extension',
        ])
        ->timeout($this->timeout)
        ->post($endpoint, [
            'model' => $this->model,
            'messages' => [
                [
                    'role' => 'system',
                    'content' => $systemPrompt,
                ],
                [
                    'role' => 'user',
                    'content' => $userPrompt,
                ],
            ],
            'response_format' => [
                'type' => 'json_object',
            ],
            'temperature' => 0.1,
            'max_tokens' => 4096,
        ]);

        if ($response->status() === 429) {
            throw new RuntimeException('OpenRouter rate limit reached. Please try again in a few moments.');
        }

        if (!$response->successful()) {
            $errorBody = $response->json();
            $errorMessage = $errorBody['error']['message'] ?? $response->body();
            throw new RuntimeException("OpenRouter API error ({$response->status()}): {$errorMessage}");
        }

        $json = $response->json();
        $rawContent = $json['choices'][0]['message']['content'] ?? null;

        if (empty($rawContent)) {
            throw new RuntimeException('Received empty response from OpenRouter provider.');
        }

        $parsed = json_decode($rawContent, true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($parsed)) {
            throw new RuntimeException('Failed to parse OpenRouter response as valid JSON: ' . json_last_error_msg());
        }

        if (isset($json['usage'])) {
            $parsed['_usage'] = [
                'prompt_tokens' => $json['usage']['prompt_tokens'] ?? 0,
                'completion_tokens' => $json['usage']['completion_tokens'] ?? 0,
                'total_tokens' => $json['usage']['total_tokens'] ?? 0,
                'model' => $this->model,
                'provider' => $this->getName(),
            ];
        }

        return $parsed;
    }
}
