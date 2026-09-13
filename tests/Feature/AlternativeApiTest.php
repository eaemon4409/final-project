<?php

namespace Tests\Feature;

use App\Services\AI\IAIProvider;
use App\Services\AlternativeService;
use Tests\TestCase;

class AlternativeApiTest extends TestCase
{
    public function test_alternatives_endpoint_validates_title(): void
    {
        $response = $this->postJson('/api/v1/alternatives', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    public function test_alternatives_endpoint_returns_suggestions(): void
    {
        $mockProvider = $this->createMock(IAIProvider::class);
        $mockProvider->method('compare')->willReturn([
            'identifiedProduct' => 'ASUS Vivobook 15',
            'category' => 'Laptop',
            'currentPriceEstimate' => '৳65,000',
            'alternatives' => [
                [
                    'name' => 'Acer Aspire 5 A515',
                    'category' => 'Laptop',
                    'estimatedPriceRange' => '~৳60,000 (Slightly cheaper)',
                    'whyBetter' => 'Backlit keyboard & faster dual-channel memory',
                    'tradeOff' => 'Slightly thicker chassis',
                    'bestFor' => 'Students & Office work',
                    'searchKeyword' => 'Acer Aspire 5 A515',
                ],
                [
                    'name' => 'Lenovo IdeaPad Slim 3',
                    'category' => 'Laptop',
                    'estimatedPriceRange' => 'Similar Price (~৳64,000)',
                    'whyBetter' => 'Better battery efficiency and privacy webcam shutter',
                    'tradeOff' => 'Display viewing angles are narrower',
                    'bestFor' => 'Productivity & Remote work',
                    'searchKeyword' => 'Lenovo IdeaPad Slim 3',
                ],
            ],
        ]);

        $this->app->instance(AlternativeService::class, new AlternativeService($mockProvider));

        $response = $this->postJson('/api/v1/alternatives', [
            'title' => 'ASUS Vivobook 15 OLED Core i5',
            'domain' => 'startech.com.bd',
            'description' => 'ASUS Vivobook 15 Laptop with 16GB RAM and 512GB SSD',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'requestId',
                'data' => [
                    'identifiedProduct',
                    'category',
                    'currentPriceEstimate',
                    'alternatives' => [
                        '*' => [
                            'name',
                            'category',
                            'estimatedPriceRange',
                            'whyBetter',
                            'tradeOff',
                            'bestFor',
                            'searchKeyword',
                            'searchLinks' => [
                                'startech',
                                'ryans',
                                'daraz',
                                'google',
                                'amazon',
                            ],
                        ],
                    ],
                ],
            ]);
    }
}
