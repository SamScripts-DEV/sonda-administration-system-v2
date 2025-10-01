import api from "@/lib/axios";
import { ApiResponse } from "@/shared/types/api";
import { AssignableUserForRole, AssignableUsersByArea, Role, RoleData } from "../types";
import { endpoints } from "@/lib/endpoints";
import { Permission } from "@/features/permission";
import { getErrorMessage } from "@/shared/getErrorMessage";



export async function fetchRoles(): Promise<ApiResponse<Role[]>> {
    try {
        const response = await api.get(endpoints.roles.getRoles);
        return response.data;
    } catch (error: any) {
        throw new Error(getErrorMessage(error));
    }

}

export async function fetchPermissionsForRole(roleId: string): Promise<ApiResponse<Permission[]>> {
    try {
        const response = await api.get(endpoints.roles.getPermissionsForRole(roleId));
        return response.data;
    } catch (error: any) {
        throw new Error(getErrorMessage(error));
    }
}

export async function fetchAssignableUsersForRole(roleId: string): Promise<ApiResponse<AssignableUserForRole[] | AssignableUsersByArea[]>> {
    try {
        const response = await api.get(endpoints.roles.getAssignableUsersForRole(roleId));
        return response.data;
    } catch (error: any) {
        throw new Error(getErrorMessage(error));
    }
}

export async function createRole(data: RoleData): Promise<ApiResponse<Role>> {
    try {
        const response = await api.post(endpoints.roles.createRole, data);
        return response.data;
    } catch (error: any) {
        throw new Error(getErrorMessage(error));
    }
}

export async function updateRole(id: string, data: Partial<RoleData>): Promise<ApiResponse<Role>> {
    try {
        const response = await api.put(endpoints.roles.updateRole(id), data);
        return response.data;
    } catch (error: any) {    
        throw new Error(getErrorMessage(error));
    }
}

export async function deleteRole(id: string): Promise<ApiResponse<string>> {
    try {
        const response = await api.delete(endpoints.roles.deleteRole(id));
        return response.data;
    } catch (error: any) {
        throw new Error(getErrorMessage(error));
    }
}



export async function addUserToRole(roleId: string, userIds: string[], areaId?: string): Promise<ApiResponse<string>> {
    try {
        const response = await api.post(endpoints.roles.assignUsersToRole(roleId), { userIds, areaId });
        return response.data;
    } catch (error: any) {
        console.log(error.response?.data);
        
        throw new Error(getErrorMessage(error));
    }
}

export async function removeUserFromRole(roleId: string, userId: string, areaId?: string): Promise<ApiResponse<string>> {

    try {

        const url = areaId
            ? `${endpoints.roles.removeUserFromRole(roleId, userId)}?areaId=${areaId}`
            : endpoints.roles.removeUserFromRole(roleId, userId);
        const response = await api.delete(url);
        
        return response.data;
    } catch (error) {
        console.log(error);
        
        throw new Error(getErrorMessage(error));
        
    }
    
}



export async function addPermissionsToRole(roleId: string, permissionIds: string[]): Promise<ApiResponse<string>> {
    try {
        const response = await api.post(endpoints.roles.addPermissionsToRole(roleId), { permissionIds });
        return response.data
    } catch (error: any) {
        console.log(error);
        throw new Error(getErrorMessage(error));
    }
}

export async function removePermissionFromRole(roleId: string, permissionId: string): Promise<ApiResponse<string>> {
    try {
        const response = await api.delete(endpoints.roles.removePermissionFromRole(roleId, permissionId));
        return response.data;
    } catch (error: any) {
        console.log(error);
        throw new Error(getErrorMessage(error));
    }
}