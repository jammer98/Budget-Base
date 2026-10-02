import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api";

export function useCategories(token: string | null) {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(token as string),
    enabled: !!token,
  });
}