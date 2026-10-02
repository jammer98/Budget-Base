"use client";

import * as React from "react";
import { Pencil, Plus } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { useBudgets } from "@/lib/hooks/use-budgets";
import { useBudgetStatus } from "@/lib/hooks/use-budget-status";
import { formatCurrency } from "@/lib/format";
import type { Budget } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BudgetFormDialog } from "@/components/budget-form-dialog";
import { BudgetStatusList } from "@/components/budget-status-list";

function currentMonthInputValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default function BudgetsPage() {
  const { token } = useAuth();
  const now = React.useMemo(() => new Date(), []);
  const [monthInput, setMonthInput] = React.useState(currentMonthInputValue(now));
  const month = `${monthInput}-01`;

  const budgets = useBudgets(token);
  const budgetStatus = useBudgetStatus(token, month);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingBudget, setEditingBudget] = React.useState<Budget | null>(null);

  function openAddDialog() {
    setEditingBudget(null);
    setFormOpen(true);
  }

  function openEditDialog(budget: Budget) {
    setEditingBudget(budget);
    setFormOpen(true);
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold">Budgets</h1>
        <Button onClick={openAddDialog}>
          <Plus className="size-4" />
          Set budget
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-base">Your budgets</CardTitle>
        </CardHeader>
        <CardContent>
          {budgets.isLoading && (
            <p className="text-sm text-muted-foreground">Loading…</p>
          )}
          {budgets.isError && (
            <p className="text-sm text-destructive">
              {budgets.error instanceof Error
                ? budgets.error.message
                : "Failed to load budgets."}
            </p>
          )}
          {budgets.data && budgets.data.budgets.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No budgets set yet — set one above to start tracking against a
              limit.
            </p>
          )}
          {budgets.data && budgets.data.budgets.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Monthly limit</TableHead>
                  <TableHead className="w-[64px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.data.budgets.map((budget) => (
                  <TableRow key={budget.id}>
                    <TableCell className="font-medium">
                      {budget.category_name}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(budget.monthly_limit)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit budget"
                        onClick={() => openEditDialog(budget)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <CardTitle className="font-serif text-base">
            This month&apos;s status
          </CardTitle>
          <div className="grid gap-1.5">
            <Label htmlFor="status-month" className="sr-only">
              Month
            </Label>
            <Input
              id="status-month"
              type="month"
              value={monthInput}
              onChange={(e) => setMonthInput(e.target.value)}
              className="w-[160px]"
            />
          </div>
        </CardHeader>
        <CardContent>
          {budgetStatus.isLoading && (
            <p className="text-sm text-muted-foreground">Loading…</p>
          )}
          {budgetStatus.isError && (
            <p className="text-sm text-destructive">
              {budgetStatus.error instanceof Error
                ? budgetStatus.error.message
                : "Failed to load budget status."}
            </p>
          )}
          {budgetStatus.data && (
            <BudgetStatusList rows={budgetStatus.data.budgetStatus} />
          )}
        </CardContent>
      </Card>

      {token && (
        <BudgetFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          token={token}
          budget={editingBudget}
        />
      )}
    </div>
  );
}