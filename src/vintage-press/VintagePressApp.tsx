import type { ChangeEvent, DragEvent } from "react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActionBar } from "./components/ActionBar";
import { AdjustmentSliders } from "./components/AdjustmentSliders";
import { Masthead } from "./components/Masthead";
import { PreviewStage } from "./components/PreviewStage";
import { StylePicker } from "./components/StylePicker";
import { DEFAULT_PARAMS, STYLES } from "./constants";
import { CONTROLS } from "./controls";
import type { StyleId, VintageParams } from "./types";
import { useVintageRender } from "./useVintageRender";

/** Root UI for Vintage Press — image → halftone / litho treatments in the canvas. */
export function App() {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [styleId, setStyleId] = useState<StyleId>("halftone");
  const [params, setParams] = useState<VintageParams>(() => ({ ...DEFAULT_PARAMS }));
  const [busy, setBusy] = useState(false);
  const [origDims, setOrigDims] = useState<{ w: number; h: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const sourceImgRef = useRef<HTMLImageElement | null>(null);
  const dragSessionRef = useRef(false);
  const [dragHover, setDragHover] = useState(false);

  const runEffects = useVintageRender(sourceImgRef, canvasRef, styleId, params);

  const render = useCallback(() => {
    if (!sourceImgRef.current || !canvasRef.current) return;
    setBusy(true);
    requestAnimationFrame(() => {
      runEffects();
      setBusy(false);
    });
  }, [runEffects]);

  useEffect(() => {
    if (imgSrc) render();
  }, [imgSrc, render]);

  const previewName = useMemo(() => STYLES.find((s) => s.id === styleId)?.name, [styleId]);

  const loadFile = useCallback((file: File | undefined) => {
    if (!file || !/^image\/(png|jpeg|jpg)$/i.test(file.type)) {
      alert("Please choose a PNG or JPEG.");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      sourceImgRef.current = img;
      setOrigDims({ w: img.width, h: img.height });
      setImgSrc(url);
    };
    img.src = url;
  }, []);

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      dragSessionRef.current = false;
      setDragHover(false);
      const f = e.dataTransfer.files?.[0];
      if (f) loadFile(f);
    },
    [loadFile],
  );

  const onDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragSessionRef.current) {
      dragSessionRef.current = true;
      setDragHover(true);
    }
  }, []);

  const onDragLeave = useCallback(() => {
    dragSessionRef.current = false;
    setDragHover(false);
  }, []);

  const onDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vintage-${styleId}-${Date.now()}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  }, [styleId]);

  const onOpenFilePicker = useCallback(() => fileRef.current?.click(), []);

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => loadFile(e.target.files?.[0]),
    [loadFile],
  );

  return (
    <div className="vig-root">
      <div className="vig-wrap">
        <Masthead />

        <div className="vig-grid">
          <aside className="vig-side">
            <StylePicker styles={STYLES} styleId={styleId} onChange={setStyleId} />
            <AdjustmentSliders
              controlsForStyle={CONTROLS[styleId]}
              params={params}
              setParams={setParams}
            />
          </aside>

          <PreviewStage
            previewLabel={previewName}
            origDims={origDims}
            imgSrc={imgSrc}
            busy={busy}
            dragHover={dragHover}
            canvasRef={canvasRef}
            fileRef={fileRef}
            actions={
              imgSrc ? <ActionBar onReplace={onOpenFilePicker} onDownload={onDownload} /> : null
            }
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onOpenFilePicker={onOpenFilePicker}
            onFileInputChange={onFileChange}
          />
        </div>
      </div>
    </div>
  );
}
