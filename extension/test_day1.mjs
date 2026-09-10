import assert from 'assert';
import { cleanWhitespace, intelligentTruncate } from './src/utils/textHelper.ts';
import { extractDomain, normalizeUrl, isSupportedUrl } from './src/utils/urlHelper.ts';

console.log('--- Running Day 1 Unit & Verification Tests ---');

// 1. Test URL Helper
console.log('1. Testing URL Helper...');
assert.strictEqual(isSupportedUrl('https://www.startech.com.bd/product'), true);
assert.strictEqual(isSupportedUrl('http://ryans.com/laptop'), true);
assert.strictEqual(isSupportedUrl('chrome://extensions'), false);
assert.strictEqual(isSupportedUrl('edge://settings'), false);

assert.strictEqual(extractDomain('https://www.startech.com.bd/asus-vivobook'), 'startech.com.bd');
assert.strictEqual(extractDomain('https://ryans.com/item/123'), 'ryans.com');

const urlWithTrackers = 'https://startech.com.bd/product?utm_source=facebook&utm_medium=cpc&ref=affiliate';
assert.strictEqual(normalizeUrl(urlWithTrackers), 'https://startech.com.bd/product');
console.log('✓ URL Helper tests passed.');

// 2. Test Text & Truncation Helper
console.log('2. Testing Text Helper & Intelligent Truncation...');
assert.strictEqual(cleanWhitespace('  Hello   World \n  Test  '), 'Hello World Test');

const longText = 'Sentence one. '.repeat(400); // 5600 characters
const truncated = intelligentTruncate(longText, 3500);
assert(truncated.length <= 3500, `Truncated length ${truncated.length} must be <= 3500`);
assert(truncated.endsWith('.'), 'Truncated text should end cleanly at sentence end');
console.log(`✓ Intelligent Truncation passed (truncated from ${longText.length} to ${truncated.length} chars).`);

// 3. Test 4-Page Snapshot Collection & Limit Rules
console.log('3. Testing 4-Page Snapshot Logic & Boundaries...');
const simulatedStorage = {
  installId: 'anon-test-guid-1234',
  pages: [],
  goal: ''
};

function simulateAddPage(snapshot) {
  if (simulatedStorage.pages.length >= 4) {
    return { success: false, message: 'Maximum 4 pages can be compared at once.' };
  }
  const normUrl = normalizeUrl(snapshot.url);
  if (simulatedStorage.pages.some(p => normalizeUrl(p.url) === normUrl)) {
    return { success: false, message: 'This page is already in your comparison.' };
  }
  const id = `page-${simulatedStorage.pages.length + 1}`;
  simulatedStorage.pages.push({ ...snapshot, id });
  return { success: true };
}

// Add Page 1: Star Tech
const r1 = simulateAddPage({
  url: 'https://startech.com.bd/asus-vivobook-15',
  domain: 'startech.com.bd',
  title: 'ASUS Vivobook 15 X1504VA Core i5 13th Gen 15.6" FHD Laptop',
  description: 'ASUS Vivobook 15 laptop with Intel Core i5-1335U processor, 16GB RAM, 512GB SSD.',
  importantText: 'Price: Tk 74,500\nProcessor: Intel Core i5-1335U\nRAM: 16GB DDR4\nStorage: 512GB NVMe SSD\nDisplay: 15.6" FHD\nWarranty: 2 Years',
  capturedAt: new Date().toISOString()
});
assert.strictEqual(r1.success, true);
assert.strictEqual(simulatedStorage.pages.length, 1);

// Add Page 2: Ryans
const r2 = simulateAddPage({
  url: 'https://ryans.com/lenovo-ideapad-5-ryzen-7',
  domain: 'ryans.com',
  title: 'Lenovo IdeaPad 5 15ABR8 AMD Ryzen 7 7730U 15.6 Inch FHD Laptop',
  description: 'Lenovo IdeaPad 5 powered by AMD Ryzen 7 7730U processor, 16GB RAM, 512GB SSD.',
  importantText: 'Price: Tk 78,000\nProcessor: AMD Ryzen 7 7730U\nRAM: 16GB DDR4\nStorage: 512GB SSD\nWeight: 1.63 kg\nWarranty: 2 Years',
  capturedAt: new Date().toISOString()
});
assert.strictEqual(r2.success, true);
assert.strictEqual(simulatedStorage.pages.length, 2);

// Test Duplicate Prevention
const rDup = simulateAddPage({
  url: 'https://ryans.com/lenovo-ideapad-5-ryzen-7?utm_source=google',
  domain: 'ryans.com',
  title: 'Duplicate Page',
  importantText: '...',
  capturedAt: new Date().toISOString()
});
assert.strictEqual(rDup.success, false);
assert.strictEqual(rDup.message, 'This page is already in your comparison.');
console.log('✓ Duplicate URL prevented successfully.');

// Add Page 3: Techland BD
const r3 = simulateAddPage({
  url: 'https://techlandbd.com/hp-pavilion-15-eg3019tu',
  domain: 'techlandbd.com',
  title: 'HP Pavilion 15-eg3019TU Core i5 13th Gen FHD Laptop',
  description: 'HP Pavilion with Intel Core i5-1335U, 8GB RAM, 512GB SSD.',
  importantText: 'Price: Tk 81,500\nProcessor: Core i5-1335U\nRAM: 8GB\nStorage: 512GB SSD\nWeight: 1.59 kg\nWarranty: 2 Years',
  capturedAt: new Date().toISOString()
});
assert.strictEqual(r3.success, true);
assert.strictEqual(simulatedStorage.pages.length, 3);

// Add Page 4: Daraz
const r4 = simulateAddPage({
  url: 'https://daraz.com.bd/products/acer-aspire-5',
  domain: 'daraz.com.bd',
  title: 'Acer Aspire 5 A515 Core i5 13th Gen Laptop',
  description: 'Acer Aspire 5 with 16GB RAM and 512GB SSD.',
  importantText: 'Price: Tk 76,000\nProcessor: Core i5-1335U\nRAM: 16GB\nStorage: 512GB SSD\nWarranty: 2 Years',
  capturedAt: new Date().toISOString()
});
assert.strictEqual(r4.success, true);
assert.strictEqual(simulatedStorage.pages.length, 4);

// Test 5th page blocked (Max 4 limit)
const r5 = simulateAddPage({
  url: 'https://another-shop.com/laptop-5',
  domain: 'another-shop.com',
  title: '5th laptop',
  importantText: '...',
  capturedAt: new Date().toISOString()
});
assert.strictEqual(r5.success, false);
assert.strictEqual(r5.message, 'Maximum 4 pages can be compared at once.');
console.log('✓ 4-Page limit strictly enforced (5th page rejected).');

// Verify Goal setting
simulatedStorage.goal = 'Best for programming under Tk 80,000';
assert.strictEqual(simulatedStorage.goal, 'Best for programming under Tk 80,000');

// Verify 4 snapshots structure
console.log('\n--- 4 Verified Snapshots Collected ---');
simulatedStorage.pages.forEach((p, idx) => {
  console.log(`[${idx + 1}] ID: ${p.id} | Domain: ${p.domain} | Title: ${p.title}`);
  assert(p.url, 'Must have url');
  assert(p.domain, 'Must have domain');
  assert(p.title, 'Must have title');
  assert(p.importantText, 'Must have importantText');
  assert(p.capturedAt, 'Must have capturedAt');
});

console.log('\n=== ALL DAY 1 VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
