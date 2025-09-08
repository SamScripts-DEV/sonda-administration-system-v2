import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import { ApiResponse } from "@/shared/types/api";
import { Department } from "../types";

export async function fetchDepartments(): Promise<ApiResponse<Department[]>> {
    try {
        const response = await api.get(endpoints.departments.getDepartments);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }
        throw new Error(error.message || "An unexpected error occurred");
        
    }
}
    
