import { useQuery } from "@tanstack/react-query";
import { getSummaryReport } from "@/lib/api";

export function useSummaryReport(
  token: string | null,
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: ["reports", "summary", startDate, endDate],
    queryFn: () => getSummaryReport(token as string, startDate, endDate),
    enabled: !!token && !!startDate && !!endDate,
  });
}