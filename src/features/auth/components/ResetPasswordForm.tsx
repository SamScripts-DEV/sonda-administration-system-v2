"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, Key } from "lucide-react"

interface ResetPasswordFormProps {
  onBackToLogin: () => void
}

export function ResetPasswordForm({ onBackToLogin }: ResetPasswordFormProps) {
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordReset, setPasswordReset] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }
    setIsLoading(true)
    // Simulate password reset
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setPasswordReset(true)
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(newPassword)
  const strengthLabels = ["Muy débil", "Débil", "Regular", "Fuerte", "Muy fuerte"]
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]

  if (passwordReset) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Contraseña Actualizada</h2>
          <p className="text-muted-foreground">Tu contraseña ha sido cambiada exitosamente</p>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-sm text-green-800">
            Por seguridad, todas las sesiones activas han sido cerradas. Deberás iniciar sesión nuevamente.
          </p>
        </div>

        <Button onClick={onBackToLogin} className="w-full">
          Iniciar Sesión
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Nueva Contraseña</h2>
        <p className="text-muted-foreground">Ingresa el código de recuperación y tu nueva contraseña</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recovery-code">Código de Recuperación</Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="recovery-code"
              type="text"
              placeholder="Ingresa el código de 6 dígitos"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="pl-10 tracking-widest"
              maxLength={6}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">Nueva Contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {newPassword && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded ${
                      i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Fortaleza: {strengthLabels[passwordStrength - 1] || "Muy débil"}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-red-600">Las contraseñas no coinciden</p>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Requisitos de contraseña:</strong>
          </p>
          <ul className="text-xs text-amber-700 mt-1 space-y-1">
            <li>• Mínimo 8 caracteres</li>
            <li>• Al menos una mayúscula y una minúscula</li>
            <li>• Al menos un número</li>
            <li>• Al menos un carácter especial</li>
          </ul>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || newPassword !== confirmPassword || passwordStrength < 3}
        >
          {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
        </Button>
      </form>

      <Button variant="ghost" onClick={onBackToLogin} className="w-full">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al inicio de sesión
      </Button>
    </div>
  )
}
