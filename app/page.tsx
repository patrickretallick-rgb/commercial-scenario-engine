"use client";

import { useState } from "react";
import { InputPanel } from "@/components/InputPanel";
import { SliderPanel } from "@/components/SliderPanel";
import OutputChart from "@/components/OutputChart";
import { runScenario } from "@/lib/engine";
import type { ScenarioInputs, SliderParams } from "@/lib/types";

const DEFAULT_INPUTS: ScenarioInputs = {
  annualRevenue: 5_000_000,
  monthlyMediaSpend: 50_000,
  activeCustomerCount: 25_000,
  averageOrderValue: 85,
  existingCustomerMediaOverlap: 0.4,
};

const DEFAULT_SLIDERS: SliderParams = {
  existingCustomerSuppression: 0.4,
  experimentationUplift: 0.05,
  mediaReinvestmentRate: 0.5,
};

export default function Home() {
  const [inputs, setInputs] = useState<ScenarioInputs>(DEFAULT_INPUTS);
  const [sliders, setSliders] = useState<SliderParams>(DEFAULT_SLIDERS);

  const result = runScenario(inputs, sliders);

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8">Commercial Scenario Engine</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start">
        <InputPanel inputs={inputs} onChange={setInputs} />
        <div className="flex flex-col gap-8">
          <SliderPanel sliders={sliders} onChange={setSliders} />
          <OutputChart result={result} />
        </div>
      </div>
    </main>
  );
}
