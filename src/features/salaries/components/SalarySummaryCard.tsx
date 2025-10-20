"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { DollarSign, Calendar, MessageSquare, TrendingUp } from "lucide-react"
import { SalaryHistory } from "../types"

interface SalarySummaryCardProps {
  currentSalary: SalaryHistory | null
  userName: string
  previousSalary?: number
}

export function SalarySummaryCard({ currentSalary, userName, previousSalary }: SalarySummaryCardProps) {
  if (!currentSalary) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No hay información salarial disponible</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const salaryChange = previousSalary ? ((currentSalary.amount - previousSalary) / previousSalary) * 100 : 0
  const isIncrease = salaryChange > 0

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Salario Actual</span>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Activo
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Usuario</p>
          <p className="text-lg font-semibold">{userName}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Monto</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-primary">
              ${currentSalary.amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
            </p>
            {previousSalary && salaryChange !== 0 && (
              <div className={`flex items-center gap-1 text-sm ${isIncrease ? "text-green-600" : "text-red-600"}`}>
                <TrendingUp className={`h-4 w-4 ${!isIncrease && "rotate-180"}`} />
                <span>{Math.abs(salaryChange).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              <span>Válido desde</span>
            </div>
            <p className="font-medium">{new Date(currentSalary.validFrom).toLocaleDateString("es-ES")}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              <span>Válido hasta</span>
            </div>
            <p className="font-medium">
              {currentSalary.validTo ? new Date(currentSalary.validTo).toLocaleDateString("es-ES") : "Indefinido"}
            </p>
          </div>
        </div>

        {currentSalary.comment && (
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <MessageSquare className="h-4 w-4" />
              <span>Comentario</span>
            </div>
            <p className="text-sm bg-muted p-3 rounded-lg">{currentSalary.comment}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
