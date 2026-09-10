# Chrome Web Store — Step-by-Step Submission Checklist

This checklist provides the exact values and files ready to copy-paste when uploading **Compare Anything** to the **Google Chrome Web Store Developer Dashboard**.

---

## 🔗 Dashboard URL
Open: **[https://chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole)**

---

## 📦 1. Package Upload
- Click **"+ New Item"** in the top right.
- Upload file:
  ```text
  release/compare-anything-extension-v1.0.0.zip
  ```

---

## 📝 2. Store Listing Tab

### Product Title (Max 45 characters)
```text
Compare Anything – AI Web Comparison
```

### Summary / Short Description (Max 132 characters)
```text
Add 2–4 web pages and get one clear AI comparison table based strictly on page evidence. No hallucinations. 100% factual.
```

### Detailed Description
Copy the full text block directly from:
👉 **[docs/STORE_LISTING.md](STORE_LISTING.md#detailed-description-formatted-for-web-store)**

### Category
- **Category:** Productivity
- **Secondary:** Shopping (if applicable)

### Language
- **English (United States)**

---

## 🎨 3. Graphic Assets Tab

Upload the following pre-sized assets from the `store-assets/` folder:

| Field | Required Size | File to Select |
|---|---|---|
| **Store Icon** | 128 x 128 px | `extension/public/icons/icon128.png` |
| **Small Promo Tile** | 440 x 280 px | `store-assets/promo-tile-440x280.png` |
| **Screenshot 1** | 1280 x 800 px | `store-assets/screenshot-1-popup-add-pages.png` |
| **Screenshot 2** | 1280 x 800 px | `store-assets/screenshot-2-results-verdict.png` |
| **Screenshot 3** | 1280 x 800 px | `store-assets/screenshot-3-side-by-side-table.png` |
| **Screenshot 4** | 1280 x 800 px | `store-assets/screenshot-4-best-for-breakdown.png` |
| **Screenshot 5** | 1280 x 800 px | `store-assets/screenshot-5-export-csv-clipboard.png` |

---

## 🔒 4. Privacy Practices Tab

### Single Purpose Statement
```text
The single purpose of Compare Anything is to extract user-requested webpage text and generate a structured, side-by-side comparison table of 2 to 4 web pages.
```

### Permission Justifications

#### `activeTab`
```text
The activeTab permission is required to access the URL, page title, and DOM of the specific webpage the user explicitly chooses to add to their comparison stack when clicking the "Add Current Page" button. It does not run in the background.
```

#### `scripting`
```text
The scripting permission is required to execute an isolated extraction function (PageExtractor) that strips ads, nav bars, and scripts, extracting clean specification tables and visible text from the page currently active when the user triggers the action.
```

#### `storage`
```text
The storage permission is required to persist the user's selected page snapshots, optional comparison goal, and cached comparison results locally in chrome.storage.local across browser sessions until cleared.
```

### Host Permissions Justification (`*.onrender.com`)
```text
Required to communicate securely via HTTPS with our deployed AI comparison backend (https://compare-anything-backend.onrender.com) for processing evidence-based comparisons.
```

### Data Usage Declarations
- **"Do you collect personal data?"** ➔ Select **NO**.
- **Developer Certifications:**
  - [x] Check: *I confirm that my item complies with the Limited Use policy.*
  - [x] Check: *I will not sell user data to third parties.*
  - [x] Check: *I will not use or transfer user data for purposes unrelated to the item's single purpose.*
  - [x] Check: *I will not use or transfer user data to determine creditworthiness or for lending purposes.*

### Privacy Policy Link
```text
https://github.com/eaemon4409/final-project/blob/main/docs/PRIVACY.md
```

---

## 🚀 5. Submit for Review
1. Click the blue **"Submit for Review"** button in the top right.
2. Select standard review submission.
3. Review approval typically takes **24 to 72 hours**. Once approved, your extension will be live on the Chrome Web Store!
