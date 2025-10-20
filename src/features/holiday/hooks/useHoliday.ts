import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createHoliday, deleteHoliday, fetchHolidays, updateHoliday } from "../service/holidayApi";
import { Holiday, HolidayFormData } from "../types";
import { toast } from "sonner";



export function useFetchHolidays () {
    return useQuery({
        queryKey: ["holidays"],
        queryFn: async () => {
            const res = await fetchHolidays()
            return res.data ?? [] 

        },
        staleTime: 5 * 60 * 1000, 
    })
}

export function useCreateHoliday() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: HolidayFormData) => createHoliday(data),
        onMutate: async (newHoliday: HolidayFormData) => {
            await queryClient.cancelQueries({ queryKey: ["holidays"] });
            const previousHolidays = queryClient.getQueryData<Holiday[]>(["holidays"]) ?? [];
            const optimisticId = "optimistic-" + Date.now();

            queryClient.setQueryData(["holidays"], [
                ...previousHolidays,
                { ...newHoliday, id: optimisticId }
            ]);

            return { previousHolidays, optimisticId };
        },
        onError: (_error, _newHoliday, context: any) => {
            if (context?.previousHolidays) {
                queryClient.setQueryData(["holidays"], context.previousHolidays);
            }
            toast.error("Error al crear el feriado.");
        },
        onSuccess: (response, _newHoliday, context: any) => {
            const createdHoliday = response.data ?? response;
            const previousHolidays = queryClient.getQueryData<Holiday[]>(["holidays"]) ?? [];
            const updatedHolidays = previousHolidays.map(hol =>
                hol.id === context.optimisticId ? createdHoliday : hol
            );
            queryClient.setQueryData(["holidays"], updatedHolidays);
            toast.success("Feriado creado exitosamente");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["holidays"] });
        }
    });
}

export function useEditHoliday() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<HolidayFormData> }) =>
            updateHoliday(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ["holidays"] });
            const previousHolidays = queryClient.getQueryData<Holiday[]>(["holidays"]) ?? [];

            const updatedHolidays = previousHolidays.map(hol =>
                hol.id === id ? { ...hol, ...data } : hol
            );
            queryClient.setQueryData(["holidays"], updatedHolidays);
            return { previousHolidays };
        },
        onError: (_error, _variables, context: any) => {
            if (context?.previousHolidays) {
                queryClient.setQueryData(["holidays"], context.previousHolidays);
            }
            toast.error("Error al actualizar el feriado.");
        },
        onSuccess: (response) => {
            const updatedHoliday = (response.data ?? response) as Holiday;
            const previousHolidays = queryClient.getQueryData<Holiday[]>(["holidays"]) ?? [];
            const updatedHolidays = previousHolidays.map(hol =>
                hol.id === updatedHoliday.id ? updatedHoliday : hol
            );
            queryClient.setQueryData(["holidays"], updatedHolidays);
            toast.success("Feriado actualizado exitosamente");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["holidays"] });
        }
    });
}

export function useDeleteHoliday() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteHoliday(id),
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ["holidays"] });
            const previousHolidays = queryClient.getQueryData<Holiday[]>(["holidays"]) ?? [];
            queryClient.setQueryData(
                ["holidays"],
                previousHolidays.filter((hol) => hol.id !== id)
            );
            return { previousHolidays };
        },
        onError: (_error, _id, context: any) => {
            if (context?.previousHolidays) {
                queryClient.setQueryData(["holidays"], context.previousHolidays);
            }
            toast.error("Error al eliminar el feriado.");
        },
        onSuccess: () => {
            toast.success("Feriado eliminado exitosamente");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["holidays"] });
        },
    });
}