import { ApiResponse } from "@/shared/types/api";
import { CreateShiftTypeRoleLocalDto, ShiftTypeRoleLocal } from "../types";
import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import { getErrorMessage } from "@/shared/getErrorMessage";



export async function createShiftConfigRelationToRole(data: CreateShiftTypeRoleLocalDto): Promise<ApiResponse<ShiftTypeRoleLocal>> {
    try {
        const response = await api.post<ApiResponse<ShiftTypeRoleLocal>>(endpoints.shiftRelationToRole.createShiftRelationToRole, data);
        return response.data
        
    } catch (error: any) {
        throw new Error(getErrorMessage(error))
        
    }
}

export async function fetchShiftsConfigRelationsToRole(): Promise<ApiResponse<ShiftTypeRoleLocal[]>> {
    try {
        const response = await api.get<ApiResponse<ShiftTypeRoleLocal[]>>(endpoints.shiftRelationToRole.getShiftRelationsToRole);
        return response.data
        
    } catch (error: any) {
        throw new Error(getErrorMessage(error))
    }
}


export async function updateShiftConfigRelationToRole(id: string, data: Partial<CreateShiftTypeRoleLocalDto>): Promise<ApiResponse<ShiftTypeRoleLocal>> {
    try {
        const response = await api.patch<ApiResponse<ShiftTypeRoleLocal>>(endpoints.shiftRelationToRole.updateShiftRelationToRole(id), data);
        return response.data
        
    } catch (error: any) {
        throw new Error(getErrorMessage(error))
        
    }
}

export async function deleteShiftConfigRelationToRole(id: string): Promise<ApiResponse<string>> {
    try {
        const response = await api.delete<ApiResponse<string>>(endpoints.shiftRelationToRole.deleteShiftRelationToRole(id));
        return response.data
        
    } catch (error: any) {
        throw new Error(getErrorMessage(error))
        
    }
}