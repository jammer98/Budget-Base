import { useQuery } from "@tanstack/react-query";
import { getBudgetStatus } from "@/lib/api";

export function useBudgetStatus(token: string | null, month: string) {
  return useQuery({
    queryKey: ["reports", "budget-status", month],
    queryFn: () => getBudgetStatus(token as string, month),
    enabled: !!token && !!month,
  });
}