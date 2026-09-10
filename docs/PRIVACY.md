# Privacy Policy for Compare Anything — AI Web Comparison

**Effective Date:** September 10, 2026  
**Last Updated:** September 10, 2026  
**Extension Name:** Compare Anything – AI Web Comparison  
**Contact Email:** support@compareanything.dev

---

## 1. Introduction & Single Purpose Statement

Compare Anything ("we", "our", or "the Extension") is committed to protecting your privacy. The single and exclusive purpose of Compare Anything is to provide users with clear, evidence-based, side-by-side comparisons of 2 to 4 webpages explicitly selected by the user.

We strictly adhere to the **Google Chrome Web Store Developer Program Policies**, including the **Single Purpose Policy** and **Limited Use Requirements**.

---

## 2. Information We Collect and Process

Compare Anything is architected around the principle of **strict data minimization**:

### A. User-Selected Webpage Snapshots
When—and only when—you click the **"Add Current Page"** button on an active browser tab, the extension extracts:
- Webpage URL and root domain
- Page title and meta description
- Cleaned, visible text and specification tables (with scripts, styles, advertisements, cookies, and navigation elements stripped out)
- Any standardized schema markup (JSON-LD) present on the page

> **No Passive Background Scraping:** The Extension **never** monitors, records, or logs your general browsing activity, history, open tabs, or web search queries. Extraction occurs strictly on-demand in response to explicit user interaction.

### B. Anonymous Installation Identifier (`installId`)
Upon installation, the Extension generates a random, anonymous UUID stored locally in your browser (`chrome.storage.local`). 
- This identifier is completely detached from any personal identity, email address, IP address, or Google account.
- It is used solely to enforce fair-use daily rate limits (e.g. 10 comparisons per day per installation) to prevent automated abuse.

### C. Optional User Goal / Priority
If you enter an optional comparison focus (e.g., *"Best camera for travel under $500"*), this text is passed alongside your comparison payload to customize criteria weighting.

---

## 3. How We Process Data & AI Ephemeral Guarantee

1. **Ephemeral AI Inference:** When you initiate a comparison, your selected page snapshots and optional goal are transmitted securely to our AI inference API (`/api/v1/compare`).
2. **Zero Storage of Web Content:** Your page text and comparison contents are processed entirely in ephemeral volatile memory. **We never save, store, or persist webpage content, snapshot text, or comparison findings in databases or permanent server disks.**
3. **No Training on Your Data:** Webpage content processed through our AI providers (Groq / OpenRouter) is processed under zero-data-retention API agreements and is **never used to train public AI models**.
4. **Privacy-Preserving Server Logging:** Server logs strictly record non-identifiable technical metadata:
   - Request UUID
   - SHA-256 cryptographic hash of the anonymous install ID (for rate limiting verification)
   - Number of pages compared (2–4)
   - API execution duration and token count
   - HTTP status code
   *Webpage URLs, content, and user goal strings are strictly excluded from server log files.*

---

## 4. Permissions Justification

Compare Anything requests only the minimum set of permissions necessary to function:

| Permission | Justification |
|---|---|
| `activeTab` | Grants temporary access only to the tab currently in view when the user clicks the extension popup or "Add Current Page". |
| `scripting` | Executes a lightweight, isolated extraction script inside the active tab to extract visible content and specs when requested. |
| `storage` | Saves your snapshots and cached comparison results locally on your own computer (`chrome.storage.local`) so they remain available when you open the results page. |

---

## 5. Data Sharing, Selling, and Disclosure

- **We DO NOT sell, rent, monetize, or trade your data** to any third parties, brokers, or advertisers under any circumstances.
- **We DO NOT use or transfer data** for serving personalized advertisements, retargeting, credit checks, or profiling.
- **We DO NOT use third-party tracking scripts, analytics cookies, or cross-site fingerprinting** in the extension popup or results page.

---

## 6. User Control & Data Retention

- **Local Data Control:** All snapshots and comparison results reside in your browser's local sandbox storage (`chrome.storage.local`).
- **One-Click Deletion:** Clicking **"Clear Comparison"** or **"Start New Comparison"** instantly and permanently deletes all stored snapshots and cached comparison results from your browser.
- **Uninstalling:** Uninstalling the Extension instantly purges all local storage and settings associated with Compare Anything.

---

## 7. Compliance with Global Regulations (GDPR / CCPA)

Under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA):
- We do not collect personally identifiable information (PII).
- You have the right to erase all data at any time via local browser controls.
- Our data processing is justified under the lawful basis of fulfilling your explicit request to perform a comparison.

---

## 8. Changes to This Privacy Policy

If we make any material revisions to this policy, we will update the "Last Updated" date at the top of this document. Any changes will adhere to Google Chrome Web Store Developer Policies.

---

## 9. Contact & Support

If you have questions, feedback, or privacy inquiries regarding Compare Anything, please contact us:
- **Email:** support@compareanything.dev
- **Repository:** https://github.com/eaemon4409/final-project
