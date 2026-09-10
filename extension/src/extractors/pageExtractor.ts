import { PageSnapshot } from '../models/types';
import { extractDomain } from '../utils/urlHelper';
import { intelligentTruncate, cleanWhitespace } from '../utils/textHelper';

/**
 * Pure DOM extraction function intended to run in the context of the webpage.
 * Must be self-contained so it can be passed to chrome.scripting.executeScript.
 */
export function extractPageFromDOM(): {
  url: string;
  domain: string;
  title: string;
  description: string;
  structuredData?: string;
  importantText: string;
  capturedAt: string;
} {
  const url = window.location.href;
  const hostname = window.location.hostname.replace(/^www\./, '');

  // 1. Page Title
  let title = '';
  // Check OpenGraph title or h1 first
  const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
  const h1 = document.querySelector('h1')?.textContent;
  if (h1 && h1.trim().length > 3) {
    title = h1.trim();
  } else if (ogTitle && ogTitle.trim()) {
    title = ogTitle.trim();
  } else {
    title = document.title || 'Untitled Page';
  }
  // Remove site name suffix if present (e.g. "Product - Star Tech")
  title = title.split(/ [|\-–•] /)[0].trim() || title;

  // 2. Meta Description
  let description = '';
  const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') ||
                     document.querySelector('meta[property="og:description"]')?.getAttribute('content');
  if (metaDesc) {
    description = metaDesc.trim();
  }

  // 3. Structured Data (JSON-LD / schema.org)
  let structuredData = '';
  try {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const ldObjects: unknown[] = [];
    scripts.forEach((script) => {
      try {
        const text = script.textContent;
        if (text) {
          const parsed = JSON.parse(text);
          // Keep relevant schema types (Product, JobPosting, Course, Hotel, Offer)
          ldObjects.push(parsed);
        }
      } catch {
        // Ignore invalid JSON-LD
      }
    });
    if (ldObjects.length > 0) {
      structuredData = JSON.stringify(ldObjects).slice(0, 1500);
    }
  } catch {
    // Ignore error
  }

  // 4. Cloned body without junk elements for clean text extraction
  const clone = document.body.cloneNode(true) as HTMLElement;

  // Selectors of unwanted elements
  const removeSelectors = [
    'script', 'style', 'noscript', 'iframe', 'svg',
    'nav', 'header', 'footer',
    '[role="navigation"]', '[role="banner"]', '[role="contentinfo"]',
    '.nav', '.navbar', '.header', '.footer', '.menu',
    '.cookie-consent', '.cookie-banner', '#cookie-notice',
    '.ad', '.ads', '.advertisement', '.social-share',
    '.comments', '#comments', '.sidebar'
  ];

  removeSelectors.forEach(sel => {
    clone.querySelectorAll(sel).forEach(el => el.remove());
  });

  // Remove elements explicitly hidden
  clone.querySelectorAll('*').forEach(el => {
    const style = (el as HTMLElement).style;
    if (style && (style.display === 'none' || style.visibility === 'hidden')) {
      el.remove();
    }
  });

  // Priority 1: Tables (Specification tables, comparison charts, pricing tables)
  const tableTexts: string[] = [];
  clone.querySelectorAll('table').forEach(tbl => {
    const rows: string[] = [];
    tbl.querySelectorAll('tr').forEach(tr => {
      const cells: string[] = [];
      tr.querySelectorAll('th, td').forEach(cell => {
        const txt = cell.textContent?.replace(/\s+/g, ' ').trim();
        if (txt) cells.push(txt);
      });
      if (cells.length > 0) {
        rows.push(cells.join(' | '));
      }
    });
    if (rows.length > 0) {
      tableTexts.push(rows.join('\n'));
    }
  });

  // Priority 2: Specification definition lists & key-value sections
  const specTexts: string[] = [];
  clone.querySelectorAll('dl, .specification, .specs, .specifications, .attributes, .product-info').forEach(sec => {
    const text = sec.textContent?.replace(/\s+/g, ' ').trim();
    if (text && text.length > 10 && text.length < 2000) {
      specTexts.push(text);
    }
  });

  // Priority 3: Prominent headings (H2, H3, H4) and list items
  const headingListTexts: string[] = [];
  clone.querySelectorAll('h2, h3, h4, ul, ol').forEach(el => {
    const tagName = el.tagName.toLowerCase();
    if (tagName.startsWith('h')) {
      const heading = el.textContent?.replace(/\s+/g, ' ').trim();
      if (heading && heading.length > 2 && heading.length < 150) {
        headingListTexts.push(`[${heading}]`);
      }
    } else if (tagName === 'ul' || tagName === 'ol') {
      const items: string[] = [];
      el.querySelectorAll('li').forEach(li => {
        const item = li.textContent?.replace(/\s+/g, ' ').trim();
        if (item && item.length > 2 && item.length < 200) {
          items.push(`• ${item}`);
        }
      });
      if (items.length > 0 && items.length <= 15) {
        headingListTexts.push(items.join('\n'));
      }
    }
  });

  // Priority 4: Main paragraphs / body text
  const paraTexts: string[] = [];
  clone.querySelectorAll('p').forEach(p => {
    const txt = p.textContent?.replace(/\s+/g, ' ').trim();
    if (txt && txt.length > 25 && txt.length < 500) {
      paraTexts.push(txt);
    }
  });

  // Assemble with priority: Tables -> Specs -> Headings/Lists -> Paragraphs
  const sections: string[] = [];

  if (tableTexts.length > 0) {
    sections.push('--- SPECIFICATION TABLES ---\n' + tableTexts.join('\n\n'));
  }

  if (specTexts.length > 0) {
    sections.push('--- SPECIFICATIONS & DETAILS ---\n' + specTexts.join('\n\n'));
  }

  if (headingListTexts.length > 0) {
    sections.push('--- KEY FEATURES & DETAILS ---\n' + headingListTexts.join('\n'));
  }

  if (paraTexts.length > 0) {
    sections.push('--- SUMMARY TEXT ---\n' + paraTexts.slice(0, 6).join('\n'));
  }

  // Fallback to body text if no structured content found
  let rawContent = sections.join('\n\n').trim();
  if (!rawContent || rawContent.length < 50) {
    rawContent = (clone.textContent || '').replace(/\s+/g, ' ').trim();
  }

  // Truncate cleanly up to ~3,500 characters
  const maxChars = 3500;
  let importantText = rawContent;
  if (importantText.length > maxChars) {
    // Intelligent truncation at sentence boundary
    const slice = importantText.slice(0, maxChars);
    const lastPunct = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('\n'));
    if (lastPunct > maxChars * 0.7) {
      importantText = slice.slice(0, lastPunct + 1).trim();
    } else {
      const lastSpace = slice.lastIndexOf(' ');
      importantText = (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trim() + '...';
    }
  }

  return {
    url,
    domain: hostname,
    title,
    description,
    structuredData,
    importantText,
    capturedAt: new Date().toISOString()
  };
}

