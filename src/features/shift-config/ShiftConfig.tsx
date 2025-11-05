"use client"

import { useEffect, useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { ShiftTypesTable } from "./components/ShiftTypesTable"
import { ShiftTypeForm } from "./components/ShiftTypeForm"
import { ShiftTypeDetailsModal } from "./components/ShiftTypeDetailsModal"
import { ShiftScheduleForm } from "./components/ShiftScheduleForm"
import { DeleteConfirmationModal } from "./components/DeleteConfirmation"
import { ShiftTypeRoleLocalForm } from "./components/ShiftTypeRoleLocalForm"
import { Plus, Search, Clock, Calendar, RotateCw, Shield, Users, SlidersHorizontal } from "lucide-react"
import { ShiftType, ShiftSchedule, ShiftTypeRoleLocal, AreaRole, ShiftTypeDto, ShiftScheduleDto, CreateShiftTypeRoleLocalDto } from "./types"
import { SectionTitle } from "@/shared/components/SectionTitle"
import { useQueryClient } from "@tanstack/react-query"
import { useActivateShiftType, useCreateShiftType, useDeleteShiftType, useEditShiftType, useFetchAreaRolesForSelect, useFetchShiftConfig } from "./hooks/useShiftConfig"
import { useCreateShiftSchedule, useDeleteShiftSchedule, useEditShiftSchedule, useFetchShiftSchedules } from "./hooks/useShiftConfigSchedule"
import { useCreateShiftConfigRelationToRole, useDeleteShiftConfigRelationToRole, useEditShiftConfigRelationToRole, useFetchShiftConfigRelationsToRole } from "./hooks/useShiftConfigRelationToRole"


export function ShiftTypeManagementDashboard({ initialShiftConfig }: { initialShiftConfig?: ShiftType[] }) {
    const queryClient = useQueryClient()

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedShiftType, setSelectedShiftType] = useState<ShiftType | null>(null)
    const [selectedSchedule, setSelectedSchedule] = useState<ShiftSchedule | null>(null)
    const [selectedRoleLocal, setSelectedRoleLocal] = useState<ShiftTypeRoleLocal | null>(null)

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
    const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
    const [isRoleLocalDialogOpen, setIsRoleLocalDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [shiftTypeToDelete, setShiftTypeToDelete] = useState<ShiftType | null>(null)

    useEffect(() => {
        queryClient.setQueryData(["shift-config"], initialShiftConfig)
    }, [initialShiftConfig, queryClient])

    const { data: shiftTypes = [] } = useFetchShiftConfig()
    const { data: areaRolesForSelect = [] } = useFetchAreaRolesForSelect()
    const { data: allSchedules = [] } = useFetchShiftSchedules()
    const { data: allRelationsShiftRole = [] } = useFetchShiftConfigRelationsToRole()
    
    const { mutate: createShiftType } = useCreateShiftType() 
    const { mutate: editedShiftTypes } = useEditShiftType()
    const { mutate: activateShiftType } = useActivateShiftType()
    const { mutate: deleteShiftType } = useDeleteShiftType()


    const { mutate: createShiftSchedule } = useCreateShiftSchedule()
    const { mutate: editShiftSchedule } = useEditShiftSchedule()
    const { mutate: deleteShiftSchedule } = useDeleteShiftSchedule() 


    const { mutate: createRelationShiftRole } = useCreateShiftConfigRelationToRole()
    const { mutate: editRelationShiftRole } = useEditShiftConfigRelationToRole()
    const { mutate: deleteRelationShiftRole } = useDeleteShiftConfigRelationToRole()

    const selectedShiftTypeSchedules = selectedShiftType
        ? allSchedules.filter(sch => sch.shiftTypeId === selectedShiftType.id)
        : []

    const selectedShiftTypeRoleLocals = selectedShiftType
        ? allRelationsShiftRole.filter(rel => rel.shiftTypeId === selectedShiftType.id)
        : []

    const filteredShiftTypes = shiftTypes.filter(
        (shiftType) =>
            shiftType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shiftType.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const activeShiftTypes = shiftTypes.filter((st) => st.isActive)
    const rotativeCount = activeShiftTypes.filter((st) => st.isRotative).length
    const standbyCount = activeShiftTypes.filter((st) => st.isStandby).length
    const totalSchedules = activeShiftTypes.reduce((acc, st) => acc + (st.schedules?.length || 0), 0)
    const totalRoleLocals = activeShiftTypes.reduce((acc, st) => acc + (st.roleLocals?.length || 0), 0)


    const handleCreateShiftType = (data: ShiftTypeDto) => {
        createShiftType(data,{
            onSuccess: () => setIsCreateDialogOpen(false)
        })
    }

    const handleEditShiftType = (formData: ShiftTypeDto) => {
        if (!selectedShiftType) return
        editedShiftTypes({id: selectedShiftType.id, data: formData }, {
            onSuccess: () => setIsEditDialogOpen(false)
        })

    }

    const handleActivateShiftType = (shiftType: ShiftType) => {
        activateShiftType(shiftType.id)
    }

    const handleDeleteClick = (shiftType: ShiftType) => {
        setShiftTypeToDelete(shiftType)
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = () => {
        if (shiftTypeToDelete) {
            deleteShiftType(shiftTypeToDelete.id, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setShiftTypeToDelete(null);
                }
            })
        }
    }



    const handleSaveSchedule = (data: ShiftScheduleDto) => {
        if(!selectedShiftType) return
        if (selectedSchedule) {
            editShiftSchedule({id: selectedSchedule.id, data}, {
                onSuccess: () => setIsScheduleDialogOpen(false)
            })
        }else {
            createShiftSchedule({ ...data, shiftTypeId: selectedShiftType.id }, {
                onSuccess: () => setIsScheduleDialogOpen(false)
            })
        }
    }

    const handleDeleteSchedule = (schedule: ShiftSchedule) => {
        deleteShiftSchedule(schedule.id)
    }


    const handleSaveRelationShiftRole = (data: CreateShiftTypeRoleLocalDto) => {
        if(!selectedShiftType) return
        if (selectedRoleLocal) {
            editRelationShiftRole(
                {id: selectedRoleLocal.id, data},
                {onSuccess: () => setIsRoleLocalDialogOpen(false)}
            
            )
        } else {
            createRelationShiftRole(
                { ...data, shiftTypeId: selectedShiftType.id },
                {onSuccess: () => setIsRoleLocalDialogOpen(false)}
            )
        }
    }

    const handleDeleteRelationShiftRole = (relation: ShiftTypeRoleLocal) => {
        deleteRelationShiftRole(relation.id)
    }




    return (
        <div className="min-h-screen bg-background">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SectionTitle icon={<SlidersHorizontal />} label="Configuración de Turnos" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tipos</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeShiftTypes.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">Activos</p>
                        </CardContent>
                    </Card>


                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Horarios Configurados</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalSchedules}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Roles Asignados</CardTitle>
                            <Users className="h-4 w-4 text-[#005af9]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#005af9]">{totalRoleLocals}</div>
                            <p className="text-xs text-muted-foreground mt-1">Total de asignaciones activas</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Buscar tipos de turno..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Nuevo Tipo de Turno
                    </Button>
                </div>

                {/* Shift Types Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tipos de Turno</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ShiftTypesTable
                            shiftTypes={filteredShiftTypes}
                            onEdit={(shiftType) => {
                                setSelectedShiftType(shiftType)
                                setIsEditDialogOpen(true)
                            }}
                            onDelete={handleDeleteClick}
                            onViewDetails={(shiftType) => {
                                setSelectedShiftType(shiftType)
                                setIsDetailsDialogOpen(true)
                            }}
                            onManageSchedules={(shiftType) => {
                                setSelectedShiftType(shiftType)
                                setIsDetailsDialogOpen(true)
                            }}
                            onActivate={handleActivateShiftType}
                        />
                    </CardContent>
                </Card>

                {/* Create Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Tipo de Turno</DialogTitle>
                        </DialogHeader>
                        <ShiftTypeForm
                            onSubmit={handleCreateShiftType}
                            onCancel={() => setIsCreateDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Editar Tipo de Turno</DialogTitle>
                        </DialogHeader>
                        {selectedShiftType && (
                            <ShiftTypeForm
                                shiftType={selectedShiftType}
                                onSubmit={handleEditShiftType}
                                onCancel={() => setIsEditDialogOpen(false)}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                {/* Details Dialog */}
                <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                    <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Detalles del Tipo de Turno</DialogTitle>
                        </DialogHeader>
                        {selectedShiftType && (
                            <ShiftTypeDetailsModal
                                shiftType={{...selectedShiftType, schedules: selectedShiftTypeSchedules, roleLocals: selectedShiftTypeRoleLocals}}
                                onAddSchedule={() => {
                                    setSelectedSchedule(null)
                                    setIsScheduleDialogOpen(true)
                                }}
                                onEditSchedule={(schedule) => {
                                    setSelectedSchedule(schedule)
                                    setIsScheduleDialogOpen(true)
                                }}
                                onDeleteSchedule={handleDeleteSchedule}
                                onAddRoleLocal={() => {
                                    setSelectedRoleLocal(null)
                                    setIsRoleLocalDialogOpen(true)
                                }}
                                onEditRoleLocal={(roleLocal) => {
                                    setSelectedRoleLocal(roleLocal)
                                    setIsRoleLocalDialogOpen(true)
                                }}
                                onDeleteRoleLocal={handleDeleteRelationShiftRole}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                {/* Schedule Dialog */}
                <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{selectedSchedule ? "Editar" : "Crear"} Horario</DialogTitle>
                        </DialogHeader>
                        {selectedShiftType && (
                            <ShiftScheduleForm
                                schedule={selectedSchedule || undefined}
                                shiftTypeId={selectedShiftType.id}
                                onSubmit={handleSaveSchedule}
                                onCancel={() => setIsScheduleDialogOpen(false)}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                {/* Role Local Dialog */}
                <Dialog open={isRoleLocalDialogOpen} onOpenChange={setIsRoleLocalDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{selectedRoleLocal ? "Editar" : "Nueva"} Asignación de Rol de Área</DialogTitle>
                        </DialogHeader>
                        {selectedShiftType && (
                            <ShiftTypeRoleLocalForm
                                roleLocal={selectedRoleLocal || undefined}
                                shiftTypeId={selectedShiftType.id}
                                availableAreaRoles={areaRolesForSelect}
                                onSubmit={handleSaveRelationShiftRole}
                                onCancel={() => setIsRoleLocalDialogOpen(false)}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                {shiftTypeToDelete && (
                    <DeleteConfirmationModal
                        isOpen={isDeleteDialogOpen}
                        onClose={() => {
                            setIsDeleteDialogOpen(false)
                            setShiftTypeToDelete(null)
                        }}
                        onConfirm={handleDeleteConfirm}
                        shiftTypeName={shiftTypeToDelete.name}
                    />
                )}
            </div>
        </div>
    )
}
