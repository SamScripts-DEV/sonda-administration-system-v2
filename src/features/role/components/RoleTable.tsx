"use client"

import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, Users, Shield } from "lucide-react"
import type { Role } from "@/features/role"
import type { Tower } from "@/features/tower"


interface RoleTableProps {
  roles: Role[]
  towers: Tower[]
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
  onViewDetails: (role: Role) => void
  onAssignUsers: (role: Role) => void
  onAssignPermissions: (role: Role) => void
}

export function RoleTable({
  roles,
  towers,
  onEdit,
  onDelete,
  onViewDetails,
  onAssignUsers,
  onAssignPermissions,
}: RoleTableProps) {
  const getTowerNames = (towerIds?: string[]) => {
    if (!towerIds || towerIds.length === 0) return "N/A"
    return towerIds.map((id) => towers.find((tower) => tower.id === id)?.name || id).join(", ")
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
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
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Alcance</TableHead>
            <TableHead>Torres</TableHead>
            <TableHead>Usuarios</TableHead>
            <TableHead>Permisos</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate" title={role.description || ""}>
                  {role.description || "Sin descripción"}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={role.scope === "GLOBAL" ? "default" : "secondary"}>
                  {role.scope === "GLOBAL" ? "Global" : "Local"}
                </Badge>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate" title={getTowerNames(role.towerIds)}>
                  {getTowerNames(role.towerIds)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{role.users?.length || 0}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>{role.permissions?.length || 0}</span>
                </div>
              </TableCell>
              <TableCell>{formatDate(role.createdAt)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(role)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(role)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAssignUsers(role)}>
                      <Users className="mr-2 h-4 w-4" />
                      Asignar usuarios
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAssignPermissions(role)}>
                      <Shield className="mr-2 h-4 w-4" />
                      Asignar permisos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(role)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
