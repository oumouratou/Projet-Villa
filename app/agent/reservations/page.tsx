"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, XCircle, Home, ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { getReservations, updateReservation } from "@/lib/backend-api"

export default function AgentReservationsPage() {
  const { isAuthenticated, isLoading, user, token } = useAuth()
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user?.role !== "agent" && user?.role !== "admin"))) {
      window.location.href = "/connexion"
    }
  }, [isAuthenticated, isLoading, user])

  useEffect(() => {
    if (!token) return
    let cancelled = false
    setLoading(true)
    getReservations(token)
      .then((rows) => {
        if (cancelled) return
        setReservations(rows)
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token])

  const setStatus = async (id: string, statut: string) => {
    if (!token) return
    try {
      await updateReservation(id, { statut }, token)
      setReservations((prev) => prev.map(r => r.id === id ? { ...r, status: statut, statut } : r))
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Réservations — Agent</h1>
        <Link href="/agent" className="text-sm text-muted-foreground">Retour</Link>
      </div>

      <div>
        {loading && <div className="text-muted-foreground">Chargement...</div>}
        {error && <div className="text-destructive">{error}</div>}

        {!loading && !error && (
          <div className="space-y-4">
            {reservations.length === 0 && (
              <div className="p-6 bg-card rounded">Aucune réservation</div>
            )}

            {reservations.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 bg-card rounded border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                    <Home className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">Bien: {r.propertyId}</div>
                    <div className="text-sm text-muted-foreground">{r.startDate ? new Date(r.startDate).toLocaleDateString('fr-FR') : '-'} → {r.endDate ? new Date(r.endDate).toLocaleDateString('fr-FR') : '-'}</div>
                    <div className="text-sm text-muted-foreground">Client: {r.clientId ?? '—'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={r.status === 'en_attente' ? 'secondary' : r.status === 'confirmee' ? 'default' : 'destructive'}>
                    {r.status === 'en_attente' ? 'En attente' : r.status === 'confirmee' ? 'Confirmée' : 'Refusée'}
                  </Badge>

                  {r.status === 'en_attente' && (
                    <>
                      <Button size="sm" variant="outline" className="text-green-600 border-green-600" onClick={() => setStatus(r.id, 'confirmee')}>
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600" onClick={() => setStatus(r.id, 'refusee')}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

