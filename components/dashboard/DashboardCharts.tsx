"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  COST_CATEGORIES,
  formatCurrency,
  formatNumber,
  getConcertMetrics,
  spendingByMonth,
  toNumber,
} from "@/lib/calculations";
import { useChartTheme } from "@/lib/useChartTheme";
import type { Concert } from "@/lib/types";
import { FadeIn } from "@/components/Motion";

export function DashboardCharts({ concerts }: { concerts: Concert[] }) {
  const theme = useChartTheme();

  const categoryData = COST_CATEGORIES.map((category) => ({
    name: category.label,
    value: concerts.reduce(
      (sum, concert) => sum + toNumber(concert[category.key]),
      0,
    ),
  })).filter((item) => item.value > 0);

  const byConcert = concerts.map((concert) => {
    const metrics = getConcertMetrics(concert);
    return {
      name:
        concert.concert_name.length > 16
          ? `${concert.concert_name.slice(0, 16)}…`
          : concert.concert_name,
      totalCost: metrics.totalCost,
      fun: toNumber(concert.fun_rating),
      funPoints: metrics.funPointsPer100 ?? 0,
    };
  });

  const monthlySpend = spendingByMonth(concerts);

  const tickStyle = { fontSize: 11, fill: theme.content };
  const chartHeightClass = "h-56 w-full sm:h-72";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <FadeIn delay={0.02} className="lg:col-span-2">
        <ChartCard title="Spending over time">
          {monthlySpend.length === 0 ? (
            <ChartEmpty />
          ) : (
            <div className={chartHeightClass}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlySpend}
                  margin={{ left: 8, right: 12, top: 8 }}
                >
                  <CartesianGrid stroke={theme.muted} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={tickStyle} />
                  <YAxis tick={tickStyle} />
                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(
                        typeof value === "number" ? value : Number(value),
                      )
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Total spent"
                    stroke={theme.primary}
                    strokeWidth={3}
                    dot={{ r: 4, fill: theme.primary }}
                    activeDot={{ r: 6 }}
                    isAnimationActive
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </FadeIn>

      <FadeIn delay={0.05}>
        <ChartCard title="Spending by cost category">
          {categoryData.length === 0 ? (
            <ChartEmpty />
          ) : (
            <div className={chartHeightClass}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    isAnimationActive
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={theme.palette[index % theme.palette.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(
                        typeof value === "number" ? value : Number(value),
                      )
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </FadeIn>

      <FadeIn delay={0.1}>
        <ChartCard title="Total cost by concert">
          {byConcert.length === 0 ? (
            <ChartEmpty />
          ) : (
            <div className={chartHeightClass}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byConcert} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid stroke={theme.muted} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={tickStyle}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={tickStyle} />
                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(
                        typeof value === "number" ? value : Number(value),
                      )
                    }
                  />
                  <Bar
                    dataKey="totalCost"
                    name="Total cost"
                    fill={theme.primary}
                    radius={[6, 6, 0, 0]}
                    isAnimationActive
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </FadeIn>

      <FadeIn delay={0.15}>
        <ChartCard title="Fun rating by concert">
          {byConcert.length === 0 ? (
            <ChartEmpty />
          ) : (
            <div className={chartHeightClass}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byConcert} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid stroke={theme.muted} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={tickStyle}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis domain={[0, 10]} tick={tickStyle} />
                  <Tooltip />
                  <Bar
                    dataKey="fun"
                    name="Fun rating"
                    fill={theme.secondary}
                    radius={[6, 6, 0, 0]}
                    isAnimationActive
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </FadeIn>

      <FadeIn delay={0.2}>
        <ChartCard title="Fun Points per $100 by concert">
          {byConcert.length === 0 ? (
            <ChartEmpty />
          ) : (
            <div className={chartHeightClass}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byConcert} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid stroke={theme.muted} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={tickStyle}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={tickStyle} />
                  <Tooltip
                    formatter={(value) =>
                      formatNumber(
                        typeof value === "number" ? value : Number(value),
                        2,
                      )
                    }
                  />
                  <Bar
                    dataKey="funPoints"
                    name="Fun Points per $100"
                    fill={theme.accent}
                    radius={[6, 6, 0, 0]}
                    isAnimationActive
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </FadeIn>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="card card-hover h-full border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        {children}
      </div>
    </section>
  );
}

function ChartEmpty() {
  return (
    <div className="flex h-56 items-center justify-center text-sm text-base-content/60 sm:h-72">
      Add a concert to draw this chart.
    </div>
  );
}
