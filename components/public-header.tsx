"use client"

import Link from "next/link"
import { Building2, Menu, X, User, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const userStr = localStorage.getItem("auth_user")
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        setIsAuthenticated(true)
        setUserRole(user.role)
      } catch {
        setIsAuthenticated(false)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    setIsAuthenticated(false)
    setUserRole(null)
    router.push("/")
  }

  const dashboardLink = userRole === "admin" ? "/admin" : userRole === "agent" ? "/agent" : "/client"

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">ImmoGestion</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Accueil</Link>
            <Link href="/biens" className="text-muted-foreground hover:text-foreground transition-colors">Nos Biens</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href={dashboardLink} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <User className="h-4 w-4" />
                  Mon espace
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-destructive transition-colors">
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/connexion" className="text-muted-foreground hover:text-foreground transition-colors">Connexion</Link>
                <Link href="/inscription" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">Inscription</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Accueil</Link>
              <Link href="/biens" className="text-muted-foreground hover:text-foreground transition-colors">Nos Biens</Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
              <hr className="border-border" />
              {isAuthenticated ? (
                <>
                  <Link href={dashboardLink} className="text-muted-foreground hover:text-foreground transition-colors">Mon espace</Link>
                  <button onClick={handleLogout} className="text-left text-muted-foreground hover:text-destructive transition-colors">Déconnexion</button>
                </>
              ) : (
                <>
                  <Link href="/connexion" className="text-muted-foreground hover:text-foreground transition-colors">Connexion</Link>
                  <Link href="/inscription" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center">Inscription</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}