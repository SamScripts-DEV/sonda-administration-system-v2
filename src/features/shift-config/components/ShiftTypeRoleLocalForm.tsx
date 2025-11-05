"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Briefcase, Search } from "lucide-react"
import { ShiftTypeRoleLocal, AreaRole } from "../types"


interface ShiftTypeRoleLocalFormProps {
  roleLocal?: ShiftTypeRoleLocal
  shiftTypeId: string
  availableAreaRoles: AreaRole[]
  onSubmit: (data: { shiftTypeId: string; areaRoleId: string }) => void
  onCancel: () => void
}

export function ShiftTypeRoleLocalForm({
  roleLocal,
  shiftTypeId,
  availableAreaRoles,
  onSubmit,
  onCancel,
}: ShiftTypeRoleLocalFormProps) {
  const [selectedAreaRoleId, setSelectedAreaRoleId] = useState(roleLocal?.areaRoleId || "")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAreaRoles = availableAreaRoles.filter((ar) => {
    const searchLower = searchTerm.toLowerCase()
    return ar.roleName.toLowerCase().includes(searchLower) || ar.areaName.toLowerCase().includes(searchLower)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAreaRoleId) return

    onSubmit({
      shiftTypeId,
      areaRoleId: selectedAreaRoleId,
    })
  }

  const selectedAreaRole = availableAreaRoles.find((ar) => ar.id === selectedAreaRoleId)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            {roleLocal ? "Editar Asignación de Rol" : "Nueva Asignación de Rol"}
          </CardTitle>
          <CardDescription>
            Asigna un rol de área a este tipo de turno para definir qué roles pueden usar este turno
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar Rol/Área</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Buscar por rol o área..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Area Role Selector */}
          <div className="space-y-2">
            <Label htmlFor="areaRole">
              Rol - Área <span className="text-destructive">*</span>
            </Label>
            <Select value={selectedAreaRoleId} onValueChange={setSelectedAreaRoleId}>
              <SelectTrigger id="areaRole">
                <SelectValue placeholder="Selecciona un rol de área" />
              </SelectTrigger>
              <SelectContent>
                {filteredAreaRoles.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {searchTerm ? "No se encontraron resultados" : "No hay roles de área disponibles"}
                  </div>
                ) : (
                  filteredAreaRoles.map((ar) => (
                    <SelectItem key={ar.id} value={ar.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{ar.roleName}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{ar.areaName}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Preview */}
          {selectedAreaRole && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#005af9]/10 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-[#005af9]" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedAreaRole.roleName}</p>
                      <p className="text-sm text-muted-foreground">{selectedAreaRole.areaName}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={!selectedAreaRoleId}
          style={{ backgroundColor: "#005af9" }}
          className="text-white hover:opacity-90"
        >
          {roleLocal ? "Actualizar Asignación" : "Crear Asignación"}
        </Button>
      </div>
    </form>
  )
}
