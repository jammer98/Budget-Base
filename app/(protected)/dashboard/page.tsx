"use client";

import * as React from "react";
import { Pencil, Trash2, Plus, Tag } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { useExpenses } from "@/lib/hooks/use-expense";
import { useCategories } from "@/lib/hooks/use-categories";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Expense } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseFormDialog } from "@/components/expense-form-dialog";
import { DeleteExpenseDialog } from "@/components/delete-expense-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PAGE_LIMIT = 20;
const ALL_CATEGORIES = "all";

function formatExpenseDate(expense: Expense): string {
  const value =  expense.spent_on;
  if (!value) return "—";

  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default function DashboardPage() {
  const { user, token } = useAuth();

  const [categoryId, setCategoryId] = React.useState<string>(ALL_CATEGORIES);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [page, setPage] = React.useState(1);

  const debouncedStartDate = useDebouncedValue(startDate);
  const debouncedEndDate = useDebouncedValue(endDate);

  React.useEffect(() => {
    setPage(1);
  }, [categoryId, debouncedStartDate, debouncedEndDate]);

  const { data: categoriesData } = useCategories(token);

  const { data, isLoading, isFetching, isError, error } = useExpenses(token, {
    categoryId: categoryId === ALL_CATEGORIES ? undefined : Number(categoryId),
    startDate: debouncedStartDate || undefined,
    endDate: debouncedEndDate || undefined,
    page,
    limit: PAGE_LIMIT,
  });

  const hasNextPage = (data?.expenses.length ?? 0) === PAGE_LIMIT;

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingExpense, setEditingExpense] = React.useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = React.useState<Expense | null>(null);

  function openAddDialog() {
    setEditingExpense(null);
    setFormOpen(true);
  }

  function openEditDialog(expense: Expense) {
    setEditingExpense(expense);
    setFormOpen(true);
  }

  const categories = categoriesData?.categories ?? [];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Welcome, {user?.name}</h1>
        <p className="text-sm text-muted-foreground">Your expenses at a glance.</p>
      </div>

      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader className="p-4 pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Tag className="size-3.5" />
            </span>
            Browse by category
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Select a category to filter your expenses.
          </p>
        </CardHeader>
        <CardContent className="grid gap-2 p-4 pt-0 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => setCategoryId(ALL_CATEGORIES)}
            className={cn(
              "rounded-lg border p-3 text-left transition-colors",
              categoryId === ALL_CATEGORIES
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50 hover:bg-accent/50"
            )}
          >
            <p className="text-sm font-medium">All categories</p>
            <p className="mt-0.5 text-xs text-muted-foreground">View every expense</p>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategoryId(String(category.id))}
              className={cn(
                "rounded-lg border p-3 text-left transition-colors",
                categoryId === String(category.id)
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 hover:bg-accent/50"
              )}
            >
              <p className="text-sm font-medium">{category.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Filter expenses</p>
            </button>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground sm:col-span-2 lg:col-span-4">
              Categories will appear here once they are available.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-4 rounded-lg border border-border bg-card p-4">
          <div className="grid gap-1.5">
            <Label htmlFor="category-filter">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="category-filter" className="w-[180px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="start-date">From</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-[160px]"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="end-date">To</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-[160px]"
            />
          </div>

          {(categoryId !== ALL_CATEGORIES || startDate || endDate) && (
            <Button
              variant="ghost"
              onClick={() => {
                setCategoryId(ALL_CATEGORIES);
                setStartDate("");
                setEndDate("");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        <Button onClick={openAddDialog}>
          <Plus className="size-4" />
          Add expense
        </Button>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">
          Loading expenses…
        </p>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load expenses."}
        </p>
      )}

      {data && data.expenses.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No expenses match these filters.
        </p>
      )}

      {data && data.expenses.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[96px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(expense.spent_on)}
                    </TableCell>
                    <TableCell>{expense.category_name ?? "Uncategorized"}</TableCell>
                    <TableCell>{expense.description ?? "—"}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Edit expense"
                          onClick={() => openEditDialog(expense)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete expense"
                          onClick={() => setDeletingExpense(expense)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page}
              {isFetching && " · updating…"}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={!hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {token && (
        <>
          <ExpenseFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            token={token}
            expense={editingExpense}
          />
          <DeleteExpenseDialog
            open={!!deletingExpense}
            onOpenChange={(open) => !open && setDeletingExpense(null)}
            token={token}
            expense={deletingExpense}
          />
        </>
      )}
    </div>
  );
}