<?php

namespace App\Services;

use App\Services\AI\GroqProvider;
use App\Services\AI\IAIProvider;
use App\Services\AI\OpenRouterProvider;
use Illuminate\Support\Facades\Log;
use Throwable;

class AlternativeService
{
    protected IAIProvider $primaryProvider;
    protected ?IAIProvider $fallbackProvider;

    public function __construct(?IAIProvider $primary = null, ?IAIProvider $fallback = null)
    {
        $default = config('ai.default_provider', 'groq');

        if ($primary !== null) {
            $this->primaryProvider = $primary;
            $this->fallbackProvider = $fallback;
        } else {
            if ($default === 'openrouter') {
                $this->primaryProvider = new OpenRouterProvider();
                $this->fallbackProvider = new GroqProvider();
            } else {
                $this->primaryProvider = new GroqProvider();
                $this->fallbackProvider = new OpenRouterProvider();
            }
        }
    }

    /**
     * Find 2-3 direct alternatives and better deals for a given webpage/product.
     *
     * @param array{
     *     title: string,
     *     url?: string|null,
     *     domain?: string|null,
     *     description?: string|null,
     *     importantText?: string|null,
     *     price?: string|null
     * } $item
     * @return array<string, mixed>
     */
    public function findAlternatives(array $item): array
    {
        $systemPrompt = $this->buildSystemPrompt();
        $userPrompt = $this->buildUserPrompt($item);

        try {
            $rawOutput = $this->primaryProvider->compare([
                'systemPrompt' => $systemPrompt,
                'userPrompt' => $userPrompt,
            ]);

            return $this->normalizeOutput($rawOutput, $item);
        } catch (Throwable $e) {
            Log::warning('Primary AI provider failed for alternatives, attempting fallback', [
                'error' => $e->getMessage(),
            ]);

            if ($this->fallbackProvider !== null) {
                try {
                    $rawOutput = $this->fallbackProvider->compare([
                        'systemPrompt' => $systemPrompt,
                        'userPrompt' => $userPrompt,
                    ]);
                    return $this->normalizeOutput($rawOutput, $item);
                } catch (Throwable $fallbackError) {
                    Log::error('Fallback AI provider also failed for alternatives', [
                        'error' => $fallbackError->getMessage(),
                    ]);
                }
            }

            return $this->generateFallbackAlternatives($item);
        }
    }

    protected function buildSystemPrompt(): string
    {
        return <<<'PROMPT'
You are Compare Anything AI's Smart Alternative & Deal Discovery Engine.
The user is viewing a product or service webpage. Your goal is to identify the product/service and recommend 2 to 3 real, direct, highly relevant competing alternatives in the same budget range and category.

Rules:
1. Provide exactly 2 to 3 direct market competitors (e.g. if viewing ASUS Vivobook 15, suggest Acer Aspire 5, Lenovo IdeaPad Slim 3, HP 15s).
2. For each alternative, give:
   - "name": Full brand and model name
   - "category": e.g. "Laptop", "Smartphone", "Monitor", "Web Hosting", etc.
   - "estimatedPriceRange": Relative price indicator (e.g. "Similar Price (~$650 / ৳72,000)", "~৳4,000 less (Budget deal)", or "Slightly higher for premium build")
   - "whyBetter": The single biggest advantage over the user's current item (e.g. "Better battery life & backlit keyboard", "Higher refresh rate display")
   - "tradeOff": The realistic downside or compromise (e.g. "Slightly heavier plastic chassis", "Fewer USB ports")
   - "bestFor": Target user type (e.g. "Students & Budget Shoppers", "Office Multitasking")
   - "searchKeyword": The exact 2-4 word query to search this product on e-commerce sites (e.g. "Acer Aspire 5 A515 i5")
3. Return ONLY valid JSON with no markdown wrapping:
{
  "identifiedProduct": "Clean name of current item",
  "category": "Category",
  "currentPriceEstimate": "Price if detected or Not Specified",
  "alternatives": [
    {
      "name": "...",
      "category": "...",
      "estimatedPriceRange": "...",
      "whyBetter": "...",
      "tradeOff": "...",
      "bestFor": "...",
      "searchKeyword": "..."
    }
  ]
}
PROMPT;
    }

