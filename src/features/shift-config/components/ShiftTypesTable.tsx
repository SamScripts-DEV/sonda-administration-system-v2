"use client"

import { Button } from "@/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Badge } from "@/shared/components/ui/badge"
import { Edit, Trash2, Eye, Clock, UserPlus } from "lucide-react"
import { ShiftType } from "../types"






interface ShiftTypesTableProps {
  shiftTypes: ShiftType[]
  onEdit: (shiftType: ShiftType) => void
  onDelete: (shiftType: ShiftType) => void
  onViewDetails: (shiftType: ShiftType) => void
  onManageSchedules: (shiftType: ShiftType) => void
  onActivate: (shiftType: ShiftType) => void
}

const DAYS_OF_WEEK = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

export function ShiftTypesTable({
  shiftTypes,
  onEdit,
  onDelete,
  onViewDetails,
  onManageSchedules,
  onActivate,
}: ShiftTypesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo de Turno</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Características</TableHead>
            <TableHead>Horarios</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shiftTypes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No hay tipos de turno registrados
              </TableCell>
            </TableRow>
          ) : (
            shiftTypes.map((shiftType) => (
              <TableRow key={shiftType.id} className={!shiftType.isActive ? "opacity-50" : ""}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-border"
                      style={{ backgroundColor: shiftType.color || "#6b7280" }}
                    />
                    <span className="font-medium">{shiftType.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{shiftType.description || "Sin descripción"}</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {shiftType.isRotative && (
                      <Badge variant="secondary" className="text-xs">
                        Rotativo
                      </Badge>
                    )}
                    {shiftType.isStandby && (
                      <Badge variant="outline" className="text-xs">
                        Guardia
                      </Badge>
                    )}
                    {!shiftType.isRotative && !shiftType.isStandby && (
                      <Badge variant="secondary" className="text-xs text-muted-foreground">
                        Fijo
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{shiftType.schedules?.length || 0} horario(s)</span>
                  </div>
                </TableCell>
                <TableCell>
                  {shiftType.isActive ? (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                      Activo
                    </Badge>
                  ): (
                    <Badge variant="secondary">
                      Inactivo
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onViewDetails(shiftType)} title="Ver detalles">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onManageSchedules(shiftType)}
                      title="Gestionar horarios"
                      disabled={!shiftType.isActive}
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(shiftType)}
                      title="Editar"
                      disabled={!shiftType.isActive}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {shiftType.isActive ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(shiftType)}
                        className="text-destructive hover:text-destructive"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onActivate(shiftType)}
                        className="text-success hover:text-success"
                        title="Activar"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
