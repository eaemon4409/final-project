# Compare Anything — Implementation Plan

This document outlines the step-by-step implementation tasks for the **Compare Anything** AI-powered Chrome Extension according to the project specification.

---

## Day 1 — Chrome Extension Foundation

### Objectives:
- [x] Manifest V3 extension configuration (`manifest.json`).
- [x] Extension structure setup (TypeScript + React + Vite).
- [x] Popup UI matching specification (Header, current page, selected page cards, counter, goal input).
- [x] Add Current Page mechanism using `activeTab` & `chrome.scripting`.
- [x] `PageExtractor` engine (structured extraction, removing ads/scripts/nav, intelligent truncation to ~3,500 chars).
- [x] Selected-page cards with remove button.
- [x] `chrome.storage.local` persistence for snapshots, user goal, and anonymous install ID.
- [x] Maximum 4 pages limit enforcement.
- [x] Duplicate URL prevention.
- [x] Clear comparison action.
- [x] Optional user priority/goal field.

### End-of-Day 1 Verification Test:
- Add 4 pages from 4 different websites.
- Confirm structured snapshots are collected correctly and inspect stored payload.

---

## Day 2 — AI Backend API
- [x] Backend API service architecture (PHP 8.3 / Laravel 13 with clean Service-Provider pattern).
- [x] `POST /api/v1/compare` endpoint and `GET /api/v1/health` status route.
- [x] `IAIProvider` interface with `GroqProvider` (primary) and `OpenRouterProvider` (fallback).
- [x] Groq model configuration (`llama-3.3-70b-versatile` / `openai/gpt-oss-20b`).
- [x] Strict JSON schema validation and response normalization.
- [x] Zero-hallucination system prompt ("Not stated" rule, no invented facts, optional winner, prompt injection defense).
- [x] Rate limiting (`CompareRateLimiter` middleware: 10 comp/day/install + IP limit).
- [x] Error handling (429, invalid input, 2-4 page boundaries, timeouts).
- [x] Automated test suite (7 tests, 85 assertions in `tests/Feature/ComparisonApiTest.php`).
- [x] Standalone End-of-Day 2 Verification Test (`test_day2.php`).

---

## Day 3 — Complete Product Integration
- [x] Connect extension frontend to backend API (`src/services/apiService.ts`).
- [x] Build full results page (`results.html` in new tab with Google Chrome Native Light Theme).
- [x] Quick Verdict & Best Overall component with evidence citations (`QuickVerdict.tsx`).
- [x] Side-by-side comparison table with 5–10 dynamic criteria & winner highlighting (`ComparisonTable.tsx`).
- [x] Best For breakdown (`BestForSection.tsx`) & Key Differences (`KeyDifferences.tsx`).
- [x] Missing Information section with "Not stated" tracking (`MissingInformation.tsx`).
- [x] Source links (`SourcesList.tsx`) & Copy Comparison to clipboard (`copyComparisonToClipboard`).
- [x] Export to CSV (`downloadCsv`).
- [x] Storage caching & Start New Comparison action (`clearComparison`).
- [x] Unit & verification test suite (`test_day3.mjs`).

---

## Day 4 — Quality & Accuracy Testing
- [x] Test 6 categories: Electronics/Products, SaaS pricing, Jobs, Courses, Services, Articles (`TruthSheetAccuracyTest.php`).
- [x] Truth-sheet verification tests (zero hallucination guarantee — missing specs strictly return "Not stated").
- [x] Edge cases tested: 2/3/4 pages, long content intelligent truncation, duplicate URLs with tracking parameters, rate limiting.
- [x] Fixed tracking parameter stripping for major ecommerce sites (`spm`, `scm`, `aff_id` in `urlHelper.ts`).
- [x] Comprehensive Quality & Testing documentation created (`docs/TESTING.md`).
- [x] Client-side quality & accuracy test suite (`test_day4_quality.mjs`).

---

## Day 5 — Release & Chrome Web Store Assets
- [x] Production build and extension ZIP package (`release/compare-anything-extension-v1.0.0.zip`).
- [x] Privacy policy (`docs/PRIVACY.md`) and support page (`docs/SUPPORT.md`).
- [x] Store assets (icons, 5 promo screenshots at 1280x800, promo banner 440x280 in `store-assets/`).
- [x] Public `README.md` and Store listing copy (`docs/STORE_LISTING.md`).
