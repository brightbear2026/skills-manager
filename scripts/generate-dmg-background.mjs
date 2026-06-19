import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const output = process.argv[2] ?? "src-tauri/assets/dmg-background.png";
const width = 660;
const height = 400;
const pixels = new Uint8Array(width * height * 4);

const colors = {
  bg: [248, 251, 253, 255],
  mint: [225, 247, 243, 255],
  border: [203, 213, 225, 255],
  teal: [15, 118, 110, 255],
  tealSoft: [165, 223, 214, 255],
  text: [17, 24, 39, 255],
};

function setPixel(x, y, color) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const index = (y * width + x) * 4;
  pixels[index] = color[0];
  pixels[index + 1] = color[1];
  pixels[index + 2] = color[2];
  pixels[index + 3] = color[3];
}

function blendPixel(x, y, color, alpha = 1) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const index = (y * width + x) * 4;
  const sourceAlpha = (color[3] / 255) * alpha;
  const targetAlpha = pixels[index + 3] / 255;
  const outputAlpha = sourceAlpha + targetAlpha * (1 - sourceAlpha);
  if (outputAlpha === 0) return;

  for (let channel = 0; channel < 3; channel += 1) {
    pixels[index + channel] = Math.round(
      (color[channel] * sourceAlpha + pixels[index + channel] * targetAlpha * (1 - sourceAlpha)) /
        outputAlpha,
    );
  }
  pixels[index + 3] = Math.round(outputAlpha * 255);
}

function roundedRect(x, y, w, h, r, color) {
  const right = x + w;
  const bottom = y + h;
  for (let py = Math.floor(y); py < bottom; py += 1) {
    for (let px = Math.floor(x); px < right; px += 1) {
      const cx = px < x + r ? x + r : px >= right - r ? right - r - 1 : px;
      const cy = py < y + r ? y + r : py >= bottom - r ? bottom - r - 1 : py;
      const dx = px - cx;
      const dy = py - cy;
      if (dx * dx + dy * dy <= r * r) {
        color[3] < 255 ? blendPixel(px, py, color) : setPixel(px, py, color);
      }
    }
  }
}

function line(x1, y1, x2, y2, thickness, color) {
  const minX = Math.floor(Math.min(x1, x2) - thickness);
  const maxX = Math.ceil(Math.max(x1, x2) + thickness);
  const minY = Math.floor(Math.min(y1, y2) - thickness);
  const maxY = Math.ceil(Math.max(y1, y2) + thickness);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSquared));
      const px = x1 + t * dx;
      const py = y1 + t * dy;
      const distance = Math.hypot(x - px, y - py);
      if (distance <= thickness / 2) {
        blendPixel(x, y, color, 1 - distance / (thickness / 2 + 1));
      }
    }
  }
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function encodePng() {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0;
    raw.set(pixels.subarray(y * width * 4, (y + 1) * width * 4), rowStart + 1);
  }

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    setPixel(x, y, colors.bg);
  }
}

roundedRect(38, 36, 584, 328, 28, [255, 255, 255, 230]);
roundedRect(39, 37, 582, 326, 27, [203, 213, 225, 90]);
roundedRect(42, 40, 576, 320, 24, [255, 255, 255, 255]);

roundedRect(116, 118, 128, 128, 28, colors.mint);
roundedRect(128, 130, 104, 104, 22, [255, 255, 255, 180]);
roundedRect(145, 153, 48, 14, 4, colors.teal);
roundedRect(145, 153, 14, 48, 4, colors.teal);
roundedRect(145, 187, 44, 14, 4, colors.teal);
roundedRect(175, 187, 14, 48, 4, colors.teal);
roundedRect(145, 221, 48, 14, 4, colors.teal);
roundedRect(202, 153, 14, 82, 4, [17, 94, 89, 255]);
roundedRect(220, 153, 14, 82, 4, [17, 94, 89, 255]);

roundedRect(416, 118, 128, 128, 28, [239, 246, 255, 255]);
roundedRect(432, 146, 96, 72, 14, [191, 219, 254, 255]);
roundedRect(432, 134, 45, 22, 10, [147, 197, 253, 255]);
roundedRect(432, 164, 96, 62, 12, [96, 165, 250, 255]);

line(282, 182, 374, 182, 8, colors.tealSoft);
line(372, 182, 350, 160, 8, colors.tealSoft);
line(372, 182, 350, 204, 8, colors.tealSoft);

roundedRect(118, 278, 124, 10, 5, [203, 213, 225, 170]);
roundedRect(418, 278, 124, 10, 5, [203, 213, 225, 170]);

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, encodePng());
