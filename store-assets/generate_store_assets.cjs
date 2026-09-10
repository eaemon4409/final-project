const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

console.log('====================================================');
console.log('   GENERATING CHROME WEB STORE GRAPHIC ASSETS       ');
console.log('====================================================\n');

const assetsDir = __dirname;

// Helper: Pure Node.js PNG encoder
function encodePNG(width, height, getPixel) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(8 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    let c = 0xffffffff;
    const toCrc = buf.subarray(4, 8 + len);
    for (let i = 0; i < toCrc.length; i++) {
      c ^= toCrc[i];
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
    }
    buf.writeInt32BE((c ^ 0xffffffff) | 0, 8 + len);
    return buf;
  }

  const raw = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    raw[offset++] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      raw[offset++] = r;
      raw[offset++] = g;
      raw[offset++] = b;
      raw[offset++] = a;
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 6 });
  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

// -------------------------------------------------------------
// 1. Promo Tile (440 x 280)
// -------------------------------------------------------------
console.log('1. Generating Small Promo Banner (440x280)...');
const promoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 280" width="440" height="280">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a73e8" />
      <stop offset="60%" stop-color="#1557b0" />
      <stop offset="100%" stop-color="#0d47a1" />
    </linearGradient>
    <linearGradient id="cardGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#f8f9fa" stop-opacity="0.90" />
    </linearGradient>
    <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="440" height="280" fill="url(#bgGrad)" />

  <!-- Subtle circles for modern tech feel -->
  <circle cx="400" cy="40" r="120" fill="#ffffff" fill-opacity="0.04" />
  <circle cx="30" cy="240" r="100" fill="#ffffff" fill-opacity="0.04" />

  <!-- Logo emblem (Overlap Cards with Comparison Spark) -->
  <g transform="translate(40, 48)" filter="url(#drop)">
    <!-- Card A -->
    <rect x="0" y="0" width="56" height="74" rx="8" fill="#e8f0fe" stroke="#1a73e8" stroke-width="2" />
    <line x1="10" y1="18" x2="46" y2="18" stroke="#1a73e8" stroke-width="3" stroke-linecap="round" />
    <line x1="10" y1="28" x2="38" y2="28" stroke="#70757a" stroke-width="2" stroke-linecap="round" />
    <line x1="10" y1="36" x2="42" y2="36" stroke="#70757a" stroke-width="2" stroke-linecap="round" />
    <line x1="10" y1="44" x2="30" y2="44" stroke="#1a73e8" stroke-width="2" stroke-linecap="round" />

    <!-- Card B (Offset) -->
    <rect x="24" y="16" width="56" height="74" rx="8" fill="#ffffff" stroke="#188038" stroke-width="2.5" />
    <line x1="34" y1="34" x2="70" y2="34" stroke="#188038" stroke-width="3" stroke-linecap="round" />
    <line x1="34" y1="44" x2="62" y2="44" stroke="#70757a" stroke-width="2" stroke-linecap="round" />
    <line x1="34" y1="52" x2="66" y2="52" stroke="#70757a" stroke-width="2" stroke-linecap="round" />
    <circle cx="68" cy="74" r="5" fill="#188038" />

    <!-- Comparison Sparkle Icon -->
    <circle cx="68" cy="8" r="14" fill="#f9ab00" filter="url(#drop)" />
    <path d="M68 1 L71 6 L76 8 L71 10 L68 15 L65 10 L60 8 L65 6 Z" fill="#ffffff" />
  </g>

  <!-- Typography -->
  <text x="140" y="78" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif" font-size="28" font-weight="800" fill="#ffffff" letter-spacing="-0.5">Compare Anything</text>
  <text x="140" y="104" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif" font-size="14" font-weight="500" fill="#d2e3fc">AI-Powered Web Comparison</text>

  <!-- Badge: Zero Hallucination -->
  <g transform="translate(140, 118)">
    <rect x="0" y="0" width="235" height="26" rx="13" fill="#ffffff" fill-opacity="0.18" stroke="#ffffff" stroke-width="1" stroke-opacity="0.3" />
    <circle cx="14" cy="13" r="4" fill="#34a853" />
    <text x="24" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif" font-size="11" font-weight="700" fill="#ffffff">ZERO HALLUCINATION GUARANTEE</text>
  </g>

  <!-- Mini feature pills at bottom -->
  <g transform="translate(40, 195)">
    <!-- Pill 1 -->
    <rect x="0" y="0" width="112" height="38" rx="8" fill="url(#cardGrad1)" filter="url(#drop)" />
    <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#1a73e8">⚡ Fast Verdict</text>

    <!-- Pill 2 -->
    <rect x="124" y="0" width="116" height="38" rx="8" fill="url(#cardGrad1)" filter="url(#drop)" />
    <text x="136" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#188038">📊 Dynamic Table</text>

    <!-- Pill 3 -->
    <rect x="250" y="0" width="110" height="38" rx="8" fill="url(#cardGrad1)" filter="url(#drop)" />
    <text x="264" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#202124">🔒 100% Private</text>
  </g>

  <text x="220" y="260" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="#93bcf8">Chrome Extension • Works on Any 2 to 4 Pages</text>
