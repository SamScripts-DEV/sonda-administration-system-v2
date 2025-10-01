import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import { ApiResponse } from "@/shared/types/api";
import { Area, CreateAreaData } from "@/features/area";

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

export async function createArea(data: CreateAreaData): Promise<ApiResponse<Area>> {
    try {
        const response = await api.post<ApiResponse<Area>>(endpoints.areas.createArea, data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }
        throw new Error(error.message || "An unexpected error occurred");
    }
}


export async function updateArea(id: string, data: Partial<CreateAreaData>): Promise<ApiResponse<Area>> {
    try {
        const response = await api.put<ApiResponse<Area>>(endpoints.areas.updateArea(id), data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }
        throw new Error(error.message || "An unexpected error occurred");
    }
}


export async function deleteArea(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
        const response = await api.delete<ApiResponse<{ message: string }>>(endpoints.areas.deleteArea(id));
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }
        throw new Error(error.message || "An unexpected error occurred");
    }
}

