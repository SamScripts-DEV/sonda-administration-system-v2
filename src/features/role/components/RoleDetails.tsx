"use client"

import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { Shield, Users, Building, Calendar, FileText } from "lucide-react"
import type { Role } from "@/features/role"
import type { Tower } from "@/features/tower"

interface RoleDetailsProps {
  role: Role
  towers: Tower[]
}

export function RoleDetails({ role, towers }: RoleDetailsProps) {
  const getTowerNames = (towerIds?: string[]) => {
    if (!towerIds || towerIds.length === 0) return []
    return towerIds
      .map((id) => towers.find((tower) => tower.id === id))
      .filter(Boolean)
      .map((tower) => tower!.name)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No disponible"
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Header Information */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                {role.name}
              </CardTitle>
              <Badge variant={role.scope === "GLOBAL" ? "default" : "secondary"} className="w-fit">
                {role.scope === "GLOBAL" ? "Rol Global" : "Rol Local"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {role.description && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                Descripción
              </div>
              <p className="text-sm leading-relaxed pl-6">{role.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Fecha de Creación
              </div>
              <p className="text-sm pl-6">{formatDate(role.createdAt)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Última Actualización
              </div>
              <p className="text-sm pl-6">{formatDate(role.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scope and Towers */}
      {role.scope === "LOCAL" && role.towerIds && role.towerIds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5" />
              Torres Asignadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {getTowerNames(role.towerIds).map((towerName, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {towerName}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assigned Users */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuarios Asignados ({role.users?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {role.users && role.users.length > 0 ? (
            <div className="space-y-3">
              {role.users.map((user) => (
                <div key={user.userId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{user.towerName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No hay usuarios asignados a este rol</p>
          )}
        </CardContent>
      </Card>

      {/* Assigned Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permisos Asignados ({role.permissions?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {role.permissions && role.permissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {role.permissions.map((permission) => (
                <div key={permission.id} className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">{permission.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No hay permisos asignados a este rol</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
