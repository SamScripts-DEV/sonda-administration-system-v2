"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Eye, Calendar, User } from "lucide-react"
import { SalaryHistory } from "../types"


interface SalaryHistoryTableProps {
  salaryHistory: (SalaryHistory & { updatedByName: string })[]
  onViewDetails: (salary: SalaryHistory) => void
}

export function SalaryHistoryTable({ salaryHistory, onViewDetails }: SalaryHistoryTableProps) {
  if (salaryHistory.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-lg font-medium mb-1">No hay historial disponible</p>
        <p className="text-sm">El historial de salarios aparecerá aquí</p>
      </div>
    )
  }

  const sortedHistory = [...salaryHistory].sort(
    (a, b) => new Date(b.validFrom).getTime() - new Date(a.validFrom).getTime(),
  )

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Monto</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Comentario</TableHead>
            <TableHead>Actualizado por</TableHead>
            <TableHead>Fecha de registro</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedHistory.map((salary, index) => {
            const isActive = !salary.validTo || new Date(salary.validTo) > new Date()
            const isPast = salary.validTo && new Date(salary.validTo) < new Date()

            return (
              <TableRow key={salary.id} className="hover:bg-muted/50">
                <TableCell>
                  <span className="font-semibold text-primary">
                    ${salary.amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{new Date(salary.validFrom).toLocaleDateString("es-ES")}</span>
                    </div>
                    {salary.validTo && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(salary.validTo).toLocaleDateString("es-ES")}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {isActive && !isPast ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Activo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                      Histórico
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {salary.comment ? (
                    <p className="text-sm text-muted-foreground max-w-xs truncate">{salary.comment}</p>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">Sin comentario</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{salary.updatedByName || "Sistema"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {new Date(salary.createdAt).toLocaleDateString("es-ES")}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onViewDetails(salary)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
