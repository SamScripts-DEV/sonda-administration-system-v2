import { useQuery } from "@tanstack/react-query";
import { Department, fetchDepartments } from "@/features/department";


export function useDepartments() {
    return useQuery<Department[]>({
        queryKey: ["departments"],
        queryFn: async () => {
            const res = await fetchDepartments();
            return res.data ?? [];
        },
        staleTime: 1000 * 60 * 5,  
    })

}