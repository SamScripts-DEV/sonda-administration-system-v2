"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { Building, Users, Shield, Calendar } from "lucide-react"
import type { Area } from "@/features/area"

interface AreaDetailsProps {
  area: Area
}

export function AreaDetails({ area }: AreaDetailsProps) {
  console.log(area);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nombre</label>
              <p className="text-base font-medium">{area.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID</label>
              <p className="text-base font-mono text-muted-foreground">{area.id}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Descripción</label>
            <p className="text-base">
              {area.description || <span className="text-muted-foreground italic">Sin descripción</span>}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Creado</label>
                <p className="text-sm">{formatDate(area.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Última actualización</label>
                <p className="text-sm">{formatDate(area.updatedAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuarios Asignados ({area.users?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {area.users && area.users.length > 0 ? (
            <div className="space-y-3">
              {area.users.map((user, idx) => (
                <div key={user.userId ?? idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">Cargo: {user.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay usuarios asignados a esta torre</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assigned Roles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Roles Asignados ({area.roles?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {area.roles && area.roles.length > 0 ? (
            <div className="space-y-3">
              {area.roles.map((role, idx) => (
                <div key={role.roleId ?? idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <Shield className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">{role.name}</p>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay roles asignados a esta torre</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
