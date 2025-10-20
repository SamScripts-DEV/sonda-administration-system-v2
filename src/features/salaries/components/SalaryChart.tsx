"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { TrendingUp } from "lucide-react"
import { SalaryHistory } from "../types"


interface SalaryChartProps {
  salaryHistory: SalaryHistory[]
}

export function SalaryChart({ salaryHistory }: SalaryChartProps) {
  if (salaryHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Evolución Salarial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No hay datos suficientes para mostrar el gráfico</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = [...salaryHistory]
    .sort((a, b) => new Date(a.validFrom).getTime() - new Date(b.validFrom).getTime())
    .map((salary) => ({
      date: new Date(salary.validFrom).toLocaleDateString("es-ES"),
      amount: salary.amount,
      fullDate: new Date(salary.validFrom).toLocaleDateString("es-ES"),
    }))

  const minAmount = Math.min(...chartData.map((d) => d.amount))
  const maxAmount = Math.max(...chartData.map((d) => d.amount))
  const padding = (maxAmount - minAmount) * 0.1

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Evolución Salarial
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#005af9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#005af9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis
              domain={[minAmount - padding, maxAmount + padding]}
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg shadow-lg p-3">
                      <p className="text-sm font-medium mb-1">{payload[0].payload.fullDate}</p>
                      <p className="text-lg font-bold text-primary">
                        ${Number(payload[0].value).toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area type="stepAfter" dataKey="amount" stroke="#005af9" strokeWidth={2} fill="url(#colorAmount)" />
          </AreaChart>
        </ResponsiveContainer>

        {chartData.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            <div
              className={`flex items-center gap-1 ${
                chartData[chartData.length - 1].amount > chartData[0].amount ? "text-green-600" : "text-red-600"
              }`}
            >
              <TrendingUp
                className={`h-4 w-4 ${chartData[chartData.length - 1].amount < chartData[0].amount && "rotate-180"}`}
              />
              <span className="font-medium">
                {(((chartData[chartData.length - 1].amount - chartData[0].amount) / chartData[0].amount) * 100).toFixed(
                  1,
                )}
                %
              </span>
            </div>
            <span className="text-muted-foreground">cambio total</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
