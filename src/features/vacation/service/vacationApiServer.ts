import { ApiResponse } from "@/shared/types/api";
import { VacationRequest } from "../types";
import { cookies } from "next/headers";
import { serverAxios } from "@/lib/axios-server";
import { endpoints } from "@/lib/endpoints";


export async function fetchVacationsServer(): Promise<ApiResponse<VacationRequest[]> | null> {
    try {
        const cookieStore = cookies();
        const cookieHeader = cookieStore.toString();

        const response = await serverAxios.get<ApiResponse<VacationRequest[]>>(endpoints.vacation.getVacations, {
            headers: {Cookie: cookieHeader},
        })

        return response.data
        
    } catch (error: any) {
        if (error.response?.status === 401) return null
        return null
        
    }
}