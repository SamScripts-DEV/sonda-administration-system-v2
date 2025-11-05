import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createShiftConfigRelationToRole,
    fetchShiftsConfigRelationsToRole,
    updateShiftConfigRelationToRole,
    deleteShiftConfigRelationToRole,
} from "../services/shiftConfigRelationToRoleApi";
import { ShiftTypeRoleLocal, CreateShiftTypeRoleLocalDto } from "../types";
import { toast } from "sonner";


export function useFetchShiftConfigRelationsToRole() {
    return useQuery({
        queryKey: ["shift-type-role-locals"],
        queryFn: async () => {
            const res = await fetchShiftsConfigRelationsToRole();
            return res.data ?? [];
        },
        staleTime: 5 * 60 * 1000,
    });
}


export function useCreateShiftConfigRelationToRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateShiftTypeRoleLocalDto) => createShiftConfigRelationToRole(data),
        onMutate: async (newRelation: CreateShiftTypeRoleLocalDto) => {
            await queryClient.cancelQueries({ queryKey: ["shift-type-role-locals"] });
            const previousRelations = queryClient.getQueryData<ShiftTypeRoleLocal[]>(["shift-type-role-locals"]) ?? [];
            const optimisticId = "optimistic-" + Date.now();

            queryClient.setQueryData(["shift-type-role-locals"], [
                ...previousRelations,
                { ...newRelation, id: optimisticId }
            ]);

            return { previousRelations, optimisticId };
        },
        onError: (error: any, _newRelation, context: any) => {
            if (context?.previousRelations) {
                queryClient.setQueryData(["shift-type-role-locals"], context.previousRelations);
            }
            toast.error(error?.message || "Error al crear el rol local");
        },
        onSuccess: (response, _newRelation, context: any) => {
            const createdRelation = response.data ?? response;
            const previousRelations = queryClient.getQueryData<ShiftTypeRoleLocal[]>(["shift-type-role-locals"]) ?? [];
            const updatedRelations = previousRelations.map(rel =>
                rel.id === context.optimisticId ? createdRelation : rel
            );
            queryClient.setQueryData(["shift-type-role-locals"], updatedRelations);
            toast.success("Rol local creado exitosamente");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["shift-type-role-locals"] });
        }
    });
}


export function useEditShiftConfigRelationToRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateShiftTypeRoleLocalDto> }) =>
            updateShiftConfigRelationToRole(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ["shift-type-role-locals"] });
            const previousRelations = queryClient.getQueryData<ShiftTypeRoleLocal[]>(["shift-type-role-locals"]) ?? [];

            const updatedRelations = previousRelations.map(rel =>
                rel.id === id ? { ...rel, ...data } : rel
            );
            queryClient.setQueryData(["shift-type-role-locals"], updatedRelations);
            return { previousRelations };
        },
        onError: (error: any, _variables, context: any) => {
            if (context?.previousRelations) {
                queryClient.setQueryData(["shift-type-role-locals"], context.previousRelations);
            }
            toast.error(error?.message || "Error al actualizar el rol local");
        },
        onSuccess: (response) => {
            const updatedRelation = (response.data ?? response) as ShiftTypeRoleLocal;
            const previousRelations = queryClient.getQueryData<ShiftTypeRoleLocal[]>(["shift-type-role-locals"]) ?? [];
            const updatedRelations = previousRelations.map(rel =>
                rel.id === updatedRelation.id ? updatedRelation : rel
            );
            queryClient.setQueryData(["shift-type-role-locals"], updatedRelations);
            toast.success("Rol local actualizado exitosamente");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["shift-type-role-locals"] });
        }
    });
}


export function useDeleteShiftConfigRelationToRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteShiftConfigRelationToRole(id),
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ["shift-type-role-locals"] });
            const previousRelations = queryClient.getQueryData<ShiftTypeRoleLocal[]>(["shift-type-role-locals"]) ?? [];
            queryClient.setQueryData(
                ["shift-type-role-locals"],
                previousRelations.filter((rel) => rel.id !== id)
            );
            return { previousRelations };
        },
        onError: (error: any, _id, context: any) => {
            if (context?.previousRelations) {
                queryClient.setQueryData(["shift-type-role-locals"], context.previousRelations);
            }
            toast.error(error?.message || "Error al eliminar el rol local");
        },
        onSuccess: () => {
            toast.success("Rol local eliminado exitosamente");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["shift-type-role-locals"] });
        }
    });
}