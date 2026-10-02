"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth-context";
import { useSummaryReport } from "@/lib/hooks/use-summary-report";
import { useTrendReport } from "@/lib/hooks/use-trend-report";
import { formatCurrency } from "@/lib/format";
import { TrendChart } from "@/components/trend-chat";
import { CategorySpendingChart } from "@/components/category-spending-chart";
import { useMonthOverMonth } from "@/lib/hooks/use-month-over-month";
import { MonthOverMonthTable } from "@/components/month-over-month-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function firstOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
}

function isoToday(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function ReportsPage() {
  const { token } = useAuth();
  const now = React.useMemo(() => new Date(), []);
  const [startDate, setStartDate] = React.useState(firstOfMonth(now));
  const [endDate, setEndDate] = React.useState(isoToday(now));

  const summary = useSummaryReport(token, startDate, endDate);
  const trend = useTrendReport(token, startDate, endDate);
  const monthOverMonth = useMonthOverMonth(token);
  const report = summary.data?.report;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-2xl font-semibold">Reports</h1>

      <div className="flex w-full flex-wrap items-end gap-5 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="grid gap-1.5">
          <Label htmlFor="report-start">From</Label>
          <Input
            id="report-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-[220px]"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="report-end">To</Label>
          <Input
            id="report-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-[220px]"
          />
        </div>
      </div>

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="trend">Trend</TabsTrigger>
          <TabsTrigger value="month-over-month">Month over month</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="flex flex-col gap-6">
          {summary.isLoading && (
            <p className="text-sm text-muted-foreground">Loading summary…</p>
          )}
          {summary.isError && (
            <p className="text-sm text-destructive">
              {summary.error instanceof Error
                ? summary.error.message
                : "Failed to load the summary report."}
            </p>
          )}

          {report && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-sm font-medium text-muted-foreground">
                      Total spent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold tabular-nums">
                      {formatCurrency(report.total)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-sm font-medium text-muted-foreground">
                      Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold tabular-nums">
                      {report.expenseCount}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-base">
                    Spending by category
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Compare how much you spent in each category during the selected
                    date range.
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {report.byCategory.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No expenses in this range.
                    </p>
                  )}
                  {report.byCategory.map((row, i) => (
                    <div key={row.category} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{row.category}</span>
                        <span className="tabular-nums text-muted-foreground">
                          {formatCurrency(row.total)} · {row.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${row.percentage}%`,
                            backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {report.byCategory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-base">
                      Category comparison
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Longer bars represent categories with higher total spending.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <CategorySpendingChart data={report.byCategory} />
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-base">Spending trend</CardTitle>
              <p className="text-sm text-muted-foreground">
                Bars show each day&apos;s spending. The 7-day average smooths out
                daily changes, while the running balance shows your cumulative
                spending over the selected range.
              </p>
            </CardHeader>
            <CardContent>
              {trend.isLoading && (
                <p className="text-sm text-muted-foreground">Loading trend…</p>
              )}
              {trend.isError && (
                <p className="text-sm text-destructive">
                  {trend.error instanceof Error
                    ? trend.error.message
                    : "Failed to load the trend report."}
                </p>
              )}
              {trend.data && <TrendChart data={trend.data.trend} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month-over-month">
  <Card>
    <CardHeader>
      <CardTitle className="font-serif text-base">Month over month</CardTitle>
    </CardHeader>
    <CardContent>
      {monthOverMonth.isLoading && (
        <p className="text-sm text-muted-foreground">Loading…</p>
      )}
      {monthOverMonth.isError && (
        <p className="text-sm text-destructive">
          {monthOverMonth.error instanceof Error
            ? monthOverMonth.error.message
            : "Failed to load month-over-month data."}
        </p>
      )}
      {monthOverMonth.data && (
        <MonthOverMonthTable rows={monthOverMonth.data.monthOverMonth} />
      )}
    </CardContent>
  </Card>
</TabsContent>
      </Tabs>
    </div>
  );
}