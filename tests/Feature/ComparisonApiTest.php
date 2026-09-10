<?php

namespace Tests\Feature;

use App\Services\AI\IAIProvider;
use App\Services\ComparisonService;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class ComparisonApiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    public function test_health_check_endpoint_returns_ok(): void
    {
        $response = $this->getJson('/api/v1/health');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
                'service' => 'Compare Anything AI Backend',
                'version' => '1.0.0',
            ]);
    }

    public function test_compare_endpoint_requires_at_least_two_pages(): void
    {
        $payload = [
            'installId' => 'test-install-uuid',
            'goal' => 'Best battery life',
            'pages' => [
                [
                    'id' => 'page-1',
                    'url' => 'https://startech.com.bd/asus-vivobook',
                    'domain' => 'startech.com.bd',
                    'title' => 'ASUS Vivobook 15',
                    'importantText' => 'Price: Tk 74,500. RAM: 16GB. Storage: 512GB SSD.',
                ],
            ],
        ];

        $response = $this->postJson('/api/v1/compare', $payload);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Add at least one more page to compare (2 to 4 pages required).',
            ]);
    }

    public function test_compare_endpoint_rejects_more_than_four_pages(): void
    {
        $makePage = fn ($i) => [
            'id' => "page-{$i}",
            'url' => "https://example.com/product-{$i}",
            'domain' => 'example.com',
            'title' => "Product {$i}",
            'importantText' => "Product description {$i}",
        ];

        $payload = [
            'installId' => 'test-install-uuid',
            'pages' => [
                $makePage(1),
                $makePage(2),
                $makePage(3),
                $makePage(4),
                $makePage(5),
            ],
        ];

        $response = $this->postJson('/api/v1/compare', $payload);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Maximum 4 pages can be compared at once.',
            ]);
    }

    public function test_compare_endpoint_requires_install_id(): void
    {
        $payload = [
            'pages' => [
                [
                    'id' => 'page-1',
                    'url' => 'https://startech.com.bd/asus',
                    'domain' => 'startech.com.bd',
                    'title' => 'ASUS',
                    'importantText' => 'Specs',
                ],
                [
                    'id' => 'page-2',
                    'url' => 'https://ryans.com/lenovo',
                    'domain' => 'ryans.com',
                    'title' => 'Lenovo',
                    'importantText' => 'Specs',
                ],
            ],
        ];

        $response = $this->postJson('/api/v1/compare', $payload);

        $response->assertStatus(422)
            ->assertJsonStructure(['errors' => ['installId']]);
    }

    public function test_successful_comparison_matches_strict_schema(): void
    {
        // Mock AI Provider returning structured output
        $mockProvider = new class implements IAIProvider {
            public function compare(array $payload): array
            {
                return [
                    'comparisonTitle' => 'ASUS Vivobook 15 vs Lenovo IdeaPad 5',
                    'comparisonType' => 'Laptops',
                    'goal' => 'Programming under Tk 80,000',
                    'items' => [
                        [
                            'id' => 'page-1',
                            'displayName' => 'ASUS Vivobook 15',
                            'shortDescription' => 'Core i5 13th Gen laptop with 16GB RAM.',
                        ],
                        [
                            'id' => 'page-2',
                            'displayName' => 'Lenovo IdeaPad 5',
                            'shortDescription' => 'Ryzen 7 7730U laptop with 16GB RAM.',
                        ],
                    ],
                    'criteria' => [
                        [
                            'name' => 'Price',
                            'importance' => 'high',
                            'values' => [
                                ['itemId' => 'page-1', 'value' => 'Tk 74,500', 'confidence' => 'high'],
                                ['itemId' => 'page-2', 'value' => 'Tk 78,000', 'confidence' => 'high'],
                            ],
                            'winnerItemIds' => ['page-1'],
                        ],
                        [
                            'name' => 'Processor',
                            'importance' => 'high',
                            'values' => [
                                ['itemId' => 'page-1', 'value' => 'Core i5-1335U', 'confidence' => 'high'],
                                ['itemId' => 'page-2', 'value' => 'Ryzen 7 7730U', 'confidence' => 'high'],
                            ],
                            'winnerItemIds' => ['page-2'],
                        ],
                        [
                            'name' => 'Weight',
                            'importance' => 'medium',
                            'values' => [
                                ['itemId' => 'page-1', 'value' => 'Not stated', 'confidence' => 'high'],
                                ['itemId' => 'page-2', 'value' => '1.63 kg', 'confidence' => 'high'],
                            ],
                            'winnerItemIds' => ['page-2'],
                        ],
                    ],
                    'bestOverall' => [
                        'itemId' => 'page-2',
                        'reason' => 'Offers Ryzen 7 8-core performance within the Tk 80,000 budget.',
                    ],
                    'bestFor' => [
                        [
                            'label' => 'Lowest Price',
                            'itemId' => 'page-1',
                            'reason' => 'Lowest listed price at Tk 74,500.',
                        ],
                        [
                            'label' => 'Best Multitasking',
                            'itemId' => 'page-2',
                            'reason' => 'Stronger multi-core CPU benchmarks.',
                        ],
                    ],
                    'keyDifferences' => [
                        'Lenovo features AMD Ryzen 7 while ASUS features Intel Core i5.',
                        'ASUS is Tk 3,500 cheaper.',
                        'ASUS does not state weight in its specs.',
                    ],
                    'missingInformation' => [
                        [
                            'itemId' => 'page-1',
                            'fields' => ['Weight', 'Battery capacity'],
                        ],
                    ],
                ];
            }

            public function getName(): string
            {
                return 'MockTestProvider';
            }
        };

        // Bind mock service in container
        $this->app->instance(ComparisonService::class, new ComparisonService($mockProvider));

        $payload = [
            'installId' => 'anon-guid-1234',
            'goal' => 'Programming under Tk 80,000',
            'pages' => [
                [
                    'id' => 'page-1',
                    'url' => 'https://startech.com.bd/asus-vivobook',
                    'domain' => 'startech.com.bd',
                    'title' => 'ASUS Vivobook 15',
                    'importantText' => 'Price: Tk 74,500. Core i5-1335U. 16GB RAM. 512GB SSD.',
                ],
                [
                    'id' => 'page-2',
                    'url' => 'https://ryans.com/lenovo-ideapad-5',
                    'domain' => 'ryans.com',
                    'title' => 'Lenovo IdeaPad 5',
                    'importantText' => 'Price: Tk 78,000. Ryzen 7 7730U. 16GB RAM. 512GB SSD. 1.63 kg.',
                ],
            ],
        ];

        $response = $this->postJson('/api/v1/compare', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'comparisonTitle' => 'ASUS Vivobook 15 vs Lenovo IdeaPad 5',
                    'comparisonType' => 'Laptops',
                    'goal' => 'Programming under Tk 80,000',
                    'bestOverall' => [
                        'itemId' => 'page-2',
                    ],
                ],
            ])
            ->assertJsonStructure([
                'success',
                'requestId',
                'data' => [
                    'comparisonTitle',
                    'comparisonType',
                    'goal',
                    'items' => [
                        '*' => ['id', 'displayName', 'shortDescription'],
                    ],
                    'criteria' => [
                        '*' => [
                            'name',
                            'importance',
                            'values' => [
                                '*' => ['itemId', 'value', 'confidence'],
                            ],
                            'winnerItemIds',
                        ],
                    ],
                    'bestOverall' => ['itemId', 'reason'],
                    'bestFor' => [
                        '*' => ['label', 'itemId', 'reason'],
                    ],
                    'keyDifferences',
                    'missingInformation' => [
                        '*' => ['itemId', 'fields'],
                    ],
                ],
            ]);
    }

    public function test_zero_hallucination_normalizes_missing_values_to_not_stated(): void
    {
        $mockProvider = new class implements IAIProvider {
            public function compare(array $payload): array
            {
                return [
                    'comparisonTitle' => 'Product Comparison',
                    'comparisonType' => 'Hardware',
                    'items' => [
                        ['id' => 'page-1', 'displayName' => 'Item A'],
                        ['id' => 'page-2', 'displayName' => 'Item B'],
                    ],
                    'criteria' => [
                        [
                            'name' => 'Warranty',
                            'values' => [
                                ['itemId' => 'page-1', 'value' => 'null'], // string "null"
                                ['itemId' => 'page-2', 'value' => ''],     // empty string
                            ],
                        ],
                    ],
                    'bestOverall' => [
                        'itemId' => null, // No clear winner
                        'reason' => 'No clear winner: information is insufficient.',
                    ],
                ];
            }

            public function getName(): string { return 'Mock'; }
        };

        $this->app->instance(ComparisonService::class, new ComparisonService($mockProvider));

        $payload = [
            'installId' => 'anon-guid-1234',
            'pages' => [
                [
                    'id' => 'page-1',
                    'url' => 'https://example.com/a',
                    'domain' => 'example.com',
                    'title' => 'Item A',
                    'importantText' => 'No warranty mentioned.',
                ],
                [
                    'id' => 'page-2',
                    'url' => 'https://example.com/b',
                    'domain' => 'example.com',
                    'title' => 'Item B',
                    'importantText' => 'No warranty mentioned.',
                ],
            ],
        ];

        $response = $this->postJson('/api/v1/compare', $payload);

        $response->assertStatus(200);
        $data = $response->json('data');

        // Check values normalized to 'Not stated'
        $this->assertEquals('Not stated', $data['criteria'][0]['values'][0]['value']);
        $this->assertEquals('Not stated', $data['criteria'][0]['values'][1]['value']);

        // Check nullable bestOverall.itemId is allowed
        $this->assertNull($data['bestOverall']['itemId']);
        $this->assertStringContainsString('No clear winner', $data['bestOverall']['reason']);
    }

    public function test_rate_limiter_blocks_requests_exceeding_daily_limit(): void
    {
        config(['ai.rate_limit.daily_per_install' => 2]);

        $mockProvider = new class implements IAIProvider {
            public function compare(array $payload): array
            {
                return [
                    'comparisonTitle' => 'Test',
                    'items' => [
                        ['id' => 'page-1', 'displayName' => 'P1'],
                        ['id' => 'page-2', 'displayName' => 'P2'],
                    ],
                    'criteria' => [],
                    'bestOverall' => ['itemId' => 'page-1', 'reason' => 'Test'],
                ];
            }
            public function getName(): string { return 'Mock'; }
        };

        $this->app->instance(ComparisonService::class, new ComparisonService($mockProvider));

        $payload = [
            'installId' => 'limited-install-id-999',
            'pages' => [
                [
                    'id' => 'page-1',
                    'url' => 'https://example.com/1',
                    'domain' => 'example.com',
                    'title' => '1',
                    'importantText' => 'text',
                ],
                [
                    'id' => 'page-2',
                    'url' => 'https://example.com/2',
                    'domain' => 'example.com',
                    'title' => '2',
                    'importantText' => 'text',
                ],
            ],
        ];

        // 1st request -> success
        $r1 = $this->postJson('/api/v1/compare', $payload);
        $r1->assertStatus(200);

        // 2nd request -> success
        $r2 = $this->postJson('/api/v1/compare', $payload);
        $r2->assertStatus(200);

        // 3rd request -> rate limited 429
        $r3 = $this->postJson('/api/v1/compare', $payload);
        $r3->assertStatus(429)
            ->assertJson([
                'success' => false,
                'message' => "Today's free comparison limit has been reached. Please try again later.",
                'error_code' => 'RATE_LIMIT_EXCEEDED',
            ]);
    }
}
