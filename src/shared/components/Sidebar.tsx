"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import {
    Home,
    Ticket,
    ClipboardList,
    LogOut,
    ChevronDown,
    Users,
    CalendarDays,
    Plane,
    UserCheck,
    CalendarHeart,
    CalendarClock,
    TextSearch,
    LayoutDashboard,
    ScanText,
    Newspaper,
    Shield,
    Building,
    Briefcase,
    Container,
    UserCog,
    Building2,
    UserSquare,
    CalendarCheck,
    SlidersHorizontal,
    Banknote,
    ClipboardCheck
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "./ui/dropdown-menu"
import { Separator } from "./ui/separator"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"



function getInitials(name: string) {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0]?.toUpperCase() || "";
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}


interface SubMenuItem {
    icon: React.ReactNode
    label: string
    href?: string
    badge?: string
}

interface MenuItem {
    icon: React.ReactNode
    label: string
    href?: string
    subItems?: SubMenuItem[]
    badge?: string
}

interface MenuSection {
    title: string
    items: MenuItem[]
}

const menuSections: MenuSection[] = [
    {
        title: "Gestión",
        items: [
            {
                icon: <SlidersHorizontal />,
                label: "Administración",
                subItems: [
                    { icon: <UserCog />, label: "Usuarios", href: "/users" },
                    { icon: <Shield />, label: "Roles y Permisos", href: "/roles" },
                    //{ icon: <Container />, label: "Departamentos", href: "/users" },
                    { icon: <Building2 />, label: "Áreas", href: "/areas" },
                    //{ icon: <Briefcase />, label: "Cargos", href: "/users" },
                ],
            },
            {
                icon: <UserSquare />,
                label: "Recursos Humanos",
                subItems: [
                    {icon: <Plane />, label: "Vacaciones", href: "/vacations"},
                    {icon: <CalendarCheck/>, label: "Feriados", href: "/holidays"},
                    {icon: <Banknote />, label: "Salarios", href: "/salaries"}
                ] 

            },
            {
                icon: <CalendarClock />,
                label: "Turnos",
                subItems: [
                    {icon: <SlidersHorizontal />, label: "Configuración de Turnos", href: "/shift-config"},
                    {icon: <ClipboardCheck />, label: "Asignación de Turnos"}
                ]
            }
        ],
    },


]

