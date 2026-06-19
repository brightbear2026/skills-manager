import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

const output = process.argv[2] ?? "src-tauri/icons/icon.png";
const size = 1024;
const scale = 2;
const width = size * scale;
const height = size * scale;
const pixels = new Uint8Array(width * height * 4);

const colors = {
  transparent: [0, 0, 0, 0],
  mint: [225, 247, 243, 255],
  mintLight: [239, 252, 249, 255],
  teal: [15, 118, 110, 255],
  tealDark: [17, 94, 89, 255],
  border: [165, 223, 214, 255],
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

  if (outputAlpha === 0) {
    setPixel(x, y, colors.transparent);
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

function roundedRect(x, y, w, h, radius, color) {
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
        if (color[3] < 255) {
          blendPixel(px, py, color);
        } else {
          setPixel(px, py, color);
        }
      }
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
    rgba.copy?.(raw, rowStart + 1, y * size * 4, (y + 1) * size * 4);
    if (!rgba.copy) {
      raw.set(rgba.subarray(y * size * 4, (y + 1) * size * 4), rowStart + 1);
    }
  }

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

roundedRect(64, 64, 896, 896, 196, colors.mint);
roundedRect(84, 84, 856, 856, 172, colors.mintLight);
roundedRect(108, 108, 808, 808, 146, colors.mint);

for (let offset = 0; offset < 6; offset += 1) {
  roundedRect(126 + offset, 126 + offset, 772 - offset * 2, 772 - offset * 2, 132, colors.border);
}
roundedRect(138, 138, 748, 748, 124, colors.mint);

const bar = 76;
const radius = 13;

roundedRect(238, 292, 284, bar, radius, colors.teal);
roundedRect(238, 292, bar, 256, radius, colors.teal);
roundedRect(238, 474, 266, bar, radius, colors.teal);
roundedRect(428, 474, bar, 256, radius, colors.teal);
roundedRect(238, 656, 284, bar, radius, colors.teal);

roundedRect(580, 292, bar, 440, radius, colors.tealDark);
roundedRect(580, 292, 158, bar, radius, colors.tealDark);
roundedRect(686, 398, bar, 334, radius, colors.tealDark);
roundedRect(792, 292, bar, 440, radius, colors.tealDark);
roundedRect(792, 292, bar, 164, radius, colors.tealDark);

roundedRect(150, 150, 724, 724, 118, [255, 255, 255, 24]);
roundedRect(220, 780, 584, 28, 14, [15, 118, 110, 40]);

writeFileSync(output, encodePng(downsample()));
