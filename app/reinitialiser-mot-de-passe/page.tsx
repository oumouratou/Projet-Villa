"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Building2, Mail, Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react"
import { backendAPI } from "@/lib/backend-api"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    if (!token || !email) {
      setError("Le lien de réinitialisation est invalide ou a expiré.")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.password_confirmation) {
      setError("Les mots de passe ne correspondent pas.")
      setIsLoading(false)
      return
    }

    try {
      const response = await backendAPI.post("/auth/reset-password", {
        ...formData,
        token,
        email,
      })
      setSuccess(response.data.message)
      setTimeout(() => router.push("/connexion"), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur est survenue.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card p-8 rounded-2xl shadow-lg">
          <Link href="/" className="flex items-center justify-center gap-2 mb-6">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">ImmoGestion</span>
          </Link>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">Réinitialiser le mot de passe</h1>
          
          {!token || !email ? (
             <div className="text-center text-destructive mt-4">Lien invalide.</div>
          ) : success ? (
            <div className="text-center mt-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-green-600">{success}</p>
              <p className="text-muted-foreground text-sm mt-2">Vous allez être redirigé vers la page de connexion...</p>
            </div>
          ) : (
            <>
            <p className="text-muted-foreground text-center mb-8">
                Saisissez votre nouveau mot de passe.
            </p>
            {error && (
                <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    Nouveau mot de passe
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Nouveau mot de passe"
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

                <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-foreground mb-2">
                    Confirmer le mot de passe
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                    type="password"
                    id="password_confirmation"
                    required
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    placeholder="Confirmez le mot de passe"
                    className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
                </div>

                <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                </button>
            </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-muted/40 text-foreground">Chargement...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
