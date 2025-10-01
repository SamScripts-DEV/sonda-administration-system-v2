import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AssignableUserForRole, AssignableUsersByArea, Role, RoleData } from "../types";
import { fetchRoles, fetchAssignableUsersForRole, fetchPermissionsForRole, createRole, updateRole, addUserToRole, removeUserFromRole, deleteRole, addPermissionsToRole, removePermissionFromRole } from "../services/rolApi";
import { toast } from "sonner";


export function useFetchRoles() {
  return useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await fetchRoles();
      return res.data ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });

}

export function useAssignableUsersForRole(roleId: string) {
  return useQuery<AssignableUserForRole[] | AssignableUsersByArea[]>({
    queryKey: ["assignable-users-for-role", roleId],
    queryFn: async () => {
      const res = await fetchAssignableUsersForRole(roleId);
      return res.data ?? [];
    },
    enabled: !!roleId,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePermissionsForRole(roleId: string) {
  return useQuery({
    queryKey: ["permissions-for-role", roleId],
    queryFn: async () => {
      const res = await fetchPermissionsForRole(roleId);
      return res.data ?? [];
    },
    enabled: !!roleId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoleData) => createRole(data),
    onMutate: async (newRole: RoleData) => {
      await queryClient.cancelQueries({ queryKey: ["roles"] });
      const previousRoles = queryClient.getQueryData<Role[]>(["roles"]) ?? [];
      const optimisticId = "optimistic-" + Date.now();

      queryClient.setQueryData(["roles"], [
        ...previousRoles,
        { ...newRole, id: optimisticId }
      ]);

      return { previousRoles, optimisticId };
    },
    onError: (_error, _newRole, context: any) => {
      if (context?.previousRoles) {
        queryClient.setQueryData(["roles"], context.previousRoles);
      }
      toast.error("Error al crear el rol.");
    },
    onSuccess: (response, _newRole, context: any) => {
      const createdRole = response.data ?? response;
      const previousRoles = queryClient.getQueryData<Role[]>(["roles"]) ?? [];
      const updatedRoles = previousRoles.map(role =>
        role.id === context.optimisticId ? createdRole : role
      );
      queryClient.setQueryData(["roles"], updatedRoles);
      toast.success("Rol creado exitosamente");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    }
  });
}


export function useEditRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RoleData }) => updateRole(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["roles"] });
      const previousRoles = queryClient.getQueryData<Role[]>(["roles"]) ?? [];

      const updatedRoles = previousRoles.map(role =>
        role.id === id ? { ...role, ...data } : role
      );
      queryClient.setQueryData(["roles"], updatedRoles);
      return { previousRoles };
    },
    onError: (_error, _variables, context: any) => {
      if (context?.previousRoles) {
        queryClient.setQueryData(["roles"], context.previousRoles);
      }
      toast.error("Error al actualizar el rol.");
    },
    onSuccess: (response) => {
      const updatedRole = (response.data ?? response) as Role;
      const previousRoles = queryClient.getQueryData<Role[]>(["roles"]) ?? [];
      const updatedRoles = previousRoles.map(role =>
        role.id === updatedRole.id ? updatedRole : role
      );
      queryClient.setQueryData(["roles"], updatedRoles);
      toast.success("Rol actualizado exitosamente");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    }
  });
}

