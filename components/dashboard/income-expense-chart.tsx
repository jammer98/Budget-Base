"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", income: 52000, expenses: 28000 },
  { month: "Feb", income: 58000, expenses: 31000 },
  { month: "Mar", income: 55000, expenses: 24000 },
  { month: "Apr", income: 62000, expenses: 27000 },
  { month: "May", income: 60000, expenses: 22000 },
  { month: "Jun", income: 65000, expenses: 22420 },
];

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function IncomeExpenseChart() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-6">
        <h3 className="font-serif text-xl font-medium">
          Income vs Expenses
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Your monthly income and spending over the last six months.
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="var(--primary)"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--muted-foreground)"
                  stopOpacity={0.15}
                />
                <stop
                  offset="95%"
                  stopColor="var(--muted-foreground)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              width={55}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />

            <Tooltip
              formatter={(value, name) => [
                formatCurrency(Number(value)),
                name === "income" ? "Income" : "Expenses",
              ]}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                color: "var(--card-foreground)",
              }}
            />

            <Legend
  verticalAlign="top"
  align="right"
  height={36}
  formatter={(value) =>
    value === "income" ? "Income" : "Expenses"
  }
/>

            <Area
              type="monotone"
              dataKey="income"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#income)"
            />

            <Area
              type="monotone"
              dataKey="expenses"
              stroke="var(--muted-foreground)"
              strokeWidth={2}
              fill="url(#expenses)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}