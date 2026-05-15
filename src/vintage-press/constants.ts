import type { VintageParams, VintageStyleMeta } from "./types";

/** Cream + charcoal palette */
export const PAPER = [232, 226, 211] as const;
export const INK = [28, 28, 30] as const;
export const GREEN_INK = [120, 140, 95] as const;

/** Each preset is a pixel-level transform over an ImageData buffer. */
export const STYLES: readonly VintageStyleMeta[] = [
  { id: "halftone", name: "Halftone Plate", caption: "Newsprint dot reproduction" },
  { id: "engraving", name: "Engraving", caption: "Etched contour with grain" },
  { id: "scatter", name: "Threshold Scatter", caption: "High-contrast speckle" },
  { id: "stippled", name: "Stippled Litho", caption: "Random-dither lithograph" },
  { id: "carbon", name: "Carbon Print", caption: "Soft duotone with film noise" },
];

export const DEFAULT_PARAMS: VintageParams = {
  dotSize: 6,
  contrast: 1.4,
  threshold: 0.5,
  grain: 0.25,
  density: 1.0,
};
