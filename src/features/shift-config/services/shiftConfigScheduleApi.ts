import { ApiResponse } from "@/shared/types/api";
import { ShiftSchedule, ShiftScheduleDto } from "../types";
import { endpoints } from "@/lib/endpoints";
import api from "@/lib/axios";
import { getErrorMessage } from "@/shared/getErrorMessage";


export async function fetchShiftSchedules(): Promise<ApiResponse<ShiftSchedule[]>> {
    try {
        const response = await api.get<ApiResponse<ShiftSchedule[]>>(endpoints.shiftSchedule.getShiftSchedules);
        return response.data
        
    } catch (error: any) {

        throw new Error(getErrorMessage(error))
        
    }
}

export async function createShiftSchedule(data: ShiftScheduleDto): Promise<ApiResponse<ShiftSchedule>> {
    try {
        const response = await api.post<ApiResponse<ShiftSchedule>>(endpoints.shiftSchedule.createShiftSchedule, data)
        return response.data
        
    } catch (error: any) {

        throw new Error(getErrorMessage(error))
        
    }
}

export async function updateShiftSchedule(id: string, data: Partial<ShiftScheduleDto>): Promise<ApiResponse<ShiftSchedule>> {
    try {
        const response = await api.patch<ApiResponse<ShiftSchedule>>(endpoints.shiftSchedule.updateShiftSchedule(id), data)
        return response.data
        
    } catch (error: any) {

        throw new Error(getErrorMessage(error))
        
    }
}

export async function deleteShiftSchedule(id: string): Promise<ApiResponse<string>> {
    try {
        const response = await api.delete<ApiResponse<string>>(endpoints.shiftSchedule.deleteShiftSchedule(id))
        return response.data
    } catch (error: any) {
        throw new Error(getErrorMessage(error))
        
    }
}