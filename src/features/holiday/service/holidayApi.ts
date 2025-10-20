import { ApiResponse } from "@/shared/types/api";
import { Holiday, HolidayFormData } from "../types";
import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import { getErrorMessage } from "@/shared/getErrorMessage";


export async function fetchHolidays(): Promise<ApiResponse<Holiday[]>> {
    try {
        const response = await api.get<ApiResponse<Holiday[]>>(endpoints.holiday.getHolidays)
        return response.data
        
    } catch (error: any) {
        throw new Error(getErrorMessage(error))
        
    }
}

export async function createHoliday(data: HolidayFormData): Promise<ApiResponse<Holiday>> {
    try {
        const response = await api.post<ApiResponse<Holiday>>(endpoints.holiday.createHoliday, data)
        return response.data
        
    } catch (error) {
        throw new Error(getErrorMessage(error))
    }
}

export async function updateHoliday(id: string, data: Partial<HolidayFormData>): Promise<ApiResponse<Holiday>> {
    try {
        const response = await api.put<ApiResponse<Holiday>>(endpoints.holiday.updateHoliday(id), data)
        return response.data
    } catch (error) {
        throw new Error(getErrorMessage(error))
    }
}

export async function deleteHoliday(id: string): Promise<ApiResponse<string>> {
    try {
        const response = await api.delete<ApiResponse<string>>(endpoints.holiday.deleteHoliday(id))
        return response.data
    } catch (error) {
        throw new Error(getErrorMessage(error))
    }   
}