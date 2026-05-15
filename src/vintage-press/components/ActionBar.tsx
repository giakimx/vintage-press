import { Contrast, Download, Upload } from "lucide-react";

export function ActionBar({
  onReplace,
  inverted,
  onInvertToggle,
  onDownload,
}: {
  onReplace: () => void;
  inverted: boolean;
  onInvertToggle: () => void;
  onDownload: () => void;
}) {
  return (
    <div className="vig-actions">
      <button type="button" className="vig-act" onClick={onReplace}>
        <Upload /> Replace
      </button>
      <button
        type="button"
        className={`vig-act${inverted ? " vig-act-active" : ""}`}
        aria-pressed={inverted}
        onClick={onInvertToggle}
      >
        <Contrast /> Invert
      </button>
      <button type="button" className="vig-act vig-act-primary" onClick={onDownload}>
        <Download /> Download PNG
      </button>
    </div>
  );
}
