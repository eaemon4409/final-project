import assert from 'assert';
import { buildAffiliateUrl, getRetailerCta } from './src/utils/affiliateHelper.ts';

console.log('Testing Affiliate Monetization Link Engine...');

// 1. Amazon Tagging
const amazonRaw = 'https://www.amazon.com/dp/B08N5WRWNW';
const amazonAff = buildAffiliateUrl(amazonRaw, { amazonTag: 'myassoc-20' });
assert(amazonAff.includes('tag=myassoc-20'), 'Amazon URL must contain affiliate tag');
console.log('✓ Amazon affiliate tagging passed.');

// 2. Daraz Tagging
const darazRaw = 'https://www.daraz.com.bd/products/laptop-i12345.html';
const darazAff = buildAffiliateUrl(darazRaw, { darazAffiliateId: 'my_daraz_id' });
assert(darazAff.includes('aff_id=my_daraz_id'), 'Daraz URL must contain aff_id');
assert(darazAff.includes('utm_source=daraz_affiliate'));
console.log('✓ Daraz affiliate tagging passed.');

// 3. eBay Tagging (EPN)
const ebayRaw = 'https://www.ebay.com/itm/123456789012';
const ebayAff = buildAffiliateUrl(ebayRaw, { ebayCampId: '5339999999', genericRefTag: 'eaemon' });
assert(ebayAff.includes('campid=5339999999'), 'eBay URL must contain campid');
assert(ebayAff.includes('mkcid=1'), 'eBay URL must contain mkcid=1');
assert(ebayAff.includes('toolid=10001'), 'eBay URL must contain toolid=10001');
assert(ebayAff.includes('mkevt=1'), 'eBay URL must contain mkevt=1');
assert(ebayAff.includes('customid=eaemon'), 'eBay URL must contain customid');
console.log('✓ eBay (EPN) affiliate tagging passed.');

// 4. AliExpress Tagging
const aliRaw = 'https://www.aliexpress.com/item/1005001234567890.html';
const aliAff = buildAffiliateUrl(aliRaw, { aliexpressTag: 'my_ali_tag', genericRefTag: 'eaemon' });
assert(aliAff.includes('aff_platform=portals-tool'), 'AliExpress URL must contain aff_platform');
assert(aliAff.includes('sk=my_ali_tag'), 'AliExpress URL must contain sk');
assert(aliAff.includes('aff_trace_key=my_ali_tag'), 'AliExpress URL must contain aff_trace_key');
assert(aliAff.includes('sub_id=eaemon'), 'AliExpress URL must contain sub_id');
console.log('✓ AliExpress affiliate tagging passed.');

// 5. Retailer CTAs
assert.strictEqual(getRetailerCta('amazon.com'), 'Check Price on Amazon');
assert.strictEqual(getRetailerCta('daraz.com.bd'), 'Check Price on Daraz');
assert.strictEqual(getRetailerCta('ebay.com'), 'Check Price on eBay');
assert.strictEqual(getRetailerCta('aliexpress.com'), 'Check Price on AliExpress');
assert.strictEqual(getRetailerCta('startech.com.bd'), 'View on Star Tech');
assert.strictEqual(getRetailerCta('ryans.com'), 'View on Ryans');
console.log('✓ Retailer CTA logic passed.');

console.log('✓ All affiliate engine tests passed (100%)!');
