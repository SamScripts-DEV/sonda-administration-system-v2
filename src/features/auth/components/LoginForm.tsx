"use client"

import type React from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, Router } from "lucide-react"
import { toast } from "sonner"

interface LoginFormProps {
  onForgotPassword: () => void
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
    const { loginAuth } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
        await loginAuth(email, password)
        router.push("/dashboard")
        
    } catch (error: any) {
        toast.error(error.message || "Error al iniciar sesión")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Iniciar Sesión</h2>
        <p className="text-muted-foreground">Accede a tu panel de administración</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="email"
              type="email"
              placeholder="nombre.apellido@sonda.com"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm text-muted-foreground">
              Recordarme
            </Label>
          </div>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        <p>¿Necesitas ayuda? Contacta a soporte técnico</p>
        <p className="font-medium text-primary">marco.vizcaino@sonda.com</p>
      </div>
    </div>
  )
}
