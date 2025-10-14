"use client"

import { useEffect, useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { AreaForm, AreaDetails, type Area,
  useAreas,
  useCreateArea,
  CreateAreaData,
  useEditArea,
  useDeleteArea
} from "@/features/area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Plus, Search, Building, Users, Shield, Edit, Trash2, Eye, Calendar } from "lucide-react"
import { SectionTitle } from "@/shared/components/SectionTitle"
import { useQueryClient } from "@tanstack/react-query"


export function AreaManagementDashboard({ initialAreas }: { initialAreas: Area[] }) {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArea, setSelectedArea] = useState<Area | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)


  useEffect(() => {
    queryClient.setQueryData(["areas"], initialAreas)
  }, [initialAreas, queryClient])


  const {data: areas = []} = useAreas()
  const {mutate: createArea} = useCreateArea()
  const {mutate: editArea} = useEditArea()
  const {mutate: deleteArea} = useDeleteArea()

  const filteredAreas = areas.filter(
    (area) =>
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalUsers = areas.reduce((acc, area) => acc + (area.users?.length || 0), 0)
  const totalRoles = areas.reduce((acc, area) => acc + (area.roles?.length || 0), 0)
  const areasWithUsers = areas.filter((area) => (area.users?.length || 0) > 0).length


  const handleCreateArea = (formData: CreateAreaData) => {
    createArea(formData, {
      onSuccess: () => setIsCreateDialogOpen(false),
    })
  }

  const handleEditArea = (formData: CreateAreaData) => {
    if (!selectedArea) return
    editArea({ id: selectedArea.id, area: formData }, {
      onSuccess: () => setIsEditDialogOpen(false),
    })

  }

  const handleDeleteArea = (id: string) => {
    deleteArea(id, {
      onSuccess: () => {
        setSelectedArea(null)
        setIsDetailsDialogOpen(false)
      },
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionTitle icon={<Building />} label="Áreas" />


        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar áreas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
              
            />
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nueva Área
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nueva Área</DialogTitle>
              </DialogHeader>
              <AreaForm
                onSubmit={handleCreateArea}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAreas.map((area) => (
            <Card key={area.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-semibold text-balance">{area.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedArea(area)
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
                        setSelectedArea(area)
                        setIsEditDialogOpen(true)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button> 
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteArea(area.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Description */}
                <div>
                  <p className="text-sm text-muted-foreground text-pretty">{area.description || "Sin descripción"}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">{area.users?.length || 0}</p>
                      <p className="text-xs text-muted-foreground">Usuarios</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{area.roles?.length || 0}</p>
                      <p className="text-xs text-muted-foreground">Roles</p>
                    </div>
                  </div>
                </div>

                {/* Created Date */}
                {area.createdAt && (
                  <div className="flex items-center space-x-2 pt-2 border-t">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Creada: {new Date(area.createdAt).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAreas.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron áreas</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza creando tu primera área"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Área
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Área</DialogTitle>
            </DialogHeader>
            {selectedArea && (
              <AreaForm
                area={selectedArea}
                onSubmit={handleEditArea}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalles de la Área</DialogTitle>
            </DialogHeader>
            {selectedArea && <AreaDetails area={selectedArea} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
