import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activateShiftType, createShiftType, deleteShiftType, fetchAreaRoleData, fetchShiftConfig, updateShiftType } from "../services/shiftConfigApi";
import { ShiftType, ShiftTypeDto } from "../types";
import { toast } from "sonner";

export function useFetchShiftConfig() {
    return useQuery({
        queryKey: ["shift-config"],
        queryFn: async () => {
            const res = await fetchShiftConfig()
            return res.data ?? [];
        },
        staleTime: 5 * 60 * 1000, 
    })
}

export function useFetchAreaRolesForSelect() {
    return useQuery({
        queryKey: ["area-roles-for-select"],
        queryFn: async () => {
            const res = await fetchAreaRoleData()
            return res.data ?? [];

        },
        staleTime: 5 * 60 * 1000,
        
    })
}

export function useCreateShiftType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ShiftTypeDto) => createShiftType(data),
    onMutate: async (newShiftType: ShiftTypeDto) => {
      await queryClient.cancelQueries({ queryKey: ["shift-config"] });
      const previousShiftTypes = queryClient.getQueryData<ShiftType[]>(["shift-config"]) ?? [];
      const optimisticId = "optimistic-" + Date.now();

      queryClient.setQueryData(["shift-config"], [
        ...previousShiftTypes,
        { ...newShiftType, id: optimisticId }
      ]);

      return { previousShiftTypes, optimisticId };
    },
    onError: (error: any, _newShiftType, context: any) => {
      if (context?.previousShiftTypes) {
        queryClient.setQueryData(["shift-config"], context.previousShiftTypes);
      }
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Error al crear el tipo de turno."
      );
    },
    onSuccess: (response, _newShiftType, context: any) => {
      const createdShiftType = response.data ?? response;
      const previousShiftTypes = queryClient.getQueryData<ShiftType[]>(["shift-config"]) ?? [];
      const updatedShiftTypes = previousShiftTypes.map(st =>
        st.id === context.optimisticId ? createdShiftType : st
      );
      queryClient.setQueryData(["shift-config"], updatedShiftTypes);
      toast.success("Tipo de turno creado exitosamente");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shift-config"] });
    }
  });
}

export function useEditShiftType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShiftTypeDto> }) =>
      updateShiftType(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["shift-config"] });
      const previousShiftTypes = queryClient.getQueryData<ShiftType[]>(["shift-config"]) ?? [];

      const updatedShiftTypes = previousShiftTypes.map(st =>
        st.id === id ? { ...st, ...data } : st
      );
      queryClient.setQueryData(["shift-config"], updatedShiftTypes);
      return { previousShiftTypes };
    },
    onError: (error: any, _variables, context: any) => {
      if (context?.previousShiftTypes) {
        queryClient.setQueryData(["shift-config"], context.previousShiftTypes);
      }
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Error al actualizar el tipo de turno."
      );
    },
    onSuccess: (response) => {
      const updatedShiftType = (response.data ?? response) as ShiftType;
      const previousShiftTypes = queryClient.getQueryData<ShiftType[]>(["shift-config"]) ?? [];
      const updatedShiftTypes = previousShiftTypes.map(st =>
        st.id === updatedShiftType.id ? updatedShiftType : st
      );
      queryClient.setQueryData(["shift-config"], updatedShiftTypes);
      toast.success("Tipo de turno actualizado exitosamente");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shift-config"] });
    }
  });
}


export function useDeleteShiftType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteShiftType(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["shift-config"] });
      const previousShiftTypes = queryClient.getQueryData<ShiftType[]>(["shift-config"]) ?? [];
      queryClient.setQueryData(
        ["shift-config"],
        previousShiftTypes.filter((st) => st.id !== id)
      );
      return { previousShiftTypes };
    },
    onError: (_error, _id, context: any) => {
      if (context?.previousShiftTypes) {
        queryClient.setQueryData(["shift-config"], context.previousShiftTypes);
      }
      toast.error("Error al eliminar el tipo de turno.");
    },
    onSuccess: () => {
      toast.success("Tipo de turno eliminado exitosamente");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shift-config"] });
    },
  });
}

export function useActivateShiftType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateShiftType(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["shift-config"] });
      const previousShiftTypes = queryClient.getQueryData<ShiftType[]>(["shift-config"]) ?? [];
      const updatedShiftTypes = previousShiftTypes.map(st =>
        st.id === id ? { ...st, active: true } : st
      );
      queryClient.setQueryData(["shift-config"], updatedShiftTypes);
      return { previousShiftTypes };
    },
    onError: (error: any, _id, context: any) => {
      if (context?.previousShiftTypes) {
        queryClient.setQueryData(["shift-config"], context.previousShiftTypes);
      }
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Error al activar el tipo de turno."
      );
    },
    onSuccess: () => {
      toast.success("Tipo de turno activado exitosamente");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shift-config"] });
    },
  });
}