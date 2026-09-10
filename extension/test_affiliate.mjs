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

// 3. Retailer CTAs
assert.strictEqual(getRetailerCta('amazon.com'), 'Check Price on Amazon');
assert.strictEqual(getRetailerCta('daraz.com.bd'), 'Check Price on Daraz');
assert.strictEqual(getRetailerCta('startech.com.bd'), 'View on Star Tech');
assert.strictEqual(getRetailerCta('ryans.com'), 'View on Ryans');
console.log('✓ Retailer CTA logic passed.');

console.log('✓ All affiliate engine tests passed (100%)!');
