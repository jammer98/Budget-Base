"use client";

import { toast } from "sonner";
import type { Expense } from "@/lib/types";
import { ApiError, NetworkError } from "@/lib/api";
import { useDeleteExpense } from "@/lib/hooks/use-expense-mutation";
import { formatCurrency } from "@/lib/format";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface DeleteExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
  expense: Expense | null;
}

export function DeleteExpenseDialog({
  open,
  onOpenChange,
  token,
  expense,
}: DeleteExpenseDialogProps) {
  const deleteExpense = useDeleteExpense(token);

  async function handleConfirm() {
    if (!expense) return;
    try {
      await deleteExpense.mutateAsync(expense.id);
      toast.success("Expense deleted.");
      onOpenChange(false);
    } catch (err) {
      if (err instanceof ApiError || err instanceof NetworkError) {
        toast.error(err.message);
      } else {
        toast.error("Couldn't delete that expense. Try again.");
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif">Delete expense?</DialogTitle>
          <DialogDescription>
            {expense
              ? `This will permanently delete "${
                  expense.description || expense.category_name || "this expense"
                }" (${formatCurrency(expense.amount)}). This can't be undone.`
              : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteExpense.isPending}
          >
            {deleteExpense.isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}