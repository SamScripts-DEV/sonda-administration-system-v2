export interface FindAllForSelectType {
    id: string;
    fullNames: string;
    imageUrl: string | null;
}

export interface UserRoles {
  global: string[]
  local: { area: string; role: string }[]
}

export interface UserRoleDetailed {
  id: string;
  name: string;
}

export interface UserLocalRoleDetailed {
  area: { id: string; name: string };
  role: { id: string; name: string };
}

export interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string[]
  active: boolean
  nationalId: string
  imageUrl?: string
  address: string
  city: string
  country: string
  province?: string;
  departmentId: string
  positionId?: string
  createdAt: string
  roles?: UserRoles
  rolesDetailed?: {
    global: UserRoleDetailed[];
    local: UserLocalRoleDetailed[];
  }
  areas: string[]
  areasDetailed?: {
    id: string;
    name: string;
  }[]
  department?: string
  position?: string
  technicalLevel?: string
  technicalLevelId?: string
}

export interface UserFormData {
  firstName: string
  lastName: string
  username: string
  email: string
  passwordHash: string
  phone: string[]
  active: boolean
  nationalId: string
  image?: string
  address: string
  city: string
  country: string
  province: string
  areaIds: string[]
  departmentId: string
  positionId?: string
}

export interface TechnicalLevel{
  id: string;
  name: string;
  description?: string;
}

export interface CreateRelationUserTechnicalLevelDto {
  userId: string;
  technicalLevelId: string;
}

export interface UserTechnicalLevelResponse {
  id: string;
  userId: string;
  technicalLevelId: string;
  userName?: string;
  technicalLevelName?: string;
}