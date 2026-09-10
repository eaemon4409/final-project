<?php

namespace Tests\Feature;

use App\Services\ComparisonService;
use Tests\TestCase;

class TruthSheetAccuracyTest extends TestCase
{
    protected ComparisonService $comparisonService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->comparisonService = new ComparisonService();
    }

    /**
     * Category 1: Products / Electronics
     * Truth Sheet Test: Weight & GPU are intentionally omitted from Page 1 snapshot.
     * System MUST return 'Not stated' and MUST NOT hallucinate specs.
     */
    public function test_category_products_truth_sheet_zero_hallucination(): void
    {
        $payload = [
            'installId' => 'truth-sheet-test',
            'goal' => 'Best value laptop',
            'pages' => [
                [
                    'id' => 'page-1',
                    'url' => 'https://startech.com.bd/asus-vivobook-15',
                    'domain' => 'startech.com.bd',
                    'title' => 'ASUS Vivobook 15 X1504VA',
                    'importantText' => "Price: Tk 74,500\nProcessor: Intel Core i5-1335U\nRAM: 16GB DDR4\nStorage: 512GB SSD\nDisplay: 15.6 inch FHD\nWarranty: 2 Years", // Notice: NO Weight, NO GPU
                ],
                [
                    'id' => 'page-2',
                    'url' => 'https://ryans.com/lenovo-ideapad-5',
                    'domain' => 'ryans.com',
                    'title' => 'Lenovo IdeaPad 5',
                    'importantText' => "Price: Tk 78,000\nProcessor: AMD Ryzen 7 7730U\nRAM: 16GB DDR4\nStorage: 512GB SSD\nDisplay: 15.6 inch FHD\nWeight: 1.63 kg\nWarranty: 2 Years",
                ],
            ],
        ];

        $result = $this->comparisonService->compare($payload);

        $this->assertNotEmpty($result['comparisonTitle']);
        $this->assertCount(2, $result['items']);

        // Find Weight criterion
        $weightCrit = collect($result['criteria'])->firstWhere('name', 'Weight');
        $this->assertNotNull($weightCrit, 'Weight criterion should be evaluated');

        $p1Weight = collect($weightCrit['values'])->firstWhere('itemId', 'page-1');
        $this->assertEquals('Not stated', $p1Weight['value'], 'Page 1 weight MUST be strictly "Not stated"');

        $p2Weight = collect($weightCrit['values'])->firstWhere('itemId', 'page-2');
        $this->assertEquals('1.63 kg', $p2Weight['value']);

        // Check missing information tracking
        $missingPage1 = collect($result['missingInformation'])->firstWhere('itemId', 'page-1');
        $this->assertNotNull($missingPage1);
        $this->assertContains('Weight', $missingPage1['fields']);
    }

    /**
     * Category 2: SaaS Pricing Plans
     * Truth Sheet Test: API access is missing from Free Plan.
     */
    public function test_category_saas_pricing_comparison(): void
    {
        $payload = [
            'installId' => 'truth-sheet-saas',
            'goal' => 'Cheapest plan with team collaboration',
            'pages' => [
                [
                    'id' => 'page-1',
                    'url' => 'https://saas-service.com/starter',
                    'domain' => 'saas-service.com',
                    'title' => 'CloudSync Starter Plan',
                    'importantText' => "Price: $10/month\nUsers: Up to 5 users\nStorage: 50 GB cloud storage\nIntegrations: Slack, GitHub\nSupport: Community Forum",
                ],
                [
                    'id' => 'page-2',
                    'url' => 'https://saas-service.com/pro',
                    'domain' => 'saas-service.com',
                    'title' => 'CloudSync Pro Plan',
                    'importantText' => "Price: $25/month\nUsers: Unlimited users\nStorage: 500 GB cloud storage\nIntegrations: Slack, GitHub, Jira\nSupport: 24/7 Priority Support\nAPI Access: Full REST API access",
                ],
            ],
        ];

        $result = $this->comparisonService->compare($payload);

        $this->assertCount(2, $result['items']);
        $this->assertNotEmpty($result['bestOverall']['reason']);
    }

    /**
     * Category 3: Job Offers
     * Truth Sheet Test: Salary is unstated in Job B.
     */
    public function test_category_jobs_comparison_with_unstated_salary(): void
    {
        $payload = [
            'installId' => 'truth-sheet-jobs',
            'goal' => 'Best remote opportunity for junior engineer',
            'pages' => [
                [
                    'id' => 'page-1',
                    'url' => 'https://careers.company-a.com/job/101',
                    'domain' => 'company-a.com',
                    'title' => 'Junior Full Stack Engineer - TechCorp',
                    'importantText' => "Salary: Tk 60,000 - 80,000 / month\nLocation: Remote (Bangladesh)\nExperience: 1-2 years\nSkills: React, TypeScript, PHP, MySQL\nBenefits: Health insurance, 2 festival bonuses",
                ],
                [
                    'id' => 'page-2',
                    'url' => 'https://careers.company-b.com/job/202',
                    'domain' => 'company-b.com',
                    'title' => 'Software Engineer I - GlobalDev',
                    'importantText' => "Location: Hybrid (Dhaka)\nExperience: 1+ year\nSkills: JavaScript, Node.js, PostgreSQL\nBenefits: Annual performance bonus, Lunch provided\nSalary: Competitive", // No exact salary figure
                ],
            ],
        ];

        $result = $this->comparisonService->compare($payload);

        $this->assertCount(2, $result['items']);
        $this->assertNotEmpty($result['keyDifferences']);
    }

    /**
     * Category 4: Education & Courses
     */
    public function test_category_education_courses_comparison(): void
    {
        $payload = [
            'installId' => 'truth-sheet-education',
            'goal' => 'Fastest course to learn AI basics',
            'pages' => [
                [
                    'id' => 'page-1',
                    'url' => 'https://learning.org/course/ai-fundamentals',
                    'domain' => 'learning.org',
                    'title' => 'AI & Deep Learning Specialization',
                    'importantText' => "Price: $49/month\nDuration: 3 months (10 hours/week)\nLevel: Intermediate\nPrerequisites: Python programming, Linear Algebra\nCertificate: Yes",
                ],
                [
                    'id' => 'page-2',
                    'url' => 'https://academy.io/course/practical-ml',
                    'domain' => 'academy.io',
                    'title' => 'Practical Machine Learning Bootcamp',
                    'importantText' => "Price: $299 one-time\nDuration: 6 weeks intensive\nLevel: Beginner to Intermediate\nPrerequisites: Basic coding\nCertificate: Verified Certificate of Completion",
                ],
            ],
        ];

        $result = $this->comparisonService->compare($payload);

        $this->assertCount(2, $result['items']);
        $this->assertNotEmpty($result['criteria']);
    }

    /**
     * Category 5: Services & Cloud Hosting
     */
    public function test_category_services_hosting_comparison(): void
    {
        $payload = [
            'installId' => 'truth-sheet-services',
            'goal' => 'Best low-latency cloud server',
            'pages' => [
                [
                    'id' => 'page-1',
                    'url' => 'https://cloud-provider-a.com/droplet',
                    'domain' => 'cloud-provider-a.com',
                    'title' => 'Cloud Droplet Standard 2GB',
                    'importantText' => "Price: $12/month\nCPU: 1 vCPU\nRAM: 2 GB\nStorage: 50 GB NVMe SSD\nBandwidth: 2 TB transfer\nLocations: Singapore, Frankfurt, New York",
                ],
                [
                    'id' => 'page-2',
                    'url' => 'https://cloud-provider-b.com/vps',
                    'domain' => 'cloud-provider-b.com',
                    'title' => 'Compute VPS 2G',
                    'importantText' => "Price: $10/month\nCPU: 2 vCPU\nRAM: 2 GB\nStorage: 40 GB SSD\nBandwidth: 3 TB transfer\nLocations: Singapore, Tokyo",
                ],
            ],
        ];

        $result = $this->comparisonService->compare($payload);

        $this->assertCount(2, $result['items']);
        $this->assertNotEmpty($result['bestOverall']['reason']);
    }

    /**
     * Category 6: Two Articles on the Same Topic
     */
    public function test_category_articles_comparison(): void
    {
        $payload = [
            'installId' => 'truth-sheet-articles',
            'goal' => 'Understand pros and cons of TypeScript',
            'pages' => [
                [
                    'id' => 'page-1',
                    'url' => 'https://techblog.com/why-typescript',
                    'domain' => 'techblog.com',
                    'title' => 'Why Every Large Project Needs TypeScript',
                    'importantText' => "Author: Sarah Connor\nDate: 2026-01-15\nFocus: Type safety, refactoring confidence, IDE autocomplete, reducing runtime bugs.\nDrawbacks Mentioned: Initial compile time, learning curve.",
                ],
                [
                    'id' => 'page-2',
                    'url' => 'https://devinsights.io/typescript-fatigue',
                    'domain' => 'devinsights.io',
                    'title' => 'The Cost of TypeScript in Rapid Prototyping',
                    'importantText' => "Author: John Doe\nDate: 2026-02-10\nFocus: Developer velocity, complex generic types, build tooling friction for solo builders.\nRecommendations: Use JSDoc for small libraries, TypeScript for enterprise.",
                ],
            ],
        ];

        $result = $this->comparisonService->compare($payload);

        $this->assertCount(2, $result['items']);
        $this->assertNotEmpty($result['keyDifferences']);
    }

    /**
     * Edge Case: 3 Pages Comparison
     */
    public function test_edge_case_three_pages(): void
    {
        $payload = [
            'installId' => 'edge-3-pages',
            'pages' => [
                ['id' => 'page-1', 'url' => 'https://site.com/1', 'domain' => 'site.com', 'title' => 'P1', 'importantText' => 'Price: $100. RAM: 8GB.'],
                ['id' => 'page-2', 'url' => 'https://site.com/2', 'domain' => 'site.com', 'title' => 'P2', 'importantText' => 'Price: $120. RAM: 16GB.'],
                ['id' => 'page-3', 'url' => 'https://site.com/3', 'domain' => 'site.com', 'title' => 'P3', 'importantText' => 'Price: $140. RAM: 16GB.'],
            ],
        ];

        $result = $this->comparisonService->compare($payload);
        $this->assertCount(3, $result['items']);
    }

    /**
     * Edge Case: 4 Pages (Maximum allowed)
     */
    public function test_edge_case_four_pages(): void
    {
        $payload = [
            'installId' => 'edge-4-pages',
            'pages' => [
                ['id' => 'page-1', 'url' => 'https://site.com/1', 'domain' => 'site.com', 'title' => 'P1', 'importantText' => 'Price: $100. RAM: 8GB.'],
                ['id' => 'page-2', 'url' => 'https://site.com/2', 'domain' => 'site.com', 'title' => 'P2', 'importantText' => 'Price: $120. RAM: 16GB.'],
                ['id' => 'page-3', 'url' => 'https://site.com/3', 'domain' => 'site.com', 'title' => 'P3', 'importantText' => 'Price: $140. RAM: 16GB.'],
                ['id' => 'page-4', 'url' => 'https://site.com/4', 'domain' => 'site.com', 'title' => 'P4', 'importantText' => 'Price: $160. RAM: 32GB.'],
            ],
        ];

        $result = $this->comparisonService->compare($payload);
        $this->assertCount(4, $result['items']);
    }
}
