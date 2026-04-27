"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageSquare, Plus, Search, Filter, Eye, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { mockComplaints } from "@/lib/mock-data"
import type { ComplaintStatus } from "@/lib/types"

export default function ClientComplaintsPage() {
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filtrer pour le client actuel (simulation)
  const clientComplaints = mockComplaints.filter(c => c.clientId === "client1")

  const filteredComplaints = clientComplaints.filter(complaint => {
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
    const matchesSearch = !searchQuery || 
      complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusColors: Record<ComplaintStatus, string> = {
    nouvelle: "bg-blue-100 text-blue-800",
    en_cours: "bg-yellow-100 text-yellow-800",
    traitee: "bg-green-100 text-green-800",
  }

  const statusLabels: Record<ComplaintStatus, string> = {
    nouvelle: "Nouvelle",
    en_cours: "En cours",
    traitee: "Traitee",
  }

  const statusIcons: Record<ComplaintStatus, React.ElementType> = {
    nouvelle: AlertCircle,
    en_cours: Clock,
    traitee: CheckCircle,
  }

  return (
    <>
      <DashboardHeader title="Mes reclamations" subtitle="Gerez et suivez vos reclamations" />

      <main className="flex-1 p-6 overflow-auto">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">
                    {clientComplaints.filter(c => c.status === "nouvelle").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Nouvelles</p>
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
                    {clientComplaints.filter(c => c.status === "en_cours").length}
                  </p>
                  <p className="text-xs text-muted-foreground">En cours</p>
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
                    {clientComplaints.filter(c => c.status === "traitee").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Traitees</p>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/client/reclamations/nouvelle"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nouvelle reclamation
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher une reclamation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | "all")}
                className="px-4 py-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Tous les statuts</option>
                <option value="nouvelle">Nouvelles</option>
                <option value="en_cours">En cours</option>
                <option value="traitee">Traitees</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        {filteredComplaints.length > 0 ? (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => {
              const StatusIcon = statusIcons[complaint.status]
              return (
                <div
                  key={complaint.id}
                  className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{complaint.subject}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {complaint.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Cree le {complaint.createdAt.toLocaleDateString("fr-FR")}
                          {complaint.reservation && (
                            <> - Lie a la reservation #{complaint.reservationId}</>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[complaint.status]}`}>
                        <StatusIcon className="h-4 w-4" />
                        {statusLabels[complaint.status]}
                      </span>
                      <Link
                        href={`/client/reclamations/${complaint.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        Details
                      </Link>
                    </div>
                  </div>

                  {complaint.agentResponse && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm">
                        <span className="font-medium text-foreground">Reponse de l&apos;agent :</span>{" "}
                        <span className="text-muted-foreground">{complaint.agentResponse}</span>
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Aucune reclamation trouvee</h3>
            <p className="text-muted-foreground mb-4">
              {statusFilter !== "all" || searchQuery
                ? "Essayez de modifier vos filtres"
                : "Vous n'avez pas encore de reclamation"}
            </p>
            <Link
              href="/client/reclamations/nouvelle"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nouvelle reclamation
            </Link>
          </div>
        )}
      </main>
    </>
  )
}
