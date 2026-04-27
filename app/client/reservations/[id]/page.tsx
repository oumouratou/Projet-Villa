import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { 
  ArrowLeft, Calendar, Home, MapPin, Clock, CheckCircle, XCircle, Ban,
  MessageSquare, Bed, Bath, Maximize
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { mockReservations } from "@/lib/mock-data"
import type { ReservationStatus } from "@/lib/types"

interface ReservationDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ReservationDetailPage({ params }: ReservationDetailPageProps) {
  const { id } = await params
  const reservation = mockReservations.find(r => r.id === id)

  if (!reservation) {
    notFound()
  }

  const statusColors: Record<ReservationStatus, string> = {
    en_attente: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmee: "bg-green-100 text-green-800 border-green-200",
    refusee: "bg-red-100 text-red-800 border-red-200",
    annulee: "bg-gray-100 text-gray-800 border-gray-200",
  }

  const statusLabels: Record<ReservationStatus, string> = {
    en_attente: "En attente de confirmation",
    confirmee: "Reservation confirmee",
    refusee: "Reservation refusee",
    annulee: "Reservation annulee",
  }

  const statusIcons: Record<ReservationStatus, React.ElementType> = {
    en_attente: Clock,
    confirmee: CheckCircle,
    refusee: XCircle,
    annulee: Ban,
  }

  const StatusIcon = statusIcons[reservation.status]

  // Calculer la duree
  const duration = Math.ceil((reservation.endDate.getTime() - reservation.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))

  return (
    <>
      <DashboardHeader title="Detail de la reservation" />

      <main className="flex-1 p-6 overflow-auto">
        <Link
          href="/client/reservations"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux reservations
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Banner */}
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${statusColors[reservation.status]}`}>
              <StatusIcon className="h-6 w-6" />
              <div>
                <p className="font-semibold">{statusLabels[reservation.status]}</p>
                {reservation.status === "en_attente" && (
                  <p className="text-sm opacity-80">Votre demande est en cours de traitement</p>
                )}
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={reservation.property?.images[0] || "/placeholder.svg"}
                  alt={reservation.property?.title || ""}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {reservation.property?.title}
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{reservation.property?.address}, {reservation.property?.city}</span>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    <span>{reservation.property?.surface} m2</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>{reservation.property?.bedrooms} ch.</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{reservation.property?.bathrooms} sdb</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reservation Details */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-4">Details de la reservation</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date de debut</p>
                  <p className="font-medium text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {reservation.startDate.toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date de fin</p>
                  <p className="font-medium text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {reservation.endDate.toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Duree</p>
                  <p className="font-medium text-foreground">{duration} mois</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date de demande</p>
                  <p className="font-medium text-foreground">
                    {reservation.createdAt.toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>

            {/* Agent Comment */}
            {reservation.agentComment && (
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Commentaire de l&apos;agent
                </h3>
                <p className="text-muted-foreground">{reservation.agentComment}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-5 sticky top-6">
              <h3 className="font-semibold text-foreground mb-4">Resume financier</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Loyer mensuel</span>
                  <span className="text-foreground">{reservation.property?.price.toLocaleString()} EUR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duree</span>
                  <span className="text-foreground">{duration} mois</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">{reservation.totalPrice.toLocaleString()} EUR</span>
                </div>
              </div>

              <hr className="border-border my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="text-foreground font-medium">#{reservation.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statut</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[reservation.status]}`}>
                    {reservation.status === "en_attente" ? "En attente" : 
                     reservation.status === "confirmee" ? "Confirmee" :
                     reservation.status === "refusee" ? "Refusee" : "Annulee"}
                  </span>
                </div>
              </div>

              {reservation.status === "confirmee" && (
                <>
                  <hr className="border-border my-4" />
                  <Link
                    href={`/client/reclamations/nouvelle?reservation=${reservation.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-input rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Signaler un probleme
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
