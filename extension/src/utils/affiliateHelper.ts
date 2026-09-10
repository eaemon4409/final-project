/**
 * Compare Anything — Smart Affiliate & Partner Link Engine
 * Automatically attaches affiliate tags to supported e-commerce platforms.
 */

export interface AffiliateConfig {
  amazonTag?: string;
  darazAffiliateId?: string;
  genericRefTag?: string;
}

const DEFAULT_CONFIG: AffiliateConfig = {
  amazonTag: 'compareanything-20', // Replace with your Amazon Associates Tag
  darazAffiliateId: 'compareanything', // Replace with your Daraz Affiliate ID
  genericRefTag: 'compareanything',
};

let activeConfig: AffiliateConfig = { ...DEFAULT_CONFIG };

// Auto-load config from chrome.storage.local if available
if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
  chrome.storage.local.get('affiliateConfig').then((res) => {
    if (res && res.affiliateConfig) {
      activeConfig = { ...DEFAULT_CONFIG, ...res.affiliateConfig };
    }
  }).catch(() => {});
}

export async function initAffiliateConfig(): Promise<AffiliateConfig> {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    try {
      const res = await chrome.storage.local.get('affiliateConfig');
      if (res && res.affiliateConfig) {
        activeConfig = { ...DEFAULT_CONFIG, ...res.affiliateConfig };
      }
    } catch {
      // fallback to activeConfig
    }
  }
  return activeConfig;
}

export function getActiveAffiliateConfig(): AffiliateConfig {
  return activeConfig;
}

export async function saveAffiliateConfig(cfg: Partial<AffiliateConfig>): Promise<void> {
  activeConfig = { ...activeConfig, ...cfg };
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    await chrome.storage.local.set({ affiliateConfig: activeConfig });
  }
}

/**
 * Transforms an original product URL into a monetized affiliate URL.
 * Transparently preserves original page destination while attaching tracking tags.
 */
export function buildAffiliateUrl(originalUrl: string, config: AffiliateConfig = activeConfig): string {
  if (!originalUrl) return '';

  try {
    const urlObj = new URL(originalUrl);
    const hostname = urlObj.hostname.toLowerCase();

    // 1. Amazon Domains (amazon.com, amazon.co.uk, amazon.in, etc.)
    if (hostname.includes('amazon.')) {
      const tag = config.amazonTag || DEFAULT_CONFIG.amazonTag;
      if (tag) {
        urlObj.searchParams.set('tag', tag);
        urlObj.searchParams.set('linkCode', 'll1');
      }
      return urlObj.toString();
    }

    // 2. Daraz Domains (daraz.com.bd, daraz.pk, daraz.lk, etc.)
    if (hostname.includes('daraz.')) {
      const affId = config.darazAffiliateId || DEFAULT_CONFIG.darazAffiliateId;
      if (affId) {
        urlObj.searchParams.set('aff_id', affId);
        urlObj.searchParams.set('utm_source', 'daraz_affiliate');
        urlObj.searchParams.set('utm_medium', 'compare_anything_ext');
      }
      return urlObj.toString();
    }

    // 3. AliExpress
    if (hostname.includes('aliexpress.')) {
      urlObj.searchParams.set('aff_platform', 'true');
      urlObj.searchParams.set('sk', config.genericRefTag || 'compareanything');
      return urlObj.toString();
    }

    // 4. Star Tech, Ryans, Tech Retailers & General Stores
    if (
      hostname.includes('startech.') ||
      hostname.includes('ryans.') ||
      hostname.includes('techland.') ||
      hostname.includes('flipkart.') ||
      hostname.includes('bestbuy.') ||
      hostname.includes('walmart.') ||
      hostname.includes('coursera.')
    ) {
      const ref = config.genericRefTag || DEFAULT_CONFIG.genericRefTag || 'compareanything';
      urlObj.searchParams.set('ref', ref);
      urlObj.searchParams.set('utm_source', 'compare_anything');
      urlObj.searchParams.set('utm_medium', 'extension_comparison');
      return urlObj.toString();
    }

    // Fallback: return original URL safely
    return originalUrl;
  } catch {
    return originalUrl;
  }
}

/**
 * Returns a human-friendly call to action based on retailer domain.
 */
export function getRetailerCta(domain: string): string {
  const d = domain.toLowerCase();
  if (d.includes('amazon')) return 'Check Price on Amazon';
  if (d.includes('daraz')) return 'Check Price on Daraz';
  if (d.includes('startech')) return 'View on Star Tech';
  if (d.includes('ryans')) return 'View on Ryans';
  if (d.includes('coursera') || d.includes('udemy')) return 'Enroll / View Course';
  if (d.includes('careers') || d.includes('job') || d.includes('linkedin')) return 'Apply / View Job';
  return 'View Deal / Check Price';
}
