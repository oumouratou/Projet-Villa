"use client"

import { Search } from "lucide-react"
import { NotificationBell } from "./notification-bell"

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          {title && <h1 className="text-xl lg:text-2xl font-bold text-foreground truncate">{title}</h1>}
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          {/* Search - Hidden on mobile */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-64 pl-9 pr-4 py-2 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Notifications */}
          <NotificationBell />
        </div>
      </div>
    </header>
  )
}

