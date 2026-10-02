import { useQuery } from "@tanstack/react-query";
import { getTrendReport } from "@/lib/api";

export function useTrendReport(
  token: string | null,
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: ["reports", "trend", startDate, endDate],
    queryFn: () => getTrendReport(token as string, startDate, endDate),
    enabled: !!token && !!startDate && !!endDate,
  });
}