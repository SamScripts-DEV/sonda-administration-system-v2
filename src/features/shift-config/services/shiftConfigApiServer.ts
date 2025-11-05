import { cookies } from "next/headers";
import { ShiftType } from "../types";
import { serverAxios } from "@/lib/axios-server";
import { ApiResponse } from "@/shared/types/api";
import { endpoints } from "@/lib/endpoints";


export async function fectchShiftConfigServer(): Promise<ApiResponse<ShiftType[]> | null> {
    try {
        const cookieStore = cookies();
        const cookieHeader = cookieStore.toString(); 

        const response = await serverAxios.get<ApiResponse<ShiftType[]>>(endpoints.shiftConfig.getShiftTypes, {
            headers: {Cookie: cookieHeader},
        })

        return response.data
        
    } catch (error: any) {
        if (error.response?.status === 401) return null 
        return null
    }
}