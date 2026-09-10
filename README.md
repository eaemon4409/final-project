# Compare Anything — AI Web Comparison

> **Stop switching between tabs. Compare them.**  
> Add 2 to 4 web pages and get one clear, evidence-based side-by-side comparison table in seconds—powered by ultra-fast AI inference.

[![Manifest V3](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Laravel 13](https://img.shields.io/badge/Backend-Laravel_13-FF2D20?logo=laravel&logoColor=white)](https://laravel.com/)
[![Groq Fast Inference](https://img.shields.io/badge/AI_Engine-Groq_Inference-F05A28?logo=fastapi&logoColor=white)](https://groq.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-48_Passed_(185_assertions)-34A853?logo=checkmarx&logoColor=white)](tests/)
[![Zero Hallucination](https://img.shields.io/badge/Guarantee-Zero_Hallucination-1A73E8)](docs/TESTING.md)

---

## 🌟 Overview

When shopping online, evaluating SaaS subscription plans, reviewing job offers, or researching university courses, people routinely keep 5 to 15 browser tabs open, constantly clicking back and forth to mentally cross-reference specs and pricing.

**Compare Anything** solves this tab-switching fatigue:
1. Navigate to any 2, 3, or 4 web pages.
2. Click **"Add Current Page"** on each tab.
3. (Optional) Enter your personal priority (e.g. *"Best laptop for programming under Tk 80,000"*).
4. Click **"Compare"** to launch an instant, clean, side-by-side comparison dashboard.

---

## 🛡️ Zero-Hallucination Guarantee

Most AI comparison tools make assumptions or hallucinate missing specs from their general training data.

**Compare Anything operates under a strict Zero-Hallucination policy:**
- Every price, battery rating, processor speed, and specification is extracted **strictly from the text of your selected pages**.
- If a manufacturer or website omits a specification (such as weight, warranty, or battery capacity), the comparison table strictly reports **`"Not stated"`**—protecting you from false assumptions.
- Tested and verified across 6 major categories in [docs/TESTING.md](docs/TESTING.md).

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| 📑 **2 to 4 Page Stacks** | Compare products from competing retailers (Star Tech vs Ryans vs Daraz) or completely different items. |
| ⚡ **Quick Verdict** | AI-driven top recommendation with concrete evidence citations based on your personal goal. |
| 📊 **Dynamic Comparison Matrix** | Automatically identifies 5–10 relevant criteria with category winners highlighted in green. |
| 🎯 **"Best For" Breakdown** | Highlights which item is best for budget buyers, power users, or portability. |
| 🔍 **Missing Information Alerts** | Transparently flags any important specifications that pages failed to mention. |
| 📥 **One-Click Export** | Download the comparison as a clean `.csv` spreadsheet or copy formatted markdown to your clipboard. |
| 🔒 **100% Private & Ephemeral** | Zero passive background browsing tracking. Page content is processed in volatile memory and never stored in server databases. |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Chrome Browser                       │
│  ┌──────────────────────┐    ┌──────────────────────┐  │
│  │     Extension Popup   │    │     Results Tab      │  │
│  │  (React 18 + Vite)   │    │  (Chrome Light UI)   │  │
│  └──────────┬───────────┘    └──────────▲───────────┘  │
│             │ activeTab                 │              │
│             ▼                           │              │
│  ┌──────────────────────┐               │              │
│  │    PageExtractor     │               │              │
│  │ (Stripped DOM specs) │               │              │
│  └──────────┬───────────┘               │              │
│             │ chrome.storage.local      │              │
└─────────────┼───────────────────────────┼──────────────┘
              │ HTTPS POST /api/v1/compare│
              ▼                           │
┌─────────────────────────────────────────┴──────────────┐
│                  Laravel 13 API Backend                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │ CompareRateLimiter (10 req/day/install + IP cap) │  │
│  └──────────────────────────┬───────────────────────┘  │
│                             ▼                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ComparisonService (Zero-Hallucination Prompt)   │  │
│  └─────────────┬──────────────────────┬─────────────┘  │
│                ▼                      ▼                │
│    ┌──────────────────────┐ ┌──────────────────────┐   │
│    │     Groq Provider    │ │ OpenRouter (Fallback)│   │
│    │ (gpt-oss-120b / 20b) │ │ (llama-3.3-70b-inst) │   │
│    └──────────────────────┘ └──────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **PHP** (8.2 or 8.3) with SQLite & cURL extensions
- **Composer**
- **Google Chrome** browser

---

### 2. Backend Setup

```powershell
# 1. Clone repository & enter directory
git clone https://github.com/eaemon4409/final-project.git
cd final-project

# 2. Install PHP dependencies
composer install

# 3. Configure environment file
cp .env.example .env
php artisan key:generate

# 4. Add your Groq API Key to .env
# Get a free key at: https://console.groq.com/keys
# Set in .env:
# GROQ_API_KEY=gsk_your_key_here
# GROQ_MODEL=openai/gpt-oss-120b

# 5. Start the backend server
php artisan serve
```
Backend will be live at `http://127.0.0.1:8000`.

---

### 3. Chrome Extension Setup

```powershell
# Navigate to extension directory
cd extension

# Install dependencies
npm install

# Build the extension
npm run build
```

**To load into Google Chrome:**
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **"Developer mode"** in the top-right corner.
3. Click **"Load unpacked"**.
4. Select the `extension/dist` folder inside this repository.
5. Pin **Compare Anything** to your Chrome toolbar!

---

## 🧪 Running Tests

### Backend Feature & Truth-Sheet Suite (PHPUnit / Pest)
```powershell
php artisan test
```
*Executes all 48 tests and 185 assertions covering health status, boundary checks, zero hallucination normalization, rate limiting, and all 6 category truth-sheets.*

### Frontend Quality & Accuracy Suite
```powershell
cd extension
node test_day4_quality.mjs
```
*Verifies intelligent truncation (~3,500 chars), tracking parameter stripping (`spm`, `scm`, `gclid`, `utm`), and 2–4 page limits.*

---

## 📦 Chrome Web Store Packaging

To generate a production release `.zip` archive ready for upload to the **Chrome Web Store Developer Dashboard**:

```powershell
cd extension
npm run package
```
Output:
- Archive: `release/compare-anything-extension-v1.0.0.zip`
- Manifest V3 compliant, zero dev-dependencies in build.

### Release & Store Assets
- **Privacy Policy:** [docs/PRIVACY.md](docs/PRIVACY.md) (Fully compliant with Chrome Web Store Developer Policies & GDPR)
- **Store Listing Copy & Tags:** [docs/STORE_LISTING.md](docs/STORE_LISTING.md)
- **Store Graphics & Screenshots:** Located in `store-assets/`:
  - `promo-tile-440x280.png` / `.svg` (Small Promo Banner)
  - `screenshot-1-popup-add-pages.png` (1280 x 800)
  - `screenshot-2-results-verdict.png` (1280 x 800)
  - `screenshot-3-side-by-side-table.png` (1280 x 800)
  - `screenshot-4-best-for-breakdown.png` (1280 x 800)
  - `screenshot-5-export-csv-clipboard.png` (1280 x 800)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
