import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import { ApiResponse } from "@/shared/types/api";
import { FindAllForSelectType, TechnicalLevel, User, CreateRelationUserTechnicalLevelDto, UserTechnicalLevelResponse } from "../types";
import { getErrorMessage } from "@/shared/getErrorMessage";

export async function fetchUsers(): Promise<ApiResponse<User[]>> {
    try {
        const response = await api.get<ApiResponse<User[]>>(endpoints.users.getUsers);
        return response.data;

    } catch (error: any) {

        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }
        throw new Error(error.message || "An unexpected error occurred");

    }
}

export async function fetchUsersForSelect(): Promise<ApiResponse<FindAllForSelectType[]>> {
    try {
        const response = await api.get<ApiResponse<FindAllForSelectType[]>>(endpoints.users.getUsersForSelect);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }
        throw new Error(error.message || "An unexpected error occurred");
    }
}

export async function createUser(formData: FormData): Promise<ApiResponse<User>> {
    try {
        const response = await api.post<ApiResponse<User>>(endpoints.users.createUser,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        return response.data;

    } catch (error: any) {
        console.log(error);

        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }
        throw new Error(error.message || "An unexpected error occurred");
    }
}

export async function updateUser(userId: string, formData: FormData): Promise<ApiResponse<User>> {
    try {
        const response = await api.patch<ApiResponse<User>>(endpoints.users.updateUser(userId),
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        return response.data;

    } catch (error: any) {      
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }
        throw new Error(error.message || "An unexpected error occurred");

    }
}

export async function deleteUser(userId: string): Promise<ApiResponse<string>> {
    try {
        const response = await api.delete<ApiResponse<string>>(endpoints.users.deleteUser(userId));
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }
        throw new Error(error.message || "An unexpected error occurred");

    }
}

export async function activateUser(userId: string): Promise<ApiResponse<string>> {
    try {
        const response = await api.patch<ApiResponse<string>>(endpoints.users.activateUser(userId));
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }
        throw new Error(error.message || "An unexpected error occurred");
    }

}


export async function fetchTechnicalLevelForUsers(): Promise<ApiResponse<TechnicalLevel[]>>  {
    try {
        const response = await api.get<ApiResponse<TechnicalLevel[]>>(endpoints.users.technicalLevel.getTechnicalLevelForUsers);
        return response.data;
        
    } catch (error: any) {
        throw new Error(getErrorMessage(error))
    }

}



export async function createRelationUserTechnicalLevel(data: CreateRelationUserTechnicalLevelDto): Promise<ApiResponse<UserTechnicalLevelResponse>> {
    try {
        const response = await api.post<ApiResponse<UserTechnicalLevelResponse>>(endpoints.users.technicalLevel.createRelationUserTechnicalLevel, data);
        return response.data
        
    } catch (error: any) {
        throw new Error(getErrorMessage(error))
        
    }
}