</svg>`;

fs.writeFileSync(path.join(assetsDir, 'promo-tile-440x280.svg'), promoSvg);

// Render Promo Tile PNG
const promoBuffer = encodePNG(440, 280, (x, y, w, h) => {
  const ny = y / h;
  const nx = x / w;
  // Gradient base: #1a73e8 (26, 115, 232) to #0d47a1 (13, 71, 161)
  let r = Math.round(26 * (1 - ny) + 13 * ny);
  let g = Math.round(115 * (1 - ny) + 71 * ny);
  let b = Math.round(232 * (1 - ny) + 161 * ny);

  // Card pills area
  if (y >= 195 && y <= 233 && x >= 40 && x <= 400) {
    if ((x <= 152) || (x >= 164 && x <= 280) || (x >= 290)) {
      r = 250; g = 252; b = 255;
    }
  }

  // Accent circles
  const d1 = Math.sqrt((x - 400) ** 2 + (y - 40) ** 2);
  if (d1 <= 120 && Math.abs(d1 - 120) < 3) {
    r = Math.min(255, r + 40);
    g = Math.min(255, g + 40);
    b = Math.min(255, b + 40);
  }

  return [r, g, b, 255];
});
fs.writeFileSync(path.join(assetsDir, 'promo-tile-440x280.png'), promoBuffer);
console.log('✓ promo-tile-440x280.png & .svg generated.');

// -------------------------------------------------------------
// Helper: Generates beautiful 1280x800 Screenshot SVGs
// -------------------------------------------------------------
function wrapScreenshotSvg(title, subtitle, contentSvg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800" width="1280" height="800">
  <defs>
    <linearGradient id="pageBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafd" />
      <stop offset="100%" stop-color="#e8f0fe" />
    </linearGradient>
    <filter id="shadowLg" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#3c4043" flood-opacity="0.16" />
    </filter>
    <filter id="shadowSm" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#3c4043" flood-opacity="0.10" />
    </filter>
  </defs>

  <!-- Canvas Background -->
  <rect width="1280" height="800" fill="url(#pageBg)" />

  <!-- Header Banner -->
  <g transform="translate(80, 42)">
    <rect x="0" y="0" width="168" height="28" rx="14" fill="#1a73e8" fill-opacity="0.12" />
    <text x="14" y="19" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#1a73e8">COMPARE ANYTHING</text>
    
    <text x="0" y="62" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="800" fill="#202124" letter-spacing="-0.6">${title}</text>
    <text x="0" y="88" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="400" fill="#5f6368">${subtitle}</text>
  </g>

  <!-- Main Window Frame (macOS / Chrome style) -->
  <g transform="translate(80, 150)" filter="url(#shadowLg)">
    <!-- Window Border & Body -->
    <rect width="1120" height="600" rx="12" fill="#ffffff" stroke="#dadce0" stroke-width="1.5" />

    <!-- Browser Chrome Toolbar -->
    <path d="M 0 12 Q 0 0 12 0 L 1108 0 Q 1120 0 1120 12 L 1120 44 L 0 44 Z" fill="#f1f3f4" />
    <line x1="0" y1="44" x2="1120" y2="44" stroke="#dadce0" stroke-width="1" />
    
    <!-- Window Controls -->
    <circle cx="20" cy="22" r="6" fill="#ea4335" />
    <circle cx="38" cy="22" r="6" fill="#fbbc05" />
    <circle cx="56" cy="22" r="6" fill="#34a853" />

    <!-- Omnibox URL Bar -->
    <rect x="180" y="9" width="760" height="26" rx="13" fill="#ffffff" stroke="#dfe1e5" stroke-width="1" />
    <text x="210" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="400" fill="#5f6368">chrome-extension://compare-anything/results.html</text>

    <!-- Injected View Content -->
    ${contentSvg}
  </g>
</svg>`;
}

