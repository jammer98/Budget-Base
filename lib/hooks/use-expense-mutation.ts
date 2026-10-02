import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createExpense,
  updateExpense,
  deleteExpense,
  createCategory,
} from "@/lib/api";
import type { CreateExpenseInput, UpdateExpenseInput } from "@/lib/types";

export function useCreateExpense(token: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateExpenseInput) => createExpense(token as string, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
  });
}

export function useUpdateExpense(token: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateExpenseInput }) =>
      updateExpense(token as string, id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
  });
}

export function useDeleteExpense(token: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteExpense(token as string, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
  });
}

export function useCreateCategory(token: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createCategory(token as string, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}