import { ApiResponse } from "@/shared/types/api";
import { Permission } from "../types";
import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";


export async function fetchPermissions(): Promise<ApiResponse<Permission[]>>{
    try {
        const response = await api.get<ApiResponse<Permission[]>>(endpoints.permission.getPermissions);
        return response.data;
        
    } catch (error: any){
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }
        throw new Error(error.message || "An unexpected error occurred");

    }
}
