import type { ScenarioInputs, SliderParams, ScenarioResult, MonthlyProjection } from './types';

/**
 * Assumed marginal ROAS applied to reinvested media savings (lever 3).
 * Benchmark: blended e-commerce average 2.87x (Ruler Analytics 2025).
 * Incrementality-adjusted ROAS is 15–30% lower than platform-reported,
 * so 3.0x is already a conservative-mid assumption.
 * If clients need to vary this, promote to a SliderParam.
 */
const ASSUMED_ROAS = 3.0;

export function runScenario(
  inputs: ScenarioInputs,
  sliders: SliderParams,
): ScenarioResult {
  const baselineMonthlyRevenue = inputs.annualRevenue / 12;

  /**
   * Lever 1 — Existing customer media suppression
   * Calculates the monthly media budget freed by suppressing existing customers
   * from paid media. This saving is cash-neutral until reinvested (lever 3).
   *
   * Formula: monthlyMediaSpend × existingCustomerMediaOverlap × existingCustomerSuppression
   * Benchmark: 20–50% of paid media typically reaches existing customers without suppression
   * (Virgin Media O2: 37% CAC reduction; SeatGeek: 30–40% efficiency gain)
   */
  const monthlyMediaSaving =
    inputs.monthlyMediaSpend *
    inputs.existingCustomerMediaOverlap *
    sliders.existingCustomerSuppression;

  // Guardrail: warn when media spend exceeds revenue (adversarial / out-of-scope inputs)
  if (inputs.monthlyMediaSpend * 12 > inputs.annualRevenue) {
    console.warn(
      '[engine] monthlyMediaSpend × 12 exceeds annualRevenue. ' +
      'Inputs are outside the intended scope (mid-to-large e-commerce). ' +
      'Lever 3 output has been capped to prevent nonsensical projections.',
    );
  }

  const projections: MonthlyProjection[] = [];

  for (let month = 1; month <= 12; month++) {
    /**
     * Lever 2 — Experimentation / CRO uplift
     * Applies a linear ramp from 0 → target annual uplift over 12 months.
     * Rationale: A/B testing programmes take 3–6 months to compound; applying
     * the full uplift from month 1 overstates early projections by ~18%.
     * Benchmark: 5–10% first-year, 15–25% mature programme (Econsultancy, VWO, CXL).
     *
     * Formula: baselineMonthlyRevenue × experimentationUplift × (month / 12)
     */
    const lever2Uplift =
      baselineMonthlyRevenue * sliders.experimentationUplift * (month / 12);

    /**
     * Lever 3 — Reinvestment of media savings
     * Converts freed budget from lever 1 into revenue via paid media acquisition.
     * Capped at baselineMonthlyRevenue to prevent adversarial inputs (S6) where
     * media spend > revenue causes the multiplier to produce nonsensical results.
     *
     * Formula: monthlyMediaSaving × mediaReinvestmentRate × ASSUMED_ROAS
     */
    const lever3Uplift = Math.min(
      monthlyMediaSaving * sliders.mediaReinvestmentRate * ASSUMED_ROAS,
      baselineMonthlyRevenue,
    );

    const mid = baselineMonthlyRevenue + lever2Uplift + lever3Uplift;

    /**
     * Uncertainty band: ±5% at month 1, widens linearly to ±20% at month 12.
     * Reflects increasing forecast uncertainty over time; not lever-specific.
     */
    const uncertaintyFactor = 0.05 + (month - 1) * (0.15 / 11);

    projections.push({
      month,
      low: mid * (1 - uncertaintyFactor),
      mid,
      high: mid * (1 + uncertaintyFactor),
    });
  }

  return { baselineMonthlyRevenue, monthlyMediaSaving, projections };
}
