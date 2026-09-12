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
   - **Walmart**: Appends `?wmlspartner=your_id&affillinktype=2&veh=aff`
   - **Best Buy**: Appends `?ref=your_id&loc=compare_anything`
   - **Target**: Appends `?afid=your_id&cpng=affiliate`
   - **Newegg**: Appends `?AID=your_id&cm_mmc=afc-compare-anything`
   - **Daraz (BD/PK/LK)**: Appends `?aff_id=your_id&utm_source=daraz_affiliate`
   - **Flipkart**: Appends `?affid=your_id`
   - **Booking.com**: Appends `?aid=your_id` (Hotel room comparisons)
   - **Agoda**: Appends `?cid=your_id` (Resort and accommodation bookings)
   - **Coursera**: Appends `?utm_campaign=your_id&utm_source=impact` (Online course comparisons)
   - **Udemy**: Appends `?couponCode=your_code&utm_source=aff-campaign`
   - **Local Retailers (Star Tech, Ryans, Techland)**: Appends campaign partner parameters
3. **High-Converting CTAs**:
   The Results page places affiliate buttons right at the high-intent decision moments:
   - **Quick Verdict Card**: Large prominent *"🔥 Check Price on [Store]"* button.
   - **Comparison Table**: Dedicated *"Store Links & Deals"* action row for each product.
   - **Best For Cards**: Direct *"View Deal"* link for each category winner.
4. **Commission Earned**:
   When the user clicks and completes their purchase, the store pays you a commission (typically **1% to 12%** of the product price, and up to **40%** on hotel bookings). If a user buys a $1,000 laptop via your Amazon, Best Buy, or Newegg link, you make ~$30–$50 from that single sale.

---

## 2. How to Set Your Affiliate IDs

There are **two easy ways** to set your affiliate IDs:

### Method A: From the Extension Popup (No Coding Required)
1. Open the **Compare Anything** popup in Chrome.
2. Click the **⚙️ Settings icon** at the top right of the popup header.
3. You will see organized categories:
   - **Major Global Retailers:** Amazon, eBay, AliExpress, Walmart, Best Buy, Target, Newegg
   - **Regional E-Commerce:** Daraz, Flipkart
   - **Hotels & Travel:** Booking.com, Agoda
   - **Courses & Education:** Coursera, Udemy
   - **Cloud API URL:** pre-filled with your live Render backend
4. Click **"Save Settings"**. All future comparisons will automatically use your personal tracking tags!

### Method B: Set Global Defaults in Code (For Public Store Distribution)
If you are publishing to the Chrome Web Store and want all organic downloaders to use your tags by default:
1. Open [`extension/src/utils/affiliateHelper.ts`](file:///c:/Users/Emon%20Ahmed/final%20project/final-project/extension/src/utils/affiliateHelper.ts)
2. Edit lines 30–50:
   ```typescript
   const DEFAULT_CONFIG: AffiliateConfig = {
     genericRefTag: 'eaemon',
     amazonTag: 'eaemon-20',
     ebayCampId: '5339000000',
     aliexpressTag: 'compareanything',
     walmartId: 'your-walmart-id',
     bestbuyId: 'your-bestbuy-id',
     targetId: 'your-target-id',
     neweggId: 'your-newegg-id',
     darazAffiliateId: 'your-daraz-id',
     flipkartAffId: 'your-flipkart-id',
     bookingAid: 'your-booking-aid',
     agodaCid: 'your-agoda-cid',
     courseraPartnerId: 'your-coursera-id',
     udemyPartnerId: 'your-udemy-id',
   };
   ```
3. Run `npm run build` and `node package_extension.cjs` to create the updated distribution ZIP.

---

## 3. How to Apply for Affiliate Programs

### 1. Amazon Associates (Global / US / UK / India)
- **URL**: [https://affiliate-program.amazon.com/](https://affiliate-program.amazon.com/)
- **Commission**: 1% to 10% | **Tag**: `username-20` (Configured: `eaemon-20`)

### 2. eBay Partner Network (EPN — Worldwide)
- **URL**: [https://partnernetwork.ebay.com/](https://partnernetwork.ebay.com/)
- **Commission**: 1.5% to 6.0% | **Tag**: 10-digit Campaign ID (e.g. `5339000000`)

### 3. AliExpress Affiliate Program (Portals — Global)
- **URL**: [https://portals.aliexpress.com/](https://portals.aliexpress.com/)
- **Commission**: Up to 9% | **Tag**: Tracking Key (`sk`)

### 4. Walmart / Best Buy / Target / Newegg (via Impact & CJ)
- **Impact Radius**: [https://impact.com/](https://impact.com/) (Hosts Walmart, Target, Best Buy)
- **CJ Affiliate**: [https://www.cj.com/](https://www.cj.com/) (Hosts Newegg, Best Buy)

### 5. Daraz & Flipkart (South Asia)
- **Daraz**: [https://www.daraz.com.bd/affiliate-program/](https://www.daraz.com.bd/affiliate-program/)
- **Flipkart**: [https://affiliate.flipkart.com/](https://affiliate.flipkart.com/)

### 6. Booking.com & Agoda Partners (Travel & Hotels)
- **Booking.com**: [https://www.booking.com/affiliate-program/](https://www.booking.com/affiliate-program/) (25% to 40% revenue share)
- **Agoda**: [https://partners.agoda.com/](https://partners.agoda.com/)

### 7. Coursera & Udemy (Online Learning)
- **Coursera**: [https://about.coursera.org/affiliates](https://about.coursera.org/affiliates) (via Impact)
- **Udemy**: [https://www.udemy.com/affiliate/](https://www.udemy.com/affiliate/) (via Rakuten LinkShare)

---

## 4. Legal Compliance & FTC Disclosure

To comply with Google Chrome Web Store policies and international consumer protection laws (FTC / ASA):
- The Results page footer automatically displays the official disclosure:
  > *"Disclosure: As an affiliate, we may earn a commission from qualifying purchases made through links on this page at no extra cost to you."*
- Original page links are preserved without deceptive redirects or adware behaviors.
