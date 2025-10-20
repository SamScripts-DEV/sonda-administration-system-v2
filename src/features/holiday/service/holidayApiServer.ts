import { cookies } from "next/headers";
import { Holiday } from "../types";
import { serverAxios } from "@/lib/axios-server";
import { endpoints } from "@/lib/endpoints";
import { ApiResponse } from "@/shared/types/api";

export async function fetchHolidaysServer(): Promise<ApiResponse<Holiday[]> | null> {

    try {
        const cookieStore = cookies();
        const cookieHeader = cookieStore.toString();

        const response = await serverAxios.get<ApiResponse<Holiday[]>>(endpoints.holiday.getHolidays, {
            headers: {Cookie: cookieHeader}
        })
        return response.data

    } catch (error: any) {
        if (error.response?.status === 401) return null
        return null

    }
}