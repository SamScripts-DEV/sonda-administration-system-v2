import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, fetchUsers, fetchUsersForSelect, User } from "@/features/user";
import { toast } from "sonner";

export function useUsers() {
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
        queryFn: fetchUsersForSelect,
    })
}

export function useCreteUser() {
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
                rolesDetails: formObj.rolesDetails ?? { global: [], local: [] },
                areas: formObj.areas ?? [],
                areasDetails: formObj.areasDetails ?? [],
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