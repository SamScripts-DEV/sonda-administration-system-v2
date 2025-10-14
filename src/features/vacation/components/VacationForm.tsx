"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/shared/components/ui/select"
import { Calendar } from "lucide-react"
import { type VacationRequest, type VacationFormData } from "@/features/vacation"
import { useUsersForSelect } from "@/features/user"


interface VacationFormProps {
  vacation?: VacationRequest
  onSubmit: (data: VacationFormData) => void
  onCancel: () => void
}


export function VacationForm({ vacation, onSubmit, onCancel }: VacationFormProps) {
  const [formData, setFormData] = useState<VacationFormData>({
    userId: vacation?.userId || "",
    startDate: vacation?.startDate || "",
    endDate: vacation?.endDate || "",
    observation: vacation?.observation || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: usersForSelect = [], isLoading } = useUsersForSelect()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    const newErrors: Record<string, string> = {}

    if (!formData.userId) {
      newErrors.userId = "El usuario es requerido"
    }

    if (!formData.startDate) {
      newErrors.startDate = "La fecha de inicio es requerida"
    }

    if (!formData.endDate) {
      newErrors.endDate = "La fecha de fin es requerida"
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)

      if (end < start) {
        newErrors.endDate = "La fecha de fin debe ser posterior a la fecha de inicio"
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    }
    return 0
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userId">
            Usuario <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.userId}
            onValueChange={(value) => setFormData({ ...formData, userId: value })}
            disabled={isLoading}
          >
            <SelectTrigger id="userId" className={`w-full ${errors.userId ? "border-destructive" : ""}`}>
              <SelectValue placeholder={isLoading ? "Cargando..." : "Selecciona un usuario"} />
            </SelectTrigger>
            <SelectContent className="w-full">
              {usersForSelect.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.fullNames}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.userId && <p className="text-sm text-destructive">{errors.userId}</p>}
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="startDate">
            Fecha de Inicio <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className={errors.startDate ? "border-destructive" : ""}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label htmlFor="endDate">
            Fecha de Fin <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className={errors.endDate ? "border-destructive" : ""}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
        </div>

        {/* Days Calculation */}
        {formData.startDate && formData.endDate && calculateDays() > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900">
              Días solicitados: <span className="text-lg font-bold">{calculateDays()}</span>
            </p>
          </div>
        )}

        {/* Observation */}
        <div className="space-y-2">
          <Label htmlFor="observation">Observación</Label>
          <Textarea
            id="observation"
            placeholder="Motivo de la solicitud (opcional)"
            value={formData.observation}
            onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
            rows={4}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{vacation ? "Actualizar Solicitud" : "Crear Solicitud"}</Button>
      </div>
    </form>
  )
}
