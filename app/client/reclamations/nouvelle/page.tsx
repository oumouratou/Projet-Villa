"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, MessageSquare, CheckCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { mockReservations } from "@/lib/mock-data"

function NewComplaintForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reservationId = searchParams.get("reservation")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    reservationId: reservationId || "",
    subject: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reservations confirmees du client
  const clientReservations = mockReservations.filter(
    r => r.clientId === "client1" && r.status === "confirmee"
  )

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.subject.trim()) {
      newErrors.subject = "Le sujet est requis"
    }
    if (!formData.description.trim()) {
      newErrors.description = "La description est requise"
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "La description doit contenir au moins 20 caracteres"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    setIsSubmitting(true)

    // Simulation de soumission
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSuccess(true)
    setIsSubmitting(false)
  }

  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Reclamation envoyee !</h2>
        <p className="text-muted-foreground mb-6">
          Votre reclamation a ete envoyee avec succes. 
          Un agent vous repondra dans les plus brefs delais.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/client/reclamations"
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Voir mes reclamations
          </Link>
          <Link
            href="/client"
            className="px-6 py-2.5 border border-input rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="space-y-6">
        {/* Linked Reservation (optional) */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">
            Reservation concernee (optionnel)
          </h3>
          <select
            value={formData.reservationId}
            onChange={(e) => setFormData({ ...formData, reservationId: e.target.value })}
            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Aucune reservation liee</option>
            {clientReservations.map((res) => (
              <option key={res.id} value={res.id}>
                {res.property?.title} - {res.startDate.toLocaleDateString("fr-FR")}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-2">
            Liez votre reclamation a une reservation si elle concerne un bien specifique
          </p>
        </div>

        {/* Subject */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Sujet de la reclamation</h3>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Ex: Probleme de chauffage, Fuite d'eau..."
            className={`w-full px-4 py-2.5 bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.subject ? "border-destructive" : "border-input"
            }`}
          />
          {errors.subject && (
            <p className="text-sm text-destructive mt-1">{errors.subject}</p>
          )}
        </div>

        {/* Description */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Description detaillee</h3>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Decrivez votre probleme en detail. Plus vous donnez d'informations, plus nous pourrons vous aider efficacement..."
            rows={6}
            className={`w-full px-4 py-2.5 bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none ${
              errors.description ? "border-destructive" : "border-input"
            }`}
          />
          {errors.description && (
            <p className="text-sm text-destructive mt-1">{errors.description}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {formData.description.length}/500 caracteres
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/client/reclamations"
            className="px-6 py-2.5 border border-input rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageSquare className="h-5 w-5" />
            {isSubmitting ? "Envoi en cours..." : "Envoyer la reclamation"}
          </button>
        </div>
      </div>
    </form>
  )
}

export default function NewComplaintPage() {
  return (
    <>
      <DashboardHeader title="Nouvelle reclamation" subtitle="Signalez un probleme ou posez une question" />

      <main className="flex-1 p-6 overflow-auto">
        <Link
          href="/client/reclamations"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux reclamations
        </Link>

        <Suspense fallback={<div className="text-muted-foreground">Chargement...</div>}>
          <NewComplaintForm />
        </Suspense>
      </main>
    </>
  )
}
