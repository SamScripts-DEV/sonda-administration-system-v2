import { ApiResponse } from "@/shared/types/api";
import { User } from "../types";
import { cookies } from "next/headers";
import { serverAxios } from "@/lib/axios-server";
import { endpoints } from "@/lib/endpoints";

export async function fetchUsersServer(): Promise<ApiResponse<User[]> | null> {
    try {
        const cookieStore = cookies();
        const cookieHeader = cookieStore.toString();

        const response = await serverAxios.get<ApiResponse<User[]>>(endpoints.users.getUsers, {
            headers: {Cookie: cookieHeader},
        })

        return response.data
        
    } catch (error: any) {
        if (error.response?.status === 401) return null
        return null
    }
}