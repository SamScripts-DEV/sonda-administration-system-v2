import ShiftConfigPage from "@/app/(sonda)/shift-config/page";
import { updateArea } from "@/features/area";
import { addPermissionsToRole } from "@/features/role/services/rolApi";
import { create } from "domain";
import { get } from "http";


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
        
    },
    holiday: {
        getHolidays: "/holidays",
        createHoliday: "/holidays",
        updateHoliday: (id: string) => `/holidays/${id}`,
        deleteHoliday: (id: string) => `/holidays/${id}`,
    },
    salary: {
        getCurrentSalary: (userId: string) => `/salary/current/${userId}`,
        getHistory: (userId: string) => `/salary/history/${userId}`,
        getAtDateHistory: (userId: string, date: string) => `/salary/history/${userId}?date=${date}`,
        getInPeriodHistory: (userId: string, from: string, to: string) => `/salary/history/${userId}?from=${from}&to=${to}`,
        createSalaryRecord: "/salary",
    },
    shiftConfig: {
        getShiftTypes: "/shift-type",
        getShiftTypesById: (shiftTypeId: string) => `/shift-type/${shiftTypeId}`,
        createShiftType: "/shift-type",
        updateShiftType: (shiftTypeId: string) => `/shift-type/${shiftTypeId}`,
        activateShiftType: (shiftTypeId: string) => `/shift-type/activate/${shiftTypeId}`,
        deleteShiftType: (shiftTypeId: string) => `/shift-type/${shiftTypeId}`,
        getAreaRoles: "/area-role",
    },
    shiftSchedule: {
        createShiftSchedule: "/shift-schedule",
        getShiftSchedules: "/shift-schedule",
        updateShiftSchedule: (shiftScheduleId: string) => `/shift-schedule/${shiftScheduleId}`,
        deleteShiftSchedule: (shiftScheduleId: string) => `/shift-schedule/${shiftScheduleId}`,
    },
    shiftRelationToRole: {
        createShiftRelationToRole: "/shift-type-role-local",
        getShiftRelationsToRole: "/shift-type-role-local",
        updateShiftRelationToRole: (relationId: string) => `/shift-type-role-local/${relationId}`,
        deleteShiftRelationToRole: (relationId: string) => `/shift-type-role-local/${relationId}`,
    }


}