"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Building } from "lucide-react"
import type { Area } from "@/features/area"

interface AreaFormProps {
  area?: Area
  onSubmit: (data: AreaFormData) => void
  onCancel: () => void
}

interface AreaFormData {
  name: string
  description: string
}

export function AreaForm({ area, onSubmit, onCancel }: AreaFormProps) {
  const [formData, setFormData] = useState<AreaFormData>({
    name: area?.name || "",
    description: area?.description || "",
  })

  const [errors, setErrors] = useState<Partial<AreaFormData>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Partial<AreaFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    onSubmit(formData)
  }

  const handleInputChange = (field: keyof AreaFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          {area ? "Editar Área" : "Nueva Área"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Básica</h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ingrese el nombre de la torre"
                  className={`border-gray-300 ${errors.name ? "border-destructive" : ""}`}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Ingrese una descripción opcional"
                  rows={3}
                  className={`border-gray-300 ${errors.name ? "border-destructive" : ""}`}

                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">{area ? "Actualizar Área" : "Crear Área"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