// -------------------------------------------------------------
// Screenshot 1: Extension Popup (1280x800)
// -------------------------------------------------------------
console.log('2. Generating Screenshot 1: Popup & Add Pages...');
const ss1Content = `
  <!-- Background Webpage Simulation -->
  <rect x="0" y="45" width="1120" height="555" fill="#f8f9fa" />
  <rect x="40" y="75" width="600" height="24" rx="4" fill="#dadce0" />
  <rect x="40" y="115" width="300" height="16" rx="4" fill="#e8eaed" />
  <rect x="40" y="150" width="560" height="240" rx="8" fill="#ffffff" stroke="#e8eaed" stroke-width="1" />
  <rect x="60" y="170" width="140" height="120" rx="6" fill="#f1f3f4" />
  <rect x="220" y="170" width="280" height="20" rx="4" fill="#202124" />
  <rect x="220" y="200" width="160" height="24" rx="4" fill="#188038" fill-opacity="0.15" />
  <text x="225" y="217" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#188038">Tk 74,500</text>

  <!-- Chrome Extension Popup (Floating on Top Right) -->
  <g transform="translate(680, 55)" filter="url(#shadowLg)">
    <rect width="400" height="500" rx="10" fill="#ffffff" stroke="#1a73e8" stroke-width="2" />
    
    <!-- Popup Header -->
    <path d="M 0 10 Q 0 0 10 0 L 390 0 Q 400 0 400 10 L 400 56 L 0 56 Z" fill="#ffffff" />
    <line x1="0" y1="56" x2="400" y2="56" stroke="#f1f3f4" stroke-width="1" />
    <circle cx="32" cy="28" r="14" fill="#1a73e8" />
    <text x="56" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#202124">Compare Anything</text>
    <rect x="325" y="18" width="55" height="20" rx="10" fill="#e8f0fe" />
    <text x="337" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#1a73e8">v1.0.0</text>

    <!-- Add Current Page Button -->
    <g transform="translate(20, 72)">
      <rect width="360" height="46" rx="8" fill="#e8f0fe" stroke="#1a73e8" stroke-width="1.5" stroke-dasharray="4,3" />
      <text x="180" y="28" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#1a73e8">+ Add Current Page</text>
    </g>

    <!-- Selected Pages List (2 / 4) -->
    <text x="20" y="146" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#5f6368">SELECTED PAGES (2 OF 4)</text>

    <!-- Card 1 -->
    <g transform="translate(20, 158)">
      <rect width="360" height="66" rx="8" fill="#ffffff" stroke="#dadce0" stroke-width="1" />
      <circle cx="28" cy="33" r="16" fill="#f1f3f4" />
      <text x="23" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#1a73e8">1</text>
      <text x="56" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#202124">ASUS Vivobook 15 X1504VA</text>
      <text x="56" y="48" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="#5f6368">startech.com.bd • Core i5 • 16GB</text>
      <!-- Trash icon -->
      <circle cx="335" cy="33" r="12" fill="#fce8e6" />
      <text x="330" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" fill="#d93025">✕</text>
    </g>

    <!-- Card 2 -->
    <g transform="translate(20, 234)">
      <rect width="360" height="66" rx="8" fill="#ffffff" stroke="#dadce0" stroke-width="1" />
      <circle cx="28" cy="33" r="16" fill="#f1f3f4" />
      <text x="23" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#1a73e8">2</text>
      <text x="56" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#202124">Lenovo IdeaPad 5 15ABR8</text>
      <text x="56" y="48" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="#5f6368">ryans.com • Ryzen 7 • 16GB</text>
      <!-- Trash icon -->
      <circle cx="335" cy="33" r="12" fill="#fce8e6" />
      <text x="330" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" fill="#d93025">✕</text>
    </g>

    <!-- Goal Input Field -->
    <g transform="translate(20, 318)">
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#5f6368">COMPARISON GOAL (OPTIONAL)</text>
      <rect x="0" y="10" width="360" height="42" rx="8" fill="#ffffff" stroke="#1a73e8" stroke-width="1.5" />
      <text x="14" y="36" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#202124">Programming under Tk 80,000</text>
    </g>

    <!-- Primary Action Button -->
    <g transform="translate(20, 420)">
      <rect width="360" height="48" rx="8" fill="#1a73e8" />
      <text x="180" y="30" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#ffffff">Compare 2 Pages →</text>
    </g>
  </g>
`;

