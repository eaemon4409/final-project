# Affiliate Monetization Guide (Option B) — Compare Anything

This guide explains how your Chrome Extension automatically turns product comparisons into revenue using **Affiliate Marketing**.

---

## 1. How It Works (কিভাবে ইনকাম হবে)

Whenever a user compares 2 to 4 products (e.g., laptops, smartphones, gadgets, headphones, courses, or jobs):

1. **AI Comparison Generation**:
   The AI analyzes prices, specs, pros & cons, and determines the overall winner.
2. **Dynamic Affiliate Injection**:
   Our built-in engine automatically transforms regular store URLs into monetized tracking links:
   - **Amazon**: Appends `?tag=your-tag-20&linkCode=ll1`
   - **eBay (EPN)**: Appends `?campid=5339xxxxxx&mkcid=1&toolid=10001&mkevt=1`
   - **AliExpress**: Appends `?aff_platform=portals-tool&sk=your_tag&aff_trace_key=your_tag`
   - **Daraz (BD/PK/LK)**: Appends `?aff_id=your_id&utm_source=daraz_affiliate`
   - **Local Retailers (Star Tech, Ryans, Techland)**: Appends campaign partner parameters
3. **High-Converting CTAs**:
   The Results page places affiliate buttons right at the high-intent decision moments:
   - **Quick Verdict Card**: Large prominent *"🔥 Check Price on [Store]"* button.
   - **Comparison Table**: Dedicated *"Store Links & Deals"* action row for each product.
   - **Best For Cards**: Direct *"View Deal"* link for each category winner.
4. **Commission Earned**:
   When the user clicks and completes their purchase, the store pays you a commission (typically **1% to 12%** of the product price). If a user buys a $1,000 laptop via your Amazon or eBay link, you make ~$30–$40 from that single sale.

---

## 2. How to Set Your Affiliate IDs

There are **two easy ways** to set your affiliate IDs:

### Method A: From the Extension Popup (No Coding Required)
1. Open the **Compare Anything** popup in Chrome.
2. Click the **⚙️ Settings icon** at the top right of the popup header.
3. Enter your:
   - **Amazon Associates Tag** (e.g., `eaemon-20`)
   - **eBay Campaign ID (EPN)** (e.g., `5339000000`)
   - **AliExpress Affiliate Tag / Key** (e.g., `your_sk_key`)
   - **Daraz Affiliate ID** (e.g., `daraz_12345`)
   - **Cloud API URL** (pre-filled with your live Render backend)
4. Click **"Save Settings"**. All future comparisons will automatically use your personal tracking tags!

### Method B: Set Global Defaults in Code (For Public Store Distribution)
If you are publishing to the Chrome Web Store and want all organic downloaders to use your tags by default:
1. Open [`extension/src/utils/affiliateHelper.ts`](file:///c:/Users/Emon%20Ahmed/final%20project/final-project/extension/src/utils/affiliateHelper.ts)
2. Edit lines 12–18:
   ```typescript
   const DEFAULT_CONFIG: AffiliateConfig = {
     amazonTag: 'eaemon-20',
     darazAffiliateId: 'your-daraz-affiliate-id',
     ebayCampId: 'your-ebay-campaign-id',
     aliexpressTag: 'your-aliexpress-tag',
     genericRefTag: 'eaemon',
   };
   ```
3. Run `npm run build` and `node package_extension.cjs` to create the updated distribution ZIP.

---

## 3. How to Apply for Affiliate Programs

### 1. Amazon Associates (Global / US / UK / India)
- **URL**: [https://affiliate-program.amazon.com/](https://affiliate-program.amazon.com/)
- **Cost**: 100% Free
- **Requirements**: Website or Chrome extension URL, basic profile info.
- **Your Tag Format**: `username-20` (Configured: `eaemon-20`)

### 2. eBay Partner Network (EPN — Global / US / UK / Worldwide)
- **URL**: [https://partnernetwork.ebay.com/](https://partnernetwork.ebay.com/)
- **Cost**: 100% Free
- **Commission**: 1.5% to 6.0% per qualifying sale
- **Your Tag Format**: 10-digit Campaign ID (e.g. `5339000000`)

### 3. AliExpress Affiliate Program (Portals — Worldwide / Gadgets)
- **URL**: [https://portals.aliexpress.com/](https://portals.aliexpress.com/)
- **Cost**: 100% Free
- **Commission**: Up to 9% on millions of direct manufacturer products
- **Your Tag Format**: Tracking ID / Tracking Key (`sk`)

### 4. Daraz Affiliate Program (Bangladesh & South Asia)
- **URL**: [https://www.daraz.com.bd/affiliate-program/](https://www.daraz.com.bd/affiliate-program/)
- **Cost**: 100% Free
- **Payout**: Direct bank transfer / bKash in Bangladesh.
- **Your Tag Format**: Given upon account approval.

---

## 4. Legal Compliance & FTC Disclosure

To comply with Google Chrome Web Store policies and international consumer protection laws (FTC / ASA):
- The Results page footer automatically displays the official disclosure:
  > *"Disclosure: As an affiliate, we may earn a commission from qualifying purchases made through links on this page at no extra cost to you."*
- Original page links are preserved without deceptive redirects or adware behaviors.
