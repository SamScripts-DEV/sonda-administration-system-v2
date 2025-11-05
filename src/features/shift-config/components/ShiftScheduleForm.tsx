"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { ShiftSchedule, ShiftScheduleDto } from "../types"

interface ShiftScheduleFormProps {
  schedule?: ShiftSchedule
  shiftTypeId: string
  onSubmit: (data: ShiftScheduleDto) => void
  onCancel: () => void
}

const DAYS_OF_WEEK = [
  { value: "null", label: "Todos los días" },
  { value: "0", label: "Lunes" },
  { value: "1", label: "Martes" },
  { value: "2", label: "Miércoles" },
  { value: "3", label: "Jueves" },
  { value: "4", label: "Viernes" },
  { value: "5", label: "Sábado" },
  { value: "6", label: "Domingo" },
]

export function ShiftScheduleForm({ schedule, shiftTypeId, onSubmit, onCancel }: ShiftScheduleFormProps) {
  const [formData, setFormData] = useState({
    shiftTypeId: schedule?.shiftTypeId || shiftTypeId,
    dayOfWeek: schedule?.dayOfWeek !== undefined ? String(schedule.dayOfWeek) : "null",
    startTime: schedule?.startTime || "09:00",
    endTime: schedule?.endTime || "17:00",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateTime = (time: string) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(time)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!validateTime(formData.startTime)) {
      newErrors.startTime = "Formato de hora inválido (HH:mm)"
    }

    if (!validateTime(formData.endTime)) {
      newErrors.endTime = "Formato de hora inválido (HH:mm)"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const submitData = {
      ...formData,
      dayOfWeek: formData.dayOfWeek === "null" ? null : Number(formData.dayOfWeek),
    }

    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Day of Week */}
        <div className="space-y-2">
          <Label htmlFor="dayOfWeek">Día de la Semana</Label>
          <Select value={formData.dayOfWeek} onValueChange={(value) => setFormData({ ...formData, dayOfWeek: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar día" />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OF_WEEK.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Selecciona un día específico o "Todos los días" para aplicar el horario diariamente
          </p>
        </div>

        {/* Start Time */}
        <div className="space-y-2">
          <Label htmlFor="startTime">
            Hora de Inicio <span className="text-destructive">*</span>
          </Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => {
              setFormData({ ...formData, startTime: e.target.value })
              setErrors({ ...errors, startTime: "" })
            }}
            className={errors.startTime ? "border-destructive" : ""}
          />
          {errors.startTime && <p className="text-sm text-destructive">{errors.startTime}</p>}
        </div>

        {/* End Time */}
        <div className="space-y-2">
          <Label htmlFor="endTime">
            Hora de Fin <span className="text-destructive">*</span>
          </Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => {
              setFormData({ ...formData, endTime: e.target.value })
              setErrors({ ...errors, endTime: "" })
            }}
            className={errors.endTime ? "border-destructive" : ""}
          />
          {errors.endTime && <p className="text-sm text-destructive">{errors.endTime}</p>}
          <p className="text-sm text-muted-foreground">
            Si la hora de fin es menor que la de inicio, se asume que el turno cruza la medianoche
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{schedule ? "Actualizar" : "Crear"} Horario</Button>
      </div>
    </form>
  )
}
