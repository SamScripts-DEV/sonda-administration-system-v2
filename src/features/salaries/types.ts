export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  imageUrl?: string
}

export interface SalaryHistory {
  id: string
  userId: string
  amount: number
  validFrom: string
  validTo?: string | null
  comment?: string | null
  updatedBy: string
  createdAt: string
  updatedAt: string
}

export interface SalaryFormData {
  userId: string
  amount: number
  validFrom: string
  validTo?: string
  comment?: string
}