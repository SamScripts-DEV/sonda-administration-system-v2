
export interface Area {
  id: string
  name: string
  description?: string | null
  createdAt?: string
  updatedAt?: string
  users?: { userId: string; firstName: string; lastName: string, position: string }[]
  roles?: { roleId: string; name: string }[]
}

export interface CreateAreaData {
  name: string
  description?: string | null
}