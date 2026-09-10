export function isSupportedUrl(url?: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    // Only support standard web pages (http and https)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove tracking query parameters and hash fragment for cleaner comparison and deduplication
    const cleanParams = new URLSearchParams();
    const trackingParams = new Set([
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'fbclid', 'gclid', 'ref', 'source', 'trk', 'spm', 'scm', 'aff_id',
      'affiliate', 'mc_cid', 'mc_eid'
    ]);

    parsed.searchParams.forEach((val, key) => {
      if (!trackingParams.has(key.toLowerCase())) {
        cleanParams.append(key, val);
      }
    });

    const queryStr = cleanParams.toString() ? `?${cleanParams.toString()}` : '';
    return `${parsed.origin}${parsed.pathname}${queryStr}`;
  } catch {
    return url.trim();
  }
}