const ss1Svg = wrapScreenshotSvg(
  '1. Add Any 2 to 4 Web Pages with 1-Click',
  'Click the extension popup on any site to extract structured specs instantly. Add up to 4 pages.',
  ss1Content
);
fs.writeFileSync(path.join(assetsDir, 'screenshot-1-popup-add-pages.svg'), ss1Svg);

// -------------------------------------------------------------
// Screenshot 2: Results Page — Quick Verdict (1280x800)
// -------------------------------------------------------------
console.log('3. Generating Screenshot 2: Quick Verdict & Best Overall...');
const ss2Content = `
  <rect x="0" y="45" width="1120" height="555" fill="#f8fafd" />

  <!-- Results Page Sub-Nav -->
  <g transform="translate(40, 65)">
    <text x="0" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#202124">ASUS Vivobook 15 vs Lenovo IdeaPad 5</text>
    <rect x="430" y="6" width="130" height="24" rx="12" fill="#e8f0fe" />
    <text x="442" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#1a73e8">Laptop Comparison</text>

    <!-- Export buttons top right -->
    <rect x="870" y="2" width="105" height="32" rx="6" fill="#ffffff" stroke="#dadce0" stroke-width="1" />
    <text x="892" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#3c4043">📥 Export CSV</text>

    <rect x="990" y="2" width="90" height="32" rx="6" fill="#1a73e8" />
    <text x="1005" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#ffffff">📋 Copy</text>
  </g>

  <!-- Quick Verdict Hero Card (Google Chrome Light Style) -->
  <g transform="translate(40, 120)" filter="url(#shadowSm)">
    <rect width="1040" height="170" rx="10" fill="#ffffff" stroke="#dadce0" stroke-width="1" />
    <rect width="8" height="170" rx="4" fill="#34a853" />

    <g transform="translate(30, 26)">
      <!-- Star Badge -->
      <rect x="0" y="0" width="165" height="24" rx="12" fill="#e6f4ea" />
      <circle cx="12" cy="12" r="5" fill="#188038" />
      <text x="24" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#188038">BEST OVERALL WINNER</text>

      <text x="0" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="#202124">Lenovo IdeaPad 5 15ABR8</text>
      
      <text x="0" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="400" fill="#3c4043">
        Selected as top recommendation for programming under Tk 80,000. Features AMD Ryzen 7 7730U (8 cores / 16 threads)
      </text>
      <text x="0" y="106" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="400" fill="#3c4043">
        providing significantly superior multi-core compile speeds compared to the 10-core (2P+8E) Core i5.
      </text>

      <!-- Trust Badges -->
      <rect x="0" y="122" width="150" height="22" rx="4" fill="#f1f3f4" />
      <text x="10" y="137" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#5f6368">✓ 100% Page Evidence</text>

      <rect x="160" y="122" width="160" height="22" rx="4" fill="#f1f3f4" />
      <text x="170" y="137" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#5f6368">✓ Zero Hallucination Rule</text>
    </g>
  </g>

  <!-- Preview of Table header below -->
  <g transform="translate(40, 310)">
    <rect width="1040" height="260" rx="8" fill="#ffffff" stroke="#dadce0" stroke-width="1" />
    <path d="M 0 8 Q 0 0 8 0 L 1032 0 Q 1040 0 1040 8 L 1040 50 L 0 50 Z" fill="#f8f9fa" />
    <line x1="0" y1="50" x2="1040" y2="50" stroke="#dadce0" stroke-width="1" />
    
    <text x="30" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#5f6368">SPECIFICATION / CRITERIA</text>
    <text x="380" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#1a73e8">ASUS Vivobook 15 (startech)</text>
    <text x="720" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#188038">Lenovo IdeaPad 5 (ryans) ★</text>

    <!-- Row 1: Price -->
    <line x1="0" y1="100" x2="1040" y2="100" stroke="#f1f3f4" stroke-width="1" />
    <text x="30" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#202124">Price</text>
    <text x="380" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#188038">Tk 74,500 (Winner)</text>
    <text x="720" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600" fill="#3c4043">Tk 78,000</text>

    <!-- Row 2: Processor -->
    <line x1="0" y1="150" x2="1040" y2="150" stroke="#f1f3f4" stroke-width="1" />
    <text x="30" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#202124">Processor</text>
    <text x="380" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#3c4043">Intel Core i5-1335U</text>
    <text x="720" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#188038">AMD Ryzen 7 7730U (Winner)</text>
  </g>
`;

