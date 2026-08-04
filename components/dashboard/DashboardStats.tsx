"use client";

import {
  formatCurrency,
  formatNumber,
  getConcertMetrics,
  toNumber,
} from "@/lib/calculations";
import type { Concert } from "@/lib/types";
import { StaggerItem, StaggerList } from "@/components/Motion";

export function DashboardStats({ concerts }: { concerts: Concert[] }) {
  const metrics = concerts.map((concert) => ({
    concert,
    ...getConcertMetrics(concert),
  }));

  const totalConcerts = concerts.length;
  const totalSpent = metrics.reduce((sum, item) => sum + item.totalCost, 0);
  const averageCost = totalConcerts ? totalSpent / totalConcerts : 0;
  const averageFun = totalConcerts
    ? concerts.reduce((sum, c) => sum + toNumber(c.fun_rating), 0) /
      totalConcerts
    : 0;

  const costPerHourValues = metrics
    .map((item) => item.costPerHour)
    .filter((value): value is number => value !== null);
  const averageCostPerHour = costPerHourValues.length
    ? costPerHourValues.reduce((sum, value) => sum + value, 0) /
      costPerHourValues.length
    : null;

  const bestValue = metrics
    .filter((item) => item.funPointsPer100 !== null)
    .sort(
      (a, b) => (b.funPointsPer100 ?? 0) - (a.funPointsPer100 ?? 0),
    )[0];

  const mostExpensive = [...metrics].sort(
    (a, b) => b.totalCost - a.totalCost,
  )[0];

  const highestFun = [...concerts].sort(
    (a, b) => toNumber(b.fun_rating) - toNumber(a.fun_rating),
  )[0];

  const cards = [
    {
      label: "Total concerts",
      value: String(totalConcerts),
      title: String(totalConcerts),
    },
    {
      label: "Total amount spent",
      value: formatCurrency(totalSpent),
      title: formatCurrency(totalSpent),
    },
    {
      label: "Average cost per concert",
      value: formatCurrency(averageCost),
      title: formatCurrency(averageCost),
    },
    {
      label: "Average fun rating",
      value: `${formatNumber(averageFun, 1)} / 10`,
      title: `${formatNumber(averageFun, 1)} / 10`,
    },
    {
      label: "Average cost per hour",
      value:
        averageCostPerHour === null
          ? "—"
          : formatCurrency(averageCostPerHour),
      title:
        averageCostPerHour === null
          ? "—"
          : formatCurrency(averageCostPerHour),
    },
    {
      label: "Best value concert",
      value: bestValue
        ? `${bestValue.concert.concert_name} (${formatNumber(bestValue.funPointsPer100 ?? 0, 2)} pts/$100)`
        : "—",
      title: bestValue
        ? `${bestValue.concert.concert_name} (${formatNumber(bestValue.funPointsPer100 ?? 0, 2)} pts/$100)`
        : "—",
    },
    {
      label: "Most expensive concert",
      value: mostExpensive
        ? `${mostExpensive.concert.concert_name} (${formatCurrency(mostExpensive.totalCost)})`
        : "—",
      title: mostExpensive
        ? `${mostExpensive.concert.concert_name} (${formatCurrency(mostExpensive.totalCost)})`
        : "—",
    },
    {
      label: "Highest fun rating",
      value: highestFun
        ? `${highestFun.concert_name} (${highestFun.fun_rating}/10)`
        : "—",
      title: highestFun
        ? `${highestFun.concert_name} (${highestFun.fun_rating}/10)`
        : "—",
    },
  ];

  return (
    <StaggerList className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StaggerItem key={card.label}>
          <div className="card-hover h-full rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
            <p className="text-[0.7rem] font-medium uppercase tracking-wide text-base-content/60">
              {card.label}
            </p>
            <p
              className="mt-2 font-display text-xl font-semibold leading-snug line-clamp-2"
              title={card.title}
            >
              {card.value}
            </p>
          </div>
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
