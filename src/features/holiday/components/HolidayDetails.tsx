"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Badge } from "@/shared/components/ui/badge"
import { Calendar, CalendarDays, Clock, FileText } from "lucide-react"
import { type Holiday } from "@/features/holiday"


interface HolidayDetailsModalProps {
  holiday: Holiday
  isOpen: boolean
  onClose: () => void
}

export function HolidayDetailsModal({ holiday, isOpen, onClose }: HolidayDetailsModalProps) {

  const calculateDuration = () => {
    const start = new Date(holiday.startDate)
    const end = new Date(holiday.endDate)
    const diffMs = end.getTime() - start.getTime();
    const oneDayMs = 1000 * 60 * 60 * 24;
    return Math.floor(diffMs / oneDayMs) + 1;
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }


  const formatDateRange = () => {
    const start = new Date(holiday.startDate)
    const end = new Date(holiday.endDate)

    if (holiday.startDate === holiday.endDate) {
      return formatDate(holiday.startDate)
    }

    return `${formatDate(holiday.startDate)} - ${formatDate(holiday.endDate)}`
  }


  const isUpcoming = new Date(holiday.startDate) > new Date()

  const duration = calculateDuration()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Detalles del Feriado
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-balance">{holiday.name}</h2>
              {isUpcoming && (
                <Badge variant="secondary" className="mt-2">
                  Próximo
                </Badge>
              )}
            </div>
          </div>

          {/* Date Information */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <CalendarDays className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha</p>
                <p className="text-base font-semibold">{formatDateRange()}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Duración</p>
                <p className="text-base font-semibold">{duration === 1 ? "1 día" : `${duration} días`}</p>
              </div>
            </div>
          </div>

          {/* Observation */}
          {holiday.observation && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">Observación</h3>
              </div>
              <p className="text-sm text-pretty pl-6">{holiday.observation}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Creado</p>
                <p className="font-medium">
                  {new Date(holiday.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Última actualización</p>
                <p className="font-medium">
                  {new Date(holiday.updatedAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>


          <div className="text-xs text-muted-foreground">
            <span className="font-mono">ID: {holiday.id}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
