import type { RefObject } from "react";
import { useCallback } from "react";
import { applyCarbon, applyEngraving, applyHalftone, applyScatter, applyStippled } from "./effects";
import type { StyleId, VintageParams } from "./types";

const MAX_DIMENSION = 1200;

export function useVintageRender(
  sourceImgRef: RefObject<HTMLImageElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  styleId: StyleId,
  params: VintageParams,
): () => void {
  return useCallback(() => {
    const img = sourceImgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(img, 0, 0, w, h);
    const srcImg = ctx.getImageData(0, 0, w, h);
    const dstImg = ctx.createImageData(w, h);
    const src = srcImg.data;
    const dst = dstImg.data;

    switch (styleId) {
      case "halftone":
        applyHalftone(src, dst, w, h, params);
        break;
      case "engraving":
        applyEngraving(src, dst, w, h, params);
        break;
      case "scatter":
        applyScatter(src, dst, w, h, params);
        break;
      case "stippled":
        applyStippled(src, dst, w, h, params);
        break;
      case "carbon":
        applyCarbon(src, dst, w, h, params);
        break;
      default:
        break;
    }
    ctx.putImageData(dstImg, 0, 0);
  }, [canvasRef, sourceImgRef, styleId, params]);
}
