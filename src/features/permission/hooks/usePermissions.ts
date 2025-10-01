import { Role } from "@/features/role";
import { useQuery } from "@tanstack/react-query";
import { Permission } from "../types";
import { fetchPermissions } from "../services/permissionApi";


export function useFetchPermissions() {
    return useQuery<Permission[]>({
        queryKey: ["permissions"],
        queryFn: async () => {
            const res = await fetchPermissions();
            return res.data ?? [];
        },
        staleTime: 1000 * 60 * 10,
    })
}