"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { Search, Users, Shield } from "lucide-react"
import type { Role, AssignableUserForRole, AssignableUsersByArea } from "@/features/role"
import type { Area } from "@/features/area"
import type { Permission } from "@/features/permission"
import { useAssignableUsersForRole } from "@/features/role"

interface RoleAssignmentProps {
  type: "users" | "permissions"
  role: Role
  areas?: Area[]
  permissions?: Permission[]
  onSubmit: (data: {
    roleId: string
    userIds?: string[]
    permissionIds?: string[]
    areaId?: string
  }) => void
  onCancel: () => void
}



export function RoleAssignment({ type, role, areas = [], permissions = [], onSubmit, onCancel }: RoleAssignmentProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectedArea, setSelectedArea] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [areaError, setAreaError] = useState<string>("");


  const { data: availableUsers = [] } = useAssignableUsersForRole(role.id)


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (type === "users") {
      onSubmit({
        roleId: role.id,
        userIds: selectedItems,
        areaId: role.scope === "LOCAL" ? selectedArea : undefined,
      })
    } else {
      onSubmit({
        roleId: role.id,
        permissionIds: selectedItems,
      })
    }
  }


  const getAvailableUsers = (): AssignableUserForRole[] => {
    if (role.scope === "GLOBAL") {

      return Array.isArray(availableUsers) && availableUsers.length > 0 && "userId" in availableUsers[0]
        ? (availableUsers as AssignableUserForRole[])
        : [];
    }

    if (
      Array.isArray(availableUsers) &&
      availableUsers.length > 0 &&
      "areaId" in availableUsers[0]
    ) {

      if (selectedArea && selectedArea !== "all") {
        const areaObj = (availableUsers as any[]).find((a) => a.areaId === selectedArea);
        return areaObj ? areaObj.users : [];
      }

      return (availableUsers as AssignableUsersByArea[]).flatMap((a) => a.users);
    }
    return [];
  };

  const handleItemToggle = (itemId: string, checked: boolean) => {
    setSelectedItems((prev) => (checked ? [...prev, itemId] : prev.filter((id) => id !== itemId)))
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  // Filter users based on role scope and selected area
  const getFilteredUsers = () => {
    let filteredUsers = getAvailableUsers()

    // // Filter by role scope
    // if (role.scope === "LOCAL" && role.areaIds) {
    //   filteredUsers = filteredUsers.filter((user) => role.areaIds!.includes(user.areaId))
    // }

    // Filter by selected area (for LOCAL roles)
    if (selectedArea && selectedArea !== "all") {
      filteredUsers = filteredUsers.filter((user) =>
        user.areas.some((area) => area.areaId === selectedArea)
      );
    }

    // Filter by search term
    if (searchTerm) {
      filteredUsers = filteredUsers.filter((user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // // Exclude already assigned users
    // const assignedUserIds = role.users?.map((u) => u.userId) || []
    // filteredUsers = filteredUsers.filter((user) => !assignedUserIds.includes(user.userId))

    return filteredUsers
  }

  const getFilteredPermissions = () => {
    let filteredPermissions = permissions

    // Filter by search term
    if (searchTerm) {
      filteredPermissions = filteredPermissions.filter(
        (permission) =>
          permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          permission.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Exclude already assigned permissions
    const assignedPermissionIds = role.permissions?.map((p) => p.id) || []
    filteredPermissions = filteredPermissions.filter(
      (permission) => !assignedPermissionIds.includes(permission.id),
    )

    return filteredPermissions
  }

  const availableAreas =
    role.scope === "LOCAL" && role.areaIds ? areas.filter((area) => role.areaIds!.includes(area.id)) : []

  return (
    <form onSubmit={handleSubmit} className="h-full">
      <Card className="flex flex-col max-h-[90vh]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {type === "users" ? <Users className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
            {type === "users" ? "Seleccionar Usuarios" : "Seleccionar Permisos"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4">
          {/* Area Selection for LOCAL roles */}
          {type === "users" && role.scope === "LOCAL" && availableAreas.length > 0 && (
            <div className="space-y-2">
              <Label>Área</Label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las áreas disponibles</SelectItem>
                  {availableAreas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={type === "users" ? "Buscar usuarios..." : "Buscar permisos..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Items List */}
          <div className="flex-1 min-h-0">
            <div className="h-full max-h-[50vh] overflow-y-auto space-y-2 border rounded-lg p-4">
              {type === "users" ? (
                getFilteredUsers().length > 0 ? (
                  getFilteredUsers().map((user) => (
                    <div key={user.userId} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded ">
                      <Checkbox
                        id={`user-${user.userId}`}
                        checked={selectedItems.includes(user.userId)}
                        onCheckedChange={(checked) => handleItemToggle(user.userId, checked as boolean)}
                        className="border-gray-300"
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Label htmlFor={`user-${user.userId}`} className="font-medium cursor-pointer">
                          {user.firstName} {user.lastName}
                        </Label>
                        <p className="text-sm text-muted-foreground"> {user.areas.map((area) => area.areaName).join(", ")}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No hay usuarios disponibles para asignar</p>
                )
              ) : getFilteredPermissions().length > 0 ? (
                getFilteredPermissions().map((permission) => (
                  <div key={permission.id} className="flex items-start space-x-3 p-2 hover:bg-muted/50 rounded">
                    <Checkbox
                      id={`permission-${permission.id}`}
                      checked={selectedItems.includes(permission.id)}
                      onCheckedChange={(checked) => handleItemToggle(permission.id, checked as boolean)}
                      className="mt-1 border-gray-300"
                    />
                    <div className="flex-1">
                      <Label htmlFor={`permission-${permission.id}`} className="font-medium cursor-pointer">
                        {permission.name}
                      </Label>
                      {permission.description && (
                        <p className="text-sm text-muted-foreground mt-1">{permission.description}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No hay permisos disponibles para asignar</p>
              )}
            </div>
          </div>

          {/* Selection Summary */}
          {selectedItems.length > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">
                {selectedItems.length} {type === "users" ? "usuario(s)" : "permiso(s)"} seleccionado(s)
              </p>
            </div>
          )}
        </CardContent>

        
      </Card>
      {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={selectedItems.length === 0}>
            Asignar {type === "users" ? "Usuarios" : "Permisos"}
          </Button>
        </div>


    </form>
  )
}
