"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Edit, Trash2, Eye, UserPlus, Upload, MoreHorizontal } from "lucide-react"
import type { User } from "@/features/user"

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onViewDetails: (user: User) => void
  onAssignRoles: (user: User) => void
  onUploadImage: (user: User) => void
}

export function UserTable({ users, onEdit, onDelete, onViewDetails, onAssignRoles, onUploadImage }: UserTableProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Áreas</TableHead>
            <TableHead>Fecha Creación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">@{user.username}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm">{user.email}</TableCell>
              <TableCell className="text-sm">{user.phone}</TableCell>
              <TableCell>
                <Badge variant={user.active ? "default" : "secondary"} className={user.active ? "bg-accent" : ""}>
                  {user.active ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{user.department}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.areas.slice(0, 2).map((area, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                  {user.areas.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{user.areas.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString("es-ES")}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(user)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAssignRoles(user)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Asignar roles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUploadImage(user)}>
                      <Upload className="mr-2 h-4 w-4" />
                      Subir imagen
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(user)}
                      className="text-destructive focus:text-destructive"
                    >
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
