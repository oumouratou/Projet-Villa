"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send, CheckCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"

function NewComplaintForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    reservation_id: "",
    subject: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("http://127.0.0.1:8000/api/reclamations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Une erreur est survenue.")
      }

      setIsSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Réclamation envoyée !</h2>
        <p className="text-muted-foreground mb-6">
          Votre réclamation a été enregistrée. Un agent vous répondra dans les plus brefs délais.
        </p>
        <Link
          href="/client/reclamations"
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Voir mes réclamations
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        <div>
          <label htmlFor="reservation_id" className="block text-sm font-medium text-foreground mb-2">
            Numéro de réservation
          </label>
          <input
            id="reservation_id"
            type="number"
            required
            value={formData.reservation_id}
            onChange={(e) => setFormData({ ...formData, reservation_id: e.target.value })}
            placeholder="Ex: 12345"
            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
            Sujet
          </label>
          <input
            id="subject"
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Ex: Problème avec la climatisation"
            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
            Description détaillée
          </label>
          <textarea
            id="description"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            placeholder="Veuillez décrire le problème en détail..."
            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 text-red-600 bg-red-100 border border-red-300 rounded-lg p-3 text-sm">
          <strong>Erreur :</strong> {error}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/client/reclamations"
          className="px-6 py-2.5 border border-input rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin h-5 w-5 border-t-2 border-r-2 border-primary-foreground rounded-full"></span>
              Envoi...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Envoyer
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default function NewComplaintPage() {
  return (
    <div className="flex-1">
      <DashboardHeader title="Nouvelle réclamation" />
      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/client/reclamations"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux réclamations
          </Link>
          <Suspense fallback={<div>Chargement...</div>}>
            <NewComplaintForm />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
