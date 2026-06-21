import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const output = process.argv[2] ?? "src-tauri/icons/icon.png";
const size = 1024;
const scale = 3;
const width = size * scale;
const height = size * scale;
const pixels = new Uint8Array(width * height * 4);

const palette = {
  transparent: [0, 0, 0, 0],
  ink: [12, 34, 41, 255],
  tealDeep: [10, 92, 88, 255],
  teal: [18, 128, 118, 255],
  mint: [154, 232, 213, 255],
  mintSoft: [215, 252, 242, 255],
  white: [255, 255, 255, 255],
  line: [91, 209, 190, 255],
  shadow: [0, 25, 30, 80],
};

function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
    Math.round((a[3] ?? 255) + ((b[3] ?? 255) - (a[3] ?? 255)) * t),
  ];
}

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

  if (outputAlpha <= 0) {
    setPixel(x, y, palette.transparent);
    return;
  }

  for (let channel = 0; channel < 3; channel += 1) {
    pixels[index + channel] = Math.round(
      (color[channel] * sourceAlpha + pixels[index + channel] * targetAlpha * (1 - sourceAlpha)) /
        outputAlpha,
    );
  }
  pixels[index + 3] = Math.round(outputAlpha * 255);
}

function roundedRect(x, y, w, h, radius, color, mode = "set") {
  const sx = Math.round(x * scale);
  const sy = Math.round(y * scale);
  const sw = Math.round(w * scale);
  const sh = Math.round(h * scale);
  const sr = Math.round(radius * scale);
  const right = sx + sw;
  const bottom = sy + sh;

  for (let py = sy; py < bottom; py += 1) {
    for (let px = sx; px < right; px += 1) {
      const cx = px < sx + sr ? sx + sr : px >= right - sr ? right - sr - 1 : px;
      const cy = py < sy + sr ? sy + sr : py >= bottom - sr ? bottom - sr - 1 : py;
      const dx = px - cx;
      const dy = py - cy;
      if (dx * dx + dy * dy <= sr * sr) {
        if (mode === "blend" || color[3] < 255) blendPixel(px, py, color);
        else setPixel(px, py, color);
      }
    }
  }
}

function roundedRectGradient(x, y, w, h, radius, top, bottom) {
  const sx = Math.round(x * scale);
  const sy = Math.round(y * scale);
  const sw = Math.round(w * scale);
  const sh = Math.round(h * scale);
  const sr = Math.round(radius * scale);
  const right = sx + sw;
  const lower = sy + sh;

  for (let py = sy; py < lower; py += 1) {
    const t = Math.max(0, Math.min(1, (py - sy) / Math.max(1, sh - 1)));
    const color = mix(top, bottom, t);
    for (let px = sx; px < right; px += 1) {
      const cx = px < sx + sr ? sx + sr : px >= right - sr ? right - sr - 1 : px;
      const cy = py < sy + sr ? sy + sr : py >= lower - sr ? lower - sr - 1 : py;
      const dx = px - cx;
      const dy = py - cy;
      if (dx * dx + dy * dy <= sr * sr) setPixel(px, py, color);
    }
  }
}

function circle(cx, cy, r, color, mode = "blend") {
  const sx = Math.round(cx * scale);
  const sy = Math.round(cy * scale);
  const sr = Math.round(r * scale);
  for (let py = sy - sr; py <= sy + sr; py += 1) {
    for (let px = sx - sr; px <= sx + sr; px += 1) {
      const dx = px - sx;
      const dy = py - sy;
      if (dx * dx + dy * dy <= sr * sr) {
        if (mode === "set" && color[3] === 255) setPixel(px, py, color);
        else blendPixel(px, py, color);
      }
    }
  }
}

