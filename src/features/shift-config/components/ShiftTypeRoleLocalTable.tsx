"use client"

import { Button } from "@/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Badge } from "@/shared/components/ui/badge"
import { Edit, Trash2, Briefcase } from "lucide-react"
import { ShiftTypeRoleLocal } from "../types"



interface ShiftTypeRoleLocalTableProps {
  roleLocals: ShiftTypeRoleLocal[]
  onEdit: (roleLocal: ShiftTypeRoleLocal) => void
  onDelete: (roleLocal: ShiftTypeRoleLocal) => void
}

export function ShiftTypeRoleLocalTable({ roleLocals, onEdit, onDelete }: ShiftTypeRoleLocalTableProps) {
  if (roleLocals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No hay roles de área asignados a este tipo de turno</p>
        <p className="text-sm mt-1">Agrega roles de área para definir qué roles pueden usar este turno</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rol</TableHead>
            <TableHead>Área</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roleLocals.map((roleLocal) => (
            <TableRow key={roleLocal.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#005af9]/10 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-[#005af9]" />
                  </div>
                  <span className="font-medium">{roleLocal.roleName || "Rol"}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{roleLocal.areaName || "Área"}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(roleLocal)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(roleLocal)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