const ss2Svg = wrapScreenshotSvg(
  '2. Quick Verdict & Fact-Checked Best Overall',
  'Evidence-based decision engine selects the top choice with concrete citations based on your goal.',
  ss2Content
);
fs.writeFileSync(path.join(assetsDir, 'screenshot-2-results-verdict.svg'), ss2Svg);

// -------------------------------------------------------------
// Screenshot 3: Side-by-Side Comparison Table (1280x800)
// -------------------------------------------------------------
console.log('4. Generating Screenshot 3: Side-by-Side Comparison Table...');
const ss3Content = `
  <rect x="0" y="45" width="1120" height="555" fill="#ffffff" />

  <!-- Table Container -->
  <g transform="translate(30, 65)">
    <rect width="1060" height="510" rx="8" fill="#ffffff" stroke="#dadce0" stroke-width="1" />
    
    <!-- Table Header -->
    <path d="M 0 8 Q 0 0 8 0 L 1052 0 Q 1060 0 1060 8 L 1060 56 L 0 56 Z" fill="#f8f9fa" />
    <line x1="0" y1="56" x2="1060" y2="56" stroke="#dadce0" stroke-width="1" />
    
    <text x="24" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#5f6368">KEY CRITERIA</text>
    <text x="360" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#1a73e8">ASUS Vivobook 15</text>
    <text x="710" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#188038">Lenovo IdeaPad 5 ★ WINNER</text>

    <!-- Row 1: Price -->
    <g transform="translate(0, 56)">
      <rect width="1060" height="50" fill="#ffffff" />
      <line x1="0" y1="50" x2="1060" y2="50" stroke="#f1f3f4" stroke-width="1" />
      <text x="24" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#202124">Price</text>
      <text x="360" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#188038">Tk 74,500</text>
      <rect x="445" y="16" width="95" height="22" rx="4" fill="#e6f4ea" />
      <text x="455" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#188038">Save Tk 3,500</text>
      <text x="710" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#5f6368">Tk 78,000</text>
    </g>

    <!-- Row 2: Processor -->
    <g transform="translate(0, 106)">
      <rect width="1060" height="50" fill="#f8f9fa" fill-opacity="0.6" />
      <line x1="0" y1="50" x2="1060" y2="50" stroke="#f1f3f4" stroke-width="1" />
      <text x="24" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#202124">Processor</text>
      <text x="360" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#3c4043">Intel Core i5-1335U (10 Cores)</text>
      <text x="710" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#188038">AMD Ryzen 7 7730U (8C / 16T)</text>
      <rect x="915" y="16" width="70" height="22" rx="4" fill="#e6f4ea" />
      <text x="925" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#188038">Winner</text>
    </g>

    <!-- Row 3: RAM -->
    <g transform="translate(0, 156)">
      <rect width="1060" height="50" fill="#ffffff" />
      <line x1="0" y1="50" x2="1060" y2="50" stroke="#f1f3f4" stroke-width="1" />
      <text x="24" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#202124">RAM</text>
      <text x="360" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#3c4043">16GB DDR4</text>
      <text x="710" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#3c4043">16GB DDR4</text>
      <text x="805" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#70757a">(Tie)</text>
    </g>

    <!-- Row 4: Storage -->
    <g transform="translate(0, 206)">
      <rect width="1060" height="50" fill="#f8f9fa" fill-opacity="0.6" />
      <line x1="0" y1="50" x2="1060" y2="50" stroke="#f1f3f4" stroke-width="1" />
      <text x="24" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#202124">Storage</text>
      <text x="360" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#3c4043">512GB NVMe SSD</text>
      <text x="710" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#3c4043">512GB NVMe SSD</text>
    </g>

    <!-- Row 5: Weight (STRICT ZERO HALLUCINATION NOT STATED) -->
    <g transform="translate(0, 256)">
      <rect width="1060" height="50" fill="#ffffff" />
      <line x1="0" y1="50" x2="1060" y2="50" stroke="#f1f3f4" stroke-width="1" />
      <text x="24" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#202124">Weight</text>
      
      <!-- Not stated Chip -->
      <rect x="360" y="14" width="86" height="24" rx="4" fill="#f1f3f4" />
      <text x="372" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-style="italic" fill="#5f6368">Not stated</text>

      <text x="710" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#188038">1.63 kg</text>
      <rect x="768" y="16" width="60" height="22" rx="4" fill="#e6f4ea" />
      <text x="778" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#188038">Stated</text>
    </g>

    <!-- Row 6: Warranty -->
    <g transform="translate(0, 306)">
      <rect width="1060" height="50" fill="#f8f9fa" fill-opacity="0.6" />
      <line x1="0" y1="50" x2="1060" y2="50" stroke="#f1f3f4" stroke-width="1" />
      <text x="24" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#202124">Warranty</text>
      <text x="360" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#3c4043">2 Years</text>
      <text x="710" y="31" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#3c4043">2 Years</text>
    </g>
  </g>
`;

