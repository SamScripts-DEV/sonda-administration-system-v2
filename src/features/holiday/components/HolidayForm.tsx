"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Calendar, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import {type Holiday} from "@/features/holiday"


interface HolidayFormData {
  name: string
  startDate: string
  endDate: string
  observation?: string
}

interface HolidayFormProps {
  holiday?: Holiday
  onSubmit: (data: HolidayFormData) => void
  onCancel: () => void
}

export function HolidayForm({ holiday, onSubmit, onCancel }: HolidayFormProps) {
  const [formData, setFormData] = useState<HolidayFormData>({
    name: holiday?.name || "",
    startDate: holiday?.startDate || "",
    endDate: holiday?.endDate || "",
    observation: holiday?.observation || "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof HolidayFormData, string>>>({})
  const [dateError, setDateError] = useState<string>("")

  // Validate dates whenever they change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)

      if (end < start) {
        setDateError("La fecha de fin no puede ser anterior a la fecha de inicio")
      } else {
        setDateError("")
      }
    }
  }, [formData.startDate, formData.endDate])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof HolidayFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
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
        newErrors.endDate = "La fecha de fin no puede ser anterior a la fecha de inicio"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
    const startDateISO = new Date(`${formData.startDate}T00:00:00`).toISOString();
    const endDateISO = new Date(`${formData.endDate}T23:59:59`).toISOString();

    onSubmit({
      ...formData,
      startDate: startDateISO,
      endDate: endDateISO,
    });
  }
  }

  const handleChange = (field: keyof HolidayFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Calculate duration
  const calculateDuration = () => {
    if (formData.startDate && formData.endDate && !dateError) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      return days
    }
    return null
  }

  const duration = calculateDuration()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Nombre del Feriado <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Ej: Día de la Independencia"
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      {/* Date Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-medium">
            Fecha de Inicio <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className={`pl-10 ${errors.startDate ? "border-destructive" : ""}`}
            />
          </div>
          {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-sm font-medium">
            Fecha de Fin <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className={`pl-10 ${errors.endDate ? "border-destructive" : ""}`}
            />
          </div>
          {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
        </div>
      </div>

      {/* Date Error Alert */}
      {dateError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{dateError}</AlertDescription>
        </Alert>
      )}

      {/* Duration Display */}
      {duration !== null && !dateError && (
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            Duración: <span className="font-semibold">{duration === 1 ? "1 día" : `${duration} días`}</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Observation Field */}
      <div className="space-y-2">
        <Label htmlFor="observation" className="text-sm font-medium">
          Observación
        </Label>
        <Textarea
          id="observation"
          value={formData.observation}
          onChange={(e) => handleChange("observation", e.target.value)}
          placeholder="Información adicional sobre el feriado (opcional)"
          rows={3}
        />
        <p className="text-xs text-muted-foreground">Opcional: Agrega notas o detalles adicionales</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!!dateError}>
          {holiday ? "Actualizar Feriado" : "Crear Feriado"}
        </Button>
      </div>
    </form>
  )
}
