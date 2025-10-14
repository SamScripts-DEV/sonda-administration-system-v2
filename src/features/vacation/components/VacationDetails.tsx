"use client"

import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { Calendar, User, Clock, FileText, TrendingDown } from "lucide-react"
import { type VacationRequest } from "@/features/vacation"


interface VacationDetailsProps {
  vacation: VacationRequest
}

export function VacationDetails({ vacation }: VacationDetailsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-orange-500">Pendiente</Badge>
      case "APPROVED":
        return <Badge className="bg-green-600">Aprobada</Badge>
      case "REJECTED":
        return <Badge className="bg-red-600">Rechazada</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Status and Basic Info */}
      <div className="flex items-center justify-between">
        <div>
          {/* <h3 className="text-lg font-semibold">Solicitud #{vacation.id}</h3> */}
          <h3 className="text-base text-muted-foreground">Creada el {formatDateTime(vacation.createdAt)}</h3>
        </div>
        {getStatusBadge(vacation.status)}
      </div>

      <Separator />

      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            Información del Usuario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre</p>
              <p className="text-sm font-semibold">{vacation.userName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{vacation.userEmail}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Área</p>
              <p className="text-sm">{vacation.areaName || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Creado por</p>
              <p className="text-sm">{vacation.createdByName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vacation Period */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Período de Vacaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha de Inicio</p>
              <p className="text-sm font-semibold">{formatDate(vacation.startDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha de Fin</p>
              <p className="text-sm font-semibold">{formatDate(vacation.endDate)}</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm font-medium text-muted-foreground">Días Solicitados</p>
              <p className="text-2xl font-bold text-primary">{vacation.daysRequested}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vacation Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Balance de Vacaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Días Asignados</p>
              <p className="text-lg font-bold">{vacation.daysAssigned}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Días Disponibles</p>
              <p className="text-lg font-bold text-blue-600">{vacation.daysAvailable}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Días Usados</p>
              <p className="text-lg font-bold text-orange-600">{vacation.daysUsed}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Días Restantes</p>
              <p className="text-lg font-bold text-green-600">{vacation.daysRemaining}</p>
            </div>
          </div>

          {vacation.daysExceeded > 0 && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-semibold text-red-900">Días Excedidos</p>
                  <p className="text-lg font-bold text-red-600">{vacation.daysExceeded}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Observation */}
      {vacation.observation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Observación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{vacation.observation}</p>
          </CardContent>
        </Card>
      )}

      {/* Timestamps */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>Creada: {formatDateTime(vacation.createdAt)}</p>
        <p>Última actualización: {formatDateTime(vacation.updatedAt)}</p>
      </div>
    </div>
  )
}
