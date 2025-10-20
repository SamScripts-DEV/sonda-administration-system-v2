"use client"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import {
    UserSalarySelector,
    type User,
    SalarySummaryCard,
    SalaryHistoryTable,
    SalaryChart,
    SalaryForm,
    useFetchCurrentSalary,
    useFetchSalaryHistory,
    useCreateSalaryRecord
} from "@/features/salaries"
import { SalaryHistory } from "./types"
import { DollarSign, Plus, History, Shield, Banknote } from "lucide-react"
import { SectionTitle } from "@/shared/components/SectionTitle"
import { useFetchUsers, useUsersForSelect, getUserFullName } from "@/features/user"
import { get } from "http"


// Mock data
const mockUsers: User[] = [
    {
        id: "1",
        firstName: "Ana",
        lastName: "García",
        email: "ana.garcia@company.com",
        imageUrl: "/professional-woman-diverse.png",
    },
    {
        id: "2",
        firstName: "Carlos",
        lastName: "Rodríguez",
        email: "carlos.rodriguez@company.com",
        imageUrl: "/professional-man.png",
    },
    {
        id: "3",
        firstName: "María",
        lastName: "López",
        email: "maria.lopez@company.com",
    },
]

const mockSalaryHistory: Record<string, SalaryHistory[]> = {
    "1": [
        {
            id: "1",
            userId: "1",
            amount: 75000,
            validFrom: "2024-01-01T00:00:00Z",
            validTo: null,
            comment: "Aumento anual por desempeño excepcional",
            updatedBy: "admin",
            createdAt: "2024-01-01T10:00:00Z",
            updatedAt: "2024-01-01T10:00:00Z",

        },
        {
            id: "2",
            userId: "1",
            amount: 65000,
            validFrom: "2023-01-01T00:00:00Z",
            validTo: "2023-12-31T23:59:59Z",
            comment: "Salario base después de promoción",
            updatedBy: "admin",
            createdAt: "2023-01-01T10:00:00Z",
            updatedAt: "2023-01-01T10:00:00Z",
        },
        {
            id: "3",
            userId: "1",
            amount: 55000,
            validFrom: "2022-01-01T00:00:00Z",
            validTo: "2022-12-31T23:59:59Z",
            comment: "Salario inicial",
            updatedBy: "admin",
            createdAt: "2022-01-01T10:00:00Z",
            updatedAt: "2022-01-01T10:00:00Z",
        },
    ],
    "2": [
        {
            id: "4",
            userId: "2",
            amount: 85000,
            validFrom: "2024-01-01T00:00:00Z",
            validTo: null,
            comment: "Ajuste salarial 2024",
            updatedBy: "admin",
            createdAt: "2024-01-01T10:00:00Z",
            updatedAt: "2024-01-01T10:00:00Z",
        },
        {
            id: "5",
            userId: "2",
            amount: 80000,
            validFrom: "2023-06-01T00:00:00Z",
            validTo: "2023-12-31T23:59:59Z",
            comment: "Aumento por certificación",
            updatedBy: "admin",
            createdAt: "2023-06-01T10:00:00Z",
            updatedAt: "2023-06-01T10:00:00Z",

        },
    ],
}

