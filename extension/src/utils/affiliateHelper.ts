/**
 * Compare Anything — Smart Affiliate & Partner Link Engine
 * Automatically attaches affiliate tags to supported e-commerce platforms.
 */

export interface AffiliateConfig {
  genericRefTag?: string;

  // Major Global Retailers
  amazonTag?: string;
  ebayCampId?: string;
  aliexpressTag?: string;
  walmartId?: string;
  bestbuyId?: string;
  targetId?: string;
  neweggId?: string;

  // Regional (Asia / India / BD)
  darazAffiliateId?: string;
  flipkartAffId?: string;

  // Travel & Hotels
  bookingAid?: string;
  agodaCid?: string;

  // Online Education & Courses
  courseraPartnerId?: string;
  udemyPartnerId?: string;
}

const DEFAULT_CONFIG: AffiliateConfig = {
  genericRefTag: 'eaemon',

  // Major Global Retailers
  amazonTag: 'eaemon-20', // Emon Ahmed's verified Amazon Associates Tag
  ebayCampId: '5339000000', // eBay Partner Network (EPN) Campaign ID
  aliexpressTag: 'compareanything', // AliExpress Affiliate Tag / ID
  walmartId: 'eaemon', // Walmart Affiliate (Impact) Partner ID
  bestbuyId: 'eaemon', // Best Buy Affiliate ID
  targetId: 'eaemon', // Target Partners ID
  neweggId: 'eaemon', // Newegg Affiliate ID

  // Regional Retailers
  darazAffiliateId: 'compareanything', // Daraz Affiliate ID
  flipkartAffId: 'eaemon', // Flipkart Affiliate ID

  // Travel & Hotels
  bookingAid: 'compareanything', // Booking.com Affiliate Partner AID
  agodaCid: 'compareanything', // Agoda Partner CID

  // Online Education & Courses
  courseraPartnerId: 'eaemon', // Coursera Impact Partner ID
  udemyPartnerId: 'eaemon', // Udemy Affiliate ID
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

    // 2. eBay Domains (ebay.com, ebay.co.uk, ebay.de, ebay.ca, ebay.com.au, etc.)
    if (hostname.includes('ebay.')) {
      const campId = config.ebayCampId || DEFAULT_CONFIG.ebayCampId;
      if (campId) {
        urlObj.searchParams.set('mkcid', '1');
        urlObj.searchParams.set('mkrid', '711-53200-19255-0');
        urlObj.searchParams.set('siteid', '0');
        urlObj.searchParams.set('campid', campId);
        urlObj.searchParams.set('customid', config.genericRefTag || 'compareanything');
        urlObj.searchParams.set('toolid', '10001');
        urlObj.searchParams.set('mkevt', '1');
      }
      return urlObj.toString();
    }

    // 3. AliExpress Domains (aliexpress.com, aliexpress.us, etc.)
    if (hostname.includes('aliexpress.')) {
      const aliTag = config.aliexpressTag || DEFAULT_CONFIG.aliexpressTag;
      if (aliTag) {
        urlObj.searchParams.set('aff_platform', 'portals-tool');
        urlObj.searchParams.set('sk', aliTag);
        urlObj.searchParams.set('aff_trace_key', aliTag);
        urlObj.searchParams.set('sub_id', config.genericRefTag || 'compareanything');
      }
      return urlObj.toString();
    }

    // 4. Walmart
    if (hostname.includes('walmart.')) {
      const partner = config.walmartId || DEFAULT_CONFIG.walmartId;
      if (partner) {
        urlObj.searchParams.set('wmlspartner', partner);
        urlObj.searchParams.set('affillinktype', '2');
        urlObj.searchParams.set('veh', 'aff');
        urlObj.searchParams.set('sourceid', 'imp_' + (config.genericRefTag || 'compareanything'));
      }
      return urlObj.toString();
    }

    // 5. Best Buy
    if (hostname.includes('bestbuy.')) {
      const bby = config.bestbuyId || DEFAULT_CONFIG.bestbuyId;
      if (bby) {
        urlObj.searchParams.set('ref', bby);
        urlObj.searchParams.set('loc', 'compare_anything');
        urlObj.searchParams.set('acampID', config.genericRefTag || 'compareanything');
      }
      return urlObj.toString();
    }

    // 6. Target
    if (hostname.includes('target.')) {
      const tgt = config.targetId || DEFAULT_CONFIG.targetId;
      if (tgt) {
        urlObj.searchParams.set('afid', tgt);
        urlObj.searchParams.set('cpng', 'affiliate');
        urlObj.searchParams.set('lnm', config.genericRefTag || 'compareanything');
      }
      return urlObj.toString();
    }

    // 7. Newegg
    if (hostname.includes('newegg.')) {
      const egg = config.neweggId || DEFAULT_CONFIG.neweggId;
      if (egg) {
        urlObj.searchParams.set('cm_mmc', 'afc-compare-anything');
        urlObj.searchParams.set('nm_mc', 'AFC-CompareAnything');
        urlObj.searchParams.set('AID', egg);
        urlObj.searchParams.set('PID', config.genericRefTag || 'compareanything');
      }
      return urlObj.toString();
    }

    // 8. Flipkart
    if (hostname.includes('flipkart.')) {
      const fkid = config.flipkartAffId || DEFAULT_CONFIG.flipkartAffId;
      if (fkid) {
        urlObj.searchParams.set('affid', fkid);
        urlObj.searchParams.set('affExtParam1', config.genericRefTag || 'compareanything');
      }
      return urlObj.toString();
    }

    // 9. Daraz Domains (daraz.com.bd, daraz.pk, daraz.lk, etc.)
    if (hostname.includes('daraz.')) {
      const affId = config.darazAffiliateId || DEFAULT_CONFIG.darazAffiliateId;
      if (affId) {
        urlObj.searchParams.set('aff_id', affId);
        urlObj.searchParams.set('utm_source', 'daraz_affiliate');
        urlObj.searchParams.set('utm_medium', 'compare_anything_ext');
      }
      return urlObj.toString();
    }

    // 10. Booking.com
    if (hostname.includes('booking.')) {
      const aid = config.bookingAid || DEFAULT_CONFIG.bookingAid;
      if (aid) {
        urlObj.searchParams.set('aid', aid);
        urlObj.searchParams.set('label', config.genericRefTag || 'compareanything');
      }
      return urlObj.toString();
    }

    // 11. Agoda
    if (hostname.includes('agoda.')) {
      const cid = config.agodaCid || DEFAULT_CONFIG.agodaCid;
      if (cid) {
        urlObj.searchParams.set('cid', cid);
        urlObj.searchParams.set('tag', config.genericRefTag || 'compareanything');
      }
      return urlObj.toString();
    }

    // 12. Coursera
    if (hostname.includes('coursera.')) {
      const coursera = config.courseraPartnerId || DEFAULT_CONFIG.courseraPartnerId;
      if (coursera) {
        urlObj.searchParams.set('utm_campaign', coursera);
        urlObj.searchParams.set('utm_source', 'impact');
        urlObj.searchParams.set('utm_medium', 'affiliate');
      }
      return urlObj.toString();
    }

    // 13. Udemy
    if (hostname.includes('udemy.')) {
      const udemy = config.udemyPartnerId || DEFAULT_CONFIG.udemyPartnerId;
      if (udemy) {
        urlObj.searchParams.set('utm_source', 'aff-campaign');
        urlObj.searchParams.set('utm_medium', 'udemyads');
        urlObj.searchParams.set('couponCode', udemy);
      }
      return urlObj.toString();
    }

    // 14. Star Tech, Ryans, Techland & Regional General Stores
    if (
      hostname.includes('startech.') ||
      hostname.includes('ryans.') ||
      hostname.includes('techland.')
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
  if (d.includes('ebay')) return 'Check Price on eBay';
  if (d.includes('aliexpress')) return 'Check Price on AliExpress';
  if (d.includes('walmart')) return 'Check Price on Walmart';
  if (d.includes('bestbuy')) return 'Check Price on Best Buy';
  if (d.includes('target')) return 'Check Price on Target';
  if (d.includes('newegg')) return 'Check Price on Newegg';
  if (d.includes('flipkart')) return 'Check Price on Flipkart';
  if (d.includes('daraz')) return 'Check Price on Daraz';
  if (d.includes('booking')) return 'View Deal on Booking.com';
  if (d.includes('agoda')) return 'View Deal on Agoda';
  if (d.includes('coursera')) return 'Enroll on Coursera';
  if (d.includes('udemy')) return 'View Course on Udemy';
  if (d.includes('startech')) return 'View on Star Tech';
  if (d.includes('ryans')) return 'View on Ryans';
  if (d.includes('techland')) return 'View on Techland';
  if (d.includes('careers') || d.includes('job') || d.includes('linkedin')) return 'Apply / View Job';
  return 'View Deal / Check Price';
}
