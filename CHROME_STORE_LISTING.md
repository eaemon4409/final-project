# 🛒 Chrome Web Store Listing Content

Use this document to copy-paste all information directly into your [Google Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole).

---

## 🏷️ Basic Information

### Extension Title
```
Compare Anything – AI Web Comparison & Deal Finder
```

### Short Description (Max 132 characters)
```
Add 2–4 web pages and get one clear AI comparison table, smart alternatives, and best overall recommendations instantly.
```
*(Character count: 121 / 132)*

### Category
- **Primary Category:** `Shopping` (or `Productivity`)
- **Language:** `English`

---

## 📝 Detailed Description

```markdown
Stop opening dozens of browser tabs and struggling to compare specs, prices, and reviews manually! 

**Compare Anything** is your intelligent AI shopping and research assistant. Simply add 2 to 4 web pages—whether you are comparing laptops, smartphones, online courses, hotel bookings, or SaaS software—and get an instant, evidence-based side-by-side comparison table with an unbiased AI verdict.

---

### 🌟 KEY FEATURES

⚡ **One-Click Page Addition:**
Add any webpage with a single click using the floating on-screen button, the extension popup, or the fast `Alt+C` keyboard shortcut.

🔍 **Smart Alternatives & Deal Finder:**
Viewing a product? Click "Find Alternatives" and let AI discover 2–3 competing rival models with price differences and direct search links for StarTech, Ryans, Daraz, Amazon, and Google Shopping.

🏆 **AI Recommendation Engine:**
No more guessing or "no clear winner". Our AI evaluates real prices, user ratings, specifications, and trade-offs to highlight the "Recommended Best Overall" pick for your specific needs.

📊 **Evidence-Based Comparison Matrix:**
See key differences clearly highlighted with color-coded winner badges, pros & cons, and customized "Best For" category verdicts.

🖨️ **Print & PDF Export:**
Export your comparison table as a clean, professionally formatted PDF or printout with a single click, or copy the results directly to your clipboard.

👁️ **Full Privacy & Control:**
Toggle the floating button on or off anytime with the eye icon. Compare Anything only reads pages you explicitly choose to add—zero background tracking, zero data selling.

---

### ⌨️ KEYBOARD SHORTCUTS
- **Alt + C**: Add the current webpage to your comparison list
- **Alt + Shift + C**: Open your side-by-side comparison results in a dedicated tab

---

### 🔒 PRIVACY-FIRST COMMITMENT
We respect your privacy above all else:
- Only pages you explicitly click to add are processed.
- No personal browsing history is ever tracked or stored.
- Webpage text is analyzed in-memory and never sold to third-party advertisers.
- Read our full Privacy Policy: https://compare-anything-backend.onrender.com/privacy-policy

---

Developed with ❤️ by Emon Ahmed.
```

---

## 🔐 Permissions Justification (For Chrome Reviewers)

When the Chrome Web Store asks: *"Explain why your extension requires each of the following permissions"*, copy-paste these exact justifications:

### 1. `activeTab`
> "The activeTab permission is required to inspect and extract product titles, specifications, and textual content from the webpage only when the user explicitly clicks the extension popup or invokes the Alt+C shortcut."

### 2. `storage`
> "The storage permission is used exclusively to store the user's comparison list, custom priorities, and floating action button preferences locally on their device."

### 3. `scripting`
> "The scripting permission is required to safely inject the DOM extraction helper and remove on-page floating UI widgets when the user toggles them off."

### 4. `tabs`
> "The tabs permission is used to synchronize the visibility state of the floating action button across all open browser tabs and to open the dedicated comparison results tab."

---

## 🎯 Single Purpose Description

When asked: *"Describe the single purpose of your extension"*:
> "Compare Anything has a single, focused purpose: to help users compare 2 to 4 web pages side by side using AI-generated comparison tables and discover direct product alternatives without manual tab switching."

---

## 🌐 Hosted Privacy Policy URL
```
https://compare-anything-backend.onrender.com/privacy-policy
```
