"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import type { Expense } from "@/lib/types";
import { ApiError, NetworkError } from "@/lib/api";
import { useCategories } from "@/lib/hooks/use-categories";
import {
  useCreateExpense,
  useUpdateExpense,
  useCreateCategory,
} from "@/lib/hooks/use-expense-mutation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toDateInputValue } from "@/lib/format";

const NO_CATEGORY = "none";

// amount stays a string through validation (matches the raw API shape) and
// is only converted with Number() right before it's sent — avoids fighting
// react-hook-form's generics over a coerced field type.
const expenseSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, {
      message: "Enter an amount greater than 0",
    }),
  categoryId: z.string(),
  description: z.string().optional(),
  spentOn: z.string().min(1, "Date is required"),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

function defaultsFor(expense: Expense | null | undefined): ExpenseFormValues {
  return {
    amount: expense?.amount ?? "",
    categoryId: expense?.category_id ? String(expense.category_id) : NO_CATEGORY,
    description: expense?.description ?? "",
    spentOn: expense?.spent_on
      ? toDateInputValue(expense.spent_on)
      : new Date().toISOString().slice(0, 10),
  };
}

interface ExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
  /** Present => editing this expense. Absent/null => creating a new one. */
  expense?: Expense | null;
}

export function ExpenseFormDialog({
  open,
  onOpenChange,
  token,
  expense,
}: ExpenseFormDialogProps) {
  const isEditing = !!expense;
  const { data: categoriesData } = useCategories(token);
  const createExpense = useCreateExpense(token);
  const updateExpense = useUpdateExpense(token);
  const createCategory = useCreateCategory(token);

  const [showNewCategory, setShowNewCategory] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState("");

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: defaultsFor(expense),
  });

  // Re-sync whenever the dialog opens for a (possibly different) expense.
  React.useEffect(() => {
    if (open) {
      form.reset(defaultsFor(expense));
      setShowNewCategory(false);
      setNewCategoryName("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, expense]);

  async function handleAddCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    try {
      const res = await createCategory.mutateAsync(name);
      form.setValue("categoryId", String(res.category.id));
      setShowNewCategory(false);
      setNewCategoryName("");
      toast.success(`Category "${res.category.name}" added.`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        toast.error("A category with that name already exists.");
      } else {
        toast.error("Couldn't add that category. Try again.");
      }
    }
  }

  async function onSubmit(values: ExpenseFormValues) {
    const input = {
      amount: Number(values.amount),
      description: values.description || undefined,
      spentOn: values.spentOn,
      categoryId:
        values.categoryId === NO_CATEGORY ? undefined : Number(values.categoryId),
    };

    try {
      if (isEditing && expense) {
        await updateExpense.mutateAsync({ id: expense.id, input });
        toast.success("Expense updated.");
      } else {
        await createExpense.mutateAsync(input);
        toast.success("Expense added.");
      }
      onOpenChange(false);
    } catch (err) {
      if (err instanceof ApiError || err instanceof NetworkError) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  }

  const isSubmitting = createExpense.isPending || updateExpense.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif">{isEditing ? "Edit expense" : "Add expense"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details below." : "Log a new expense."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <div className="flex items-center gap-2">
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={NO_CATEGORY}>Uncategorized</SelectItem>
                          {categoriesData?.categories.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setShowNewCategory((s) => !s)}
                        aria-label="Add new category"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="spentOn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showNewCategory && (
              <div className="flex items-end gap-2 rounded-md border border-border bg-muted/40 p-3">
                <div className="grid flex-1 gap-1.5">
                  <Label htmlFor="new-category-name">New category name</Label>
                  <Input
                    id="new-category-name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={createCategory.isPending || !newCategoryName.trim()}
                >
                  {createCategory.isPending ? "Adding…" : "Add"}
                </Button>
              </div>
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Add expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}