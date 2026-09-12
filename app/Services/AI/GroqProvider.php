<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class GroqProvider implements IAIProvider
{
    protected string $apiKey;
    protected string $model;
    protected string $baseUrl;
    protected int $timeout;

    public function __construct(?string $apiKey = null, ?string $model = null, ?string $baseUrl = null, ?int $timeout = null)
    {
        $this->apiKey = $apiKey ?? config('ai.groq.api_key', '');
        $configuredModel = $model ?? config('ai.groq.model', 'openai/gpt-oss-120b');
        // If an obsolete/unavailable model like llama-3.3-70b-versatile was configured in env, default to active Groq model
        if (empty($configuredModel) || str_contains($configuredModel, 'llama-3.3-70b-versatile')) {
            $configuredModel = 'openai/gpt-oss-120b';
        }
        $this->model = $configuredModel;
        $this->baseUrl = rtrim($baseUrl ?? config('ai.groq.base_url', 'https://api.groq.com/openai/v1'), '/');
        $this->timeout = $timeout ?? config('ai.groq.timeout', 45);
    }

    public function getName(): string
    {
        return 'Groq';
    }

    public function compare(array $payload): array
    {
        if (empty($this->apiKey)) {
            throw new RuntimeException('GROQ_API_KEY is not configured on the backend server.');
        }

        $systemPrompt = $payload['systemPrompt'];
        $userPrompt = $payload['userPrompt'];

        $endpoint = "{$this->baseUrl}/chat/completions";

        $sendRequest = function (string $modelToUse) use ($endpoint, $systemPrompt, $userPrompt) {
            return Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])
            ->timeout($this->timeout)
            ->post($endpoint, [
                'model' => $modelToUse,
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
        };

        $response = $sendRequest($this->model);

        // If the configured model was not found (404), automatically fallback to openai/gpt-oss-120b or openai/gpt-oss-20b
        if ($response->status() === 404 && $this->model !== 'openai/gpt-oss-120b') {
            Log::warning("Groq model '{$this->model}' not found (404). Automatically retrying with openai/gpt-oss-120b...");
            $this->model = 'openai/gpt-oss-120b';
            $response = $sendRequest($this->model);
        }

        if ($response->status() === 429) {
            throw new RuntimeException('Free AI capacity is temporarily unavailable (Groq 429 rate limit).');
        }

        if ($response->status() === 401 || $response->status() === 403) {
            throw new RuntimeException('Invalid or expired Groq API key configuration.');
        }

        if (!$response->successful()) {
            $errorBody = $response->json();
            $errorMessage = $errorBody['error']['message'] ?? $response->body();
            throw new RuntimeException("Groq API error ({$response->status()}): {$errorMessage}");
        }

        $json = $response->json();
        $rawContent = $json['choices'][0]['message']['content'] ?? null;

        if (empty($rawContent)) {
            throw new RuntimeException('Received empty response from Groq AI provider.');
        }

        $parsed = json_decode($rawContent, true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($parsed)) {
            throw new RuntimeException('Failed to parse AI response as valid JSON: ' . json_last_error_msg());
        }

        // Attach token usage metadata if available
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
