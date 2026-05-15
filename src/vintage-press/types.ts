export type StyleId = "halftone" | "engraving" | "scatter" | "stippled" | "carbon";

export interface VintageStyleMeta {
  id: StyleId;
  name: string;
  caption: string;
}

export interface VintageParams {
  dotSize: number;
  contrast: number;
  threshold: number;
  grain: number;
  density: number;
}

export type ControlRow = readonly [
  key: keyof VintageParams,
  label: string,
  min: number,
  max: number,
  step: number,
];
