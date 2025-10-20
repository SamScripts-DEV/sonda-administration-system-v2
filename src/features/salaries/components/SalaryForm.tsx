"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import { Calendar, DollarSign, AlertCircle, Save, X } from "lucide-react"
import { SalaryHistory, SalaryFormData } from "../types"


interface SalaryFormProps {
  userId: string
  userName: string
  salary?: SalaryHistory
  onSubmit: (data: SalaryFormData) => void
  onCancel: () => void
}

export function SalaryForm({ userId, userName, salary, onSubmit, onCancel }: SalaryFormProps) {
  const [formData, setFormData] = useState<SalaryFormData>({
    userId: salary?.userId || userId,
    amount: salary?.amount || 0,
    validFrom: salary?.validFrom ? salary.validFrom.split("T")[0] : new Date().toISOString().split("T")[0],
    validTo: salary?.validTo ? salary.validTo.split("T")[0] : "",
    comment: salary?.comment || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "El monto debe ser mayor a 0"
    }

    if (!formData.validFrom) {
      newErrors.validFrom = "La fecha de inicio es requerida"
    }

    if (formData.validTo && formData.validFrom && new Date(formData.validTo) <= new Date(formData.validFrom)) {
      newErrors.validTo = "La fecha de fin debe ser posterior a la fecha de inicio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const validFromISO = new Date(`${formData.validFrom}T00:00:00`).toISOString();
      const validToISO = formData.validTo
        ? new Date(`${formData.validTo}T00:00:00`).toISOString()
        : "";

      onSubmit({
        ...formData,
        validFrom: validFromISO,
        validTo: validToISO,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert className="bg-primary/5 border-primary/20">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          Estás {salary ? "actualizando" : "creando"} el salario para <strong>{userName}</strong>. Esta información es
          confidencial y será encriptada.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label htmlFor="amount" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            Monto del Salario *
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount || ""}
            onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) || 0 })}
            className={errors.amount ? "border-destructive" : ""}
          />
          {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="validFrom" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Válido desde *
            </Label>
            <Input
              id="validFrom"
              type="date"
              value={formData.validFrom}
              onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
              className={errors.validFrom ? "border-destructive" : ""}
            />
            {errors.validFrom && <p className="text-sm text-destructive mt-1">{errors.validFrom}</p>}
          </div>

          <div>
            <Label htmlFor="validTo" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Válido hasta (opcional)
            </Label>
            <Input
              id="validTo"
              type="date"
              value={formData.validTo}
              onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
              className={errors.validTo ? "border-destructive" : ""}
            />
            {errors.validTo && <p className="text-sm text-destructive mt-1">{errors.validTo}</p>}
            <p className="text-xs text-muted-foreground mt-1">Dejar vacío para salario indefinido</p>
          </div>
        </div>

        <div>
          <Label htmlFor="comment">Comentario (opcional)</Label>
          <Textarea
            id="comment"
            placeholder="Ej: Aumento por desempeño, ajuste anual, promoción..."
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Agrega un comentario para documentar el motivo del cambio
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          {salary ? "Actualizar Salario" : "Guardar Salario"}
        </Button>
      </div>
    </form>
  )
}
