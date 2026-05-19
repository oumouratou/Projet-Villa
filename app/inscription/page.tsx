"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Building2, Mail, Lock, Eye, EyeOff } from "lucide-react"

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect")

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    await new Promise(resolve => setTimeout(resolve, 1000))

    const fakeToken = "fake_token_" + Date.now()
    const fakeUser = {
      id: "client1",
      name: "Sophie Leroy",
      email: formData.email,
      role: formData.email.includes("admin") ? "admin" : formData.email.includes("agent") ? "agent" : "client",
      status: "actif",
    }
    localStorage.setItem("auth_token", fakeToken)
    localStorage.setItem("auth_user", JSON.stringify(fakeUser))

    if (redirectUrl) {
      router.push(redirectUrl)
    } else if (formData.email.includes("admin")) {
      router.push("/admin")
    } else if (formData.email.includes("agent")) {
      router.push("/agent")
    } else {
      router.push("/client")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">ImmoGestion</span>
          </Link>

          <h1 className="text-2xl font-bold text-foreground mb-2">Connexion</h1>
          <p className="text-muted-foreground mb-8">
            Connectez-vous pour acceder a votre espace
          </p>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="votre@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Votre mot de passe"
                  className="w-full pl-10 pr-12 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-input text-primary focus:ring-ring" />
                <span className="text-sm text-muted-foreground">Se souvenir de moi</span>
              </label>
              <Link href="/mot-de-passe-oublie" className="text-sm text-primary hover:text-primary/80">
                Mot de passe oublie ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-8 text-center text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-primary hover:text-primary/80 font-medium">
              Creer un compte
            </Link>
          </p>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Demo :</strong> Utilisez un email contenant &quot;admin&quot;, &quot;agent&quot; ou autre pour acceder aux differents espaces.
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-sidebar to-sidebar/90 relative">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-sidebar-foreground">
            <Building2 className="h-20 w-20 mx-auto mb-6 text-sidebar-primary" />
            <h2 className="text-3xl font-bold mb-4">Bienvenue sur ImmoGestion</h2>
            <p className="text-sidebar-foreground/80 max-w-md">
              La plateforme complete pour gerer vos locations immobilieres. Simple, efficace et securisee.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InscriptionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-foreground">Chargement...</div>}>
      <RegisterForm />
    </Suspense>
  )
}