import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import { ApiResponse } from "@/shared/types/api";
import { Area } from "@/features/area";

export async function fetchAreas(): Promise<ApiResponse<Area[]>> {
    try {
        const response = await api.get<ApiResponse<Area[]>>(endpoints.areas.getAreas);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }
        throw new Error(error.message || "An unexpected error occurred");
        
    }
}