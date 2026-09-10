<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default AI Provider
    |--------------------------------------------------------------------------
    |
    | The primary provider used for comparison analysis. Can be 'groq' or 'openrouter'.
    |
    */
    'default_provider' => env('AI_PROVIDER', 'groq'),

    /*
    |--------------------------------------------------------------------------
    | Groq Provider Configuration
    |--------------------------------------------------------------------------
    |
    | Ultra-fast inference provider. Supports strict JSON output format.
    | Spec model: openai/gpt-oss-20b or llama-3.3-70b-versatile
    |
    */
    'groq' => [
        'api_key' => env('GROQ_API_KEY', ''),
        'model' => env('GROQ_MODEL', 'openai/gpt-oss-120b'),
        'base_url' => env('GROQ_BASE_URL', 'https://api.groq.com/openai/v1'),
        'timeout' => env('GROQ_TIMEOUT', 45),
    ],

    /*
    |--------------------------------------------------------------------------
    | OpenRouter Fallback Provider
    |--------------------------------------------------------------------------
    |
    | Fallback provider in case Groq is unavailable or rate limited.
    |
    */
    'openrouter' => [
        'api_key' => env('OPENROUTER_API_KEY', ''),
        'model' => env('OPENROUTER_MODEL', 'meta-llama/llama-3.3-70b-instruct'),
        'base_url' => env('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1'),
        'timeout' => env('OPENROUTER_TIMEOUT', 45),
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting & Abuse Prevention
    |--------------------------------------------------------------------------
    |
    | Maximum number of comparisons allowed per installation and IP per day.
    |
    */
    'rate_limit' => [
        'daily_per_install' => (int) env('AI_RATE_LIMIT_PER_INSTALL', 10),
        'daily_per_ip' => (int) env('AI_RATE_LIMIT_PER_IP', 30),
    ],
];
