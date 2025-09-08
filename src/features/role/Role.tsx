"use client"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { RoleTable, RoleForm, RoleDetails, RoleAssignment, Role, type Permission} from "@/features/role"
import type { Tower } from "@/features/tower"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Plus, Search, Shield, ShieldCheck, Building, Users } from "lucide-react"
import { SectionTitle } from "@/shared/components/SectionTitle"

// Mock data
const mockRoles: Role[] = [
  {
    id: "1",
    name: "Administrador Global",
    description: "Acceso completo a todas las funcionalidades del sistema",
    scope: "GLOBAL",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    users: [{ userId: "1", firstName: "Ana", lastName: "García", towerId: "1", towerName: "Torre Norte" }],
    permissions: [
      { id: "2", name: "Gestión de Roles" },
      { id: "1", name: "Gestión de Usuarios" },
      { id: "3", name: "Configuración del Sistema" },
    ],
  },
  {
    id: "2",
    name: "Manager Torre Este",
    description: "Gestión de usuarios y operaciones en Torre Este",
    scope: "LOCAL",
    towerIds: ["3"],
    createdAt: "2024-02-01T14:30:00Z",
    updatedAt: "2024-02-10T09:15:00Z",
    users: [{ userId: "2", firstName: "Carlos", lastName: "Rodríguez", towerId: "3", towerName: "Torre Este" }],
    permissions: [
      { id: "4", name: "Gestión de Empleados" },
      { id: "5", name: "Reportes Locales" },
    ],
  },
  {
    id: "3",
    name: "Empleado",
    description: "Acceso básico para empleados",
    scope: "GLOBAL",
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: "2024-01-20T08:00:00Z",
    users: [],
    permissions: [
      { id: "6", name: "Ver Perfil" },
      { id: "7", name: "Actualizar Datos Personales" },
    ],
  },
]

const mockTowers: Tower[] = [
  { id: "1", name: "Torre Norte" },
  { id: "2", name: "Torre Sur" },
  { id: "3", name: "Torre Este" },
  { id: "4", name: "Torre Oeste" },
]

const mockPermissions: Permission[] = [
  { id: "1", name: "Gestión de Usuarios", description: "Crear, editar y eliminar usuarios" },
  { id: "2", name: "Gestión de Roles", description: "Administrar roles y permisos" },
  { id: "3", name: "Configuración del Sistema", description: "Acceso a configuraciones globales" },
  { id: "4", name: "Gestión de Empleados", description: "Administrar empleados locales" },
  { id: "5", name: "Reportes Locales", description: "Generar reportes por torre" },
  { id: "6", name: "Ver Perfil", description: "Visualizar información personal" },
  { id: "7", name: "Actualizar Datos Personales", description: "Modificar información personal" },
]

export function RoleManagementDashboard() {
  const [roles] = useState<Role[]>(mockRoles)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isAssignUsersDialogOpen, setIsAssignUsersDialogOpen] = useState(false)
  const [isAssignPermissionsDialogOpen, setIsAssignPermissionsDialogOpen] = useState(false)

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.scope.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const globalRoles = roles.filter((role) => role.scope === "GLOBAL").length
  const localRoles = roles.filter((role) => role.scope === "LOCAL").length
  const totalUsers = roles.reduce((acc, role) => acc + (role.users?.length || 0), 0)

  return (
    <div className="min-h-screen bg-background">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionTitle icon={<Shield />} label="Roles" />
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Roles</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roles.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Roles Globales</CardTitle>
              <ShieldCheck className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{globalRoles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Roles Locales</CardTitle>
              <Building className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{localRoles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios Asignados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Rol
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Rol</DialogTitle>
              </DialogHeader>
              <RoleForm
                towers={mockTowers}
                onSubmit={(data) => {
                  console.log("Create role:", data)
                  setIsCreateDialogOpen(false)
                }}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Roles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <RoleTable
              roles={filteredRoles}
              towers={mockTowers}
              onEdit={(role) => {
                setSelectedRole(role)
                setIsEditDialogOpen(true)
              }}
              onDelete={(role) => {
                console.log("Delete role:", role.id)
              }}
              onViewDetails={(role) => {
                setSelectedRole(role)
                setIsDetailsDialogOpen(true)
              }}
              onAssignUsers={(role) => {
                setSelectedRole(role)
                setIsAssignUsersDialogOpen(true)
              }}
              onAssignPermissions={(role) => {
                setSelectedRole(role)
                setIsAssignPermissionsDialogOpen(true)
              }}
            />
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Rol</DialogTitle>
            </DialogHeader>
            {selectedRole && (
              <RoleForm
                role={selectedRole}
                towers={mockTowers}
                onSubmit={(data) => {
                  console.log("Update role:", data)
                  setIsEditDialogOpen(false)
                }}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalles del Rol</DialogTitle>
            </DialogHeader>
            {selectedRole && <RoleDetails role={selectedRole} towers={mockTowers} />}
          </DialogContent>
        </Dialog>

        {/* Assign Users Dialog */}
        <Dialog open={isAssignUsersDialogOpen} onOpenChange={setIsAssignUsersDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Asignar Usuarios al Rol</DialogTitle>
            </DialogHeader>
            {selectedRole && (
              <RoleAssignment
                type="users"
                role={selectedRole}
                towers={mockTowers}
                onSubmit={(data) => {
                  console.log("Assign users:", data)
                  setIsAssignUsersDialogOpen(false)
                }}
                onCancel={() => setIsAssignUsersDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Assign Permissions Dialog */}
        <Dialog open={isAssignPermissionsDialogOpen} onOpenChange={setIsAssignPermissionsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Asignar Permisos al Rol</DialogTitle>
            </DialogHeader>
            {selectedRole && (
              <RoleAssignment
                type="permissions"
                role={selectedRole}
                permissions={mockPermissions}
                onSubmit={(data) => {
                  console.log("Assign permissions:", data)
                  setIsAssignPermissionsDialogOpen(false)
                }}
                onCancel={() => setIsAssignPermissionsDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
