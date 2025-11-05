"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { ShiftType, ShiftTypeDto } from "../types"

interface ShiftTypeFormProps {
  shiftType?: ShiftType
  onSubmit: (data: ShiftTypeDto) => void
  onCancel: () => void
}

const PRESET_COLORS = [
  "#005af9", // Primary blue
  "#10b981", // Green
  "#f59e0b", // Orange
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#6b7280", // Gray
]

export function ShiftTypeForm({ shiftType, onSubmit, onCancel }: ShiftTypeFormProps) {
  const [formData, setFormData] = useState({
    name: shiftType?.name || "",
    description: shiftType?.description || "",
    color: shiftType?.color || "#005af9",
    isRotative: shiftType?.isRotative || false,
    isStandby: shiftType?.isStandby || false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Nombre del Turno <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value })
              setErrors({ ...errors, name: "" })
            }}
            placeholder="Ej: Turno Mañana, Turno Noche"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descripción del tipo de turno"
            rows={3}
          />
        </div>

        {/* Color Picker */}
        <div className="space-y-2">
          <Label>Color Identificador</Label>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color ? "border-primary scale-110" : "border-border hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-16 h-10 cursor-pointer"
              />
              <span className="text-sm text-muted-foreground font-mono">{formData.color}</span>
            </div>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isRotative"
              checked={formData.isRotative}
              onCheckedChange={(checked) => setFormData({ ...formData, isRotative: checked as boolean })}
            />
            <Label htmlFor="isRotative" className="font-normal cursor-pointer">
              Turno Rotativo
              <span className="text-sm text-muted-foreground ml-2">(Los empleados rotan entre diferentes turnos)</span>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isStandby"
              checked={formData.isStandby}
              onCheckedChange={(checked) => setFormData({ ...formData, isStandby: checked as boolean })}
            />
            <Label htmlFor="isStandby" className="font-normal cursor-pointer">
              Turno de Guardia
              <span className="text-sm text-muted-foreground ml-2">(Turno de disponibilidad o emergencia)</span>
            </Label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{shiftType ? "Actualizar" : "Crear"} Tipo de Turno</Button>
      </div>
    </form>
  )
}
