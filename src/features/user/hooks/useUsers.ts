import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activateUser, createRelationUserTechnicalLevel, createUser, deleteUser, fetchTechnicalLevelForUsers, fetchUsers, fetchUsersForSelect, updateUser, User, UserFormData } from "@/features/user";
import { toast } from "sonner";
import { use } from "react";

export function useFetchUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await fetchUsers();
            return res.data ?? [];
        },
        staleTime: 1000 * 60 * 5,

    });
}

export function useUsersForSelect() {
    return useQuery({
        queryKey: ["users-for-select"],
        queryFn: async () => {
            const res = await fetchUsersForSelect();
            return res.data ?? [];
        },
    })
}

export function useTechnicalLevelsForSelect() {
    return useQuery({
        queryKey: ["technical-levels-for-select"],
        queryFn: async () => {
            const res = await fetchTechnicalLevelForUsers();
            return res.data ?? [];
        }
    })
}

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUser,
        onMutate: async (newUserFormData: any) => {
            await queryClient.cancelQueries({ queryKey: ["users"] });

            const previousUsers = queryClient.getQueryData<User[]>(["users"]) ?? [];

            const formObj = formDataToObject(newUserFormData)

            const optimisticUser: User = {
                id: "optimistic-id-" + Date.now(),
                firstName: formObj.firstName ?? "",
                lastName: formObj.lastName ?? "",
                username: formObj.username ?? "",
                email: formObj.email ?? "",
                phone: formObj.phone ?? [],
                active: formObj.active === "true" || formObj.active === true,
                nationalId: formObj.nationalId ?? "",
                imageUrl: formObj.imageUrl ?? null,
                address: formObj.address ?? "",
                city: formObj.city ?? "",
                country: formObj.country ?? "",
                province: formObj.province ?? "",
                departmentId: formObj.departmentId ?? "",
                positionId: formObj.positionId ?? "",
                createdAt: new Date().toISOString(),
                roles: formObj.roles ?? { global: [], local: [] },
                rolesDetailed: formObj.rolesDetails ?? { global: [], local: [] },
                areas: formObj.areas ?? [],
                areasDetailed: formObj.areasDetails ?? [],
                department: formObj.department ?? "",
                position: formObj.position ?? "",
            };
            queryClient.setQueryData(["users"], [...previousUsers, optimisticUser]);

            return { previousUsers, optimisticUser };
        },
        onError: (_error, _newUser, context: any) => {
            if (context?.previousUsers) {
                queryClient.setQueryData(["users"], context.previousUsers);
            }
            toast.error("Error al crear el usuario. Por favor, inténtalo de nuevo.");

        },
        onSuccess: (response, _newUser, context: any) => {

            const createdUser = response.data ?? response;

            const previousUsers = queryClient.getQueryData<User[]>(["users"]) ?? [];
            const updatedUsers = previousUsers.map(user =>
                user.id === context.optimisticUser.id ? createdUser : user
            );
            queryClient.setQueryData(["users"], updatedUsers);

            toast.success("Usuario creado con éxito");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        }

    })
}