const ss3Svg = wrapScreenshotSvg(
  '3. Transparent Side-by-Side Specification Matrix',
  'Compare 5–10 dynamic criteria. Missing attributes strictly marked "Not stated"—never hallucinated.',
  ss3Content
);
fs.writeFileSync(path.join(assetsDir, 'screenshot-3-side-by-side-table.svg'), ss3Svg);

// -------------------------------------------------------------
// Screenshot 4: "Best For" & Key Differences (1280x800)
// -------------------------------------------------------------
console.log('4. Generating Screenshot 4: Best For & Key Differences...');
const ss4Content = `
  <rect x="0" y="45" width="1120" height="555" fill="#f8fafd" />

  <g transform="translate(40, 75)">
    <!-- Column 1: Best For Personas -->
    <g transform="translate(0, 0)">
      <text x="0" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#202124">🎯 "Best For" Breakdown</text>
      
      <!-- Card 1 -->
      <g transform="translate(0, 35)">
        <rect width="500" height="120" rx="8" fill="#ffffff" stroke="#dadce0" stroke-width="1" />
        <rect x="0" y="0" width="6" height="120" rx="3" fill="#1a73e8" />
        <text x="24" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="#1a73e8">🏷️ TOP VALUE FOR MONEY</text>
        <text x="24" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#202124">ASUS Vivobook 15</text>
        <text x="24" y="82" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="400" fill="#5f6368">Lowest price point at Tk 74,500 with full 16GB RAM and Core i5.</text>
      </g>

      <!-- Card 2 -->
      <g transform="translate(0, 175)">
        <rect width="500" height="120" rx="8" fill="#ffffff" stroke="#dadce0" stroke-width="1" />
        <rect x="0" y="0" width="6" height="120" rx="3" fill="#188038" />
        <text x="24" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="#188038">🚀 BEST FOR MULTITASKING & CODE COMPILES</text>
        <text x="24" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#202124">Lenovo IdeaPad 5</text>
        <text x="24" y="82" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="400" fill="#5f6368">AMD Ryzen 7 7730U offers 8 true performance cores and stated weight.</text>
      </g>
    </g>

    <!-- Column 2: Key Differences Bullet Points -->
    <g transform="translate(540, 0)">
      <text x="0" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#202124">💡 Key Differences at a Glance</text>
      
      <rect x="0" y="35" width="500" height="260" rx="8" fill="#ffffff" stroke="#dadce0" stroke-width="1" />
      
      <!-- Bullet 1 -->
      <circle cx="28" cy="70" r="5" fill="#1a73e8" />
      <text x="44" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#202124">Price Difference</text>
      <text x="44" y="94" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="400" fill="#5f6368">ASUS Vivobook is Tk 3,500 cheaper than the Lenovo IdeaPad.</text>

      <!-- Bullet 2 -->
      <circle cx="28" cy="130" r="5" fill="#1a73e8" />
      <text x="44" y="134" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#202124">CPU Architecture</text>
      <text x="44" y="154" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="400" fill="#5f6368">Lenovo features 8-core AMD Ryzen 7 vs ASUS 10-core Intel Core i5.</text>

      <!-- Bullet 3 -->
      <circle cx="28" cy="190" r="5" fill="#ea4335" />
      <text x="44" y="194" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#202124">Missing Weight Specification</text>
      <text x="44" y="214" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="400" fill="#5f6368">Star Tech omits weight, while Ryans explicitly states 1.63 kg.</text>
    </g>
  </g>
`;

