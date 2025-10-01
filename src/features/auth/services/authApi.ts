import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import { LoginDto, UserPayload } from '@/features/auth'
import { ApiResponse } from "@/shared/types/api";
import { getErrorMessage } from "@/shared/getErrorMessage";

export async function login(data: LoginDto): Promise<ApiResponse<string>>{
    try {
        const response = await api.post(endpoints.auth.login, data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
        
    }
}

export async function logout(): Promise<ApiResponse<string>>{
    try {
        const response = await api.post(endpoints.auth.logout);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function checkAuth(): Promise<ApiResponse<string>>{
    try {
        const response = await api.get(endpoints.auth.checkAuth);
        return response.data;
    }   catch (error) {
        throw new Error(getErrorMessage(error));
    }
}


export async function userData(): Promise<ApiResponse<UserPayload>>{
    try {
        const response = await api.get(endpoints.auth.getPayload);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
        
    }
}