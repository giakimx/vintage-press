import { Image as ImageIcon } from "lucide-react";
import type { StyleId, VintageStyleMeta } from "../types";

export function StylePicker({
  styles,
  styleId,
  onChange,
}: {
  styles: readonly VintageStyleMeta[];
  styleId: StyleId;
  onChange: (id: StyleId) => void;
}) {
  return (
    <section>
      <div className="vig-section-label">
        <ImageIcon /> Process
      </div>
      <div className="vig-styles">
        {styles.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            className="vig-style-btn"
            data-active={styleId === s.id}
            onClick={() => onChange(s.id)}
          >
            <span className="vig-style-num">{String(idx + 1).padStart(2, "0")}</span>
            <span className="vig-style-text">
              <span className="vig-style-name">{s.name}</span>
              <span className="vig-style-cap">{s.caption}</span>
            </span>
            <span className="vig-style-dot" />
          </button>
        ))}
      </div>
    </section>
  );
}
