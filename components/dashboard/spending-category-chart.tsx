"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { category: "Food", amount: 7200 },
  { category: "Housing", amount: 5000 },
  { category: "Transport", amount: 3420 },
  { category: "Shopping", amount: 2800 },
  { category: "Other", amount: 4000 },
];

const COLORS = [
  "var(--primary)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const total = data.reduce((sum, item) => sum + item.amount, 0);

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function SpendingCategoryChart() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-6">
        <h3 className="font-serif text-xl font-medium">
          Spending by Category
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Where your money went this month.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Donut */}
        <div className="relative h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.category}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--card-foreground)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center value */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">
              Total spent
            </span>

            <span className="mt-1 text-xl font-semibold tabular-nums">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="flex flex-col justify-center gap-4">
          {data.map((item, index) => {
            const percentage = Math.round((item.amount / total) * 100);

            return (
              <div
                key={item.category}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="size-3 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="text-sm">
                    {item.category}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium tabular-nums">
                    {formatCurrency(item.amount)}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {percentage}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}