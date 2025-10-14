"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Switch } from "@/shared/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Upload, X } from "lucide-react"
import type { User, UserFormData } from "@/features/user"
import { useAreas } from "@/features/area"
import { useDepartments } from "@/features/department"
import { usePositions } from "@/features/position"



interface UserFormProps {
    user?: User
    onSubmit: (data: UserFormData, imageFile?: File) => void
    onCancel: () => void
}


export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
    const { data: areas = [] } = useAreas();
    const { data: departments = [] } = useDepartments()
    const { data: positions = [] } = usePositions()


    const [formData, setFormData] = useState<UserFormData>({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        username: user?.username || "",
        email: user?.email || "",
        passwordHash: "",
        phone: user?.phone || [],
        active: user?.active ?? true,
        nationalId: user?.nationalId || "",
        image: user?.imageUrl || "",
        address: user?.address || "",
        city: user?.city || "",
        country: user?.country || "",
        province: user?.province || "",
        areaIds: user?.areasDetailed?.map((area) => area.id) || [],
        departmentId: user?.departmentId || "",
        positionId: user?.positionId || "",
    })


    const [imagePreview, setImagePreview] = useState<string | null>(user?.imageUrl || null)
    const [imageFile, setImageFile] = useState<File | null>(null)

    const handleInputChange = (field: keyof UserFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                const result = e.target?.result as string
                setImagePreview(result)
                handleInputChange("image", result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleAreaToggle = (areaId: string) => {
        const currentAreas = formData.areaIds
        const newAreas = currentAreas.includes(areaId)
            ? currentAreas.filter((id) => id !== areaId)
            : [...currentAreas, areaId]
        handleInputChange("areaIds", newAreas)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, imageFile || undefined);
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Foto de Perfil</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={imagePreview || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                {formData.firstName && formData.lastName ? getInitials(formData.firstName, formData.lastName) : "US"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <Label htmlFor="image-upload" className="cursor-pointer">
                                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors">
                                    <div className="text-center">
                                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">Haz clic para subir una imagen</p>
                                    </div>
                                </div>
                                <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </Label>
                            {imagePreview && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setImagePreview(null)
                                        handleInputChange("image", "")
                                    }}
                                    className="mt-2"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Eliminar imagen
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName">Nombres *</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                required

                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Apellidos *</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="username">Nombre de Usuario *</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => handleInputChange("username", e.target.value)}
                                required

                            />
                        </div>
                        <div>
                            <Label htmlFor="nationalId">Documento de Identidad *</Label>
                            <Input
                                id="nationalId"
                                value={formData.nationalId}
                                onChange={(e) => handleInputChange("nationalId", e.target.value)}
                                required

                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                required

                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Teléfono *</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                required

                            />
                        </div>
                    </div>

                    {!user && (
                        <div>
                            <Label htmlFor="password">Contraseña *</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.passwordHash}
                                onChange={(e) => handleInputChange("passwordHash", e.target.value)}
                                required={!user}

                            />
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="active"
                            checked={formData.active}
                            onCheckedChange={(checked) => handleInputChange("active", checked)}
                        />
                        <Label htmlFor="active">Usuario activo</Label>
                    </div>
                </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Información de Dirección</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="address">Dirección</Label>
                        <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            rows={2}
                            required

                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="city">Ciudad</Label>
                            <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => handleInputChange("city", e.target.value)}
                                required

                            />
                        </div>
                        <div>
                            <Label htmlFor="province">Provincia</Label>
                            <Input
                                id="province"
                                value={formData.province}
                                onChange={(e) => handleInputChange("province", e.target.value)}
                                required

                            />
                        </div>
                        <div>
                            <Label htmlFor="country">País</Label>
                            <Input
                                id="country"
                                value={formData.country}
                                onChange={(e) => handleInputChange("country", e.target.value)}
                                required

                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Organization Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Información Organizacional</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="department">Departamento *</Label>
                            <Select
                                value={formData.departmentId}
                                onValueChange={(value) => handleInputChange("departmentId", value)}
                                required
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccionar departamento" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="position">Cargo</Label>
                            <Select value={formData.positionId} onValueChange={(value) => handleInputChange("positionId", value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccionar cargo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {positions.map((pos) => (
                                        <SelectItem key={pos.id} value={pos.id}>
                                            {pos.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label>Areas Asignadas</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {areas.map((area) => (
                                <div key={area.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`area-${area.id}`}
                                        checked={formData.areaIds.includes(area.id)}
                                        onChange={() => handleAreaToggle(area.id)}
                                        className="rounded border-border"
                                    />
                                    <Label htmlFor={`area-${area.id}`} className="text-sm">
                                        {area.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit">{user ? "Actualizar Usuario" : "Crear Usuario"}</Button>
            </div>
        </form>
    )
}
