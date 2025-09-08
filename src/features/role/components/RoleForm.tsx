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
import type { Tower } from "@/features/tower"


interface RoleFormProps {
  role?: Role
  towers: Tower[]
  onSubmit: (data: {
    name: string
    description: string
    scope: "GLOBAL" | "LOCAL"
    towerIds: string[]
  }) => void
  onCancel: () => void
}

export function RoleForm({ role, towers, onSubmit, onCancel }: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: role?.name || "",
    description: role?.description || "",
    scope: role?.scope || ("GLOBAL" as "GLOBAL" | "LOCAL"),
    towerIds: role?.towerIds || [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (formData.scope === "LOCAL" && formData.towerIds.length === 0) {
      newErrors.towerIds = "Debe seleccionar al menos una torre para roles locales"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  const handleTowerChange = (towerId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      towerIds: checked ? [...prev.towerIds, towerId] : prev.towerIds.filter((id) => id !== towerId),
    }))

    if (errors.towerIds) {
      setErrors((prev) => ({ ...prev, towerIds: "" }))
    }
  }

  const handleScopeChange = (scope: "GLOBAL" | "LOCAL") => {
    setFormData((prev) => ({
      ...prev,
      scope,
      towerIds: scope === "GLOBAL" ? [] : prev.towerIds,
    }))

    if (errors.towerIds) {
      setErrors((prev) => ({ ...prev, towerIds: "" }))
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
                className={`border-gray-300 ${errors.name ? "border-destructive" : ""}`}
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
                className="border-gray-300"
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
                <SelectTrigger className="border-gray-300 w-full">
                  <SelectValue placeholder="Seleccionar alcance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GLOBAL">Global - Aplica a toda la organización</SelectItem>
                  <SelectItem value="LOCAL">Local - Aplica a torres específicas</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {formData.scope === "GLOBAL"
                  ? "Este rol tendrá permisos en toda la organización"
                  : "Este rol solo tendrá permisos en las torres seleccionadas"}
              </p>
            </div>

            {formData.scope === "LOCAL" && (
              <div className="space-y-2">
                <Label>Torres Asignadas *</Label>
                <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg">
                  {towers.map((tower) => (
                    <div key={tower.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tower-${tower.id}`}
                        checked={formData.towerIds.includes(tower.id)}
                        onCheckedChange={(checked) => handleTowerChange(tower.id, checked as boolean)}
                      />
                      <Label htmlFor={`tower-${tower.id}`} className="text-sm font-normal cursor-pointer">
                        {tower.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.towerIds && <p className="text-sm text-destructive">{errors.towerIds}</p>}
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
