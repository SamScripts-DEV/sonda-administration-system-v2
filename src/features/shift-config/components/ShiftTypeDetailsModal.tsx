"use client"

import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { ShiftSchedulesTable } from "./ShiftSchedulesTable"
import { ShiftTypeRoleLocalTable } from "./ShiftTypeRoleLocalTable"
import { ShiftTypeRoleLocal, ShiftType } from "../types"
import { Clock, Info, Plus, Briefcase } from "lucide-react"

interface ShiftTypeDetailsModalProps {
  shiftType: ShiftType
  onAddSchedule: () => void
  onEditSchedule: (schedule: any) => void
  onDeleteSchedule: (schedule: any) => void
  onAddRoleLocal: () => void
  onEditRoleLocal: (roleLocal: ShiftTypeRoleLocal) => void
  onDeleteRoleLocal: (roleLocal: ShiftTypeRoleLocal) => void
}

export function ShiftTypeDetailsModal({
  shiftType,
  onAddSchedule,
  onEditSchedule,
  onDeleteSchedule,
  onAddRoleLocal,
  onEditRoleLocal,
  onDeleteRoleLocal,
}: ShiftTypeDetailsModalProps) {
  return (
    <div className="space-y-6">
      {/* Header with color */}
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-lg border-2 border-border flex-shrink-0"
          style={{ backgroundColor: shiftType.color || "#6b7280" }}
        />
        <div className="flex-1">
          <h3 className="text-2xl font-semibold">{shiftType.name}</h3>
          {shiftType.description && <p className="text-muted-foreground mt-1">{shiftType.description}</p>}
        </div>
      </div>

      {/* Characteristics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4" />
            Características
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tipo</p>
              <div className="flex gap-2">
                {shiftType.isRotative && <Badge variant="secondary">Rotativo</Badge>}
                {shiftType.isStandby && <Badge variant="outline">Guardia</Badge>}
                {!shiftType.isRotative && !shiftType.isStandby && (
                  <Badge variant="secondary" className="text-muted-foreground">
                    Fijo
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Color</p>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border-2 border-border"
                  style={{ backgroundColor: shiftType.color || "#6b7280" }}
                />
                <span className="font-mono text-sm">{shiftType.color || "#6b7280"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="schedules" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedules" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Horarios ({shiftType.schedules?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="roleLocals" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Roles de Área ({shiftType.roleLocals?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horarios Configurados
                </CardTitle>
                <Button size="sm" onClick={onAddSchedule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Horario
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ShiftSchedulesTable
                schedules={shiftType.schedules || []}
                onEdit={onEditSchedule}
                onDelete={onDeleteSchedule}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roleLocals" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Roles de Área Asignados
                </CardTitle>
                <Button size="sm" onClick={onAddRoleLocal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Asignar Rol de Área
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ShiftTypeRoleLocalTable
                roleLocals={shiftType.roleLocals || []}
                onEdit={onEditRoleLocal}
                onDelete={onDeleteRoleLocal}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
