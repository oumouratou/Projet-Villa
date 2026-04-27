"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulation d'envoi d'email
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitted(true)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">ImmoGestion</span>
        </Link>

        {!isSubmitted ? (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-2">Mot de passe oublie ?</h1>
            <p className="text-muted-foreground mb-8">
              Entrez votre adresse email et nous vous enverrons un lien pour reinitialiser votre mot de passe.
            </p>

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
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Email envoye</h1>
            <p className="text-muted-foreground mb-8">
              Si un compte existe avec l&apos;adresse <strong>{email}</strong>, vous recevrez un email avec les instructions pour reinitialiser votre mot de passe.
            </p>
            <p className="text-sm text-muted-foreground">
              Vous n&apos;avez pas recu d&apos;email ?{" "}
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-primary hover:text-primary/80 font-medium"
              >
                Renvoyer
              </button>
            </p>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/connexion"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour a la connexion
          </Link>
        </div>
      </div>
    </div>
  )
}
