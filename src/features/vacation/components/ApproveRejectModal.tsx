"use client"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { CheckCircle, XCircle, Calendar } from "lucide-react"
import { type VacationRequest } from "@/features/vacation"


interface ApproveRejectModalProps {
  vacation: VacationRequest
  onSubmit: (data: ApproveRejectData) => void
  onCancel: () => void
}

export interface ApproveRejectData {
  action: "APPROVED" | "REJECTED"
  observation?: string
}

export function ApproveRejectModal({ vacation, onSubmit, onCancel }: ApproveRejectModalProps) {
  const [observation, setObservation] = useState("")

  const handleAction = (action: "APPROVED" | "REJECTED") => {
    onSubmit({
      action,
      observation: observation.trim() || undefined,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Vacation Summary */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Calendar className="h-4 w-4 text-primary" />
          <span>Resumen de la Solicitud</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Usuario:</span>
            <span className="font-medium">{vacation.userName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Período:</span>
            <span className="font-medium">
              {formatDate(vacation.startDate)} - {formatDate(vacation.endDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Días solicitados:</span>
            <span className="font-bold text-primary">{vacation.daysRequested}</span>
          </div>
          {vacation.observation && (
            <div className="pt-2 border-t">
              <p className="text-muted-foreground mb-1">Observación del usuario:</p>
              <p className="text-sm italic">&quot;{vacation.observation}&quot;</p>
            </div>
          )}
        </div>
      </div>

      {/* Observation Input */}
      <div className="space-y-2">
        <Label htmlFor="observation">Observación (opcional)</Label>
        <Textarea
          id="observation"
          placeholder="Agregar comentarios sobre la decisión..."
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          rows={4}
        />
        <p className="text-xs text-muted-foreground">Esta observación será visible para el usuario</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancelar
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => handleAction("REJECTED")}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <XCircle className="h-4 w-4" />
          Rechazar
        </Button>
        <Button
          type="button"
          onClick={() => handleAction("APPROVED")}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="h-4 w-4" />
          Aprobar
        </Button>
      </div>
    </div>
  )
}
