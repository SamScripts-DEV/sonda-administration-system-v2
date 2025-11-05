import { ApiResponse } from "@/shared/types/api";
import { AreaRole, AreaRoleResponse, ShiftType, ShiftTypeDto } from "../types";
import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import { getErrorMessage } from "@/shared/getErrorMessage";


export async function fetchShiftConfig(): Promise<ApiResponse<ShiftType[]>> {
    try {
        const response = await api.get<ApiResponse<ShiftType[]>>(endpoints.shiftConfig.getShiftTypes);
        return response.data
        
    } catch (error: any) {
        throw new Error(getErrorMessage(error))    
    }
}

export async function createShiftType(data: ShiftTypeDto): Promise<ApiResponse<ShiftType>> {
    try {
        const response = await api.post<ApiResponse<ShiftType>>(endpoints.shiftConfig.createShiftType, data);
        return response.data;
        
    } catch (error: any) {
        console.log(error);
        
        throw new Error(getErrorMessage(error))
    }
}


export async function updateShiftType(id: string, data: Partial<ShiftTypeDto>): Promise<ApiResponse<ShiftType>> {
    try {
        const response = await api.patch<ApiResponse<ShiftType>>(endpoints.shiftConfig.updateShiftType(id), data);
        return response.data;
        
    } catch (error: any) {
        throw new Error(getErrorMessage(error))
    }
}

export async function activateShiftType(id: string): Promise<ApiResponse<string>> {
    try {
        const response = await api.patch<ApiResponse<string>>(endpoints.shiftConfig.activateShiftType(id))
        return response.data
        
    } catch (error: any) {
        throw new Error(getErrorMessage(error))
        
    }
}

export async function deleteShiftType(id: string): Promise<ApiResponse<string>> {
    try {
        const response = await api.delete<ApiResponse<string>>(endpoints.shiftConfig.deleteShiftType(id))
        return response.data;
    } catch (error: any) {
        console.log(error);
        
        throw new Error(getErrorMessage(error))
    }
}


export async function fetchAreaRoleData(): Promise<ApiResponse<AreaRoleResponse[]>> {
    try {
        const response = await api.get<ApiResponse<AreaRoleResponse[]>>(endpoints.shiftConfig.getAreaRoles);
        return response.data;
        
    } catch (error:any) {
        throw new Error(getErrorMessage(error))
    }
}