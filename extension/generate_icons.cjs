const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPNG(width, height, pixelFn) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // color type RGBA (6)
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(8 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeInt32BE(crc, 8 + len);
    return buf;
  }

  // CRC32 implementation
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
    }
    return (c ^ 0xffffffff) | 0;
  }

  // Raw image data with scanline filter bytes
  const raw = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    raw[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      raw[offset++] = r;
      raw[offset++] = g;
      raw[offset++] = b;
      raw[offset++] = a;
    }
  }

  const compressedData = zlib.deflateSync(raw);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function iconPixel(x, y, w, h) {
  // Normalize 0..1
  const nx = x / w;
  const ny = y / h;
  const cx = nx - 0.5;
  const cy = ny - 0.5;
  const r = Math.sqrt(cx * cx + cy * cy);

  // Rounded rectangle background (radius ~ 0.22)
  const cornerR = 0.22;
  const qx = Math.max(Math.abs(cx) - (0.46 - cornerR), 0);
  const qy = Math.max(Math.abs(cy) - (0.46 - cornerR), 0);
  const distToEdge = Math.sqrt(qx * qx + qy * qy) - cornerR;

  if (distToEdge > 0.04) {
    return [0, 0, 0, 0]; // Transparent outside
  }

  // Smooth antialiased boundary
  let alpha = 1.0;
  if (distToEdge > 0) {
    alpha = Math.max(0, 1.0 - distToEdge / 0.04);
  }

  // Background Gradient: Modern Deep Indigo to Violet (#4F46E5 to #7C3AED)
  let bgR = Math.round(79 + (124 - 79) * ny);
  let bgG = Math.round(70 + (58 - 70) * ny);
  let bgB = Math.round(229 + (237 - 229) * ny);

  // Foreground: Two comparison cards side by side (left and right columns)
  // Left card: x from 0.18 to 0.44, y from 0.24 to 0.76
  // Right card: x from 0.56 to 0.82, y from 0.24 to 0.76
  const isLeftCard = nx >= 0.20 && nx <= 0.45 && ny >= 0.24 && ny <= 0.76;
  const isRightCard = nx >= 0.55 && nx <= 0.80 && ny >= 0.24 && ny <= 0.76;

  // Versus / balance beam in between:
  const isCenterBar = nx >= 0.47 && nx <= 0.53 && ny >= 0.46 && ny <= 0.54;

  if (isLeftCard) {
    // Crisp white/cyan card with top accent
    if (ny >= 0.28 && ny <= 0.36 && nx >= 0.24 && nx <= 0.41) {
      return [56, 189, 248, Math.round(255 * alpha)]; // Cyan header
    }
    if ((ny >= 0.44 && ny <= 0.48 && nx >= 0.24 && nx <= 0.41) ||
        (ny >= 0.54 && ny <= 0.58 && nx >= 0.24 && nx <= 0.38) ||
        (ny >= 0.64 && ny <= 0.68 && nx >= 0.24 && nx <= 0.41)) {
      return [203, 213, 225, Math.round(255 * alpha)]; // Table lines
    }
    return [255, 255, 255, Math.round(245 * alpha)];
  }

  if (isRightCard) {
    // Crisp white/emerald card with top accent
    if (ny >= 0.28 && ny <= 0.36 && nx >= 0.59 && nx <= 0.76) {
      return [52, 211, 153, Math.round(255 * alpha)]; // Emerald header
    }
    if ((ny >= 0.44 && ny <= 0.48 && nx >= 0.59 && nx <= 0.76) ||
        (ny >= 0.54 && ny <= 0.58 && nx >= 0.59 && nx <= 0.72) ||
        (ny >= 0.64 && ny <= 0.68 && nx >= 0.59 && nx <= 0.76)) {
      return [203, 213, 225, Math.round(255 * alpha)]; // Table lines
    }
    return [255, 255, 255, Math.round(245 * alpha)];
  }

  if (isCenterBar) {
    return [251, 191, 36, Math.round(255 * alpha)]; // Amber vs indicator
  }

  return [bgR, bgG, bgB, Math.round(255 * alpha)];
}

const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

[16, 48, 128].forEach(size => {
  const png = createPNG(size, size, iconPixel);
  const filePath = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(filePath, png);
  console.log(`Created ${filePath} (${png.length} bytes)`);
});
