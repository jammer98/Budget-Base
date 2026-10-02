"use client";

import type { BudgetStatusRow } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export function BudgetStatusList({ rows }: { rows: BudgetStatusRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No budgets set for this month yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {rows.map((row) => (
        <div key={row.categoryId} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium">
              {row.category}
              {row.overBudget && <Badge variant="destructive">Over budget</Badge>}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {formatCurrency(row.spent)} / {formatCurrency(row.monthlyLimit)} ·{" "}
              {row.percentUsed.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={
                row.overBudget
                  ? "h-full rounded-full bg-destructive"
                  : "h-full rounded-full bg-primary"
              }
              style={{ width: `${Math.min(row.percentUsed, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}