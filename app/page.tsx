"use client";

import { useState } from "react";
import { InputPanel } from "@/components/InputPanel";
import type { ScenarioInputs } from "@/lib/types";

const DEFAULT_INPUTS: ScenarioInputs = {
  annualRevenue: 5_000_000,
  monthlyMediaSpend: 50_000,
  activeCustomerCount: 25_000,
  averageOrderValue: 85,
  existingCustomerMediaOverlap: 0.4,
};

export default function Home() {
  const [inputs, setInputs] = useState<ScenarioInputs>(DEFAULT_INPUTS);

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8">Commercial Scenario Engine</h1>
      <InputPanel inputs={inputs} onChange={setInputs} />
    </main>
  );
}
