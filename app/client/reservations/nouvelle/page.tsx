"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Calendar, MapPin, CheckCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import type { Property } from "@/lib/types"
import { getProperties, createReservation } from "@/lib/backend-api"
import { useAuth } from "@/hooks/use-auth"

function NewReservationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const propertyId = searchParams.get("bien")

  const [properties, setProperties] = useState<Property[]>([])
  const [isLoadingProperties, setIsLoadingProperties] = useState(true)
  const [propertiesError, setPropertiesError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoadingProperties(true)
      setPropertiesError(null)

      try {
        const props = await getProperties()
        if (cancelled) return
        setProperties(props)
      } catch (e) {
        if (cancelled) return
        setPropertiesError(e instanceof Error ? e.message : "Erreur lors du chargement")
      } finally {
        if (!cancelled) setIsLoadingProperties(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const property = useMemo(
    () => (propertyId ? properties.find((p) => p.id === propertyId) : null),
    [properties, propertyId]
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    propertyId: propertyId || "",
    startDate: "",
    endDate: "",
    message: "",
  })

  const selectedProperty = properties.find((p) => p.id === formData.propertyId)
  const availableProperties = properties.filter((p) => p.status === "disponible")

  const { isAuthenticated, token } = useAuth()

  const calculateTotal = () => {
    if (!selectedProperty || !formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
    return nights * selectedProperty.pricePerNight
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated || !token) {
      // redirect to login with redirect back
      const redirect = `/client/reservations/nouvelle?bien=${formData.propertyId}`
      window.location.href = `/connexion?redirect=${encodeURIComponent(redirect)}`
      return
    }

    setIsSubmitting(true)

    try {
      await createReservation({ propertyId: formData.propertyId, startDate: formData.startDate, endDate: formData.endDate }, token)
      setIsSuccess(true)
    } catch (err: any) {
      console.error(err)
      alert(err?.message || "Erreur lors de la réservation")
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
        <h2 className="text-2xl font-bold text-foreground mb-2">Demande envoyee !</h2>
        <p className="text-muted-foreground mb-6">
          Votre demande de reservation a ete envoyee avec succes. 
          Un agent vous contactera sous 48h pour confirmer votre reservation.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/client/reservations"
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Voir mes reservations
          </Link>
          <Link
            href="/client/recherche"
            className="px-6 py-2.5 border border-input rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
          >
            Continuer a chercher
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Property Selection */}
          {!propertyId && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-4">Selectionnez un bien</h3>
              {isLoadingProperties ? (
                <p className="text-sm text-muted-foreground">Chargement des biens...</p>
              ) : propertiesError ? (
                <p className="text-sm text-destructive">{propertiesError}</p>
              ) : null}
              <select
                required
                value={formData.propertyId}
                onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                disabled={isLoadingProperties || !!propertiesError}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Choisir un bien...</option>
                {availableProperties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} - {p.city} ({p.pricePerNight.toLocaleString()} FCFA/nuit)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Selected Property Preview */}
          {selectedProperty && (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="relative h-40">
                <Image
                  src={selectedProperty.images[0] || "/placeholder.svg"}
                  alt={selectedProperty.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{selectedProperty.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4" />
                  {selectedProperty.city}
                </p>
                <p className="text-primary font-semibold mt-2">
                  {selectedProperty.pricePerNight.toLocaleString()} FCFA / nuit
                </p>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Periode de location</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date de debut
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date de fin
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    min={formData.startDate || new Date().toISOString().split("T")[0]}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Message (optionnel)</h3>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Ajoutez un message pour l'agent..."
              rows={4}
              className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border p-5 sticky top-6">
            <h3 className="font-semibold text-foreground mb-4">Resume</h3>
            
            {selectedProperty ? (
              <>
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prix par nuit</span>
                    <span className="text-foreground">{selectedProperty.pricePerNight.toLocaleString()} FCFA</span>
                  </div>
                  {formData.startDate && formData.endDate && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Periode</span>
                        <span className="text-foreground">
                          {Math.max(1, Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)))} nuit(s)
                        </span>
                      </div>
                      <hr className="border-border" />
                      <div className="flex justify-between font-semibold text-base">
                        <span className="text-foreground">Total estime</span>
                        <span className="text-primary">{calculateTotal().toLocaleString()} FCFA</span>
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.startDate || !formData.endDate}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
                </button>

                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Votre demande sera traitee sous 48h
                </p>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Selectionnez un bien pour voir le resume
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}

export default function NewReservationPage() {
  return (
    <>
      <DashboardHeader title="Nouvelle reservation" subtitle="Faites une demande de reservation" />

      <main className="flex-1 p-6 overflow-auto">
        <Link
          href="/client/recherche"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour a la recherche
        </Link>

        <Suspense fallback={<div className="text-muted-foreground">Chargement...</div>}>
          <NewReservationForm />
        </Suspense>
      </main>
    </>
  )
}
