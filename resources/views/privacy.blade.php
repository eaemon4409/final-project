<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy – Compare Anything</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --surface: #ffffff;
            --bg: #f8fafc;
            --text-main: #0f172a;
            --text-muted: #475569;
            --border: #e2e8f0;
            --accent-green: #10b981;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--bg);
            color: var(--text-main);
            line-height: 1.6;
            padding: 40px 20px;
        }

        .container {
            max-width: 820px;
            margin: 0 auto;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 48px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .header {
            border-bottom: 1px solid var(--border);
            padding-bottom: 24px;
            margin-bottom: 32px;
        }

        .brand-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #eff6ff;
            color: var(--primary);
            font-weight: 700;
            font-size: 13px;
            padding: 6px 14px;
            border-radius: 9999px;
            margin-bottom: 16px;
            border: 1px solid #bfdbfe;
        }

        h1 {
            font-size: 28px;
            font-weight: 800;
            color: var(--text-main);
            margin-bottom: 8px;
        }

        .effective-date {
            font-size: 13px;
            color: var(--text-muted);
        }

        h2 {
            font-size: 18px;
            font-weight: 700;
            color: var(--text-main);
            margin-top: 28px;
            margin-bottom: 12px;
        }

        p, li {
            font-size: 14.5px;
            color: var(--text-muted);
            margin-bottom: 12px;
        }

        ul {
            padding-left: 24px;
            margin-bottom: 16px;
        }

        li {
            margin-bottom: 8px;
        }

        .highlight-box {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 10px;
            padding: 16px 20px;
            margin: 20px 0;
            font-size: 14px;
            color: #166534;
        }

        .highlight-box strong {
            color: #14532d;
        }

        .permission-table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0 24px 0;
        }

        .permission-table th, .permission-table td {
            text-align: left;
            padding: 12px 14px;
            border: 1px solid var(--border);
            font-size: 13.5px;
        }

        .permission-table th {
            background: #f8fafc;
            color: var(--text-main);
            font-weight: 700;
        }

        .permission-table td {
            color: var(--text-muted);
        }

        .permission-code {
            font-family: monospace;
            font-weight: 700;
            color: var(--primary);
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
        }

        .footer {
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid var(--border);
            text-align: center;
            font-size: 13px;
            color: var(--text-muted);
        }

        .footer a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
        }

        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="brand-badge">COMPARE ANYTHING</div>
            <h1>Privacy Policy</h1>
            <p class="effective-date">Effective Date: September 2026 | Last Updated: September 13, 2026</p>
        </div>

        <div class="highlight-box">
            <strong>Zero Data Selling Guarantee:</strong> Compare Anything is designed with privacy at its foundation. We do not track your personal browsing history, do not sell user data to third parties, and only analyze webpages that you explicitly choose to add.
        </div>

        <h2>1. Single Purpose & Overview</h2>
        <p>Compare Anything is an AI-powered browser extension designed to help users evaluate and compare 2 to 4 web pages side by side (such as e-commerce products, courses, services, and software specs). The extension extracts factual page details only when the user explicitly triggers an action.</p>

        <h2>2. Data Collection & How It Is Used</h2>
        <p>We believe in data minimization. Here is what we collect and why:</p>
        <ul>
            <li><strong>User-Selected Webpage Content:</strong> When you click <em>"+ Add to Comparison"</em> or press <code>Alt+C</code>, the extension reads the title, metadata, product specifications, and relevant text from that specific active tab. This data is used solely to generate the comparison matrix and AI verdict requested by you.</li>
            <li><strong>User Goals / Priorities:</strong> If you specify a priority (e.g. "Long battery life" or "Under $500"), this query is passed to the AI model to generate a tailored verdict.</li>
            <li><strong>Local State:</strong> Your selected pages and preferences are stored locally in your browser using <code>chrome.storage.local</code>. You can clear this at any time using the "Clear All" button.</li>
        </ul>

        <h2>3. Chrome Extension Permissions & Justification</h2>
        <p>In accordance with the Google Chrome Web Store User Data Policy, below is a clear disclosure of why each requested permission is required:</p>

        <table class="permission-table">
            <thead>
                <tr>
                    <th>Permission</th>
                    <th>Purpose / Justification</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><span class="permission-code">activeTab</span></td>
                    <td>Grants temporary access to the active webpage only when you click the extension icon or trigger a comparison shortcut. Used to capture the title and specifications of the current tab.</td>
                </tr>
                <tr>
                    <td><span class="permission-code">scripting</span></td>
                    <td>Used to execute the on-page extraction helper and safely remove UI overlays when the user turns off the floating widget.</td>
                </tr>
                <tr>
                    <td><span class="permission-code">storage</span></td>
                    <td>Saves your list of compared pages, active theme, and toolbar preferences locally on your computer.</td>
                </tr>
                <tr>
                    <td><span class="permission-code">tabs</span></td>
                    <td>Used to synchronize the visibility state of the floating action button across your open browser tabs and open the side-by-side comparison results tab.</td>
                </tr>
            </tbody>
        </table>

        <h2>4. Third-Party AI Processing</h2>
        <p>When you click <em>"COMPARE"</em> or <em>"Find Alternatives"</em>, the anonymized textual specifications of your selected pages are transmitted via secure HTTPS encryption to our backend API, which queries privacy-compliant AI providers (such as Groq and Google Gemini). The AI models process the text strictly in-memory to generate the comparison table and do not use your inputs to train public foundational models.</p>

        <h2>5. Data Retention & Deletion</h2>
        <p>We do not store your comparison history or webpage snapshots on permanent databases. All comparison data resides in your browser's local storage and can be completely wiped at any second by clicking the <strong>Clear</strong> button in the extension popup.</p>

        <h2>6. Security Measures</h2>
        <p>All communication between the Chrome extension and our backend API uses Industry-Standard Transport Layer Security (TLS/HTTPS). No unencrypted data is ever transmitted.</p>

        <h2>7. Contact & Inquiries</h2>
        <p>If you have any questions, feedback, or concerns regarding this Privacy Policy or your data, please contact us at:</p>
        <ul>
            <li><strong>Developer:</strong> Emon Ahmed</li>
            <li><strong>Project Repository:</strong> <a href="https://github.com/eaemon4409/final-project" target="_blank" rel="noreferrer">github.com/eaemon4409/final-project</a></li>
        </ul>

        <div class="footer">
            <p>&copy; 2026 Compare Anything. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
