"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"

interface ForgotPasswordFormProps {
  onBackToLogin: () => void
  onResetPassword: () => void
}

export function ForgotPasswordForm({ onBackToLogin, onResetPassword }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setEmailSent(true)
  }

  if (emailSent) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Correo Enviado</h2>
          <p className="text-muted-foreground">
            Hemos enviado las instrucciones de recuperación a tu correo electrónico
          </p>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Si no recibes el correo en los próximos minutos:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Revisa tu carpeta de spam</li>
            <li>• Verifica que el correo sea correcto</li>
            <li>• Contacta a soporte técnico</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button onClick={onResetPassword} className="w-full">
            Ya tengo el código de recuperación
          </Button>
          <Button variant="outline" onClick={onBackToLogin} className="w-full bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio de sesión
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Recuperar Contraseña</h2>
        <p className="text-muted-foreground">Ingresa tu correo electrónico y te enviaremos las instrucciones</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recovery-email">Correo Electrónico</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="recovery-email"
              type="email"
              placeholder="usuario@sondacloud.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> El enlace de recuperación será válido por 24 horas por motivos de seguridad.
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar Instrucciones"}
        </Button>
      </form>

      <Button variant="ghost" onClick={onBackToLogin} className="w-full">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al inicio de sesión
      </Button>
    </div>
  )
}
