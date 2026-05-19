import Link from "next/link"
import { Calendar, MessageSquare, Home, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { mockReservations, mockComplaints, mockProperties } from "@/lib/mock-data"

export default function ClientDashboardPage() {
  // Filtrer pour le client actuel (simulation)
  const clientReservations = mockReservations.filter(r => r.clientId === "client-1")
  const clientComplaints = mockComplaints.filter(c => c.clientId === "client-1")
  
  const pendingReservations = clientReservations.filter(r => r.status === "en_attente")
  const confirmedReservations = clientReservations.filter(r => r.status === "confirmee")
  const activeComplaints = clientComplaints.filter(c => c.status !== "traitee")

  const statusColors = {
    en_attente: "bg-yellow-100 text-yellow-800",
    confirmee: "bg-green-100 text-green-800",
    refusee: "bg-red-100 text-red-800",
    annulee: "bg-gray-100 text-gray-800",
  }

  const statusLabels = {
    en_attente: "En attente",
    confirmee: "Confirmee",
    refusee: "Refusee",
    annulee: "Annulee",
  }

  return (
    <>
      <DashboardHeader 
        title="Tableau de bord" 
        subtitle="Bienvenue, Sophie !" 
      />
      
      <main className="flex-1 p-6 overflow-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{clientReservations.length}</p>
                <p className="text-sm text-muted-foreground">Reservations totales</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingReservations.length}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{confirmedReservations.length}</p>
                <p className="text-sm text-muted-foreground">Confirmees</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeComplaints.length}</p>
                <p className="text-sm text-muted-foreground">Reclamations actives</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Reservations */}
          <div className="bg-card rounded-xl border border-border">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-semibold text-foreground">Mes reservations recentes</h2>
              <Link
                href="/client/reservations"
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {clientReservations.length > 0 ? (
                clientReservations.slice(0, 3).map((reservation) => {
                  const property = mockProperties.find(p => p.id === reservation.propertyId)
                  return (
                    <Link
                      key={reservation.id}
                      href={`/client/reservations/${reservation.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Home className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {property?.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(reservation.startDate).toLocaleDateString("fr-FR")} - {new Date(reservation.endDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[reservation.status]}`}>
                        {statusLabels[reservation.status]}
                      </span>
                    </Link>
                  )
                })
              ) : (
                <div className="p-8 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Aucune reservation</p>
                  <Link
                    href="/client/recherche"
                    className="mt-3 inline-block text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Rechercher un bien
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="bg-card rounded-xl border border-border">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-semibold text-foreground">Mes reclamations</h2>
              <Link
                href="/client/reclamations"
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {clientComplaints.length > 0 ? (
                clientComplaints.slice(0, 3).map((complaint) => {
                  const complaintStatusColors = {
                    ouverte: "bg-blue-100 text-blue-800",
                    en_cours: "bg-yellow-100 text-yellow-800",
                    traitee: "bg-green-100 text-green-800",
                  }
                  const complaintStatusLabels = {
                    ouverte: "Nouvelle",
                    en_cours: "En cours",
                    traitee: "Traitee",
                  }
                  return (
                    <Link
                      key={complaint.id}
                      href={`/client/reclamations/${complaint.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{complaint.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(complaint.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${complaintStatusColors[complaint.status as 'ouverte' | 'en_cours' | 'traitee']}`}>
                        {complaintStatusLabels[complaint.status as 'ouverte' | 'en_cours' | 'traitee']}
                      </span>
                    </Link>
                  )
                })
              ) : (
                <div className="p-8 text-center">
                  <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Aucune reclamation</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="font-semibold text-foreground mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/client/recherche"
              className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Rechercher un bien</p>
                <p className="text-sm text-muted-foreground">Parcourir les biens disponibles</p>
              </div>
            </Link>

            <Link
              href="/client/reclamations/nouvelle"
              className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Nouvelle reclamation</p>
                <p className="text-sm text-muted-foreground">Signaler un probleme</p>
              </div>
            </Link>

            <Link
              href="/client/profil"
              className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Mon profil</p>
                <p className="text-sm text-muted-foreground">Gerer mes informations</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
