import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { approveOrRejectVacationRequest, createVacationRequest, deleteVacationRequest, fetchVacations, updateVacationRequest, VacationFormData, VacationRequest } from "@/features/vacation";
import { toast } from "sonner";

export function useFetchVacations() {
    return useQuery({
        queryKey: ["vacations"],
        queryFn: async () => {
            const res = await fetchVacations();
            return res.data ?? [];
        },
        staleTime: 1000 * 60 * 5,
    })
}

export function useCreateVacation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: VacationFormData) => createVacationRequest(data),
        onMutate: async (newVacation: VacationFormData) => {
            await queryClient.cancelQueries({ queryKey: ["vacations"] });
            const previousVacations = queryClient.getQueryData<VacationRequest[]>(["vacations"]) ?? [];
            const optimisticId = "optimistic-" + Date.now();

            queryClient.setQueryData(["vacations"], [
                ...previousVacations,
                { ...newVacation, id: optimisticId, status: "PENDING" }
            ]);

            return { previousVacations, optimisticId };
        },
        onError: (_error, _newVacation, context: any) => {
            if (context?.previousVacations) {
                queryClient.setQueryData(["vacations"], context.previousVacations);
            }
            toast.error("Error al crear la solicitud de vacaciones.");
        },
        onSuccess: (response, _newVacation, context: any) => {
            const createdVacation = response.data ?? response;
            const previousVacations = queryClient.getQueryData<VacationRequest[]>(["vacations"]) ?? [];
            const updatedVacations = previousVacations.map(vac =>
                vac.id === context.optimisticId ? createdVacation : vac
            );
            queryClient.setQueryData(["vacations"], updatedVacations);
            toast.success("Solicitud de vacaciones creada exitosamente");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["vacations"] });
        }
    });
}

export function useApproveOrRejectVacation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, action, observation }: { id: string; action: "APPROVED" | "REJECTED"; observation?: string }) =>
            approveOrRejectVacationRequest(id, { action, observation }),
        onMutate: async ({ id, action }) => {
            await queryClient.cancelQueries({ queryKey: ["vacations"] });
            const previousVacations = queryClient.getQueryData<VacationRequest[]>(["vacations"]) ?? [];

            queryClient.setQueryData(
                ["vacations"],
                previousVacations.map(vac =>
                    vac.id === id ? { ...vac, status: action === "APPROVED" ? "APPROVED" : "REJECTED" } : vac
                )
            );
            return { previousVacations };
        },
        onError: (_error, _vars, context: any) => {
            if (context?.previousVacations) {
                queryClient.setQueryData(["vacations"], context.previousVacations);
            }
            toast.error("Error al actualizar el estado de la solicitud.");
        },
        onSuccess: (response, { action }) => {
            const updatedVacation = (response.data ?? response) as VacationRequest;
            const previousVacations = queryClient.getQueryData<VacationRequest[]>(["vacations"]) ?? [];
            queryClient.setQueryData(
                ["vacations"],
                previousVacations.map(vac =>
                    vac.id === updatedVacation.id ? updatedVacation : vac
                )
            );
            toast.success(
                action === "APPROVED"
                    ? "Solicitud aprobada exitosamente"
                    : "Solicitud rechazada exitosamente"
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["vacations"] });
        },
    });
}

export function useEditVacation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<VacationFormData> }) =>
            updateVacationRequest(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ["vacations"] });
            const previousVacations = queryClient.getQueryData<VacationRequest[]>(["vacations"]) ?? [];

            const updatedVacations = previousVacations.map(vac =>
                vac.id === id ? { ...vac, ...data } : vac
            );
            queryClient.setQueryData(["vacations"], updatedVacations);
            return { previousVacations };
        },
        onError: (_error, _variables, context: any) => {
            if (context?.previousVacations) {
                queryClient.setQueryData(["vacations"], context.previousVacations);
            }
            toast.error("Error al actualizar la solicitud.");
        },
        onSuccess: (response) => {
            const updatedVacation = (response.data ?? response) as VacationRequest;
            const previousVacations = queryClient.getQueryData<VacationRequest[]>(["vacations"]) ?? [];
            const updatedVacations = previousVacations.map(vac =>
                vac.id === updatedVacation.id ? updatedVacation : vac
            );
            queryClient.setQueryData(["vacations"], updatedVacations);
            toast.success("Solicitud actualizada exitosamente");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["vacations"] });
        }
    });
}

export function useDeleteVacation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteVacationRequest(id),
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ["vacations"] });
            const previousVacations = queryClient.getQueryData<VacationRequest[]>(["vacations"]) ?? [];
            queryClient.setQueryData(
                ["vacations"],
                previousVacations.filter((vac) => vac.id !== id)
            );
            return { previousVacations };
        },
        onError: (_error, _id, context: any) => {
            if (context?.previousVacations) {
                queryClient.setQueryData(["vacations"], context.previousVacations);
            }
            toast.error("Error al eliminar la solicitud.");
        },
        onSuccess: () => {
            toast.success("Solicitud eliminada exitosamente");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["vacations"] });
        },
    });
}