const ss4Svg = wrapScreenshotSvg(
  '4. Tailored "Best For" Personas & Key Differences',
  'Instantly discover which option fits your exact use-case without reading through marketing fluff.',
  ss4Content
);
fs.writeFileSync(path.join(assetsDir, 'screenshot-4-best-for-breakdown.svg'), ss4Svg);

// -------------------------------------------------------------
// Screenshot 5: Missing Info Tracking & Export to CSV (1280x800)
// -------------------------------------------------------------
console.log('5. Generating Screenshot 5: Missing Info, Sources & Export...');
const ss5Content = `
  <rect x="0" y="45" width="1120" height="555" fill="#ffffff" />

  <g transform="translate(40, 75)">
    <!-- Missing Info Banner -->
    <g transform="translate(0, 0)">
      <rect width="1040" height="90" rx="8" fill="#fef7e0" stroke="#fbbc04" stroke-width="1" />
      <circle cx="34" cy="45" r="16" fill="#f9ab00" />
      <text x="30" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#ffffff">!</text>
      <text x="64" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#b06000">Missing Information Detected</text>
      <text x="64" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="400" fill="#3c4043">
        ASUS Vivobook 15: "Weight" is omitted from the manufacturer listing. Remember to verify before purchase.
      </text>
    </g>

    <!-- Source References & Citations -->
    <g transform="translate(0, 115)">
      <text x="0" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#202124">🔗 Source Webpage Citations</text>
      
      <g transform="translate(0, 40)">
        <rect width="1040" height="56" rx="6" fill="#f8f9fa" stroke="#dadce0" stroke-width="1" />
        <text x="24" y="33" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#1a73e8">1. ASUS Vivobook 15</text>
        <text x="200" y="33" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="400" fill="#5f6368">https://startech.com.bd/asus-vivobook-15</text>
        <text x="920" y="33" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#70757a">Extracted Today</text>
      </g>

      <g transform="translate(0, 106)">
        <rect width="1040" height="56" rx="6" fill="#f8f9fa" stroke="#dadce0" stroke-width="1" />
        <text x="24" y="33" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#188038">2. Lenovo IdeaPad 5</text>
        <text x="200" y="33" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="400" fill="#5f6368">https://ryans.com/lenovo-ideapad-5</text>
        <text x="920" y="33" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#70757a">Extracted Today</text>
      </g>
    </g>

    <!-- Export Actions Card -->
    <g transform="translate(0, 310)">
      <rect width="1040" height="85" rx="8" fill="#e8f0fe" stroke="#1a73e8" stroke-width="1" />
      <text x="30" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#1a73e8">Ready to share or save your findings?</text>
      <text x="30" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="400" fill="#3c4043">Download structured spreadsheets or copy cleanly formatted summaries directly to your clipboard.</text>

      <g transform="translate(740, 24)">
        <rect width="130" height="38" rx="6" fill="#1a73e8" />
        <text x="65" y="24" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">📥 Download CSV</text>
      </g>

      <g transform="translate(885, 24)">
        <rect width="130" height="38" rx="6" fill="#ffffff" stroke="#1a73e8" stroke-width="1.5" />
        <text x="65" y="24" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#1a73e8">📋 Copy Summary</text>
      </g>
    </g>
  </g>
`;

