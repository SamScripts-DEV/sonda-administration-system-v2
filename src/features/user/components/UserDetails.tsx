"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { User, Mail, Phone, MapPin, Building, Shield, Award } from "lucide-react"
import { User as UserProps } from "../types"

interface UserDetailsProps {
  user: UserProps
}

export function UserDetails({ user }: UserDetailsProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Header with Avatar and Basic Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>
                <div className="flex items-center gap-2">
                  {user.technicalLevel && (
                    <Badge className="bg-primary">
                      <Award className="h-3 w-3 mr-1" />
                      {user.technicalLevel}
                    </Badge>
                  )}
                  <Badge variant={user.active ? "success" : "secondary"}>
                    {user.active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs mt-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{Array.isArray(user.phone) ? user.phone.join(", ") : user.phone}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Información Personal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Documento de Identidad</label>
              <p className="text-foreground">{user.nationalId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
              <p className="text-foreground">{new Date(user.createdAt).toLocaleDateString("es-ES")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Información de Dirección</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Dirección</label>
            <p className="text-foreground">{user.address}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Ciudad</label>
              <p className="text-foreground">{user.city}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">País</label>
              <p className="text-foreground">{user.country}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Información Organizacional</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Departamento</label>
              <p className="text-foreground">{user.department}</p>
            </div>
            {user.position && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Posición</label>
                <p className="text-foreground">{user.position}</p>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Áreas Asignadas</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.areas.map((area, index) => (
                <Badge key={index} variant="outline">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Roles y Permisos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Roles Globales</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.roles?.global.map((role, index) => (
                <Badge key={index} className="bg-primary">
                  {role}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <label className="text-sm font-medium text-muted-foreground">Roles Locales</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.roles?.local.map((role, index) => (
                <Badge key={index} variant="secondary">
                  {role.role}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