export function useEditUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, formData }: { id: string, formData: FormData }) => updateUser(id, formData),
        onMutate: async ({ id, formData }) => {
            await queryClient.cancelQueries({ queryKey: ["users"] });

            const previousUsers = queryClient.getQueryData<User[]>(["users"]) ?? [];
            const formObj = formDataToObject(formData)

            const updatedUsers = previousUsers.map(user => user.id === id ? {
                ...user,
                ...formObj,
                id,
            } : user
            );
            queryClient.setQueryData(["users"], updatedUsers);
            return { previousUsers };
        },
        onError: (_error, _variables, context: any) => {
            if (context?.previousUsers) {
                queryClient.setQueryData(["users"], context.previousUsers);
            }
            toast.error("Error al actualizar el usuario. Por favor, inténtalo de nuevo.");
        },
        onSuccess: (response, _varibles, context: any) => {
            const updatedUser = response.data as User | undefined;
            if (!updatedUser) {
                toast.error("No se pudo obtener el usuario actualizado.");
                return;
            }
            const previousUsers = queryClient.getQueryData<User[]>(["users"]) ?? [];
            const updatedUsers = previousUsers.map(user =>
                user.id === updatedUser.id ? updatedUser : user
            );
            queryClient.setQueryData(["users"], updatedUsers);
            toast.success("Usuario actualizado con éxito");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
        }
    })
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => deleteUser(userId),
        onMutate: async (userId: string) => {
            await queryClient.cancelQueries({ queryKey: ["users"] });

            const previousUsers = queryClient.getQueryData<User[]>(["users"]) ?? [];

            const updatedUsers = previousUsers.map(user =>
                user.id === userId ? { ...user, active: false } : user
            )

            queryClient.setQueryData(["users"], updatedUsers);

            return { previousUsers };
        },
        onError: (_error, _userId, context: any) => {
            if (context?.previousUsers) {
                queryClient.setQueryData(["users"], context.previousUsers);
            }
            toast.error("Error al inabilitar el usuario. Por favor, inténtalo de nuevo.");
        },
        onSuccess: (response) => {
            toast.success("Usuario inabilitado con éxito");
        },
        onSettled: () => {
            // queryClient.invalidateQueries({ queryKey: ["users"] })
        }

    })
}

export function useActivateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => activateUser(userId),
        onMutate: async (userId: string) => {
            await queryClient.cancelQueries({ queryKey: ["users"] });

            const previousUsers = queryClient.getQueryData<User[]>(["users"]) ?? [];

            const updatedUsers = previousUsers.map(user =>
                user.id === userId ? { ...user, active: true } : user
            )

            queryClient.setQueryData(["users"], updatedUsers);

            return { previousUsers };
        },
        onError: (_error, _userId, context: any) => {
            if (context?.previousUsers) {
                queryClient.setQueryData(["users"], context.previousUsers);
            }
            toast.error("Error al activar el usuario. Por favor, inténtalo de nuevo.");
        },
        onSuccess: (response) => {
            toast.success("Usuario activado con éxito");
        },
        onSettled: () => {
            // queryClient.invalidateQueries({ queryKey: ["users"] })
        }

    })
}


function formDataToObject(formData: FormData): Record<string, any> {
    const obj: Record<string, any> = {};
    formData.forEach((value, key) => {

        if (key.endsWith("[]")) {
            const cleanKey = key.replace("[]", "");
            if (!obj[cleanKey]) obj[cleanKey] = [];
            obj[cleanKey].push(value);
        } else {
            obj[key] = value;
        }
    });
    return obj;
}


//function to convert UserFormData to FormData, including an optional image file
export function userFormDataToFormData(formData: UserFormData, imageFile?: File): FormData {
    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("passwordHash", formData.passwordHash ?? "");
    (Array.isArray(formData.phone) ? formData.phone : [formData.phone]).forEach(phone => data.append("phone[]", phone));
    data.append("active", String(formData.active));
    data.append("nationalId", formData.nationalId);
    if (imageFile) {
        data.append("imageUrl", imageFile);
    }
    if (formData.address) data.append("address", formData.address);
    if (formData.city) data.append("city", formData.city);
    if (formData.country) data.append("country", formData.country);
    if (formData.province) data.append("province", formData.province);
    formData.areaIds.forEach(id => data.append("areaIds[]", id));
    data.append("departmentId", formData.departmentId);
    if (formData.positionId) data.append("positionId", formData.positionId);
    return data;
}

export function getUserFullName(users: { id: string; fullNames: string }[], userId: string) {
    const user = users.find(u => u.id === userId);
    return user ? user.fullNames : "Sistema";
}


export function useAssignTechnicalLevel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRelationUserTechnicalLevel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Nivel técnico asignado con éxito");
        }
    })
}