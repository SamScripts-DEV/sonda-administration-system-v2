export interface Role {
  id: string
  name: string
  description?: string | null
  scope: "GLOBAL" | "LOCAL"
  towerIds?: string[]
  createdAt?: string
  updatedAt?: string
  users?: AssignableUser[]
  permissions?: { id: string; name: string }[]
}

export interface AssignableUser {
  userId: string
  firstName: string
  lastName: string
  towerId: string
  towerName: string
}

export interface AssignableUsersByTower {
  towerId: string
  towerName: string
  users: AssignableUser[]
}
export interface Permission {
  id: string
  name: string
  description?: string
}