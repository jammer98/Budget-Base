import { useQuery } from "@tanstack/react-query";
import { getMonthOverMonth } from "@/lib/api";

export function useMonthOverMonth(token: string | null) {
  return useQuery({
    queryKey: ["reports", "month-over-month"],
    queryFn: () => getMonthOverMonth(token as string),
    enabled: !!token,
  });
}