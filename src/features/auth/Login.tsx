"use client"

import { useState } from "react"
import { LoginForm } from "./components/LoginForm"
import { ForgotPasswordForm } from "./components/ForgotPasswordForm"
import { ResetPasswordForm } from "./components/ResetPasswordForm"
import Image from "next/image";

type AuthView = "login" | "forgot-password" | "reset-password"

export function LoginSystem() {
    const [currentView, setCurrentView] = useState<AuthView>("login")
    const [displayView, setDisplayView] = useState<AuthView>("login")
    const [isAnimating, setIsAnimating] = useState(false)

    const shouldSwapColumns = currentView === "forgot-password"

    const handleViewChange = (newView: AuthView) => {
        if (isAnimating) return

        // Start animation
        setIsAnimating(true)
        setCurrentView(newView)

        // Change display content at midpoint (350ms)
        setTimeout(() => {
            setDisplayView(newView)
        }, 350)

        // End animation after content has changed (450ms total)
        setTimeout(() => {
            setIsAnimating(false)
        }, 450)
    }

    const getBackgroundImage = () => {
        switch (displayView) {
            case "login":
                return "/Datacenter.jpg"
            case "forgot-password":
                return "/servers.jpg"
            case "reset-password":
                return "/Cyber.jpg"
            default:
                return "/Datacenter.jpg"
        }
    }

    const getBackgroundContent = () => {
        switch (displayView) {
            case "login":
                return {
                    title: "Bienvenido a SondaCloud",
                    subtitle: "Sistema de administración empresarial integral",
                    features: ["Gestión integral de personal", "Orquestación operativa", "Acceso unificado a recursos digitales", "Monitoreo y control", "Analítica y reportes estratégicos"],
                }
            case "forgot-password":
                return {
                    title: "Recupera tu acceso",
                    subtitle: "Mantén el control de tu plataforma de gestión empresarial",
                    features: ["Autenticación Segura", "Recuperación Rápida", "Acceso Protegido", "Soporte 24/7"],
                }
            case "reset-password":
                return {
                    title: "Nueva contraseña",
                    subtitle: "Fortalece la seguridad de tu cuenta empresarial",
                    features: ["Encriptación Avanzada", "Políticas de Seguridad", "Protección Total"],
                }
        }
    }

    const backgroundContent = getBackgroundContent()

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            <div
                className={`flex-1 flex items-center justify-center p-8 bg-white relative overflow-hidden transition-all duration-700 ease-in-out ${shouldSwapColumns ? "order-2" : "order-1"
                    }`}
            >
                <div
                    className={`w-full max-w-md relative z-10 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"
                        }`}
                >
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Image
                                    src="/LogoSONDA.png"
                                    alt="Logo"
                                    width={48}
                                    height={48}
                                    className="w-10 h-10 object-contain"
                                    priority
                                />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">SondaCloud</h1>
                        </div>
                    </div>

                    <div className="relative">
                        {displayView === "login" && <LoginForm onForgotPassword={() => handleViewChange("forgot-password")} />}
                        {displayView === "forgot-password" && (
                            <ForgotPasswordForm
                                onBackToLogin={() => handleViewChange("login")}
                                onResetPassword={() => handleViewChange("reset-password")}
                            />
                        )}
                        {displayView === "reset-password" && <ResetPasswordForm onBackToLogin={() => handleViewChange("login")} />}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-12 -translate-x-12" />
            </div>

            <div
                className={`flex-1 relative overflow-hidden transition-all duration-700 ease-in-out ${shouldSwapColumns ? "order-1" : "order-2"
                    }`}
            >
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                        style={{ backgroundImage: `url(${getBackgroundImage()})` }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70" />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-center p-12 text-white">
                        <div>
                            <h2 className="text-4xl font-bold mb-4 text-balance">{backgroundContent.title}</h2>
                            <p className="text-xl mb-8 text-primary-foreground/90 text-pretty">{backgroundContent.subtitle}</p>

                            <div className="space-y-4">
                                {backgroundContent.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                        <span className="text-lg">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
