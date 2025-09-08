import { useQuery } from "@tanstack/react-query";
import { fetchPositions, Position } from "@/features/position";


export function usePositions() {
    return useQuery<Position[]>({
        queryKey: ["positions"],
        queryFn: async () => {
            const res = await fetchPositions();
            return res.data ?? [];
        },
        staleTime: 1000 * 60 * 5,
       
    })
} 