/**
 * Baseline commercial numbers entered by the user.
 * All monetary values are in GBP.
 */
export interface ScenarioInputs {
  annualRevenue: number;
  monthlyMediaSpend: number;
  activeCustomerCount: number;
  averageOrderValue: number;
  /** Estimated share of paid media impressions currently reaching known existing customers. 0–1. */
  existingCustomerMediaOverlap: number;
}

/**
 * The three adjustable lever values, each normalised to [0, 1].
 * The UI layer is responsible for converting slider display values to this scale.
 *
 * existingCustomerSuppression: 0–1 (represents 0–100%)
 * experimentationUplift:       0–1 (UI displays 0–20%; SliderPanel divides by 100)
 * mediaReinvestmentRate:       0–1 (represents 0–100%)
 */
export interface SliderParams {
  existingCustomerSuppression: number;
  experimentationUplift: number;
  mediaReinvestmentRate: number;
}

/** A single month's revenue projection. */
export interface MonthlyProjection {
  month: number; // 1–12
  low: number;   // £ lower bound of confidence range
  mid: number;   // £ midpoint estimate
  high: number;  // £ upper bound of confidence range
}

/** Full engine output: one projection per calendar month, always length 12. */
export interface ScenarioResult {
  /** Unmodified monthly revenue baseline, used by UI to show headroom delta. */
  baselineMonthlyRevenue: number;
  /** Monthly media budget freed by lever 1, shown in UI even when reinvestment=0. */
  monthlyMediaSaving: number;
  projections: MonthlyProjection[];
}
