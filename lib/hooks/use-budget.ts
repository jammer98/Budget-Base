import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBudgets, getBudgetStatus, upsertBudget } from "@/lib/api";
import type { CreateBudgetInput } from "@/lib/types";

export function useBudgets(token: string | null) {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: () => getBudgets(token as string),
    enabled: Boolean(token),
  });
}

export function useBudgetStatus(token: string | null, month: string) {
  return useQuery({
    queryKey: ["budget-status", month],
    queryFn: () => getBudgetStatus(token as string, month),
    enabled: Boolean(token && month),
  });
}

export function useUpsertBudget(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBudgetInput) =>
      upsertBudget(token as string, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budget-status"] });
    },
  });
}