"use client"

import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Eye, Pencil, Trash2, CheckCircle } from "lucide-react"
import { type VacationRequest } from "@/features/vacation"


interface VacationTableProps {
  vacations: VacationRequest[]
  onEdit: (vacation: VacationRequest) => void
  onDelete: (vacation: VacationRequest) => void
  onViewDetails: (vacation: VacationRequest) => void
  onApproveReject: (vacation: VacationRequest) => void
}

export function VacationTable({ vacations, onEdit, onDelete, onViewDetails, onApproveReject }: VacationTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Pendiente
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Aprobada
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rechazada
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Fecha Inicio</TableHead>
            <TableHead>Fecha Fin</TableHead>
            <TableHead className="text-center">Días</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Área</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vacations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No se encontraron solicitudes de vacaciones
              </TableCell>
            </TableRow>
          ) : (
            vacations.map((vacation) => (
              <TableRow key={vacation.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{vacation.userName}</span>
                    <span className="text-sm text-muted-foreground">{vacation.userEmail}</span>
                  </div>
                </TableCell>
                <TableCell>{formatDate(vacation.startDate)}</TableCell>
                <TableCell>{formatDate(vacation.endDate)}</TableCell>
                <TableCell className="text-center">
                  <span className="font-semibold">{vacation.daysRequested}</span>
                </TableCell>
                <TableCell>{getStatusBadge(vacation.status)}</TableCell>
                <TableCell>
                  <span className="text-sm">{vacation.areaName || "—"}</span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onViewDetails(vacation)} title="Ver detalles">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {vacation.status === "PENDING" && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => onEdit(vacation)} title="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onApproveReject(vacation)}
                          title="Aprobar/Rechazar"
                          className="text-primary hover:text-primary"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(vacation)}
                      title="Eliminar"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
