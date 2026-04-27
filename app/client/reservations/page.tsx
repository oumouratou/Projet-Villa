"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Home, Search, Filter, Eye, Clock, CheckCircle, XCircle, Ban } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { mockReservations } from "@/lib/mock-data"
import type { ReservationStatus } from "@/lib/types"

export default function ClientReservationsPage() {
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filtrer pour le client actuel (simulation)
  const clientReservations = mockReservations.filter(r => r.clientId === "client1")

  const filteredReservations = clientReservations.filter(reservation => {
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
    const matchesSearch = !searchQuery || 
      reservation.property?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.property?.city.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusColors: Record<ReservationStatus, string> = {
    en_attente: "bg-yellow-100 text-yellow-800",
    confirmee: "bg-green-100 text-green-800",
    refusee: "bg-red-100 text-red-800",
    annulee: "bg-gray-100 text-gray-800",
  }

  const statusLabels: Record<ReservationStatus, string> = {
    en_attente: "En attente",
    confirmee: "Confirmee",
    refusee: "Refusee",
    annulee: "Annulee",
  }

  const statusIcons: Record<ReservationStatus, React.ElementType> = {
    en_attente: Clock,
    confirmee: CheckCircle,
    refusee: XCircle,
    annulee: Ban,
  }

  return (
    <>
      <DashboardHeader title="Mes reservations" subtitle="Consultez et suivez vos demandes de reservation" />

      <main className="flex-1 p-6 overflow-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{clientReservations.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">
                  {clientReservations.filter(r => r.status === "en_attente").length}
                </p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">
                  {clientReservations.filter(r => r.status === "confirmee").length}
                </p>
                <p className="text-xs text-muted-foreground">Confirmees</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">
                  {clientReservations.filter(r => r.status === "refusee").length}
                </p>
                <p className="text-xs text-muted-foreground">Refusees</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par bien ou ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ReservationStatus | "all")}
                className="px-4 py-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="confirmee">Confirmees</option>
                <option value="refusee">Refusees</option>
                <option value="annulee">Annulees</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reservations List */}
        {filteredReservations.length > 0 ? (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => {
              const StatusIcon = statusIcons[reservation.status]
              return (
                <div
                  key={reservation.id}
                  className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Home className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {reservation.property?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {reservation.property?.city}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {reservation.startDate.toLocaleDateString("fr-FR")} - {reservation.endDate.toLocaleDateString("fr-FR")}
                          </span>
                          <span className="font-medium text-foreground">
                            {reservation.totalPrice.toLocaleString()} EUR
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[reservation.status]}`}>
                        <StatusIcon className="h-4 w-4" />
                        {statusLabels[reservation.status]}
                      </span>
                      <Link
                        href={`/client/reservations/${reservation.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        Details
                      </Link>
                    </div>
                  </div>

                  {reservation.agentComment && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Commentaire de l&apos;agent :</span>{" "}
                        {reservation.agentComment}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Aucune reservation trouvee</h3>
            <p className="text-muted-foreground mb-4">
              {statusFilter !== "all" || searchQuery
                ? "Essayez de modifier vos filtres"
                : "Vous n'avez pas encore de reservation"}
            </p>
            <Link
              href="/client/recherche"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Rechercher un bien
            </Link>
          </div>
        )}
      </main>
    </>
  )
}
