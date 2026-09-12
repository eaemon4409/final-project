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

// 5. Walmart Tagging
const walmartRaw = 'https://www.walmart.com/ip/Apple-AirPods-Pro/123456';
const walmartAff = buildAffiliateUrl(walmartRaw, { walmartId: 'my_walmart_id', genericRefTag: 'eaemon' });
assert(walmartAff.includes('wmlspartner=my_walmart_id'), 'Walmart URL must contain wmlspartner');
assert(walmartAff.includes('veh=aff'), 'Walmart URL must contain veh=aff');
console.log('✓ Walmart affiliate tagging passed.');

// 6. Best Buy Tagging
const bbyRaw = 'https://www.bestbuy.com/site/apple-macbook-pro/123456.p';
const bbyAff = buildAffiliateUrl(bbyRaw, { bestbuyId: 'my_bby_ref', genericRefTag: 'eaemon' });
assert(bbyAff.includes('ref=my_bby_ref'), 'Best Buy URL must contain ref');
assert(bbyAff.includes('loc=compare_anything'), 'Best Buy URL must contain loc');
console.log('✓ Best Buy affiliate tagging passed.');

// 7. Target Tagging
const tgtRaw = 'https://www.target.com/p/apple-ipad-10th-gen/-/A-123456';
const tgtAff = buildAffiliateUrl(tgtRaw, { targetId: 'my_tgt_id', genericRefTag: 'eaemon' });
assert(tgtAff.includes('afid=my_tgt_id'), 'Target URL must contain afid');
console.log('✓ Target affiliate tagging passed.');

// 8. Newegg Tagging
const eggRaw = 'https://www.newegg.com/p/N82E16814137788';
const eggAff = buildAffiliateUrl(eggRaw, { neweggId: 'my_egg_aid', genericRefTag: 'eaemon' });
assert(eggAff.includes('AID=my_egg_aid'), 'Newegg URL must contain AID');
assert(eggAff.includes('cm_mmc=afc-compare-anything'), 'Newegg URL must contain cm_mmc');
console.log('✓ Newegg affiliate tagging passed.');

// 9. Flipkart Tagging
const fkRaw = 'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm123456';
const fkAff = buildAffiliateUrl(fkRaw, { flipkartAffId: 'my_fk_id', genericRefTag: 'eaemon' });
assert(fkAff.includes('affid=my_fk_id'), 'Flipkart URL must contain affid');
console.log('✓ Flipkart affiliate tagging passed.');

// 10. Booking.com Tagging
const bookingRaw = 'https://www.booking.com/hotel/bd/pan-pacific-sonargaon.html';
const bookingAff = buildAffiliateUrl(bookingRaw, { bookingAid: '1234567', genericRefTag: 'eaemon' });
assert(bookingAff.includes('aid=1234567'), 'Booking.com URL must contain aid');
console.log('✓ Booking.com affiliate tagging passed.');

// 11. Agoda Tagging
const agodaRaw = 'https://www.agoda.com/radisson-blu-dhaka/hotel/dhaka-bd.html';
const agodaAff = buildAffiliateUrl(agodaRaw, { agodaCid: '7654321', genericRefTag: 'eaemon' });
assert(agodaAff.includes('cid=7654321'), 'Agoda URL must contain cid');
console.log('✓ Agoda affiliate tagging passed.');

// 12. Coursera Tagging
const courseraRaw = 'https://www.coursera.org/learn/machine-learning';
const courseraAff = buildAffiliateUrl(courseraRaw, { courseraPartnerId: 'my_partner', genericRefTag: 'eaemon' });
assert(courseraAff.includes('utm_campaign=my_partner'), 'Coursera URL must contain utm_campaign');
console.log('✓ Coursera affiliate tagging passed.');

// 13. Udemy Tagging
const udemyRaw = 'https://www.udemy.com/course/the-web-developer-bootcamp/';
const udemyAff = buildAffiliateUrl(udemyRaw, { udemyPartnerId: 'COUPON2026', genericRefTag: 'eaemon' });
assert(udemyAff.includes('couponCode=COUPON2026'), 'Udemy URL must contain couponCode');
console.log('✓ Udemy affiliate tagging passed.');

// 14. Retailer CTAs
assert.strictEqual(getRetailerCta('amazon.com'), 'Check Price on Amazon');
assert.strictEqual(getRetailerCta('daraz.com.bd'), 'Check Price on Daraz');
assert.strictEqual(getRetailerCta('ebay.com'), 'Check Price on eBay');
assert.strictEqual(getRetailerCta('aliexpress.com'), 'Check Price on AliExpress');
assert.strictEqual(getRetailerCta('walmart.com'), 'Check Price on Walmart');
assert.strictEqual(getRetailerCta('bestbuy.com'), 'Check Price on Best Buy');
assert.strictEqual(getRetailerCta('target.com'), 'Check Price on Target');
assert.strictEqual(getRetailerCta('newegg.com'), 'Check Price on Newegg');
assert.strictEqual(getRetailerCta('flipkart.com'), 'Check Price on Flipkart');
assert.strictEqual(getRetailerCta('booking.com'), 'View Deal on Booking.com');
assert.strictEqual(getRetailerCta('agoda.com'), 'View Deal on Agoda');
assert.strictEqual(getRetailerCta('coursera.org'), 'Enroll on Coursera');
assert.strictEqual(getRetailerCta('udemy.com'), 'View Course on Udemy');
assert.strictEqual(getRetailerCta('startech.com.bd'), 'View on Star Tech');
assert.strictEqual(getRetailerCta('ryans.com'), 'View on Ryans');
assert.strictEqual(getRetailerCta('techland.com.bd'), 'View on Techland');
console.log('✓ All 16 Retailer CTA logic tests passed.');

console.log('✓ ALL 14 AFFILIATE LINK ENGINES & CTAS PASSED 100%!');