function capsuleLine(x1, y1, x2, y2, thickness, color) {
  const sx1 = x1 * scale;
  const sy1 = y1 * scale;
  const sx2 = x2 * scale;
  const sy2 = y2 * scale;
  const r = (thickness * scale) / 2;
  const minX = Math.floor(Math.min(sx1, sx2) - r);
  const maxX = Math.ceil(Math.max(sx1, sx2) + r);
  const minY = Math.floor(Math.min(sy1, sy2) - r);
  const maxY = Math.ceil(Math.max(sy1, sy2) + r);
  const dx = sx2 - sx1;
  const dy = sy2 - sy1;
  const lenSq = dx * dx + dy * dy || 1;

  for (let py = minY; py <= maxY; py += 1) {
    for (let px = minX; px <= maxX; px += 1) {
      const t = Math.max(0, Math.min(1, ((px - sx1) * dx + (py - sy1) * dy) / lenSq));
      const qx = sx1 + dx * t;
      const qy = sy1 + dy * t;
      const distX = px - qx;
      const distY = py - qy;
      if (distX * distX + distY * distY <= r * r) blendPixel(px, py, color);
    }
  }
}

function downsample() {
  const out = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const sums = [0, 0, 0, 0];
      for (let yy = 0; yy < scale; yy += 1) {
        for (let xx = 0; xx < scale; xx += 1) {
          const inputIndex = ((y * scale + yy) * width + (x * scale + xx)) * 4;
          for (let channel = 0; channel < 4; channel += 1) {
            sums[channel] += pixels[inputIndex + channel];
          }
        }
      }
      const outputIndex = (y * size + x) * 4;
      for (let channel = 0; channel < 4; channel += 1) {
        out[outputIndex + channel] = Math.round(sums[channel] / (scale * scale));
      }
    }
  }
  return out;
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

function encodePng(rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y += 1) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0;
    raw.set(rgba.subarray(y * size * 4, (y + 1) * size * 4), rowStart + 1);
  }

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

roundedRect(116, 128, 792, 792, 182, palette.shadow, "blend");
roundedRectGradient(74, 62, 876, 876, 212, [31, 160, 146, 255], palette.ink);
roundedRect(94, 82, 836, 836, 188, [255, 255, 255, 24], "blend");
roundedRect(132, 122, 760, 760, 158, [5, 42, 49, 70], "blend");

circle(512, 508, 326, [150, 242, 222, 18]);
circle(512, 508, 244, [150, 242, 222, 16]);

capsuleLine(294, 350, 422, 456, 20, [142, 245, 222, 145]);
capsuleLine(730, 390, 604, 464, 20, [142, 245, 222, 145]);
capsuleLine(512, 736, 512, 628, 20, [142, 245, 222, 145]);

circle(294, 350, 38, [7, 55, 60, 230]);
circle(294, 350, 18, palette.mintSoft);
circle(730, 390, 38, [7, 55, 60, 230]);
circle(730, 390, 18, palette.mintSoft);
circle(512, 736, 38, [7, 55, 60, 230]);
circle(512, 736, 18, palette.mintSoft);

roundedRect(344, 356, 358, 244, 58, [5, 54, 61, 210], "blend");
roundedRect(364, 374, 318, 204, 44, [30, 155, 142, 245], "blend");
roundedRect(310, 426, 404, 244, 62, [2, 36, 43, 235], "blend");
roundedRect(336, 450, 352, 190, 46, [235, 255, 249, 250], "blend");

roundedRect(378, 488, 160, 24, 12, palette.teal);
roundedRect(378, 536, 242, 24, 12, [28, 150, 137, 255]);
roundedRect(378, 584, 112, 24, 12, [91, 209, 190, 255]);
roundedRect(584, 482, 44, 44, 16, palette.teal);
roundedRect(584, 568, 44, 44, 16, [91, 209, 190, 255]);

roundedRect(252, 756, 520, 34, 17, [215, 252, 242, 48], "blend");
roundedRect(300, 810, 424, 22, 11, [3, 29, 35, 80], "blend");

writeFileSync(output, encodePng(downsample()));