export default function Sidebar({ isHidden = false }: { isHidden?: boolean }) {
    const { user, logoutAuth } = useAuth()
    const [isExpanded, setIsExpanded] = useState(false)
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const [imgLoaded, setImgLoaded] = useState(false);

    const pathname = usePathname()



    const shouldStayExpanded = isExpanded || profileDropdownOpen

    useEffect(() => {
        const handleMouseLeave = () => {
            if (profileDropdownOpen) return
            setIsExpanded(false)
            setExpandedItems([])
        }

        const handleClickOutside = (e: MouseEvent) => {
            const sidebar = document.getElementById("sidebar")
            const target = e.target as Element

            if (sidebar?.contains(target) || target.closest("[data-radix-popper-content-wrapper]")) {
                return
            }

            setIsExpanded(false)
            setExpandedItems([])
        }

        const sidebar = document.getElementById("sidebar")
        sidebar?.addEventListener("mouseleave", handleMouseLeave)
        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            sidebar?.removeEventListener("mouseleave", handleMouseLeave)
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [profileDropdownOpen])

    const toggleSubMenu = (label: string) => {
        setExpandedItems((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
    }

    if (isHidden) return null

    return (
        <div
            id="sidebar"
            className={cn(
                "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col",
                shouldStayExpanded ? "w-72" : "w-16",
            )}
            onMouseEnter={() => setIsExpanded(true)}
        >
            {/* Header*/}
            <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                {shouldStayExpanded ? (
                    <div className="flex items-center gap-2 ">
                        <img src="/Logo-sonda.svg" alt="Logo Sonda" className="h-8 w-auto" />

                    </div>
                ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <img src="/logoSONDA.png" alt="Logo Sonda" />
                    </div>
                )}
            </div>

            {/* Navigation  */}
            <div
                className="flex-1 overflow-y-auto"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}

            >
                <nav className="p-2 space-y-1">
                    {menuSections.map((section, sectionIndex) => (
                        <div key={section.title}>
                            {shouldStayExpanded && (
                                <div className="px-3 py-2 mt-4 first:mt-2">
                                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        {section.title}
                                    </h3>
                                </div>
                            )}

                            {section.items
                                .map((item) => {

                                    const isActive =
                                        (item.href && pathname.startsWith(item.href)) ||
                                        (item.subItems && item.subItems.some(sub => sub.href === pathname));

                                    return (
                                        <div key={item.label}>
                                            <NavItem
                                                item={item}
                                                isExpanded={shouldStayExpanded}
                                                active={isActive}
                                                onToggleSubMenu={toggleSubMenu}
                                                isSubMenuExpanded={expandedItems.includes(item.label)}
                                            />
                                            {item.subItems && shouldStayExpanded && expandedItems.includes(item.label) && (
                                                <div className="ml-6 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-4">
                                                    {item.subItems.map((subItem) => (
                                                        <SubNavItem key={subItem.label} item={subItem} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                            {shouldStayExpanded && sectionIndex < menuSections.length - 1 && (
                                <div className="my-3">
                                    <Separator />
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Profile Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                <DropdownMenu onOpenChange={setProfileDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full flex items-center gap-3 justify-start p-3 h-auto",
                                !shouldStayExpanded && "justify-center p-2",
                            )}
                        >
                            <Avatar className="h-8 w-8">
                                {user?.imageUrl && (
                                    <Image
                                        src={user.imageUrl}
                                        alt="Avatar"
                                        width={32}
                                        height={32}
                                        className="rounded-full object-cover"
                                        style={{ display: "block" }}
                                        onLoadingComplete={() => setImgLoaded(true)}
                                        onError={() => setImgLoaded(false)}
                                    />
                                )}
                                {/* Fallback visible si no hay imagen o aún no cargó */}
                                {(!user?.imageUrl || !imgLoaded) && (
                                    <AvatarFallback className="bg-primary text-white">
                                        {user ? getInitials(user.fullName) : " "}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            {shouldStayExpanded && (
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.fullName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.position}</p>
                                </div>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <div className="px-2 py-1.5">
                            <p className="text-sm font-medium">{user?.fullName}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-2 text-red-600 dark:text-red-400" onClick={logoutAuth}>
                            <LogOut className="h-4 w-4" />
                            <span>Cerrar Sesión</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

interface NavItemProps {
    item: MenuItem
    isExpanded: boolean
    active?: boolean
    onToggleSubMenu: (label: string) => void
    isSubMenuExpanded: boolean
}

function NavItem({ item, isExpanded, active, onToggleSubMenu, isSubMenuExpanded }: NavItemProps) {
    const hasSubItems = item.subItems && item.subItems.length > 0

    const button = (
        <Button
            variant={active ? "default" : "ghost"}
            className={cn(
                "w-full justify-start h-10 px-3",
                !isExpanded && "justify-center px-2",
                active && "bg-primary text-white",
            )}
            onClick={() => hasSubItems && onToggleSubMenu(item.label)}
        >
            <span className={cn("flex-shrink-0", isExpanded && "mr-3")}>{item.icon}</span>
            {isExpanded && (
                <>
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    {item.badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">{item.badge}</span>
                    )}
                    {hasSubItems && (
                        <ChevronDown className={cn("h-4 w-4 ml-2 transition-transform", isSubMenuExpanded && "rotate-180")} />
                    )}
                </>
            )}
        </Button>
    )

    if (item.href && !hasSubItems) {
        return (
            <Link href={item.href} legacyBehavior passHref>
                <a className="block">{button}</a>
            </Link>
        )
    }

    return button
}

interface SubNavItemProps {
    item: SubMenuItem
}

function SubNavItem({ item }: SubNavItemProps) {
    const button = (
        <Button variant="ghost" size="sm" className="w-full justify-start h-8 px-3 text-sm font-normal">
            <span className="mr-3 flex-shrink-0">{item.icon}</span>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-orange-500 text-white rounded-full">{item.badge}</span>
            )}
        </Button>
    )

    if (item.href) {
        return (
            <Link href={item.href} legacyBehavior passHref>
                <a className="block">{button}</a>
            </Link>
        )
    }

    return button
}
