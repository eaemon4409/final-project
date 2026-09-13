# Privacy Policy for Compare Anything

**Effective Date:** September 2026  
**Last Updated:** September 13, 2026  
**Hosted URL:** [https://compare-anything-backend.onrender.com/privacy-policy](https://compare-anything-backend.onrender.com/privacy-policy)

---

## 🛡️ Zero Data Selling Guarantee
**Compare Anything** is built with privacy at its foundation. We do not track your personal browsing history, do not sell user data to third parties, and only analyze webpages that you explicitly choose to add.

---

## 1. Single Purpose & Overview
**Compare Anything** is an AI-powered browser extension designed to help users evaluate and compare 2 to 4 web pages side by side (such as e-commerce products, courses, services, and software specs). The extension extracts factual page details only when the user explicitly triggers an action.

---

## 2. Data Collection & How It Is Used
We practice strict data minimization:
- **User-Selected Webpage Content:** When you click *"+ Add to Comparison"* or press `Alt+C`, the extension extracts the title, metadata, product specifications, and relevant text from that specific active tab. This data is used solely to generate the comparison matrix and AI verdict requested by you.
- **User Priorities / Goals:** If you enter a priority (e.g., "Long battery life" or "Under $500"), this query is passed to the AI model to generate a tailored verdict.
- **Local Browser Storage:** Your selected pages and preferences are stored locally in your browser using `chrome.storage.local`. You can clear this at any time using the "Clear All" button.

---

## 3. Chrome Extension Permissions & Justification
In accordance with Google Chrome Web Store User Data Policy, below is a clear disclosure of why each requested permission is required:

| Permission | Purpose / Justification |
|---|---|
| `activeTab` | Grants temporary access to the active webpage only when you click the extension icon or trigger a comparison shortcut. Used to capture the title and specifications of the current tab. |
| `scripting` | Used to execute the on-page extraction helper and safely remove UI overlays when the user turns off the floating widget. |
| `storage` | Saves your list of compared pages, active theme, and toolbar preferences locally on your computer. |
| `tabs` | Used to synchronize the visibility state of the floating action button across your open browser tabs and open the side-by-side comparison results tab. |

---

## 4. Third-Party AI Processing
When you click *"COMPARE"* or *"Find Alternatives"*, the anonymized textual specifications of your selected pages are transmitted via secure HTTPS encryption to our backend API, which queries privacy-compliant AI providers (such as Groq and Google Gemini). The AI models process the text strictly in-memory to generate the comparison table and do not use your inputs to train public foundational models.

---

## 5. Data Retention & Deletion
We do not store your comparison history or webpage snapshots on permanent databases. All comparison data resides in your browser's local storage and can be completely wiped at any second by clicking the **Clear** button in the extension popup.

---

## 6. Developer Contact
- **Developer:** Emon Ahmed
- **Project Repository:** [github.com/eaemon4409/final-project](https://github.com/eaemon4409/final-project)
