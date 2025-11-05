export interface AreaRole {
  id: string
  roleId: string
  areaId: string
  roleName: string
  areaName: string
}


export interface ShiftTypeRoleLocal {
  id: string
  shiftTypeId: string
  areaRoleId: string
  roleName?: string
  areaName?: string
}

export interface CreateShiftTypeRoleLocalDto {
  shiftTypeId: string
  areaRoleId: string

}
// export interface ShiftTypeRoleLocal {
//   id: string
//   shiftTypeId: string
//   areaRoleId: string
// }


export interface ShiftSchedule {
  id: string
  shiftTypeId: string
  dayOfWeek: number | null
  startTime: string
  endTime: string
}

export interface ShiftType {
  id: string
  name: string
  description?: string | null
  color?: string | null
  isRotative: boolean
  isStandby: boolean
  isActive: boolean
  schedules?: ShiftSchedule[]
  roleLocals?: ShiftTypeRoleLocal[]
}

export interface ShiftTypeDto {
  name: string;
  description?: string;
  color?: string;
  isRotative?: boolean;
  isStandby?: boolean;
}

export interface ShiftScheduleDto {
  shiftTypeId: string;
  dayOfWeek: number | null;
  startTime: string;
  endTime: string;
}

export interface AreaRoleResponse {
  id: string;
  roleId: string;
  areaId: string;
  roleName: string;
  areaName: string;
}