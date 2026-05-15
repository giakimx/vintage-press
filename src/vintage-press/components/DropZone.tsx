import { Upload } from "lucide-react";
import type { MouseEvent } from "react";

export function DropZone({
  dragHover,
  onActivate,
}: {
  dragHover: boolean;
  onActivate: () => void;
}) {
  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: full hit area for drop / click */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: "Browse files" button handles keyboard */}
      <div className="vig-drop" data-hover={dragHover} onClick={onActivate}>
        <Upload className="vig-drop-icon" />
        <div className="vig-drop-title">Drop an image here</div>
        <div className="vig-drop-sub">JPEG or PNG · processed locally</div>
        <div className="vig-divider">or</div>
        <button
          type="button"
          className="vig-pick-btn"
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onActivate();
          }}
        >
          Browse files
        </button>
      </div>
    </>
  );
}
