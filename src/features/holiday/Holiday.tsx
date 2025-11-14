"use client"

import { useEffect, useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { HolidayForm, HolidayDetailsModal, type Holiday, useCreateHoliday, useEditHoliday, useDeleteHoliday, HolidayFormData } from "@/features/holiday"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Plus, Search, Calendar, CalendarDays, CalendarCheck, Edit, Trash2, Eye } from "lucide-react"
import { Badge } from "@/shared/components/ui/badge"
import { SectionTitle } from "@/shared/components/SectionTitle"
import { useQueryClient } from "@tanstack/react-query"
import { useFetchHolidays } from "@/features/holiday"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"



export function HolidayManagementDashboard({ initialHolidays }: { initialHolidays: Holiday[] }) {
    const queryClient = useQueryClient()
    //const [holidays] = useState<Holiday[]>(mockHolidays)
    const currentYear = new Date().getFullYear()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
    const [selectedYear, setSelectedYear] = useState(currentYear)

    useEffect(() => {
        queryClient.setQueryData(["holidays"], initialHolidays)
    }, [queryClient])

    const { data: holidays = [] } = useFetchHolidays(selectedYear)
    const { mutate: createHoliday } = useCreateHoliday()
    const { mutate: editHoliday } = useEditHoliday()
    const { mutate: deleteHoliday } = useDeleteHoliday()


    const filteredHolidays = holidays.filter(
        (holiday) =>
            holiday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            holiday.observation?.toLowerCase().includes(searchTerm.toLowerCase()),
    )


    const totalDays = holidays.reduce((acc, holiday) => {
        const start = new Date(holiday.startDate)
        const end = new Date(holiday.endDate)
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
        return acc + days
    }, 0)

    const upcomingHolidays = holidays.filter((holiday) => new Date(holiday.startDate) > new Date()).length

    const currentMonth = new Date().getMonth()
    const holidaysThisMonth = holidays.filter((holiday) => new Date(holiday.startDate).getMonth() === currentMonth).length

    const calculateDuration = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffMs = end.getTime() - start.getTime();
        const oneDayMs = 1000 * 60 * 60 * 24;
        return Math.floor(diffMs / oneDayMs) + 1;
    };


    const formatDateRange = (startDate: string, endDate: string) => {
        const start = new Date(startDate)
        const end = new Date(endDate)
        const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }

        if (startDate === endDate) {
            return start.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
        }

        return `${start.toLocaleDateString("es-ES", options)} - ${end.toLocaleDateString("es-ES", { ...options, year: "numeric" })}`
    }


    const isUpcoming = (startDate: string) => {
        return new Date(startDate) > new Date()
    }

    const handleCreateHoliday = (data: HolidayFormData) => {
        createHoliday(data, {
            onSuccess: () => setIsCreateDialogOpen(false)
        })
    }

    const handleUpdateHoliday = (data: Partial<HolidayFormData>) => {
        if (!selectedHoliday) return
        editHoliday({ id: selectedHoliday.id, data }, {
            onSuccess: () => {
                setIsEditDialogOpen(false)
            }
        })
    }

    const handleDeleteHoliday = (id: string) => {
        deleteHoliday(id)
    }

    return (
        <div className="min-h-screen bg-background">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SectionTitle icon={<CalendarCheck />} label="Feriados" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Feriados</CardTitle>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{holidays.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">{totalDays} días en total</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Próximos Feriados</CardTitle>
                            <CalendarCheck className="h-4 w-4 text-success" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-success">{upcomingHolidays}</div>
                            <p className="text-xs text-muted-foreground mt-1">Por venir este año</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Este Mes</CardTitle>
                            <Calendar className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">{holidaysThisMonth}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Feriados en {new Date().toLocaleDateString("es-ES", { month: "long" })}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex gap-2 w-full max-w-md">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Buscar feriados..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={String(selectedYear)} onValueChange={val => setSelectedYear(Number(val))}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Año" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 2030 - currentYear + 1 }, (_, i) => currentYear + i).map(year => (
                                    <SelectItem key={year} value={String(year)}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>


                    </div>

                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Nuevo Feriado
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Crear Nuevo Feriado</DialogTitle>
                            </DialogHeader>
                            <HolidayForm
                                onSubmit={handleCreateHoliday}
                                onCancel={() => setIsCreateDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Holiday Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHolidays.map((holiday) => {
                        const duration = calculateDuration(holiday.startDate, holiday.endDate)
                        const upcoming = isUpcoming(holiday.startDate)

                        return (
                            <Card
                                key={holiday.id}
                                className="hover:shadow-lg transition-shadow duration-200 relative overflow-hidden"
                            >
                                {/* Colored accent bar */}
                                <div className={`absolute top-0 left-0 right-0 h-1 ${upcoming ? "bg-accent" : "bg-muted"}`} />

                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="h-5 w-5 text-primary" />
                                                {upcoming && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Próximo
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardTitle className="text-lg font-semibold text-balance">{holiday.name}</CardTitle>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedHoliday(holiday)
                                                    setIsDetailsDialogOpen(true)
                                                }}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedHoliday(holiday)
                                                    setIsEditDialogOpen(true)
                                                }}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteHoliday(holiday.id)}
                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Date Range */}
                                    <div className="bg-muted/50 rounded-lg p-3">
                                        <p className="text-sm font-medium text-primary mb-1">
                                            {formatDateRange(holiday.startDate, holiday.endDate)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{duration === 1 ? "1 día" : `${duration} días`}</p>
                                    </div>

                                    {/* Observation */}
                                    {holiday.observation && (
                                        <div>
                                            <p className="text-sm text-muted-foreground text-pretty">{holiday.observation}</p>
                                        </div>
                                    )}

                                    {/* Footer Info */}
                                    <div className="pt-2 border-t">
                                        <p className="text-xs text-muted-foreground">
                                            Creado: {new Date(holiday.createdAt).toLocaleDateString("es-ES")}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Empty State */}
                {filteredHolidays.length === 0 && (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No se encontraron feriados</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando el primer feriado del año"}
                            </p>
                            {!searchTerm && (
                                <Button onClick={() => setIsCreateDialogOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Nuevo Feriado
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Editar Feriado</DialogTitle>
                        </DialogHeader>
                        {selectedHoliday && (
                            <HolidayForm
                                holiday={selectedHoliday}
                                onSubmit={handleUpdateHoliday}
                                onCancel={() => setIsEditDialogOpen(false)}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                {/* Details Modal */}
                {selectedHoliday && (
                    <HolidayDetailsModal
                        holiday={selectedHoliday}
                        isOpen={isDetailsDialogOpen}
                        onClose={() => setIsDetailsDialogOpen(false)}
                    />
                )}
            </div>
        </div>
    )
}
