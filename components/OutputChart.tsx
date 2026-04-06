import { ScenarioResult } from "@/lib/types";

interface OutputChartProps {
  result: ScenarioResult | null;
}

const fmt = (n: number) =>
  `£${Math.round(n).toLocaleString("en-GB")}`;

const fmtDelta = (n: number) => {
  const sign = n >= 0 ? "+" : "−";
  return `${sign}£${Math.round(Math.abs(n)).toLocaleString("en-GB")}`;
};

export default function OutputChart({ result }: OutputChartProps) {
  if (!result) {
    return (
      <p className="text-sm text-muted-foreground">
        Enter your baseline figures to see projections.
      </p>
    );
  }

  const { baselineMonthlyRevenue, monthlyMediaSaving, projections } = result;
  const m12 = projections[11];
  const headroomMid = m12.mid - baselineMonthlyRevenue;
  const headroomLow = m12.low - baselineMonthlyRevenue;
  const headroomHigh = m12.high - baselineMonthlyRevenue;

  return (
    <div className="flex flex-col gap-6">

      {/* Summary strip */}
      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
          Indicative headroom at month 12
        </p>
        <p className="text-2xl font-semibold tabular-nums">
          {fmtDelta(headroomMid)}
          <span className="text-base font-normal text-muted-foreground ml-1">/ month</span>
        </p>
        <p className="text-sm text-muted-foreground tabular-nums">
          Plausible range: {fmtDelta(headroomLow)} to {fmtDelta(headroomHigh)}
        </p>
        {monthlyMediaSaving > 0 && (
          <p className="text-sm text-muted-foreground tabular-nums">
            Media saving from suppression: {fmt(monthlyMediaSaving)} / month
          </p>
        )}
      </div>

      {/* Month-by-month table */}
      {/* TODO (#10): replace with chart component */}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b text-muted-foreground">
            <th className="text-left py-1 pr-4 font-medium">Month</th>
            <th className="text-right py-1 pr-4 font-medium">Low</th>
            <th className="text-right py-1 pr-4 font-medium">Mid</th>
            <th className="text-right py-1 pr-4 font-medium">High</th>
            <th className="text-right py-1 font-medium">Headroom (mid)</th>
          </tr>
        </thead>
        <tbody>
          {projections.map((p) => (
            <tr key={p.month} className="border-b last:border-0">
              <td className="py-1 pr-4">{p.month}</td>
              <td className="text-right py-1 pr-4 tabular-nums">{fmt(p.low)}</td>
              <td className="text-right py-1 pr-4 tabular-nums">{fmt(p.mid)}</td>
              <td className="text-right py-1 pr-4 tabular-nums">{fmt(p.high)}</td>
              <td className="text-right py-1 tabular-nums text-muted-foreground">
                {fmtDelta(p.mid - baselineMonthlyRevenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
