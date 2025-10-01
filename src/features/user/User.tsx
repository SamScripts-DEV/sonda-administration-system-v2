"use client"

import { useEffect, useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { UserTable, UserForm, UserDetails, User,
    useFetchUsers, 
    useCreateUser,
    useEditUser,
    useDeleteUser,
    UserFormData,
    userFormDataToFormData,
    useActivateUser
 } from "@/features/user"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Plus, Search, Users, UserCheck, UserX, Building } from "lucide-react"
import { SectionTitle } from "@/shared/components/SectionTitle"
import { useQueryClient } from "@tanstack/react-query"



export function UserManagementDashboard({ initialUsers }: { initialUsers: User[] }) {
    const queryClient = useQueryClient()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

    useEffect(() => {
        queryClient.setQueryData(["users"], initialUsers);
    }, [initialUsers, queryClient]);

    const { data: users = [] } = useFetchUsers();
    const {mutate: createUser} = useCreateUser();
    const {mutate: editUser} = useEditUser();
    const {mutate: deleteUser} = useDeleteUser();
    const {mutate: activateUser} = useActivateUser();


    users.forEach((user, idx) => {
        if (!user.firstName || !user.lastName || !user.email || !user.username) {
            console.warn(`Usuario con campos faltantes en posición ${idx}:`, user);
        }
    });

    const filteredUsers = users.filter(
        (user) =>
            (user.firstName).toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const activeUsers = users.filter((user) => user.active).length
    const inactiveUsers = users.filter((user) => !user.active).length

    const handleCreateUser = (formData: UserFormData, imageFile?: File ) => {
        const data =  userFormDataToFormData(formData, imageFile);
        createUser(data, {
            onSuccess: () => setIsCreateDialogOpen(false)
        });
    };


    const handleEditUser = (formData: UserFormData, imageFile?: File ) => {
        if (!selectedUser) return;
        const data = userFormDataToFormData(formData, imageFile);
        editUser({id: selectedUser.id, formData: data}, {
            onSuccess: () => setIsEditDialogOpen(false)
        });

    }

    const handleDeleteUser = (user:User) => {
        deleteUser(user.id)
    }

    const handleActivateUser = (user: User) => {
        activateUser(user.id)
    }

    return (
        <div className="min-h-screen bg-background">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SectionTitle icon={<Users />} label="Usuarios" />
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Usuarios</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios Activos</CardTitle>
                            <UserCheck className="h-4 w-4 text-accent" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-accent">{activeUsers}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios Inactivos</CardTitle>
                            <UserX className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">{inactiveUsers}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Departamentos</CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">8</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Buscar usuarios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2 bg-primary">
                                <Plus className="h-4 w-4" />
                                Nuevo Usuario
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                            </DialogHeader>
                            <UserForm
                                onSubmit={handleCreateUser}
                                onCancel={() => setIsCreateDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Usuarios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UserTable
                            users={filteredUsers}
                            onEdit={(user) => {
                                setSelectedUser(user)
                                setIsEditDialogOpen(true)
                            }}
                            onDelete={handleDeleteUser}
                            onActivate={handleActivateUser}
                            onViewDetails={(user) => {
                                setSelectedUser(user)
                                setIsDetailsDialogOpen(true)
                            }}
                            onAssignRoles={(user) => {
                                console.log("Assign roles to user:", user.id)
                            }}
                            onUploadImage={(user) => {
                                console.log("Upload image for user:", user.id)
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Editar Usuario</DialogTitle>
                        </DialogHeader>
                        {selectedUser && (
                            <UserForm
                                user={selectedUser}
                                onSubmit={handleEditUser}
                                onCancel={() => setIsEditDialogOpen(false)}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                {/* Details Dialog */}
                <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Detalles del Usuario</DialogTitle>
                        </DialogHeader>
                        {selectedUser && <UserDetails user={selectedUser} />}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
