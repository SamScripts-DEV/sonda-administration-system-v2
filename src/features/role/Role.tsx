"use client"

import { useEffect, useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import {
  RoleTable, RoleForm, RoleDetails, RoleAssignment, Role,
  useFetchRoles,
  useCreateRole,
  RoleData,
  useEditRole,
  useAddUserToRole,
  useRemoveUserFromRole,
  useDeleteRole,
  useAddPermissionsToRole,
  useRemovePermissionFromRole
} from "@/features/role"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogFooter
} from "@/shared/components/ui/alert-dialog"
import { type Area, useAreas, useEditArea } from "@/features/area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Plus, Search, Shield, ShieldCheck, Building, Users } from "lucide-react"
import { SectionTitle } from "@/shared/components/SectionTitle"
import { useQueryClient } from "@tanstack/react-query"
import type { Permission } from "@/features/permission"
import { useFetchPermissions } from "@/features/permission"





export function RoleManagementDashboard({ initialRoles }: { initialRoles: Role[] }) {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("")
  //const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isAssignUsersDialogOpen, setIsAssignUsersDialogOpen] = useState(false)
  const [isAssignPermissionsDialogOpen, setIsAssignPermissionsDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)

  useEffect(() => {
    queryClient.setQueryData(["roles"], initialRoles)
  }, [initialRoles, queryClient])

  const { data: roles = [] } = useFetchRoles();
  const selectRole = roles.find(r => r.id === selectedRoleId);
  const { data: areas = [] } = useAreas()
  const { data: permissions = [] } = useFetchPermissions()

  const { mutate: createRole } = useCreateRole()
  const { mutate: updateRole } = useEditRole()
  const { mutate: addUserToRole } = useAddUserToRole()
  const { mutate: removeUserFromRole } = useRemoveUserFromRole()
  const { mutate: deleteRole } = useDeleteRole()
  const { mutate: addPermissionsToRole } = useAddPermissionsToRole()
  const { mutate: removePermissionFromRole } = useRemovePermissionFromRole()

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.scope.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const globalRoles = roles.filter((role) => role.scope === "GLOBAL").length
  const localRoles = roles.filter((role) => role.scope === "LOCAL").length
  const totalUsers = roles.reduce((acc, role) => acc + (role.users?.length || 0), 0)


  const handleCreateRole = (formData: RoleData) => {
    createRole(formData, {
      onSuccess: () => setIsCreateDialogOpen(false),
    })
  }

  const handleUpdateRole = (formData: RoleData) => {
    if (!selectRole) return
    updateRole({ id: selectRole.id, data: formData }, {
      onSuccess: () => setIsEditDialogOpen(false),
    })
  }

  const handleAssignUsers = (data: {
    roleId: string;
    userIds?: string[];
    permissionIds?: string[];
    areaId?: string;
  }) => {

    if (data.userIds && data.userIds.length > 0) {
      addUserToRole({
        roleId: data.roleId,
        userIds: data.userIds,
        areaId: data.areaId,
      }, {
        onSuccess: () => setIsAssignUsersDialogOpen(false),
      });
    }
  };

  const handleRemoveUserFromRole = (userId: string, areaId?: string) => {
    if (!selectRole) return;
    removeUserFromRole({
      roleId: selectRole.id,
      userId,
      areaId
    })
  }

  const handleAssignPermissions = (data: {roleId: string; permissionIds?: string[]}) => {
    if (data.permissionIds && data.permissionIds.length > 0) {
      addPermissionsToRole(
        {roleId: data.roleId, permissionIds: data.permissionIds},
        {
          onSuccess: () => setIsAssignPermissionsDialogOpen(false),
        }
      )
    }
  }

  const handleRemovePermissionFromRole = (permissionId: string) => {
    if (!selectRole) return;
    removePermissionFromRole({roleId: selectRole.id, permissionId})
  }

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
              <ShieldCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{globalRoles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Roles Locales</CardTitle>
              <Building className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{localRoles}</div>
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
                areas={areas}
                onSubmit={handleCreateRole}
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
              areas={areas}
              onEdit={(role) => {
                setSelectedRoleId(role.id)
                setIsEditDialogOpen(true)
              }}
              onDelete={(role) => {
                setRoleToDelete(role)
              }}
              onViewDetails={(role) => {
                setSelectedRoleId(role.id)
                setIsDetailsDialogOpen(true)
              }}
              onAssignUsers={(role) => {
                setSelectedRoleId(role.id)
                setIsAssignUsersDialogOpen(true)
              }}
              onAssignPermissions={(role) => {
                setSelectedRoleId(role.id)
                setIsAssignPermissionsDialogOpen(true)
              }}
            />
          </CardContent>
        </Card>

        <AlertDialog open={!!roleToDelete} onOpenChange={(open) => !open && setRoleToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar rol?</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro que deseas eliminar el rol <b>{roleToDelete?.name}</b>? Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setRoleToDelete(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={() => {
                  if (roleToDelete) {
                    deleteRole(roleToDelete.id, {
                      onSuccess: () => setRoleToDelete(null),
                      onError: () => setRoleToDelete(null),
                    });
                  }
                }}
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Rol</DialogTitle>
            </DialogHeader>
            {selectRole && (
              <RoleForm
                role={selectRole}
                areas={areas}
                onSubmit={handleUpdateRole}
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
            {selectRole && <RoleDetails role={selectRole} areas={areas} onRemoveUser={handleRemoveUserFromRole} onRemovePermission={handleRemovePermissionFromRole} />}
          </DialogContent>
        </Dialog>

        {/* Assign Users Dialog */}
        <Dialog open={isAssignUsersDialogOpen} onOpenChange={setIsAssignUsersDialogOpen}>
          <DialogContent className="max-w-3xl overflow-visible max-h-none">
            <DialogHeader>
              <DialogTitle>Asignar Usuarios al Rol</DialogTitle>
            </DialogHeader>
            {selectRole && (
              <RoleAssignment
                type="users"
                role={selectRole}
                areas={areas}
                onSubmit={handleAssignUsers}
                onCancel={() => setIsAssignUsersDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Assign Permissions Dialog */}
        <Dialog open={isAssignPermissionsDialogOpen} onOpenChange={setIsAssignPermissionsDialogOpen}>
          <DialogContent className="max-w-3xl overflow-visible max-h-none">
            <DialogHeader>
              <DialogTitle>Asignar Permisos al Rol</DialogTitle>
            </DialogHeader>
            {selectRole && (
              <RoleAssignment
                type="permissions"
                role={selectRole}
                permissions={permissions}
                onSubmit={handleAssignPermissions}
                onCancel={() => setIsAssignPermissionsDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>




  )
}
