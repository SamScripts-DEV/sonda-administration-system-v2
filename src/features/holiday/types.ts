export interface Holiday {
  id: string
  name: string
  startDate: string
  endDate: string
  observation?: string | null
  createdAt: string
  updatedAt: string
}

export interface HolidayFormData {
    name: string
    startDate: string
    endDate: string
    observation?: string | null
}