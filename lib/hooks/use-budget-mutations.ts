import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertBudget } from "@/lib/api";
import type { CreateBudgetInput } from "@/lib/types";

export function useUpsertBudget(token: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBudgetInput) => upsertBudget(token as string, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["reports", "budget-status"] });
    },
  });
}