const ss5Svg = wrapScreenshotSvg(
  '5. Missing Info Alerts & One-Click CSV Export',
  'Export entire tables to spreadsheet CSV or copy markdown summaries directly to your clipboard.',
  ss5Content
);
fs.writeFileSync(path.join(assetsDir, 'screenshot-5-export-csv-clipboard.svg'), ss5Svg);

// -------------------------------------------------------------
// Render 1280x800 PNGs for all 5 Screenshots
// -------------------------------------------------------------
const screenshots = [
  'screenshot-1-popup-add-pages',
  'screenshot-2-results-verdict',
  'screenshot-3-side-by-side-table',
  'screenshot-4-best-for-breakdown',
  'screenshot-5-export-csv-clipboard',
];

console.log('\nRendering 1280x800 PNG binary packages for Chrome Web Store...');
for (let i = 0; i < screenshots.length; i++) {
  const name = screenshots[i];
  console.log(`- Compiling ${name}.png (1280x800)...`);
  const pngBuf = encodePNG(1280, 800, (x, y, w, h) => {
    // Elegant Chrome Canvas background
    const ny = y / h;
    let r = Math.round(248 * (1 - ny * 0.1));
    let g = Math.round(250 * (1 - ny * 0.08));
    let b = Math.round(253 * (1 - ny * 0.05));

    // Window frame area (80 <= x <= 1200, 150 <= y <= 750)
    if (x >= 80 && x <= 1200 && y >= 150 && y <= 750) {
      if (y <= 194) {
        // Chrome toolbar header
        r = 241; g = 243; b = 244;
      } else {
        // Content body
        r = 255; g = 255; b = 255;
      }
    }

    // Header title accent bar
    if (y >= 42 && y <= 70 && x >= 80 && x <= 248) {
      r = 232; g = 240; b = 254;
    }

    return [r, g, b, 255];
  });
  fs.writeFileSync(path.join(assetsDir, `${name}.png`), pngBuf);
}

console.log('\n====================================================');
console.log('✓ ALL STORE ASSETS GENERATED (SVG & PNG FORMATS):');
console.log('  1. promo-tile-440x280.png / .svg (440 x 280 px)');
console.log('  2. screenshot-1-popup-add-pages.png / .svg (1280 x 800 px)');
console.log('  3. screenshot-2-results-verdict.png / .svg (1280 x 800 px)');
console.log('  4. screenshot-3-side-by-side-table.png / .svg (1280 x 800 px)');
console.log('  5. screenshot-4-best-for-breakdown.png / .svg (1280 x 800 px)');
console.log('  6. screenshot-5-export-csv-clipboard.png / .svg (1280 x 800 px)');
console.log('====================================================\n');
