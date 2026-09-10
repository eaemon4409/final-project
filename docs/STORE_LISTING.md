# Chrome Web Store Listing Copy & Metadata

This document contains the finalized, pre-formatted copy and metadata ready for copy-pasting into the **Chrome Web Store Developer Dashboard**.

---

## 🏷️ Basic Metadata

### Title
```text
Compare Anything – AI Web Comparison
```
*(36 / 45 characters)*

### Summary / Short Description
```text
Add 2–4 web pages and get one clear AI comparison table based strictly on page evidence. No hallucinations. 100% factual.
```
*(122 / 132 characters)*

### Category
- **Primary Category:** Productivity
- **Secondary Category:** Shopping

### Language
- English (United States)

---

## 📝 Detailed Description (Formatted for Web Store)

```markdown
Stop switching back and forth between 10 open tabs. Compare Anything collects 2 to 4 web pages and generates a comprehensive, side-by-side comparison table in seconds—powered by ultra-fast AI.

Whether you are comparing laptops, SaaS software pricing plans, job offers, online courses, or articles, Compare Anything extracts the factual specifications and gives you an instant, trustworthy verdict.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌟 WHY COMPARE ANYTHING IS DIFFERENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ Most AI extensions hallucinate or invent specifications they assume are true.
✅ Compare Anything operates under a strict ZERO-HALLUCINATION GUARANTEE:
Every single price, specification, and feature is extracted directly from the text of your selected pages. If a page does not mention battery life or weight, the table strictly marks it as "Not stated"—protecting you from misleading assumptions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ KEY FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Add Any 2 to 4 Web Pages
Click "Add Current Page" from any website (Amazon, Star Tech, Ryans, GSMArena, LinkedIn, Coursera, SaaS pricing pages, etc.).

🔹 Goal-Driven Verdict (Optional)
Tell the AI your personal priority (e.g. "Best battery life under $600" or "Best remote job for junior devs"). The AI analyzes the evidence according to your goal.

🔹 Quick Verdict & Best Overall
Get a clear, factual recommendation with direct citations from the pages explaining why one option stands out.

🔹 Side-by-Side Dynamic Comparison Table
Automatically identifies 5–10 crucial criteria (Price, Display, Battery, Processor, RAM, Storage, etc.) and highlights category winners in green.

🔹 "Best For" Persona Breakdown
Know instantly which item is best for budget shoppers, which is best for high performance, and which offers the best warranty.

🔹 Missing Information Tracker
Instantly see what critical specifications each manufacturer or seller left out.

🔹 One-Click Export
Download your comparison as a clean CSV spreadsheet or copy a markdown summary directly to your clipboard.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ WHAT CAN YOU COMPARE?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Electronics & Gadgets (Laptops, Smartphones, Monitors, PC parts)
• SaaS & Cloud Pricing (Monthly vs annual tiers, features, API limits)
• Job Offers (Salary, remote flexibility, perks, required experience)
• Online Courses (Duration, prerequisites, certificate, price)
• Hosting & Services (Storage limits, bandwidth, uptime SLA, support)
• Research & Articles (Key points, authors, publication dates, conclusions)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 PRIVACY & ZERO DATA SALES GUARANTEE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your privacy is our top priority:
• No passive background browsing tracking. Extraction ONLY occurs when you click "Add Current Page".
• Page content is processed in ephemeral memory and NEVER stored on our servers.
• We never sell, monetize, or track your personal data.
• Completely free of advertisements and third-party tracking scripts.

Take control of your decision-making today. Install Compare Anything and make smart, evidence-backed choices in seconds!
```

---

## 🔑 Search Keywords / Tags
```text
compare, comparison, product comparison, side by side comparison, shopping assistant, price comparison, specifications, tab comparison, ai comparison, research tool
```

---

## 🛡️ Single Purpose & Permission Justifications (For Google Reviewer Form)

### Single Purpose Declaration
```text
The single purpose of Compare Anything is to extract user-requested webpage text and generate a structured, side-by-side comparison table of 2 to 4 web pages.
```

### Permission Justification: `activeTab`
```text
The activeTab permission is required to access the URL, page title, and DOM of the specific webpage the user explicitly chooses to add to their comparison stack when clicking the "Add Current Page" button. It does not run in the background.
```

### Permission Justification: `scripting`
```text
The scripting permission is required to execute an isolated extraction function (PageExtractor) that strips ads, nav bars, and scripts, extracting clean specification tables and visible text from the page currently active when the user triggers the action.
```

### Permission Justification: `storage`
```text
The storage permission is required to persist the user's selected page snapshots, optional comparison goal, and cached comparison results locally in chrome.storage.local across browser sessions until cleared.
```

### Host Permissions Justification: `http://127.0.0.1:8000/*` and `http://localhost:8000/*`
```text
Used to communicate with the local comparison backend API service during local development and testing. (Production builds route to our secure HTTPS backend).
```
