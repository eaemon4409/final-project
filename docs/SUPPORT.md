# Support & Help Center — Compare Anything

Welcome to the **Compare Anything** support page. If you encounter any difficulties, need assistance, or have feature suggestions, we are here to help.

---

## 🚀 Quick Troubleshooting & FAQs

### 1. "Comparison Unavailable — Cannot connect to AI backend"
- **Cause:** The backend comparison API is not running or unreachable.
- **Solution:** If running locally in development mode, ensure you have executed:
  ```powershell
  php artisan serve
  ```
  Check that `http://127.0.0.1:8000/api/v1/health` returns `{"status": "ok"}`.

### 2. "Why does a spec field say 'Not stated'?"
- **Answer:** **Compare Anything enforces a strict Zero-Hallucination rule.** If a product page, job offer, or article does not explicitly state a specification (such as battery capacity, weight, or salary), our AI engine will never guess or invent numbers. It strictly outputs `"Not stated"` to safeguard your decision-making.

### 3. How do I add pages to compare?
1. Navigate to the first website you want to compare (e.g. an online store or job listing).
2. Click the **Compare Anything** icon in your Chrome toolbar.
3. Click **"Add Current Page"**.
4. Repeat for up to 4 tabs.
5. (Optional) Enter your decision goal (e.g., *"Best for battery life and low budget"*).
6. Click **"Compare X Pages"** to view your side-by-side analysis in a clean full-tab dashboard.

### 4. How can I export my comparison?
- On the results page, click **"Export CSV"** in the top-right toolbar to download a complete spreadsheet of the comparison.
- Click **"Copy Comparison"** to copy formatted Markdown of the verdict and criteria directly to your clipboard.

### 5. How do I clear current pages and start fresh?
- Click **"Start New Comparison"** or the trash icon on any snapshot card to remove pages.

---

## 📬 Contacting Support

If your issue is not resolved by the steps above:
- **Email:** support@compareanything.dev
- **GitHub Issues:** [Open an Issue on GitHub](https://github.com/eaemon4409/final-project/issues)
- **Response Time:** We aim to reply to all queries within 24–48 business hours.

When contacting us, please include:
1. The URLs or types of pages you were trying to compare.
2. The exact error message displayed (or a screenshot).
3. Your browser version (e.g., Chrome Version 128+).