export function useAddUserToRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, userIds, areaId }: { roleId: string; userIds: string[]; areaId?: string }) =>
      addUserToRole(roleId, userIds, areaId),
    onMutate: async ({ roleId, userIds }) => {
      await queryClient.cancelQueries({ queryKey: ["roles"] });
      const previousRoles = queryClient.getQueryData<Role[]>(["roles"]) ?? [];

      const updatedRoles = previousRoles.map(role =>
        role.id === roleId
          ? {
            ...role,
            users: [
              ...(role.users ?? []),
              ...userIds.map(id => ({
                userId: id,
                firstName: "Nuevo",
                lastName: "Usuario",
                areas: [],
              })),
            ],
          }
          : role
      );
      queryClient.setQueryData(["roles"], updatedRoles);
      return { previousRoles };
    },
    onError: (error, _variables, context: any) => {
      if (context?.previousRoles) {
        queryClient.setQueryData(["roles"], context.previousRoles);
      }
      toast.error(error.message || "Error al asignar usuarios.");
    },
    onSuccess: () => {
      toast.success("Usuarios asignados exitosamente");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

export function useRemoveUserFromRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, userId, areaId }: { roleId: string; userId: string; areaId?: string }) =>
      removeUserFromRole(roleId, userId, areaId),
    onMutate: async ({ roleId, userId }) => {
      await queryClient.cancelQueries({ queryKey: ["roles"] });
      const previousRoles = queryClient.getQueryData<Role[]>(["roles"]) ?? [];

      const updatedRoles = previousRoles.map(role =>
        role.id === roleId
          ? {
            ...role,
            users: (role.users ?? []).filter(user => user.userId !== userId),
          }
          : role
      );
      queryClient.setQueryData(["roles"], updatedRoles);
      return { previousRoles };
    },
    onError: (error, _variables, context: any) => {
      if (context?.previousRoles) {
        queryClient.setQueryData(["roles"], context.previousRoles);
      }
      toast.error(error.message || "Error al quitar usuario.");
    },
    onSuccess: () => {
      toast.success("Usuario quitado exitosamente");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}


export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: string) => deleteRole(roleId),
    onMutate: async (roleId: string) => {
      await queryClient.cancelQueries({ queryKey: ["roles"] });
      const previousRoles = queryClient.getQueryData<Role[]>(["roles"]) ?? [];
      queryClient.setQueryData(
        ["roles"],
        previousRoles.filter((role) => role.id !== roleId)
      );
      return { previousRoles };
    },
    onError: (error, _roleId, context: any) => {
      if (context?.previousRoles) {
        queryClient.setQueryData(["roles"], context.previousRoles);
      }
      toast.error(error.message || "Error al eliminar el rol.");
    },
    onSuccess: () => {
      toast.success("Rol eliminado exitosamente");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

export function useAddPermissionsToRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      addPermissionsToRole(roleId, permissionIds),
    onMutate: async ({ roleId, permissionIds }) => {
      await queryClient.cancelQueries({ queryKey: ["roles"] });
      const previousRoles = queryClient.getQueryData<Role[]>(["roles"]) ?? [];

      // Optimistic update: agrega los permisos al rol
      const updatedRoles = previousRoles.map(role =>
        role.id === roleId
          ? {
              ...role,
              permissions: [
                ...(role.permissions ?? []),
                ...permissionIds.map(id => ({ id, name: "Nuevo Permiso" })),
              ],
            }
          : role
      );
      queryClient.setQueryData(["roles"], updatedRoles);
      return { previousRoles };
    },
    onError: (error, _variables, context: any) => {
      if (context?.previousRoles) {
        queryClient.setQueryData(["roles"], context.previousRoles);
      }
      toast.error(error.message || "Error al asignar permisos.");
    },
    onSuccess: () => {
      toast.success("Permisos asignados exitosamente");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}


export function useRemovePermissionFromRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionId }: { roleId: string; permissionId: string }) =>
      removePermissionFromRole(roleId, permissionId),
    onMutate: async ({ roleId, permissionId }) => {
      await queryClient.cancelQueries({ queryKey: ["roles"] });
      const previousRoles = queryClient.getQueryData<Role[]>(["roles"]) ?? [];

      const updatedRoles = previousRoles.map(role =>
        role.id === roleId
          ? {
              ...role,
              permissions: (role.permissions ?? []).filter(p => p.id !== permissionId),
            }
          : role
      );
      queryClient.setQueryData(["roles"], updatedRoles);
      return { previousRoles };
    },
    onError: (error, _variables, context: any) => {
      if (context?.previousRoles) {
        queryClient.setQueryData(["roles"], context.previousRoles);
      }
      toast.error(error.message || "Error al quitar permiso.");
    },
    onSuccess: () => {
      toast.success("Permiso quitado exitosamente");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}