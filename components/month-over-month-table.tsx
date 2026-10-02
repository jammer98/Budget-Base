"use client";

import type { MonthOverMonthRow } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatMonth(month: string) {
  // month comes back as a date-like string, e.g. "2026-09-01"
  return new Date(`${month.slice(0, 10)}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function ChangeCell({ row }: { row: MonthOverMonthRow }) {
  if (row.change === null || row.percentChange === null) {
    return <span className="text-muted-foreground">—</span>;
  }
  const isUp = row.change > 0;
  const isDown = row.change < 0;
  return (
    <span
      className={
        isUp
          ? "text-destructive"
          : isDown
          ? "text-primary"
          : "text-muted-foreground"
      }
    >
      {isUp ? "+" : ""}
      {formatCurrency(row.change)} ({isUp ? "+" : ""}
      {row.percentChange.toFixed(1)}%)
    </span>
  );
}

export function MonthOverMonthTable({ rows }: { rows: MonthOverMonthRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No category history yet — add expenses across a couple of months to see
        trends here.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Month</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-right">Prev. month</TableHead>
          <TableHead className="text-right">Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={`${row.categoryId}-${row.month}`}>
            <TableCell className="font-medium">{row.category}</TableCell>
            <TableCell>{formatMonth(row.month)}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(row.total)}
            </TableCell>
            <TableCell className="text-right tabular-nums text-muted-foreground">
              {row.prevTotal === null ? "—" : formatCurrency(row.prevTotal)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              <ChangeCell row={row} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}