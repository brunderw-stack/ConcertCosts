import type { Concert } from "@/lib/types";

export type CostFields = Pick<
  Concert,
  | "ticket_cost"
  | "ticket_fees"
  | "parking_cost"
  | "food_drink_cost"
  | "merchandise_cost"
  | "lodging_cost"
  | "travel_cost"
  | "other_cost"
>;

export function toNumber(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function calculateTotalCost(costs: CostFields): number {
  return (
    toNumber(costs.ticket_cost) +
    toNumber(costs.ticket_fees) +
    toNumber(costs.parking_cost) +
    toNumber(costs.food_drink_cost) +
    toNumber(costs.merchandise_cost) +
    toNumber(costs.lodging_cost) +
    toNumber(costs.travel_cost) +
    toNumber(costs.other_cost)
  );
}

export function calculateCostPerHour(
  totalCost: number,
  hoursAtEvent: number,
): number | null {
  const hours = toNumber(hoursAtEvent);
  if (hours <= 0) return null;
  return totalCost / hours;
}

/** Fun Points per $100 = (fun rating / total cost) * 100 */
export function calculateFunPointsPer100(
  funRating: number,
  totalCost: number,
): number | null {
  if (totalCost <= 0) return null;
  return (toNumber(funRating) / totalCost) * 100;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number, digits = 1): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value);
}

export const COST_CATEGORIES = [
  { key: "ticket_cost" as const, label: "Tickets" },
  { key: "ticket_fees" as const, label: "Fees" },
  { key: "parking_cost" as const, label: "Parking" },
  { key: "food_drink_cost" as const, label: "Food & Drink" },
  { key: "merchandise_cost" as const, label: "Merch" },
  { key: "lodging_cost" as const, label: "Lodging" },
  { key: "travel_cost" as const, label: "Travel / Gas" },
  { key: "other_cost" as const, label: "Other" },
];

export function getConcertMetrics(concert: Concert) {
  const totalCost = calculateTotalCost(concert);
  const costPerHour = calculateCostPerHour(
    totalCost,
    toNumber(concert.hours_at_event),
  );
  const funPointsPer100 = calculateFunPointsPer100(
    toNumber(concert.fun_rating),
    totalCost,
  );

  return { totalCost, costPerHour, funPointsPer100 };
}

/** Group concert spending by calendar month (YYYY-MM), sorted oldest → newest */
export function spendingByMonth(concerts: Concert[]) {
  const buckets = new Map<string, number>();

  for (const concert of concerts) {
    const key = concert.concert_date.slice(0, 7); // YYYY-MM
    if (!/^\d{4}-\d{2}$/.test(key)) continue;
    buckets.set(key, (buckets.get(key) ?? 0) + calculateTotalCost(concert));
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => {
      const [year, mon] = month.split("-");
      const label = new Date(Number(year), Number(mon) - 1, 1).toLocaleDateString(
        "en-US",
        { month: "short", year: "numeric" },
      );
      return { month, label, total };
    });
}
