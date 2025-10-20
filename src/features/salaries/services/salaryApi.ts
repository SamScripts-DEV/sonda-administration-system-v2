import { endpoints } from "@/lib/endpoints";
import { getErrorMessage } from "@/shared/getErrorMessage";
import { ApiResponse } from "@/shared/types/api";
import { SalaryFormData, SalaryHistory } from "../types";
import api from "@/lib/axios";


export async function fetchCurrentSalary(userId: string): Promise<ApiResponse<SalaryHistory>>{
    try {
        const response = await api.get(endpoints.salary.getCurrentSalary(userId));
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
        
    }
}

export async function fetchSalaryHistory(userId: string): Promise<ApiResponse<SalaryHistory[]>>{
    try {
        const response = await api.get(endpoints.salary.getHistory(userId));
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export async function createSalaryRecord(data: SalaryFormData): Promise<ApiResponse<SalaryHistory>>{
    try {
        const response = await api.post(endpoints.salary.createSalaryRecord, data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}