import type { ScenarioInputs, SliderParams, ScenarioResult, MonthlyProjection } from './types';

/**
 * Assumed marginal return on ad spend applied to reinvested media savings (lever 3).
 * Hardcoded for MVP. If clients need to vary this, promote to a SliderParam.
 */
const ASSUMED_ROAS = 3.0;

/**
 * Runs the commercial scenario model.
 *
 * TODO (issue #7): Replace stub projections with real model logic.
 *
 * Intended mechanics:
 *
 * Lever 1 — Existing customer suppression (existingCustomerSuppression):
 *   monthlyMediaSpend × existingCustomerMediaOverlap × existingCustomerSuppression
 *   = monthly media saving. Freed budget passes to lever 3.
 *   Key inputs: monthlyMediaSpend, existingCustomerMediaOverlap
 *
 * Lever 2 — Experimentation / CRO uplift (experimentationUplift):
 *   Applies a compounding monthly multiplier to the revenue baseline.
 *   Uncertainty band widens over the 12-month horizon.
 *   Key inputs: annualRevenue, averageOrderValue
 *
 * Lever 3 — Reinvestment of media savings (mediaReinvestmentRate):
 *   mediaSaving × mediaReinvestmentRate × ASSUMED_ROAS = monthly revenue uplift.
 *   Key inputs: monthly saving from lever 1, ASSUMED_ROAS constant
 *
 * Confidence range:
 *   low  = mid × (1 - uncertaintyFactor)
 *   high = mid × (1 + uncertaintyFactor)
 *   uncertaintyFactor grows linearly from 5% in month 1 to 20% by month 12.
 *   TODO (issue #7): Validate uncertainty spread assumptions with stakeholder.
 */
export function runScenario(
  inputs: ScenarioInputs,
  sliders: SliderParams,
): ScenarioResult {
  const projections: MonthlyProjection[] = [];

  const baselineMonthlyRevenue = inputs.annualRevenue / 12;

  for (let month = 1; month <= 12; month++) {
    // TODO (issue #7): Replace with real per-lever calculations.
    // Lever 1: inputs.monthlyMediaSpend × inputs.existingCustomerMediaOverlap × sliders.existingCustomerSuppression
    // Lever 2: baselineMonthlyRevenue × (1 + sliders.experimentationUplift) compounded
    // Lever 3: lever1Saving × sliders.mediaReinvestmentRate × ASSUMED_ROAS
    const mid = baselineMonthlyRevenue;
    const uncertaintyFactor = 0.05 + (month - 1) * (0.15 / 11);

    projections.push({
      month,
      low: mid * (1 - uncertaintyFactor),
      mid,
      high: mid * (1 + uncertaintyFactor),
    });
  }

  return { baselineMonthlyRevenue, projections };
}
