import { GREEN_INK, INK, PAPER } from "./constants";
import type { VintageParams } from "./types";

/** Read channel with safe default for strict indexed access */
function sampleU8(data: Uint8ClampedArray, i: number): number {
  return data[i] ?? 0;
}

function sampleF32(buf: Float32Array, i: number): number {
  return buf[i] ?? 0;
}

/** Rec. 709 luma, normalized */
export function toGrayscale(data: Uint8ClampedArray, i: number): number {
  return (
    (sampleU8(data, i) * 0.2126 + sampleU8(data, i + 1) * 0.7152 + sampleU8(data, i + 2) * 0.0722) /
    255
  );
}

export function paint(
  data: Uint8ClampedArray,
  i: number,
  rgb: readonly [number, number, number],
  a: number = 255,
): void {
  data[i] = rgb[0];
  data[i + 1] = rgb[1];
  data[i + 2] = rgb[2];
  data[i + 3] = a;
}

/** Pseudo-random, deterministic per (x,y) — keeps re-renders stable */
export function hash2(x: number, y: number): number {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

export function applyHalftone(
  src: Uint8ClampedArray,
  dst: Uint8ClampedArray,
  w: number,
  h: number,
  opts: Pick<VintageParams, "dotSize" | "contrast">,
): void {
  const { dotSize, contrast } = opts;
  const cell = Math.max(2, Math.round(dotSize));
  for (let i = 0; i < dst.length; i += 4) paint(dst, i, PAPER);

  for (let y = 0; y < h; y += cell) {
    for (let x = 0; x < w; x += cell) {
      let sum = 0,
        n = 0;
      const yEnd = Math.min(y + cell, h);
      const xEnd = Math.min(x + cell, w);
      for (let yy = y; yy < yEnd; yy++) {
        for (let xx = x; xx < xEnd; xx++) {
          sum += toGrayscale(src, (yy * w + xx) * 4);
          n++;
        }
      }
      const lum = sum / n;
      const c = (1 - lum) ** (1 / Math.max(0.1, contrast));
      const r = (cell / 2) * Math.sqrt(c);
      const cx = x + cell / 2;
      const cy = y + cell / 2;
      const r2 = r * r;
      const yStart = Math.max(0, Math.floor(cy - r));
      const yStop = Math.min(h, Math.ceil(cy + r));
      const xStart = Math.max(0, Math.floor(cx - r));
      const xStop = Math.min(w, Math.ceil(cx + r));
      for (let yy = yStart; yy < yStop; yy++) {
        for (let xx = xStart; xx < xStop; xx++) {
          const dx = xx - cx,
            dy = yy - cy;
          if (dx * dx + dy * dy <= r2) {
            paint(dst, (yy * w + xx) * 4, INK);
          }
        }
      }
    }
  }
}

export function applyEngraving(
  src: Uint8ClampedArray,
  dst: Uint8ClampedArray,
  w: number,
  h: number,
  opts: Pick<VintageParams, "threshold" | "grain">,
): void {
  const { threshold: t, grain } = opts;
  const lum = new Float32Array(w * h);
  for (let i = 0, p = 0; i < src.length; i += 4, p++) lum[p] = toGrayscale(src, i);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const n = hash2(x, y);
      const g = n < grain ? 180 : 18;
      paint(dst, i, [g, g, g]);
    }
  }

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const gx =
        -sampleF32(lum, (y - 1) * w + x - 1) -
        2 * sampleF32(lum, y * w + x - 1) -
        sampleF32(lum, (y + 1) * w + x - 1) +
        sampleF32(lum, (y - 1) * w + x + 1) +
        2 * sampleF32(lum, y * w + x + 1) +
        sampleF32(lum, (y + 1) * w + x + 1);
      const gy =
        -sampleF32(lum, (y - 1) * w + x - 1) -
        2 * sampleF32(lum, (y - 1) * w + x) -
        sampleF32(lum, (y - 1) * w + x + 1) +
        sampleF32(lum, (y + 1) * w + x - 1) +
        2 * sampleF32(lum, (y + 1) * w + x) +
        sampleF32(lum, (y + 1) * w + x + 1);
      const mag = Math.sqrt(gx * gx + gy * gy);
      if (mag > t) {
        const i = (y * w + x) * 4;
        const interior = sampleF32(lum, y * w + x);
        if (interior < 0.5) {
          paint(dst, i, GREEN_INK);
        } else {
          paint(dst, i, [220, 220, 215]);
        }
      }
    }
  }
}

export function applyScatter(
  src: Uint8ClampedArray,
  dst: Uint8ClampedArray,
  w: number,
  h: number,
  opts: Pick<VintageParams, "threshold" | "density">,
): void {
  const { threshold, density } = opts;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const l = toGrayscale(src, i);
      const r = hash2(x, y);
      let bg: readonly [number, number, number] = [22, 22, 24];
      if (r < 0.008) bg = [60, 60, 58];
      paint(dst, i, bg);
      if (l > threshold && hash2(x + 13, y + 7) < density * (l - threshold)) {
        paint(dst, i, PAPER);
      }
    }
  }
}

export function applyStippled(
  src: Uint8ClampedArray,
  dst: Uint8ClampedArray,
  w: number,
  h: number,
  opts: Pick<VintageParams, "dotSize" | "contrast">,
): void {
  const { dotSize, contrast } = opts;
  for (let i = 0; i < dst.length; i += 4) paint(dst, i, PAPER);
  const step = Math.max(2, Math.round(dotSize));
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const l = toGrayscale(src, (y * w + x) * 4);
      const darkness = (1 - l) ** (1 / Math.max(0.1, contrast));
      const jx = (hash2(x, y) - 0.5) * step;
      const jy = (hash2(x + 91, y + 31) - 0.5) * step;
      const px = Math.max(0, Math.min(w - 1, Math.round(x + jx)));
      const py = Math.max(0, Math.min(h - 1, Math.round(y + jy)));
      if (hash2(px + 5, py + 11) < darkness) {
        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            const xx = px + dx,
              yy = py + dy;
            if (xx < w && yy < h) paint(dst, (yy * w + xx) * 4, INK);
          }
        }
      }
    }
  }
}

export function applyCarbon(
  src: Uint8ClampedArray,
  dst: Uint8ClampedArray,
  w: number,
  h: number,
  opts: Pick<VintageParams, "contrast" | "grain">,
): void {
  const { contrast, grain } = opts;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      let l = toGrayscale(src, i);
      l = 1 / (1 + Math.exp(-(l - 0.5) * (4 + contrast * 8)));
      const r = Math.round(PAPER[0] * l + INK[0] * (1 - l));
      const g = Math.round(PAPER[1] * l + INK[1] * (1 - l));
      const b = Math.round(PAPER[2] * l + INK[2] * (1 - l));
      const n = (hash2(x, y) - 0.5) * grain * 80;
      paint(dst, i, [
        Math.max(0, Math.min(255, r + n)),
        Math.max(0, Math.min(255, g + n)),
        Math.max(0, Math.min(255, b + n)),
      ]);
    }
  }
}

/** Flip RGB channels in place (alpha unchanged). */
export function invertRgb(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - (data[i] ?? 0);
    data[i + 1] = 255 - (data[i + 1] ?? 0);
    data[i + 2] = 255 - (data[i + 2] ?? 0);
  }
}
