import { useQuery } from "@tanstack/react-query";
import {
  getSummaryReport,
  getTrendReport,
  getMonthOverMonth,
  getBudgetStatus,
} from "@/lib/api";

export function useSummaryReport(
  token: string | null,
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: ["reports", "summary", startDate, endDate],
    queryFn: () => getSummaryReport(token as string, startDate, endDate),
    enabled: Boolean(token && startDate && endDate),
  });
}

export function useTrendReport(
  token: string | null,
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: ["reports", "trend", startDate, endDate],
    queryFn: () => getTrendReport(token as string, startDate, endDate),
    enabled: Boolean(token && startDate && endDate),
  });
}

export function useMonthOverMonth(token: string | null) {
  return useQuery({
    queryKey: ["reports", "month-over-month"],
    queryFn: () => getMonthOverMonth(token as string),
    enabled: Boolean(token),
  });
}

export function useBudgetStatus(token: string | null, month: string) {
  return useQuery({
    queryKey: ["reports", "budget-status", month],
    queryFn: () => getBudgetStatus(token as string, month),
    enabled: Boolean(token && month),
  });
}