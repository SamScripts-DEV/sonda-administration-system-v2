"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import type { Role } from "@/features/role"
import type { Area } from "@/features/area"


interface RoleFormProps {
  role?: Role
  areas: Area[]
  onSubmit: (data: {
    name: string
    description: string
    scope: "GLOBAL" | "LOCAL"
    areaIds: string[]
  }) => void
  onCancel: () => void
}

export function RoleForm({ role, areas, onSubmit, onCancel }: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: role?.name || "",
    description: role?.description || "",
    scope: role?.scope || ("GLOBAL" as "GLOBAL" | "LOCAL"),
    areaIds: role?.areaIds || [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (formData.scope === "LOCAL" && formData.areaIds.length === 0) {
      newErrors.areasIds = "Debe seleccionar al menos una área para roles locales"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  const handleAreaChange = (areaId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      areaIds: checked ? [...prev.areaIds, areaId] : prev.areaIds.filter((id) => id !== areaId),
    }))

    if (errors.areaIds) {
      setErrors((prev) => ({ ...prev, areaIds: "" }))
    }
  }

  const handleScopeChange = (scope: "GLOBAL" | "LOCAL") => {
    setFormData((prev) => ({
      ...prev,
      scope,
      areaIds: scope === "GLOBAL" ? [] : prev.areaIds,
    }))

    if (errors.areaIds) {
      setErrors((prev) => ({ ...prev, areaIds: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Rol *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }))
                }}
                placeholder="Ej: Administrador, Manager, Empleado"
                className={`${errors.name ? "border-destructive" : ""}`}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción del rol y sus responsabilidades"
                rows={3}

              />
            </div>
          </CardContent>
        </Card>

        {/* Scope Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuración de Alcance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Alcance del Rol *</Label>
              <Select value={formData.scope} onValueChange={handleScopeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar alcance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GLOBAL">Global - Aplica a toda la organización</SelectItem>
                  <SelectItem value="LOCAL">Local - Aplica a áreas específicas</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {formData.scope === "GLOBAL"
                  ? "Este rol tendrá permisos en toda la organización"
                  : "Este rol solo tendrá permisos en las áreas seleccionadas"}
              </p>
            </div>

            {formData.scope === "LOCAL" && (
              <div className="space-y-2">
                <Label>Áreas Asignadas *</Label>
                <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg">
                  {areas.map((area) => (
                    <div key={area.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`area-${area.id}`}
                        checked={formData.areaIds.includes(area.id)}
                        onCheckedChange={(checked) => handleAreaChange(area.id, checked as boolean)}
                      />
                      <Label htmlFor={`area-${area.id}`} className="text-sm font-normal cursor-pointer">
                        {area.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.areaIds && <p className="text-sm text-destructive">{errors.areaIds}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{role ? "Actualizar Rol" : "Crear Rol"}</Button>
      </div>
    </form>
  )
}
