"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { SummaryByCategory } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  total: {
    label: "Total spent",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function CategorySpendingChart({
  data,
}: {
  data: SummaryByCategory[];
}) {
  const chartData = data.map((row) => ({
    category: row.category,
    total: row.total,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-[320px] w-full">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
      >
        <CartesianGrid horizontal={false} />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <YAxis
          type="category"
          dataKey="category"
          width={96}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            String(value).length > 14
              ? `${String(value).slice(0, 14)}…`
              : String(value)
          }
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => [formatCurrency(value as number), "Total spent"]}
            />
          }
        />
        <Bar
          dataKey="total"
          fill="var(--color-total)"
          radius={[0, 4, 4, 0]}
          barSize={24}
        />
      </BarChart>
    </ChartContainer>
  );
}
