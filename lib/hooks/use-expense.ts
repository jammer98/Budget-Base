import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "@/lib/api";
import type { ExpenseListParams } from "@/lib/types";

export function useExpenses(token: string | null, params: ExpenseListParams = {}) {
  return useQuery({
    queryKey: ["expenses", params],
    queryFn: () => getExpenses(token as string, params),
    enabled: !!token,
  });
}