export function SalaryManagementDashboard() {
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
    const [selectedSalary, setSelectedSalary] = useState<SalaryHistory | null>(null)

    //const userSalaryHistory = selectedUser ? mockSalaryHistory[selectedUser.id] || [] : []
    //const currentSalary = userSalaryHistory.find((s) => !s.validTo || new Date(s.validTo) > new Date()) || null

    const { data: users = [] } = useFetchUsers();
    const { data: usersForSelect = [] } = useUsersForSelect()

    const userId = selectedUser?.id ?? "";

    const { data: currentSalary } = useFetchCurrentSalary(userId);
    const { data: salaryHistory = [] } = useFetchSalaryHistory(userId);
    const { mutate: createSalaryRecord } = useCreateSalaryRecord(userId);

    const previousSalary = salaryHistory.length > 1 ? salaryHistory[1].amount : undefined
    console.log("Salary History:", salaryHistory);

    const sortedSalaryHistory = [...salaryHistory].sort(
        (a, b) => new Date(a.validFrom).getTime() - new Date(b.validFrom).getTime()
    );

    const mappedSalaryHistory = salaryHistory.map(salary => ({
        ...salary,
        updatedByName: getUserFullName(usersForSelect, salary.updatedBy),
    }));



    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SectionTitle icon={<Banknote />} label="Salarios" />
                {/* Security Notice */}
                <div className="mb-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-primary mb-1">Información Confidencial</h3>
                            <p className="text-sm text-muted-foreground">
                                Los datos salariales son confidenciales y están encriptados. Solo usuarios autorizados pueden acceder a
                                esta información.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - User Selector */}
                    <div className="lg:col-span-1">
                        <UserSalarySelector users={users} selectedUser={selectedUser} onSelectUser={setSelectedUser} />
                    </div>

                    {/* Right Column - Salary Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {!selectedUser ? (
                            <Card>
                                <CardContent className="p-12">
                                    <div className="text-center text-muted-foreground">
                                        <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                        <h3 className="text-lg font-semibold mb-2">Selecciona un usuario</h3>
                                        <p className="text-sm">
                                            Selecciona un usuario de la lista para ver su información salarial, historial y gráficos de
                                            evolución
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {/* Action Button */}
                                <div className="flex justify-end">
                                    <Button onClick={() => setIsFormDialogOpen(true)} className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        {currentSalary ? "Actualizar Salario" : "Registrar Salario"}
                                    </Button>
                                </div>

                                {/* Summary Card */}
                                <SalarySummaryCard
                                    currentSalary={currentSalary ?? null}
                                    userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
                                    previousSalary={previousSalary}
                                />

                                {/* Chart */}
                                {salaryHistory.length > 0 && <SalaryChart salaryHistory={sortedSalaryHistory} />}

                                {/* History Table */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <History className="h-5 w-5 text-primary" />
                                            Historial de Salarios
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <SalaryHistoryTable
                                            salaryHistory={mappedSalaryHistory}
                                            onViewDetails={(salary) => {
                                                setSelectedSalary(salary)
                                                setIsDetailsDialogOpen(true)
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                </div>

                {/* Form Dialog */}
                <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{currentSalary ? "Actualizar Salario" : "Registrar Nuevo Salario"}</DialogTitle>
                        </DialogHeader>
                        {selectedUser && (
                            <SalaryForm
                                userId={selectedUser.id}
                                userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
                                salary={currentSalary || undefined}
                                onSubmit={(data => {
                                    createSalaryRecord(data, {
                                        onSuccess: () => setIsFormDialogOpen(false)
                                    });
                                })}
                                onCancel={() => setIsFormDialogOpen(false)}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                {/* Details Dialog */}
                <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Detalles del Salario</DialogTitle>
                        </DialogHeader>
                        {selectedSalary && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Monto</p>
                                        <p className="text-2xl font-bold text-primary">
                                            ${selectedSalary.amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Estado</p>
                                        <p className="text-lg font-semibold">
                                            {!selectedSalary.validTo || new Date(selectedSalary.validTo) > new Date()
                                                ? "Activo"
                                                : "Histórico"}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Válido desde</p>
                                        <p className="font-medium">{new Date(selectedSalary.validFrom).toLocaleDateString("es-ES")}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Válido hasta</p>
                                        <p className="font-medium">
                                            {selectedSalary.validTo
                                                ? new Date(selectedSalary.validTo).toLocaleDateString("es-ES")
                                                : "Indefinido"}
                                        </p>
                                    </div>
                                </div>

                                {selectedSalary.comment && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Comentario</p>
                                        <p className="bg-muted p-3 rounded-lg">{selectedSalary.comment}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Actualizado por</p>
                                        <p className="font-medium">{getUserFullName(usersForSelect,selectedSalary.updatedBy) || "Sistema"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Fecha de registro</p>
                                        <p className="font-medium">{new Date(selectedSalary.createdAt).toLocaleDateString("es-ES")}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
