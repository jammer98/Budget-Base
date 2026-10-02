import { useQuery } from "@tanstack/react-query";
import { getBudgets } from "@/lib/api";

export function useBudgets(token: string | null) {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: () => getBudgets(token as string),
    enabled: !!token,
  });
}