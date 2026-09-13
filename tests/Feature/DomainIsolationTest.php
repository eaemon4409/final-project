<?php

namespace Tests\Feature;

use App\Services\ComparisonService;
use Tests\TestCase;

class DomainIsolationTest extends TestCase
{
    protected ComparisonService $comparisonService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->comparisonService = new ComparisonService();
    }

    /**
     * Test that smartphones with "Night mode" photography never get misclassified as Hotels,
     * and strictly show smartphone specifications rather than hotel parameters.
     */
    public function test_smartphone_with_night_mode_never_classified_as_hotel_and_has_phone_specs(): void
    {
        $payload = [
            'installId' => 'domain-isolation-test',
            'goal' => 'best camera and performance',
            'pages' => [
                [
                    'id' => 'phone-1',
                    'url' => 'https://startech.com.bd/samsung-galaxy-s24-ultra',
                    'domain' => 'startech.com.bd',
                    'title' => 'Samsung Galaxy S24 Ultra 5G Smartphone',
                    'description' => 'Samsung Galaxy S24 Ultra features Night mode photography, Snapdragon 8 Gen 3, and 5000mAh battery. Free delivery available.',
                    'importantText' => "--- SPECIFICATION TABLES ---\nProcessor | Qualcomm Snapdragon 8 Gen 3 (4 nm)\nRAM | 12GB LPDDR5X\nStorage | 256GB UFS 4.0\nDisplay | 6.8 inches Dynamic LTPO AMOLED 2X, 120Hz\nRear Camera | 200 MP wide + 50 MP periscope telephoto\nFront Camera | 12 MP\nBattery | 5000 mAh, 45W wired charging\nOperating System | Android 14, One UI 6.1\nPrice | Tk 185,000\nWarranty | 1 Year Official",
                ],
                [
                    'id' => 'phone-2',
                    'url' => 'https://startech.com.bd/apple-iphone-15-pro-max',
                    'domain' => 'startech.com.bd',
                    'title' => 'Apple iPhone 15 Pro Max',
                    'description' => 'Apple iPhone 15 Pro Max with A17 Pro chip, Night scene portrait, 4441mAh battery, and Titanium design.',
                    'importantText' => "--- SPECIFICATION TABLES ---\nProcessor | Apple A17 Pro (3 nm)\nRAM | 8GB\nStorage | 256GB NVMe\nDisplay | 6.7 inches Super Retina XDR OLED, 120Hz ProMotion\nRear Camera | 48 MP wide + 12 MP periscope telephoto\nFront Camera | 12 MP TrueDepth\nBattery | 4441 mAh, 25W wired\nOperating System | iOS 17\nPrice | Tk 195,000\nWarranty | 1 Year Apple Official",
                ]
            ],
        ];

        $result = $this->comparisonService->compare($payload);

        $this->assertNotEquals('Hotels & Accommodations', $result['comparisonType'], 'Smartphones must NOT be classified as Hotels');

        $criterionNames = array_column($result['criteria'], 'name');

        // MUST NOT contain hotel parameters
        $this->assertNotContains('Room Types & Beds', $criterionNames, 'Phone comparison must never have Room Types');
        $this->assertNotContains('Breakfast', $criterionNames, 'Phone comparison must never have Breakfast');
        $this->assertNotContains('Swimming Pool', $criterionNames, 'Phone comparison must never have Swimming Pool');
        $this->assertNotContains('Airport Shuttle', $criterionNames, 'Phone comparison must never have Airport Shuttle');
        $this->assertNotContains('Check-in / Check-out', $criterionNames, 'Phone comparison must never have Check-in / Check-out');
        $this->assertNotContains('Price per night', $criterionNames, 'Phone comparison must never have Price per night');

        // MUST contain smartphone specifications
        $this->assertTrue(
            in_array('Processor', $criterionNames) || in_array('Display', $criterionNames) || in_array('Battery', $criterionNames),
            'Phone comparison must contain genuine smartphone specifications'
        );
    }

    /**
     * Test that arbitrary products (e.g. Drones, Electronics) have their dynamic specification
     * table rows accurately parsed and extracted into criteria.
     */
    public function test_dynamic_specification_table_parser_extracts_arbitrary_product_specs(): void
    {
        $payload = [
            'installId' => 'arbitrary-spec-test',
            'goal' => 'longest flight time',
            'pages' => [
                [
                    'id' => 'drone-1',
                    'url' => 'https://startech.com.bd/dji-mini-4-pro',
                    'domain' => 'startech.com.bd',
                    'title' => 'DJI Mini 4 Pro Drone',
                    'description' => 'Under 249g mini camera drone with 4K/60fps HDR video, 34-min flight time.',
                    'importantText' => "--- SPECIFICATION TABLES ---\nTakeoff Weight | 249 g\nMax Flight Time | 34 mins\nMax Transmission Range | 20 km FHD\nVideo Resolution | 4K at 60fps HDR\nSensor | 1/1.3-inch CMOS\nObstacle Sensing | Omnidirectional\nPrice | Tk 115,000",
                ],
                [
                    'id' => 'drone-2',
                    'url' => 'https://startech.com.bd/dji-air-3',
                    'domain' => 'startech.com.bd',
                    'title' => 'DJI Air 3 Drone',
                    'description' => 'Dual primary camera drone with 46-min flight time, omnidirectional obstacle sensing.',
                    'importantText' => "--- SPECIFICATION TABLES ---\nTakeoff Weight | 720 g\nMax Flight Time | 46 mins\nMax Transmission Range | 20 km FHD\nVideo Resolution | 4K at 100fps\nSensor | Dual 1/1.3-inch CMOS\nObstacle Sensing | Omnidirectional\nPrice | Tk 165,000",
                ]
            ]
        ];

        $result = $this->comparisonService->compare($payload);

        $criterionNames = array_column($result['criteria'], 'name');
        $this->assertContains('Max Flight Time', $criterionNames);
        $this->assertContains('Video Resolution', $criterionNames);
        $this->assertContains('Takeoff Weight', $criterionNames);

        // Verify values
        $flightTimeCrit = collect($result['criteria'])->firstWhere('name', 'Max Flight Time');
        $this->assertNotNull($flightTimeCrit);
        $d1Val = collect($flightTimeCrit['values'])->firstWhere('itemId', 'drone-1');
        $this->assertEquals('34 mins', $d1Val['value']);
    }

    /**
     * Test that genuine hotels still extract hotel parameters cleanly.
     */
    public function test_genuine_hotel_comparison_extracts_hotel_attributes(): void
    {
        $payload = [
            'installId' => 'hotel-test',
            'goal' => 'best luxury stay',
            'pages' => [
                [
                    'id' => 'hotel-1',
                    'url' => 'https://booking.com/hotel-intercontinental-dhaka',
                    'domain' => 'booking.com',
                    'title' => 'InterContinental Dhaka Hotel & Resort',
                    'description' => 'Luxury hotel with outdoor swimming pool, free breakfast, deluxe king rooms, spa.',
                    'importantText' => "--- SPECIFICATION TABLES ---\nRoom Types & Beds | Deluxe King Bed\nCheck-in / Check-out | Check-in 14:00, Check-out 12:00\nCancellation Policy | Free cancellation until 24h\nPrice per night | Tk 22,000\n--- KEY FEATURES ---\nOutdoor swimming pool, free wifi, complimentary breakfast, airport shuttle available.",
                ],
                [
                    'id' => 'hotel-2',
                    'url' => 'https://booking.com/radisson-blu-dhaka',
                    'domain' => 'booking.com',
                    'title' => 'Radisson Blu Water Garden Hotel',
                    'description' => 'Water garden resort with pool, tennis court, free breakfast, superior twin rooms.',
                    'importantText' => "--- SPECIFICATION TABLES ---\nRoom Types & Beds | Superior Twin Beds\nCheck-in / Check-out | Check-in 15:00, Check-out 12:00\nCancellation Policy | Non-refundable\nPrice per night | Tk 19,500\n--- KEY FEATURES ---\nSwimming pool, free wifi, buffet breakfast, fitness center.",
                ]
            ]
        ];

        $result = $this->comparisonService->compare($payload);

        $this->assertStringContainsString('Hotel', $result['comparisonType']);
        $criterionNames = array_column($result['criteria'], 'name');

        $hasHotelSpecs = collect($criterionNames)->contains(fn($n) => 
            str_contains(strtolower($n), 'room') || 
            str_contains(strtolower($n), 'check') || 
            str_contains(strtolower($n), 'cancel') || 
            str_contains(strtolower($n), 'wifi') ||
            str_contains(strtolower($n), 'breakfast') ||
            str_contains(strtolower($n), 'pool')
        );
        $this->assertTrue($hasHotelSpecs, 'Hotel comparison must contain genuine hotel-related criteria');

        $this->assertNotContains('Processor', $criterionNames, 'Hotels must not contain Processor');
        $this->assertNotContains('RAM', $criterionNames, 'Hotels must not contain RAM');
        $this->assertNotContains('GPU', $criterionNames, 'Hotels must not contain GPU');
    }
}