/**
 * Executes the extractor in the active Chrome tab.
 */
export async function extractActiveTabContent(): Promise<PageSnapshot> {
  if (typeof chrome === 'undefined' || !chrome.tabs || !chrome.scripting) {
    // Development fallback mock snapshot
    return {
      id: 'page-dev',
      url: window.location.href || 'https://example.com/product',
      domain: 'example.com',
      title: 'Dev Test Product ' + Math.floor(Math.random() * 100),
      description: 'Dev test product meta description',
      importantText: 'Price: $999\nRAM: 16GB\nProcessor: Core i7\nStorage: 512GB SSD',
      capturedAt: new Date().toISOString()
    };
  }

  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!activeTab || !activeTab.id) {
    throw new Error('No active browser tab detected.');
  }

  const tabUrl = activeTab.url || '';
  if (tabUrl.startsWith('chrome://') || tabUrl.startsWith('chrome-extension://') || tabUrl.startsWith('edge://')) {
    throw new Error('Chrome internal pages cannot be added to comparison.');
  }

  const results = await chrome.scripting.executeScript({
    target: { tabId: activeTab.id },
    func: extractPageFromDOM
  });

  if (!results || results.length === 0 || !results[0].result) {
    throw new Error("We couldn't extract enough information from this page.");
  }

  const data = results[0].result;

  if (!data.importantText || data.importantText.trim().length < 20) {
    throw new Error("We couldn't extract enough information from this page.");
  }

  return {
    id: 'pending-id',
    url: data.url,
    domain: data.domain || extractDomain(data.url),
    title: cleanWhitespace(data.title || activeTab.title || 'Untitled Page'),
    description: cleanWhitespace(data.description || ''),
    structuredData: data.structuredData,
    importantText: intelligentTruncate(data.importantText, 3500),
    capturedAt: data.capturedAt || new Date().toISOString()
  };
}
