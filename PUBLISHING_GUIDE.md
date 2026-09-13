# 🚀 Chrome Web Store Publishing Guide

This guide walks you through publishing **Compare Anything** to the official **Google Chrome Web Store** step by step.

---

## 📋 Prerequisites Checklist

1. A standard Google Account (Gmail).
2. A one-time **$5 USD** developer registration fee charged by Google.
3. The production store zip package: `Compare_Anything_Store_Release.zip` (located on your Desktop).
4. The Store Listing document: [CHROME_STORE_LISTING.md](file:///c:/Users/Emon%20Ahmed/final%20project/final-project/CHROME_STORE_LISTING.md).

---

## 🛠️ Step-by-Step Publishing Process

### Step 1: Register as a Chrome Web Store Developer
1. Go to the **[Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)**.
2. Sign in with your Google Account.
3. Accept the Developer Agreement and pay the one-time $5 USD registration fee.

---

### Step 2: Upload the Extension Package
1. On the Developer Dashboard, click the **"+ New Item"** button in the top right.
2. Drag and drop your **`Compare_Anything_Store_Release.zip`** file (located on your Desktop).
3. The dashboard will automatically inspect your `manifest.json` and create your new extension draft.

---

### Step 3: Fill in Store Listing Details
From the left sidebar, click **"Store listing"**:
1. **Description**: Open [CHROME_STORE_LISTING.md](file:///c:/Users/Emon%20Ahmed/final%20project/final-project/CHROME_STORE_LISTING.md) and copy the **Detailed Description** into the text box.
2. **Category**: Select **Shopping** or **Productivity**.
3. **Language**: English.
4. **Icons & Screenshots**:
   - The 128x128 store icon will be loaded automatically from the package.
   - Upload at least 1 screenshot (1280 x 800 px) showing the comparison table or popup.
   - *(Optional)* Small promo tile: 440 x 280 px.

---

### Step 4: Fill in the Privacy Practices Tab
From the left sidebar, click **"Privacy practices"**:
1. **Single Purpose**:
   Paste:
   > *"Compare Anything has a single, focused purpose: to help users compare 2 to 4 web pages side by side using AI-generated comparison tables and discover direct product alternatives without manual tab switching."*
2. **Permission Justification**:
   Copy-paste the exact justifications from [CHROME_STORE_LISTING.md](file:///c:/Users/Emon%20Ahmed/final%20project/final-project/CHROME_STORE_LISTING.md) for `activeTab`, `storage`, `scripting`, and `tabs`.
3. **Data Usage Disclosures**:
   - Check *"Web history / webpage content"* -> Purpose: *"Functionality of the extension"*.
   - Check *"I certify that this extension complies with the Limited Use Policy"*.
   - Check *"I do not sell user data to third parties"*.
   - Check *"I do not use or transfer user data for purposes unrelated to the extension's core functionality"*.
   - Check *"I do not use or transfer user data for creditworthiness or lending purposes"*.
4. **Privacy Policy URL**:
   Paste:
   ```
   https://compare-anything-backend.onrender.com/privacy-policy
   ```

---

### Step 5: Submit for Review
1. Click the blue **"Submit for review"** button in the top right corner.
2. Confirm submission.
3. Google will review the extension (typically takes between **24 to 72 hours**).
4. Once approved, your extension will be live on the Chrome Web Store with a public link that anyone can install with one click! 🎉
