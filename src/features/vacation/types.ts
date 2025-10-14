export type VacationRequestStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface VacationRequest {
  id: string
  userId: string
  createdById: string
  startDate: string
  endDate: string
  daysRequested: number
  status: VacationRequestStatus
  observation?: string
  createdAt: string
  updatedAt: string

  userName: string
  userEmail: string
  createdByName: string
  areaName?: string
  daysUsed: number
  daysAvailable: number
  daysRemaining: number
  daysAssigned: number
  daysExceeded: number
}

export interface VacationFormData {
  userId: string
  startDate: string
  endDate: string
  observation?: string
}