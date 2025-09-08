import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Area, fetchAreas } from "@/features/area";

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