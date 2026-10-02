"use client";

import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";
import type { TrendPoint } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  total: { label: "Daily total", color: "var(--chart-1)" },
  movingAvg7d: { label: "7-day avg", color: "var(--chart-2)" },
  runningBalance: { label: "Running balance", color: "var(--chart-3)" },
} satisfies ChartConfig;

function formatDayTick(day: string) {
  // Handles both a plain "YYYY-MM-DD" and an already-full ISO timestamp —
  // only append a time component if one isn't present yet.
  const iso = day.includes("T") ? day : `${day}T00:00:00`;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return day; // fall back to showing the raw value rather than "Invalid Date"
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <ComposedChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={formatDayTick}
        />
        <YAxis
          yAxisId="left"
          tickLine={false}
          axisLine={false}
          width={64}
          tickFormatter={(v) => formatCurrency(v)}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickLine={false}
          axisLine={false}
          width={64}
          tickFormatter={(v) => formatCurrency(v)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => formatDayTick(value as string)}
              formatter={(value, name) => [
                formatCurrency(value as number),
                chartConfig[name as keyof typeof chartConfig]?.label ?? name,
              ]}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          yAxisId="left"
          dataKey="total"
          fill="var(--color-total)"
          radius={[3, 3, 0, 0]}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="movingAvg7d"
          stroke="var(--color-movingAvg7d)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="runningBalance"
          stroke="var(--color-runningBalance)"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ChartContainer>
  );
}