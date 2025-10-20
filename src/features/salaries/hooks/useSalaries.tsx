import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentSalary, fetchSalaryHistory, createSalaryRecord } from "../services/salaryApi";
import { SalaryFormData, SalaryHistory } from "../types";
import { toast } from "sonner";


export function useFetchCurrentSalary(userId: string) {
  return useQuery<SalaryHistory | undefined>({
    queryKey: ["salary", userId],
    queryFn: async () => {
      const res = await fetchCurrentSalary(userId);
      return res.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFetchSalaryHistory(userId: string) {
  return useQuery<SalaryHistory[]>({
    queryKey: ["salaryHistory", userId],
    queryFn: async () => {
      const res = await fetchSalaryHistory(userId);
      return res.data ?? [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}


export function useCreateSalaryRecord(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SalaryFormData) => createSalaryRecord(data),
    onMutate: async (newSalary: SalaryFormData) => {
      await queryClient.cancelQueries({ queryKey: ["salaryHistory", userId] });
      const previousHistory = queryClient.getQueryData<SalaryHistory[]>(["salaryHistory", userId]) ?? [];
      const optimisticId = "optimistic-" + Date.now();

 
      queryClient.setQueryData(["salaryHistory", userId], [
        ...previousHistory,
        { ...newSalary, id: optimisticId, createdAt: new Date().toISOString() }
      ]);

      return { previousHistory, optimisticId };
    },
    onError: (_error, _newSalary, context: any) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(["salaryHistory", userId], context.previousHistory);
      }
      toast.error("Error al registrar el salario.");
    },
    onSuccess: (response, _newSalary, context: any) => {
      const createdSalary = response.data ?? response;
      const previousHistory = queryClient.getQueryData<SalaryHistory[]>(["salaryHistory", userId]) ?? [];
      const updatedHistory = previousHistory.map(sal =>
        sal.id === context.optimisticId ? createdSalary : sal
      );
      queryClient.setQueryData(["salaryHistory", userId], updatedHistory);
      toast.success("Salario registrado exitosamente");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["salaryHistory", userId] });
      queryClient.invalidateQueries({ queryKey: ["salary", userId] });
    }
  });
}