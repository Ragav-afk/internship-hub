// Rough, hand-maintained rates used ONLY to compare stipends across
// currencies for the minimum-stipend filter (components/FilterSidebar.tsx's
// slider is INR-denominated - "₹X/month and up"). Never used for display -
// formatStipend() in lib/format.ts always shows the original currency and
// amount as-is. Good enough for "at least roughly this much," not exact;
// update these occasionally as real exchange rates drift.
export const EXCHANGE_RATES_TO_INR: Record<string, number> = {
  INR: 1,
  USD: 88,
  GBP: 112,
  EUR: 96,
};

export function toInr(amount: number, currency: string): number {
  const rate = EXCHANGE_RATES_TO_INR[currency];
  // Unknown currency: compare as-is rather than guess a rate.
  return rate === undefined ? amount : amount * rate;
}
