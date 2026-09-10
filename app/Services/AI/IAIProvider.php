<?php

namespace App\Services\AI;

interface IAIProvider
{
    /**
     * Compare page snapshots and return a structured comparison payload.
     *
     * @param array{
     *     installId: string,
     *     goal: string|null,
     *     pages: array<int, array{
     *         id: string,
     *         url: string,
     *         domain: string,
     *         title: string,
     *         description?: string|null,
     *         importantText: string,
     *         structuredData?: string|null,
     *         capturedAt?: string|null
     *     }>
     * } $payload
     * @return array The verified comparison result matching the strict schema.
     */
    public function compare(array $payload): array;

    /**
     * Get the name of this AI provider.
     */
    public function getName(): string;
}
