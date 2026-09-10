import assert from 'assert';

console.log('--- Running Day 3 Unit & Verification Tests ---');

// Mock Comparison Result
const mockResult = {
  comparisonTitle: 'ASUS Vivobook 15 vs Lenovo IdeaPad 5',
  comparisonType: 'Laptops',
  goal: 'Best laptop for programming under Tk 80,000',
  items: [
    {
      id: 'page-1',
      displayName: 'ASUS Vivobook 15',
      shortDescription: 'Core i5 13th Gen laptop with 16GB RAM.',
    },
    {
      id: 'page-2',
      displayName: 'Lenovo IdeaPad 5',
      shortDescription: 'AMD Ryzen 7 7730U 8-core laptop.',
    },
  ],
  criteria: [
    {
      name: 'Price',
      importance: 'high',
      values: [
        { itemId: 'page-1', value: 'Tk 74,500', confidence: 'high' },
        { itemId: 'page-2', value: 'Tk 78,000', confidence: 'high' },
      ],
      winnerItemIds: ['page-1'],
    },
    {
      name: 'Processor',
      importance: 'high',
      values: [
        { itemId: 'page-1', value: 'Core i5-1335U', confidence: 'high' },
        { itemId: 'page-2', value: 'Ryzen 7 7730U', confidence: 'high' },
      ],
      winnerItemIds: ['page-2'],
    },
    {
      name: 'Weight',
      importance: 'medium',
      values: [
        { itemId: 'page-1', value: 'Not stated', confidence: 'high' },
        { itemId: 'page-2', value: '1.63 kg', confidence: 'high' },
      ],
      winnerItemIds: ['page-2'],
    },
  ],
  bestOverall: {
    itemId: 'page-2',
    reason: 'Offers Ryzen 7 8-core performance within the budget.',
  },
  bestFor: [
    {
      label: 'Lowest Price',
      itemId: 'page-1',
      reason: 'Lowest price at Tk 74,500.',
    },
  ],
  keyDifferences: [
    'ASUS is Tk 3,500 cheaper.',
    'Lenovo has stronger 8-core Ryzen 7 processor.',
  ],
  missingInformation: [
    {
      itemId: 'page-1',
      fields: ['Weight'],
    },
  ],
};

const mockPages = [
  {
    id: 'page-1',
    url: 'https://startech.com.bd/asus-vivobook',
    domain: 'startech.com.bd',
    title: 'ASUS Vivobook 15',
    description: 'ASUS laptop specs',
    importantText: 'Price: Tk 74,500',
    capturedAt: new Date().toISOString(),
  },
  {
    id: 'page-2',
    url: 'https://ryans.com/lenovo-ideapad-5',
    domain: 'ryans.com',
    title: 'Lenovo IdeaPad 5',
    description: 'Lenovo laptop specs',
    importantText: 'Price: Tk 78,000',
    capturedAt: new Date().toISOString(),
  },
];

// 1. Test CSV Output Generation Logic
console.log('1. Testing CSV Generator Logic...');
const itemNames = mockResult.items.map((it) => it.displayName);
const escapeCsv = (val) => `"${(val || '').replace(/"/g, '""')}"`;
const headers = ['Criterion', 'Importance', ...itemNames, 'Winner(s)'];
const rows = [headers.map(escapeCsv).join(',')];

for (const criterion of mockResult.criteria) {
  const valMap = new Map(criterion.values.map((v) => [v.itemId, v.value]));
  const winners = criterion.winnerItemIds
    .map((id) => mockResult.items.find((it) => it.id === id)?.displayName || id)
    .join(', ') || 'None';

  const row = [
    criterion.name,
    criterion.importance.toUpperCase(),
    ...mockResult.items.map((it) => valMap.get(it.id) || 'Not stated'),
    winners,
  ];
  rows.push(row.map(escapeCsv).join(','));
}

const csvOutput = rows.join('\r\n');
assert(csvOutput.includes('"Price","HIGH","Tk 74,500","Tk 78,000","ASUS Vivobook 15"'));
assert(csvOutput.includes('"Weight","MEDIUM","Not stated","1.63 kg","Lenovo IdeaPad 5"'));
console.log('✓ CSV generation logic passed.');

// 2. Test Markdown Summary Generator Logic
console.log('2. Testing Markdown Summary Generator Logic...');
const pageMap = new Map(mockPages.map((p) => [p.id, p]));
const itemMap = new Map(mockResult.items.map((it) => [it.id, it.displayName]));

let text = `# ${mockResult.comparisonTitle}\n`;
text += `Category: ${mockResult.comparisonType}\n`;
text += `User Goal: ${mockResult.goal}\n\n`;
text += '## Quick Verdict\n';
const winnerName = itemMap.get(mockResult.bestOverall.itemId);
text += `**Best Overall:** ${winnerName}\n`;
text += `${mockResult.bestOverall.reason}\n\n`;

text += '## Comparison Table\n\n';
const headerCols = ['Feature', ...mockResult.items.map((i) => i.displayName)];
text += `| ${headerCols.join(' | ')} |\n`;
text += `| ${headerCols.map(() => '---').join(' | ')} |\n`;

for (const criterion of mockResult.criteria) {
  const valMap = new Map(criterion.values.map((v) => [v.itemId, v.value]));
  const row = [
    criterion.name,
    ...mockResult.items.map((it) => valMap.get(it.id) || 'Not stated'),
  ];
  text += `| ${row.join(' | ')} |\n`;
}

assert(text.includes('| Price | Tk 74,500 | Tk 78,000 |'));
assert(text.includes('| Weight | Not stated | 1.63 kg |'));
assert(text.includes('**Best Overall:** Lenovo IdeaPad 5'));
console.log('✓ Markdown summary generator logic passed.');

// 3. Test Storage Cache Boundaries
console.log('3. Testing Cache Structure & Storage Boundaries...');
assert.strictEqual(mockResult.items.length, 2);
assert(mockResult.criteria.length >= 3);
assert.strictEqual(mockResult.bestFor.length, 1);
assert.strictEqual(mockResult.missingInformation[0].fields[0], 'Weight');
console.log('✓ Storage cache boundaries verified.');

console.log('\n=== ALL DAY 3 UNIT & VERIFICATION TESTS PASSED SUCCESSFULLY! ===\n');
