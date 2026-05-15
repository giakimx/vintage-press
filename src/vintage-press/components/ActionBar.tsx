import { Download, Upload } from "lucide-react";

export function ActionBar({
  onReplace,
  onDownload,
}: {
  onReplace: () => void;
  onDownload: () => void;
}) {
  return (
    <div className="vig-actions">
      <button type="button" className="vig-act" onClick={onReplace}>
        <Upload /> Replace
      </button>
      <button type="button" className="vig-act vig-act-primary" onClick={onDownload}>
        <Download /> Download PNG
      </button>
    </div>
  );
}
