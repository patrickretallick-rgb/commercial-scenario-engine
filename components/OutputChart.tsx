import { ScenarioResult } from "@/lib/types";

interface OutputChartProps {
  result: ScenarioResult | null;
}

const fmt = (n: number) => `£${n.toLocaleString("en-GB")}`;

export default function OutputChart({ result }: OutputChartProps) {
  if (!result || result.projections.every((p) => p.mid === 0)) {
    return (
      <div className="text-sm text-gray-500">
        Enter your baseline figures to see projections.
      </div>
    );
  }

  return (
    <div>
      {/* TODO (#10): replace table with chart component */}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-1 pr-4">Month</th>
            <th className="text-right py-1 pr-4">Low</th>
            <th className="text-right py-1 pr-4">Mid</th>
            <th className="text-right py-1">High</th>
          </tr>
        </thead>
        <tbody>
          {result.projections.map((p) => (
            <tr key={p.month} className="border-b last:border-0">
              <td className="py-1 pr-4">{p.month}</td>
              <td className="text-right py-1 pr-4">{fmt(p.low)}</td>
              <td className="text-right py-1 pr-4">{fmt(p.mid)}</td>
              <td className="text-right py-1">{fmt(p.high)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
