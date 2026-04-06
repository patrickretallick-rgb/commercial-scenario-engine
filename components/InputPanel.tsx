"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ScenarioInputs } from "@/lib/types";

interface InputPanelProps {
  inputs: ScenarioInputs;
  onChange: (inputs: ScenarioInputs) => void;
}

interface FieldConfig {
  key: keyof ScenarioInputs;
  label: string;
  prefix?: string;
  suffix?: string;
  /** If true, stored value is 0–1 but displayed as 0–100 */
  isPercent?: boolean;
}

const FIELDS: FieldConfig[] = [
  { key: "annualRevenue",                label: "Annual revenue",                        prefix: "£" },
  { key: "monthlyMediaSpend",            label: "Monthly media spend",                   prefix: "£" },
  { key: "activeCustomerCount",          label: "Active customer count"                               },
  { key: "averageOrderValue",            label: "Average order value",                   prefix: "£" },
  { key: "existingCustomerMediaOverlap", label: "Existing-customer media overlap",       suffix: "%", isPercent: true },
];

function toDisplay(value: number, isPercent: boolean): string {
  return isPercent ? String(Math.round(value * 100)) : String(value);
}

export function InputPanel({ inputs, onChange }: InputPanelProps) {
  const [displayValues, setDisplayValues] = useState<Record<keyof ScenarioInputs, string>>(
    () => Object.fromEntries(
      FIELDS.map((f) => [f.key, toDisplay(inputs[f.key], f.isPercent ?? false)])
    ) as Record<keyof ScenarioInputs, string>
  );

  function handleChange(key: keyof ScenarioInputs, raw: string) {
    setDisplayValues((prev) => ({ ...prev, [key]: raw }));
  }

  function handleBlur(key: keyof ScenarioInputs, raw: string, isPercent: boolean) {
    const parsed = parseFloat(raw);
    if (isNaN(parsed) || parsed <= 0) return;
    onChange({ ...inputs, [key]: isPercent ? parsed / 100 : parsed });
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Baseline inputs
      </h2>
      {FIELDS.map((field) => (
        <div key={field.key} className="flex flex-col gap-1">
          <Label htmlFor={field.key}>{field.label}</Label>
          <div className="relative flex items-center">
            {field.prefix && (
              <span className="absolute left-2.5 text-sm text-muted-foreground select-none">
                {field.prefix}
              </span>
            )}
            <Input
              id={field.key}
              type="number"
              value={displayValues[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              onBlur={(e) => handleBlur(field.key, e.target.value, field.isPercent ?? false)}
              className={field.prefix ? "pl-6" : field.suffix ? "pr-8" : ""}
            />
            {field.suffix && (
              <span className="absolute right-2.5 text-sm text-muted-foreground select-none">
                {field.suffix}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
