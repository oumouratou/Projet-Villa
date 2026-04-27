import Link from "next/link"
import { notFound } from "next/navigation"
import { 
  ArrowLeft, MessageSquare, Clock, AlertCircle, CheckCircle, Calendar, Home, User
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { mockComplaints } from "@/lib/mock-data"
import type { ComplaintStatus } from "@/lib/types"

interface ComplaintDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ComplaintDetailPage({ params }: ComplaintDetailPageProps) {
  const { id } = await params
  const complaint = mockComplaints.find(c => c.id === id)

  if (!complaint) {
    notFound()
  }

  const statusColors: Record<ComplaintStatus, string> = {
    nouvelle: "bg-blue-100 text-blue-800 border-blue-200",
    en_cours: "bg-yellow-100 text-yellow-800 border-yellow-200",
    traitee: "bg-green-100 text-green-800 border-green-200",
  }

  const statusLabels: Record<ComplaintStatus, string> = {
    nouvelle: "Nouvelle - En attente de traitement",
    en_cours: "En cours de traitement",
    traitee: "Reclamation traitee",
  }

  const statusIcons: Record<ComplaintStatus, React.ElementType> = {
    nouvelle: AlertCircle,
    en_cours: Clock,
    traitee: CheckCircle,
  }

  const StatusIcon = statusIcons[complaint.status]

  return (
    <>
      <DashboardHeader title="Detail de la reclamation" />

      <main className="flex-1 p-6 overflow-auto">
        <Link
          href="/client/reclamations"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux reclamations
        </Link>

        <div className="max-w-3xl space-y-6">
          {/* Status Banner */}
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${statusColors[complaint.status]}`}>
            <StatusIcon className="h-6 w-6" />
            <div>
              <p className="font-semibold">{statusLabels[complaint.status]}</p>
              {complaint.status === "nouvelle" && (
                <p className="text-sm opacity-80">Votre reclamation sera traitee dans les plus brefs delais</p>
              )}
              {complaint.status === "en_cours" && (
                <p className="text-sm opacity-80">Un agent travaille sur votre demande</p>
              )}
            </div>
          </div>

          {/* Complaint Details */}
          <div className="bg-card rounded-xl border border-border">
            <div className="p-5 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{complaint.subject}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Reference: #{complaint.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
              <p className="text-foreground leading-relaxed">{complaint.description}</p>
            </div>
          </div>

          {/* Linked Reservation */}
          {complaint.reservation && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Reservation associee
              </h3>
              <Link
                href={`/client/reservations/${complaint.reservationId}`}
                className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-card flex items-center justify-center">
                  <Home className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{complaint.reservation.property?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {complaint.reservation.startDate.toLocaleDateString("fr-FR")} - {complaint.reservation.endDate.toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </Link>
            </div>
          )}

          {/* Agent Response */}
          {complaint.agentResponse && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Reponse de l&apos;agent
              </h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-foreground">{complaint.agentResponse}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  Repondu le {complaint.updatedAt.toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Historique
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Reclamation creee</p>
                  <p className="text-sm text-muted-foreground">
                    {complaint.createdAt.toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>

              {complaint.status !== "nouvelle" && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Prise en charge</p>
                    <p className="text-sm text-muted-foreground">
                      Un agent a pris en charge votre reclamation
                    </p>
                  </div>
                </div>
              )}

              {complaint.status === "traitee" && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Reclamation traitee</p>
                    <p className="text-sm text-muted-foreground">
                      {complaint.updatedAt.toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
