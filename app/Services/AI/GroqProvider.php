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
        $rawKey = (string) ($apiKey ?? config('ai.groq.api_key', ''));
        $this->apiKey = trim(preg_replace('/[\r\n\t]+/', '', $rawKey));

        $configuredModel = (string) ($model ?? config('ai.groq.model', 'openai/gpt-oss-120b'));
        $configuredModel = trim(preg_replace('/[\r\n\t]+/', '', $configuredModel));

        // If an obsolete/unavailable model like llama-3.3-70b-versatile was configured in env, default to active Groq model
        if (empty($configuredModel) || str_contains($configuredModel, 'llama-3.3-70b-versatile')) {
            $configuredModel = 'openai/gpt-oss-120b';
        }
        $this->model = $configuredModel;

        $rawBaseUrl = (string) ($baseUrl ?? config('ai.groq.base_url', 'https://api.groq.com/openai/v1'));
        $this->baseUrl = trim(preg_replace('/[\r\n\t]+/', '', rtrim($rawBaseUrl, '/')));

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

        $candidateModels = array_values(array_unique([
            $this->model,
            'openai/gpt-oss-120b',
            'openai/gpt-oss-20b',
        ]));

        $response = null;
        $usedModel = $this->model;
        $lastErrorMsg = '';

        foreach ($candidateModels as $candidate) {
            $usedModel = $candidate;
            try {
                $response = $sendRequest($candidate);

                if ($response->successful()) {
                    $this->model = $usedModel;
                    break;
                }

                $status = $response->status();
                $body = $response->json();
                $lastErrorMsg = $body['error']['message'] ?? $response->body();

                Log::warning("Groq model '{$candidate}' returned HTTP {$status}: {$lastErrorMsg}. Attempting next model...");

                // If 401 or 403, key itself is invalid, don't keep looping
                if ($status === 401 || $status === 403) {
                    throw new RuntimeException('Invalid or expired Groq API key configuration.');
                }

                // If 429 or 404, continue to next model in the chain
            } catch (Throwable $e) {
                if ($e instanceof RuntimeException && str_contains($e->getMessage(), 'Invalid or expired')) {
                    throw $e;
                }
                $lastErrorMsg = $e->getMessage();
                Log::warning("Groq request to '{$candidate}' threw exception: {$lastErrorMsg}");
            }
        }

        if (!$response || !$response->successful()) {
            throw new RuntimeException("All Groq models failed. Last error: {$lastErrorMsg}");
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
