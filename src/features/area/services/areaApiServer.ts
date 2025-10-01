import { serverAxios } from "@/lib/axios-server";
import { ApiResponse } from "@/shared/types/api";
import { cookies } from "next/headers";
import { Area } from "@/features/area";
import { endpoints } from "@/lib/endpoints";

export async function fetchAreasServer(): Promise<ApiResponse<Area[]> | null>{
    try {
        const cookieStore = cookies();
        const cookieHeader = cookieStore.toString();
        const response = await serverAxios.get<ApiResponse<Area[]>>(endpoints.areas.getAreas,{
            headers: { Cookie: cookieHeader }
        })
        return response.data;
        
    } catch (error: any) {
        if (error.response?.status == 401) return null
        return null
        
    }
}