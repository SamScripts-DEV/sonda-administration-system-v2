import { ApiResponse } from "@/shared/types/api";
import { VacationFormData, VacationRequest } from "../types";
import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import { getErrorMessage } from "@/shared/getErrorMessage";


export async function fetchVacations(): Promise<ApiResponse<VacationRequest[]>> {
    try {
        const response = await api.get<ApiResponse<VacationRequest[]>>(endpoints.vacation.getVacations);

        return response.data
        
    } catch (error: any) {
        throw new Error(getErrorMessage(error));
        
    }

}

export async function createVacationRequest(formdata: VacationFormData): Promise<ApiResponse<VacationRequest>> {
    try {
        const response = await api.post(endpoints.vacation.createVacationRequest, formdata);

        return response.data
        
    } catch (error: any) {
        throw new Error(getErrorMessage(error)); 
    }
}

export async function updateVacationRequest(id: string, formdata: Partial<VacationFormData>): Promise<ApiResponse<VacationRequest>> {
    try {
        const response = await api.patch(endpoints.vacation.updateVacationRequest(id), formdata);
        return response.data
    } catch (error: any) {
        throw new Error(getErrorMessage(error)); 
    }
}

export async function approveOrRejectVacationRequest(id: string, data: {action: 'APPROVED' | 'REJECTED', observation?: string}): Promise<ApiResponse<VacationRequest>> {
    try {
        const response = await api.patch(endpoints.vacation.approveOrRejectVacationRequest(id), data);
        return response.data
    } catch (error: any) {
        throw new Error(getErrorMessage(error)); 
    }
}

export async function deleteVacationRequest(id: string): Promise<ApiResponse<void>> {
    try {
        const response = await api.delete(endpoints.vacation.deleteVacationRequest(id));
        return response.data
    } catch (error: any) {   
        throw new Error(getErrorMessage(error)); 
    }
}