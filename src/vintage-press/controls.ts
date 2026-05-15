import type { ControlRow, StyleId } from "./types";

export const CONTROLS = {
  halftone: [
    ["dotSize", "Dot pitch", 2, 16, 1],
    ["contrast", "Contrast", 0.5, 3, 0.05],
  ],
  engraving: [
    ["threshold", "Edge threshold", 0.1, 2, 0.05],
    ["grain", "Film grain", 0, 0.6, 0.01],
  ],
  scatter: [
    ["threshold", "Light threshold", 0.2, 0.9, 0.01],
    ["density", "Scatter density", 0.2, 4, 0.05],
  ],
  stippled: [
    ["dotSize", "Stipple step", 2, 10, 1],
    ["contrast", "Contrast", 0.5, 3, 0.05],
  ],
  carbon: [
    ["contrast", "Contrast", 0, 2, 0.05],
    ["grain", "Film grain", 0, 1, 0.01],
  ],
} as const satisfies Record<StyleId, readonly ControlRow[]>;
