"use client";

import { Slider } from "@/components/ui/slider";
import type { SliderParams } from "@/lib/types";

interface SliderPanelProps {
  sliders: SliderParams;
  onChange: (sliders: SliderParams) => void;
}

interface LeverConfig {
  key: keyof SliderParams;
  label: string;
  /** Display max — slider range is 0 to this value. Stored value is always displayValue / 100. */
  displayMax: number;
}

const LEVERS: LeverConfig[] = [
  { key: "existingCustomerSuppression", label: "Existing customer media suppression", displayMax: 100 },
  { key: "experimentationUplift",       label: "Experimentation / CRO uplift",        displayMax: 20  },
  { key: "mediaReinvestmentRate",        label: "Reinvestment of media savings",       displayMax: 100 },
];

export function SliderPanel({ sliders, onChange }: SliderPanelProps) {
  function handleChange(key: keyof SliderParams, rawValue: number | readonly number[]) {
    const v = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    onChange({ ...sliders, [key]: v / 100 });
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Levers
      </h2>
      {LEVERS.map((lever) => {
        const displayValue = Math.round(sliders[lever.key] * 100);
        return (
          <div key={lever.key} className="flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <label className="text-sm font-medium">{lever.label}</label>
              <span className="text-sm tabular-nums text-muted-foreground">
                {displayValue}%
              </span>
            </div>
            <Slider
              min={0}
              max={lever.displayMax}
              step={1}
              value={[displayValue]}
              onValueChange={(value) => handleChange(lever.key, value)}
            />
          </div>
        );
      })}
    </div>
  );
}