    protected function buildUserPrompt(array $item): string
    {
        $title = $item['title'] ?? 'Unknown Item';
        $domain = $item['domain'] ?? '';
        $desc = mb_substr($item['description'] ?? '', 0, 300);
        $snippet = mb_substr($item['importantText'] ?? '', 0, 800);

        return "CURRENT WEBPAGE / PRODUCT INFO:\n" .
               "Title: {$title}\n" .
               "Store / Domain: {$domain}\n" .
               "Description: {$desc}\n" .
               "Extracted Details: {$snippet}\n\n" .
               "Please identify the product and recommend 2-3 direct alternative competitors with better deals or advantages in valid JSON format.";
    }

    /**
     * @param array<string, mixed>|string $rawOutput
     * @param array<string, mixed> $item
     * @return array<string, mixed>
     */
    protected function normalizeOutput($rawOutput, array $item): array
    {
        $decoded = is_array($rawOutput) ? $rawOutput : null;

        if ($decoded === null && is_string($rawOutput)) {
            $clean = trim($rawOutput);
            if (preg_match('/```(?:json)?\s*(.*?)\s*```/is', $clean, $matches)) {
                $clean = $matches[1];
            }
            $decoded = json_decode($clean, true);
        }

        if (!is_array($decoded) || empty($decoded['alternatives'])) {
            return $this->generateFallbackAlternatives($item);
        }

        $alternatives = [];
        foreach ($decoded['alternatives'] as $alt) {
            if (!is_array($alt) || empty($alt['name'])) {
                continue;
            }

            $keyword = (string) ($alt['searchKeyword'] ?? $alt['name']);
            $encodedKw = urlencode($keyword);

            $alternatives[] = [
                'name' => (string) $alt['name'],
                'category' => (string) ($alt['category'] ?? ($decoded['category'] ?? 'General')),
                'estimatedPriceRange' => (string) ($alt['estimatedPriceRange'] ?? 'Competitive Price'),
                'whyBetter' => (string) ($alt['whyBetter'] ?? 'Great overall value & performance'),
                'tradeOff' => (string) ($alt['tradeOff'] ?? 'Minor differences in design/ports'),
                'bestFor' => (string) ($alt['bestFor'] ?? 'Value seekers'),
                'searchKeyword' => $keyword,
                'searchLinks' => [
                    'startech' => "https://www.startech.com.bd/product/search?search={$encodedKw}",
                    'ryans' => "https://www.ryans.com/search?q={$encodedKw}",
                    'daraz' => "https://www.daraz.com.bd/catalog/?q={$encodedKw}",
                    'google' => "https://www.google.com/search?q={$encodedKw}+price",
                    'amazon' => "https://www.amazon.com/s?k={$encodedKw}",
                ],
            ];
        }

        if (empty($alternatives)) {
            return $this->generateFallbackAlternatives($item);
        }

        return [
            'identifiedProduct' => (string) ($decoded['identifiedProduct'] ?? ($item['title'] ?? 'Selected Item')),
            'category' => (string) ($decoded['category'] ?? 'General'),
            'currentPriceEstimate' => (string) ($decoded['currentPriceEstimate'] ?? 'Market Price'),
            'alternatives' => $alternatives,
        ];
    }

    protected function generateFallbackAlternatives(array $item): array
    {
        $title = $item['title'] ?? 'Product';
        // Extract basic keywords from title
        $cleanTitle = preg_replace('/[^\w\s-]/', '', $title) ?? $title;
        $words = array_slice(explode(' ', trim($cleanTitle)), 0, 3);
        $baseKw = implode(' ', $words);
        $encodedKw = urlencode($baseKw);

        return [
            'identifiedProduct' => $title,
            'category' => 'Product Comparison',
            'currentPriceEstimate' => 'Market Price',
            'alternatives' => [
                [
                    'name' => "Alternative {$baseKw} Deals",
                    'category' => 'Alternative Options',
                    'estimatedPriceRange' => 'Check live prices across stores',
                    'whyBetter' => 'Explore current stock, discounts and warranty deals from verified retailers',
                    'tradeOff' => 'Specifications vary by retailer and model revision',
                    'bestFor' => 'Smart Shoppers comparing local availability',
                    'searchKeyword' => $baseKw,
                    'searchLinks' => [
                        'startech' => "https://www.startech.com.bd/product/search?search={$encodedKw}",
                        'ryans' => "https://www.ryans.com/search?q={$encodedKw}",
                        'daraz' => "https://www.daraz.com.bd/catalog/?q={$encodedKw}",
                        'google' => "https://www.google.com/search?q={$encodedKw}+deals",
                        'amazon' => "https://www.amazon.com/s?k={$encodedKw}",
                    ],
                ],
            ],
        ];
    }
}
