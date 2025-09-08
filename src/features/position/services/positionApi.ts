import { ApiResponse } from "@/shared/types/api";
import { Position } from "../types";
import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";


export async function fetchPositions(): Promise<ApiResponse<Position[]>> {
    try {
        const response = await api.get(endpoints.positions.getPositions)
        return response.data
        
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message);
        }
        throw new Error("An unexpected error occurred");
    }
}