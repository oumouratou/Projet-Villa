"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Mail, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react"
import { backendAPI } from "@/lib/backend-api"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await backendAPI.post("/auth/forgot-password", { email })
      setSuccess(response.data.message)
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

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">Mot de passe oublié ?</h1>
          
          {success ? (
            <div className="text-center mt-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-green-600">{success}</p>
              <p className="text-muted-foreground text-sm mt-2">Veuillez consulter votre boîte de réception.</p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground text-center mb-8">
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              {error && (
                <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/connexion"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
