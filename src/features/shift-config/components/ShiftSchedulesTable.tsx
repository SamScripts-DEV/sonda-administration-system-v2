"use client"

import { Button } from "@/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Badge } from "@/shared/components/ui/badge"
import { Edit, Trash2, Clock } from "lucide-react"
import { ShiftSchedule } from "../types"

interface ShiftSchedulesTableProps {
  schedules: ShiftSchedule[]
  onEdit: (schedule: ShiftSchedule) => void
  onDelete: (schedule: ShiftSchedule) => void
}

const DAYS_OF_WEEK = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

export function ShiftSchedulesTable({ schedules, onEdit, onDelete }: ShiftSchedulesTableProps) {
  const formatTime = (time: string) => {
    return time
  }

  const getDayName = (dayOfWeek: number | null) => {
    if (dayOfWeek === null) return "Todos los días"
    return DAYS_OF_WEEK[dayOfWeek] || "Desconocido"
  }

  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(":").map(Number)
    const [endHour, endMin] = endTime.split(":").map(Number)

    let totalMinutes = endHour * 60 + endMin - (startHour * 60 + startMin)

    if (totalMinutes < 0) {
      totalMinutes += 24 * 60
    }

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Día</TableHead>
            <TableHead>Hora Inicio</TableHead>
            <TableHead>Hora Fin</TableHead>
            <TableHead>Duración</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No hay horarios configurados
              </TableCell>
            </TableRow>
          ) : (
            schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>
                  <Badge variant="outline">{getDayName(schedule.dayOfWeek)}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{formatTime(schedule.startTime)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{formatTime(schedule.endTime)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {calculateDuration(schedule.startTime, schedule.endTime)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(schedule)} title="Editar">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(schedule)}
                      className="text-destructive hover:text-destructive"
                      title="Eliminar"
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
