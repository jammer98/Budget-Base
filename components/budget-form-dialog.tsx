"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import type { Budget } from "@/lib/types";
import { ApiError, NetworkError } from "@/lib/api";
import { useCategories } from "@/lib/hooks/use-categories";
import { useUpsertBudget } from "@/lib/hooks/use-budget-mutations";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const budgetSchema = z.object({
  categoryId: z.string().min(1, "Choose a category"),
  monthlyLimit: z
    .string()
    .min(1, "Enter a monthly limit")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, {
      message: "Enter an amount greater than 0",
    }),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
  budget?: Budget | null;
}

export function BudgetFormDialog({
  open,
  onOpenChange,
  token,
  budget,
}: BudgetFormDialogProps) {
  const isEditing = !!budget;
  const { data: categoriesData } = useCategories(token);
  const upsertBudget = useUpsertBudget(token);

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      categoryId: budget ? String(budget.category_id) : "",
      monthlyLimit: budget?.monthly_limit ?? "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        categoryId: budget ? String(budget.category_id) : "",
        monthlyLimit: budget?.monthly_limit ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, budget]);

  async function onSubmit(values: BudgetFormValues) {
    try {
      await upsertBudget.mutateAsync({
        categoryId: Number(values.categoryId),
        monthlyLimit: Number(values.monthlyLimit),
      });
      toast.success(isEditing ? "Budget updated." : "Budget set.");
      onOpenChange(false);
    } catch (err) {
      if (err instanceof ApiError || err instanceof NetworkError) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif">
            {isEditing ? "Edit budget" : "Set a budget"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this category's monthly limit."
              : "Set a monthly spending limit for a category. Picking a category that already has a budget just updates it (upsert)."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesData?.categories.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly limit</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={upsertBudget.isPending}>
                {upsertBudget.isPending
                  ? "Saving…"
                  : isEditing
                  ? "Save changes"
                  : "Set budget"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}