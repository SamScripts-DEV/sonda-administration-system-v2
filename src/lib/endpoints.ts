import { addPermissionsToRole } from "@/features/role/services/rolApi";


export const endpoints = {
    auth: {
        login: "/auth/login",
        logout: "/auth/logout",
        getPayload: "/auth/me",
        checkAuth: "/auth/check-auth",
    },
    users: {
        getUsers: "/users",
        getUsersForSelect: "/users/for-select",

        createUser: "/users",
        updateUser: (userId: string) => `/users/${userId}`,
        deleteUser: (userId: string) => `/users/${userId}/delete`,
        activateUser: (userId: string) => `/users/${userId}/activate`,
    },
    areas: {
        getAreas: "/areas",
        createArea: "/areas",
        updateArea: (areaId: string) => `/areas/${areaId}`,
        deleteArea: (areaId: string) => `/areas/${areaId}/delete`,
    },
    departments: {
        getDepartments: "/departments",
    },
    positions: {
        getPositions: "/positions",
    },
    roles: {
        getRoles: "/roles",
        getPermissionsForRole: (roleId: string) => `/roles/${roleId}/permissions`,
        getAssignableUsersForRole: (roleId: string) => `/roles/${roleId}/assignable-users`,
        createRole: "/roles",
        updateRole: (roleId: string) => `/roles/${roleId}`,
        deleteRole: (roleId: string) => `/roles/${roleId}/delete`,
        assignUsersToRole: (roleId: string) => `/roles/${roleId}/users`,
        removeUserFromRole: (roleId: string, userId: string) => `/roles/${roleId}/users/${userId}`,

        addPermissionsToRole: (roleId: string) => `/roles/${roleId}/permissions`,
        removePermissionFromRole: (roleId: string, permissionId: string) => `/roles/${roleId}/permissions/${permissionId}`
    },
    permission: {
        getPermissions: "/permissions",

        
    },
    vacation: {
        getVacations: "/vacations",
        createVacationRequest: "/vacations",
        updateVacationRequest: (id: string) => `/vacations/${id}`,
        approveOrRejectVacationRequest: (id: string) => `/vacations/approve/${id}`,
        deleteVacationRequest: (id: string) => `/vacations/${id}`,
        
    }

}