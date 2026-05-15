import type { ChangeEvent, DragEvent, ReactNode, RefObject } from "react";

import { BusyOverlay } from "./BusyOverlay";
import { DropZone } from "./DropZone";

export function PreviewStage({
  previewLabel,
  origDims,
  imgSrc,
  busy,
  dragHover,
  canvasRef,
  fileRef,
  actions,
  onDragOver,
  onDragLeave,
  onDrop,
  onOpenFilePicker,
  onFileInputChange,
}: {
  previewLabel: string | undefined;
  origDims: { w: number; h: number } | null;
  imgSrc: string | null;
  busy: boolean;
  dragHover: boolean;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fileRef: RefObject<HTMLInputElement | null>;
  actions: ReactNode;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onOpenFilePicker: () => void;
  onFileInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <section className="vig-stage">
      <div className="vig-stage-head">
        <span className="vig-stage-head-l">Preview · {previewLabel}</span>
        <div className="vig-stage-head-r">
          {origDims && (
            <span className="vig-pill">
              {origDims.w} × {origDims.h}
            </span>
          )}
          <span className="vig-pill">PNG / JPEG</span>
        </div>
      </div>

      {/* biome-ignore lint/a11y/noStaticElementInteractions: full-area file drop target */}
      <div
        className="vig-stage-body"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {!imgSrc ? (
          <DropZone dragHover={dragHover} onActivate={onOpenFilePicker} />
        ) : (
          <>
            <canvas ref={canvasRef} className="vig-canvas" />
            {busy && <BusyOverlay />}
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg"
          style={{ display: "none" }}
          onChange={onFileInputChange}
        />
      </div>
      {actions}
    </section>
  );
}
