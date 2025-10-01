import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Area, createArea, CreateAreaData, deleteArea, fetchAreas, updateArea } from "@/features/area";
import { toast } from "sonner";

export function useAreas() {
  return useQuery<Area[]>({
    queryKey: ["areas"],
    queryFn: async () => {
      const res = await fetchAreas();
      return res.data ?? [];
    },
    staleTime: 1000 * 60 * 5,

  });
}

export function useCreateArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newArea: CreateAreaData) => createArea(newArea),
    onMutate: async (newArea: CreateAreaData) => {
      await queryClient.cancelQueries({ queryKey: ["areas"] });
      const previousAreas = queryClient.getQueryData<Area[]>(["areas"]) ?? [];

      queryClient.setQueryData(["areas"], [...previousAreas, { ...newArea, id: "optimistic-" + Date.now() }]);

      return { previousAreas };
    },
    onError: (_error, _newArea, context: any) => {
      if (context?.previousAreas) {
        queryClient.setQueryData(["areas"], context.previousAreas);
      }
      toast.error("Error al crear el área");
    },
    onSuccess: (response, _newArea, context: any) => {
      const createdArea = response.data ?? response;
      const previousAreas = queryClient.getQueryData<Area[]>(["areas"]) ?? [];
      const updatedAreas = previousAreas.map(area =>
        area.id.startsWith("optimistic-") ? createdArea : area
      );
      queryClient.setQueryData(["areas"], updatedAreas);
      toast.success(`Area creada con éxito`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    }
  });
}

export function useEditArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, area }: { id: string, area: CreateAreaData }) => updateArea(id, area),
    onMutate: async ({ id, area }) => {
      await queryClient.cancelQueries({ queryKey: ["areas"] });
      const previousAreas = queryClient.getQueryData<Area[]>(["areas"]) ?? [];
      const updatedAreas = previousAreas.map(a =>
        a.id === id ? { ...a, ...area } : a
      );
      queryClient.setQueryData(["areas"], updatedAreas);
      return { previousAreas };
    },
    onError: (_error, _variables, context: any) => {
      if (context?.previousAreas) {
        queryClient.setQueryData(["areas"], context.previousAreas);
      }
      toast.error("Error al actualizar el área");
    },
    onSuccess: (response, _variables, context: any) => {
      const updatedArea = (response.data ?? response) as Area;
      const previousAreas = queryClient.getQueryData<Area[]>(["areas"]) ?? [];
      const updatedAreas = previousAreas.map(a =>
        a.id === updatedArea.id ? updatedArea : a
      );
      queryClient.setQueryData(["areas"], updatedAreas);
      toast.success(`Area actualizada con éxito`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    }
  });
}

export function useDeleteArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteArea(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["areas"] });
      const previousAreas = queryClient.getQueryData<Area[]>(["areas"]) ?? [];


      const updatedAreas = previousAreas.filter(area => area.id !== id);
      queryClient.setQueryData(["areas"], updatedAreas);

      return { previousAreas };
    },
    onError: (_error, _id, context: any) => {
      if (context?.previousAreas) {
        queryClient.setQueryData(["areas"], context.previousAreas);
      }
      toast.error("Error al borrar el área.");
    },
    onSuccess: () => {
      toast.success("Área borrada exitosamente");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    }
  });
}
