import { cookies } from "next/headers";
import { ApiResponse } from "@/shared/types/api";
import { Role } from "../types";
import { serverAxios } from "@/lib/axios-server";
import { endpoints } from "@/lib/endpoints";

export async function fetchRolesServer(): Promise<ApiResponse<Role[]> | null> {
    try {
        const cookieStore = cookies()
        const cookieHeader = cookieStore.toString()

        const response = await serverAxios.get<ApiResponse<Role[]>>(endpoints.roles.getRoles, {
            headers: { Cookie: cookieHeader }
        })

        return response.data

    } catch (error: any) {
        if (error.response?.status == 401) return null
        return null


    }
}