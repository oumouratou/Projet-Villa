"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Building2, LayoutDashboard, User, Calendar, MessageSquare, Search, 
  LogOut, Settings, Home, Users, Tag, Shield, Key, FileText, ChevronLeft, Menu
} from "lucide-react"
import type { UserRole } from "@/lib/types"
import { useState } from "react"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

interface DashboardSidebarProps {
  role: UserRole
}

const clientNavItems: NavItem[] = [
  { href: "/client", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/client/recherche", label: "Rechercher un bien", icon: Search },
  { href: "/client/reservations", label: "Mes reservations", icon: Calendar },
  { href: "/client/reclamations", label: "Mes reclamations", icon: MessageSquare },
  { href: "/client/profil", label: "Mon profil", icon: User },
]

const agentNavItems: NavItem[] = [
  { href: "/agent", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/agent/biens", label: "Gestion des biens", icon: Home },
  { href: "/agent/options", label: "Options", icon: Tag },
  { href: "/agent/reservations", label: "Reservations", icon: Calendar },
  { href: "/agent/clients", label: "Clients", icon: Users },
  { href: "/agent/reclamations", label: "Reclamations", icon: MessageSquare },
  { href: "/agent/profil", label: "Mon profil", icon: User },
]

const adminNavItems: NavItem[] = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/biens", label: "Gestion des biens", icon: Home },
  { href: "/admin/options", label: "Options", icon: Tag },
  { href: "/admin/reservations", label: "Reservations", icon: Calendar },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/reclamations", label: "Reclamations", icon: MessageSquare },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/roles", label: "Roles", icon: Shield },
  { href: "/admin/permissions", label: "Permissions", icon: Key },
  { href: "/admin/activites", label: "Historique", icon: FileText },
  { href: "/admin/parametres", label: "Parametres", icon: Settings },
]

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const userName = role === "admin" ? "Marie Kone" : role === "agent" ? "Yao Kouadio" : "Kouame Aka"
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navItems = role === "admin" ? adminNavItems : role === "agent" ? agentNavItems : clientNavItems

  const isActive = (href: string) => {
    if (href === `/${role}`) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className={`flex items-center h-16 px-4 border-b border-sidebar-border ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-7 w-7 text-sidebar-primary" />
              <span className="font-bold">ImmoGestion</span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/">
              <Building2 className="h-7 w-7 text-sidebar-primary" />
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-sidebar-accent transition-colors"
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className={`p-4 border-t border-sidebar-border ${isCollapsed ? "px-2" : ""}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                <User className="h-5 w-5 text-sidebar-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-sidebar-foreground/60 capitalize">{role}</p>
              </div>
            </div>
          )}
          <Link
            href="/connexion"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Deconnexion" : undefined}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="text-sm">Deconnexion</span>}
          </Link>
        </div>
      </aside>
    </>
  )
}
