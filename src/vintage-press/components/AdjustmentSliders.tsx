import { Sliders } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { ControlRow, VintageParams } from "../types";

export function AdjustmentSliders({
  controlsForStyle,
  params,
  setParams,
}: {
  controlsForStyle: readonly ControlRow[];
  params: VintageParams;
  setParams: Dispatch<SetStateAction<VintageParams>>;
}) {
  return (
    <section>
      <div className="vig-section-label">
        <Sliders /> Adjustments
      </div>
      {controlsForStyle.map(([key, label, min, max, step]) => (
        <div className="vig-control" key={key}>
          <div className="vig-control-row">
            <span className="vig-control-label">{label}</span>
            <span className="vig-control-val">{Number(params[key]).toFixed(2)}</span>
          </div>
          <input
            type="range"
            className="vig-slider"
            min={min}
            max={max}
            step={step}
            value={params[key]}
            onChange={(e) => setParams((p) => ({ ...p, [key]: parseFloat(e.target.value) }))}
          />
        </div>
      ))}
    </section>
  );
}
