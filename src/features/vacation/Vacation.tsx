"use client"

import { useEffect, useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { VacationTable } from "./components/VacationTable"
import { VacationForm } from "./components/VacationForm"
import { VacationDetails } from "./components/VacationDetails"
import { ApproveRejectModal } from "./components/ApproveRejectModal"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Plus, Search, Calendar, CalendarCheck, CalendarX, Clock, Plane } from "lucide-react"
import { SectionTitle } from "@/shared/components/SectionTitle"
import { VacationFormData, type VacationRequest } from "@/features/vacation"
import { useQueryClient } from "@tanstack/react-query"
import { useApproveOrRejectVacation, useCreateVacation, useDeleteVacation, useEditVacation, useFetchVacations } from "./hooks/useVacations"
import { useFetchUsers } from "@/features/user"



export function VacationManagementDashboard({ initialVacations }: { initialVacations: VacationRequest[] }) {
    const queryClient = useQueryClient()
    //const [vacations] = useState<VacationRequest[]>(mockVacations)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedVacation, setSelectedVacation] = useState<VacationRequest | null>(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
    const [isApproveRejectDialogOpen, setIsApproveRejectDialogOpen] = useState(false)

    useEffect(() => {
        queryClient.setQueryData(["vacations"], initialVacations)
    }, [queryClient])

    const { data: vacationsPre = [] } = useFetchVacations()
    const { data: users = [] } = useFetchUsers()

    const {mutate: createVacationReq} = useCreateVacation()
    const {mutate: editVacationReq} = useEditVacation()
    const {mutate: deleteVacationReq} = useDeleteVacation()
    const {mutate: approveOrRejectVacationReq} = useApproveOrRejectVacation()

    const vacations = vacationsPre.map(vac => {
        const user = users.find(u => u.id === vac.userId)
        return {
            ...vac,
            userName: user ? `${user.firstName} ${user.lastName}` : "Desconocido",
            userEmail: user?.email || "",
            areaName: user?.areas[0] || "-",
            createdByName: users.find(u => u.id === vac.createdById) ? `${users.find(u => u.id === vac.createdById)?.firstName} ${users.find(u => u.id === vac.createdById)?.lastName}` : "Desconocido",
        }
    })

    const filteredVacations = vacations.filter((vacation) => {
        const matchesSearch =
            vacation.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vacation.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vacation.observation?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || vacation.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const pendingRequests = vacations.filter((v) => v.status === "PENDING").length
    const approvedRequests = vacations.filter((v) => v.status === "APPROVED").length
    const rejectedRequests = vacations.filter((v) => v.status === "REJECTED").length
    const totalDaysPending = vacations.filter((v) => v.status === "PENDING").reduce((acc, v) => acc + v.daysRequested, 0)

    const handleCreateVacationRequest = (data: VacationFormData) => {
        createVacationReq(data, {
            onSuccess: () => setIsCreateDialogOpen(false)
        })
    }

    const handleUpdateVacationRequest = (data: VacationFormData) => {
        if (!selectedVacation) return;
        editVacationReq(
            {id: selectedVacation.id, data},
            {onSuccess: () => setIsEditDialogOpen(false)}
        )
    }

    const handleDeleteVacationRequest = (vacation: VacationRequest) => {
        deleteVacationReq(vacation.id, ) 
    }

    const handleApproveRejectVacationRequest = (data: {action: "APPROVED" | "REJECTED", observation?: string}) => {
        if (!selectedVacation) return;
        approveOrRejectVacationReq(
            {id: selectedVacation.id, action: data.action, observation: data.observation},
            {onSuccess: () => setIsApproveRejectDialogOpen(false)}
        )
    }

    return (
        <div className="min-h-screen bg-background">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SectionTitle icon={<Plane />} label="Vacaciones" />
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Solicitudes Pendientes</CardTitle>
                            <Clock className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-500">{pendingRequests}</div>
                            <p className="text-xs text-muted-foreground mt-1">{totalDaysPending} días solicitados</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Solicitudes Aprobadas</CardTitle>
                            <CalendarCheck className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">{approvedRequests}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Solicitudes Rechazadas</CardTitle>
                            <CalendarX className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">{rejectedRequests}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Solicitudes</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{vacations.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Buscar solicitudes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrar por estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="PENDING">Pendientes</SelectItem>
                                <SelectItem value="APPROVE">Aprobadas</SelectItem>
                                <SelectItem value="REJECT">Rechazadas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Nueva Solicitud
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Crear Nueva Solicitud de Vacaciones</DialogTitle>
                            </DialogHeader>
                            <VacationForm
                                onSubmit={handleCreateVacationRequest}
                                onCancel={() => setIsCreateDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Vacations Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Solicitudes de Vacaciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <VacationTable
                            vacations={filteredVacations}
                            onEdit={(vacation) => {
                                setSelectedVacation(vacation)
                                setIsEditDialogOpen(true)
                            }}
                            onDelete={handleDeleteVacationRequest}
                            onViewDetails={(vacation) => {
                                setSelectedVacation(vacation)
                                setIsDetailsDialogOpen(true)
                            }}
                            onApproveReject={(vacation) => {
                                setSelectedVacation(vacation)
                                setIsApproveRejectDialogOpen(true)
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Editar Solicitud de Vacaciones</DialogTitle>
                        </DialogHeader>
                        {selectedVacation && (
                            <VacationForm
                                vacation={selectedVacation}
                                onSubmit={handleUpdateVacationRequest}
                                onCancel={() => setIsEditDialogOpen(false)}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                {/* Details Dialog */}
                <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Detalles de la Solicitud</DialogTitle>
                        </DialogHeader>
                        {selectedVacation && <VacationDetails vacation={selectedVacation} />}
                    </DialogContent>
                </Dialog>

                {/* Approve/Reject Dialog */}
                <Dialog open={isApproveRejectDialogOpen} onOpenChange={setIsApproveRejectDialogOpen}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Aprobar o Rechazar Solicitud</DialogTitle>
                        </DialogHeader>
                        {selectedVacation && (
                            <ApproveRejectModal
                                vacation={selectedVacation}
                                onSubmit={handleApproveRejectVacationRequest}
                                onCancel={() => setIsApproveRejectDialogOpen(false)}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
