import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createShiftSchedule,
    deleteShiftSchedule,
    fetchShiftSchedules,
    updateShiftSchedule

} from "../services/shiftConfigScheduleApi";
import { ShiftSchedule, ShiftScheduleDto } from "../types";
import { toast } from "sonner";


export function useFetchShiftSchedules() {
    return useQuery({
        queryKey: ["shift-schedules"],
        queryFn: async () => {
            const res = await fetchShiftSchedules()
            return res.data ?? []
        },
        staleTime: 5 * 60 * 1000,
    })
}

export function useCreateShiftSchedule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ShiftScheduleDto) => createShiftSchedule(data),
        onMutate: async (newSchedule: ShiftScheduleDto) => {
            await queryClient.cancelQueries({ queryKey: ["shift-schedules"] });
            const previousSchedules = queryClient.getQueryData<ShiftSchedule[]>(["shift-schedules"]) ?? [];
            const optimisticId = "optimistic-" + Date.now();

            queryClient.setQueryData(["shift-schedules"], [
                ...previousSchedules,
                { ...newSchedule, id: optimisticId }
            ]);

            return { previousSchedules, optimisticId }
        },
        onError: (error: any, _newSchedule, context: any) => {
            if (context?.previousSchedules) {
                queryClient.setQueryData(["shift-schedules"], context.previousSchedules);
            }
            toast.error(error?.message || "Error al crear un horario");
        },
        onSuccess: (response, _newSchedule, context: any) => {
            const createdSchedule = response.data ?? response;
            const previousSchedules = queryClient.getQueryData<ShiftSchedule[]>(["shift-schedules"]) ?? [];
            const updatedSchedules = previousSchedules.map(sch =>
                sch.id === context.optimisticId ? createdSchedule : sch
            )

            queryClient.setQueryData(["shift-schedules"], updatedSchedules);
            toast.success("Horario creado exitosamente")
        }
    });
}


export function useEditShiftSchedule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ShiftScheduleDto> }) =>
            updateShiftSchedule(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ["shift-schedules"] })
            const previousSchedules = queryClient.getQueryData<ShiftSchedule[]>(["shift-schedules"]) ?? [];

            const updatedSchedules = previousSchedules.map(sch =>
                sch.id === id ? { ...sch, ...data } : sch
            )

            queryClient.setQueryData(["shift-schedules"], updatedSchedules);
            return { previousSchedules }
        },
        onError: (error: any, _variables, context: any) => {
            if (context?.previousSchedules) {
                queryClient.setQueryData(["shift-schedules"], context.previousSchedules);

            }
            toast.error(error?.message || "Error al actualizar el horario");
        },
        onSuccess: (response) => {
            const updatedSchedule = (response.data ?? response) as ShiftSchedule;
            const previousSchedules = queryClient.getQueryData<ShiftSchedule[]>(["shift-schedules"]) ?? [];
            const updatedSchedules = previousSchedules.map(sch =>
                sch.id === updatedSchedule.id ? updatedSchedule : sch
            );
            queryClient.setQueryData(["shift-schedules"], updatedSchedules);
            toast.success("Horario actualizado exitosamente");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["shift-schedules"] })
        }
    })
}


export function useDeleteShiftSchedule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteShiftSchedule(id),
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({queryKey: ["shift-schedules"]});
            const previousSchedules = queryClient.getQueryData<ShiftSchedule[]>(["shift-schedules"]) ?? [];

            queryClient.setQueryData(
                ["shift-schedules"],
                previousSchedules.filter((sch) => sch.id !== id)
            );
            return { previousSchedules }

        },
        onError: (error: any, _id, context: any) => {
            if(context?.previousSchedules) {
                queryClient.setQueryData(["shift-schedules"], context.previousSchedules);
            }
            toast.error(error?.message || "Error al eliminar el horario")
        },
        onSuccess: () => {
            toast.success("Horario eliminado exitosamente")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["shift-schedules"] })
        }
    })
}