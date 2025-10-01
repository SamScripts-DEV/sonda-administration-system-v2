export interface Role {
  id: string
  name: string
  description?: string | null
  scope: "GLOBAL" | "LOCAL"
  areaIds?: string[]
  createdAt?: string
  updatedAt?: string
  users?: AssignableUser[]
  permissions?: { id: string; name: string }[]
}

export interface AssignableUser {
  userId: string
  firstName: string
  lastName: string
  areaId: string
  areaName: string
}

export interface AssignableUsersByArea {
  areaId: string
  areaName: string
  users: AssignableUserForRole[]
}


export interface AssignableUserForRole {
    userId: string;
    firstName: string;
    lastName: string;
    areas: { areaId: string; areaName: string; }[];
}


export interface RoleData {
  name: string
  description?: string | null
  scope: "GLOBAL" | "LOCAL"
  areaIds?: string[]
}


export interface AddUserToRoleSelected {
  userIds: string[]
  areaId?: string
}