"use client"

import { use, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Home,
  CreditCard
} from "lucide-react"
import Link from "next/link"
import { mockReservations, mockProperties, mockClients } from "@/lib/mock-data"

export default function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [agentComment, setAgentComment] = useState("")
  
  const reservation = mockReservations.find(r => r.id === id)
  const property = reservation ? mockProperties.find(p => p.id === reservation.propertyId) : null
  const client = reservation ? mockClients.find(c => c.id === reservation.clientId) : null

  if (!reservation || !property || !client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold">Réservation non trouvée</h1>
        <Button className="mt-4" asChild>
          <Link href="/agent/reservations">Retour à la liste</Link>
        </Button>
      </div>
    )
  }

  const nights = Math.ceil(
    (new Date(reservation.endDate).getTime() - new Date(reservation.startDate).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/agent/reservations">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Réservation #{reservation.id.slice(0, 8)}</h1>
            <p className="text-muted-foreground mt-1">
              Créée le {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
        <Badge 
          variant={
            reservation.status === "confirmee" ? "default" :
            reservation.status === "en_attente" ? "secondary" : "destructive"
          }
          className="text-sm px-4 py-2"
        >
          {reservation.status === "confirmee" && <CheckCircle2 className="mr-2 h-4 w-4" />}
          {reservation.status === "en_attente" && <Clock className="mr-2 h-4 w-4" />}
          {reservation.status === "refusee" && <XCircle className="mr-2 h-4 w-4" />}
          {reservation.status === "confirmee" ? "Confirmée" :
           reservation.status === "en_attente" ? "En attente" : "Refusée"}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Informations du bien */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Bien réservé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden">
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold">{property.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{property.address}, {property.city}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{property.bedrooms} chambres</span>
                    <span>{property.bathrooms} SDB</span>
                    <span>{property.surface} m²</span>
                  </div>
                  <p className="text-primary font-semibold">
                    {property.pricePerNight.toLocaleString()} FCFA / nuit
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations du client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {client.firstName[0]}{client.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{client.firstName} {client.lastName}</p>
                    <p className="text-sm text-muted-foreground">Client depuis 2024</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.phone}</span>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <Button variant="outline" size="sm" asChild>
                <Link href={`/agent/clients/${client.id}`}>
                  Voir le profil complet
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Actions de traitement */}
          {reservation.status === "en_attente" && (
            <Card>
              <CardHeader>
                <CardTitle>Traiter la réservation</CardTitle>
                <CardDescription>
                  Acceptez ou refusez cette demande de réservation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="comment">Commentaire (optionnel)</Label>
                  <Textarea
                    id="comment"
                    placeholder="Ajoutez un commentaire pour le client..."
                    value={agentComment}
                    onChange={(e) => setAgentComment(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Confirmer la réservation
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    <XCircle className="mr-2 h-4 w-4" />
                    Refuser la réservation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Commentaire agent */}
          {reservation.agentComment && (
            <Card>
              <CardHeader>
                <CardTitle>Commentaire de l&apos;agent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{reservation.agentComment}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Dates de séjour
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Arrivée</span>
                <span className="font-medium">
                  {new Date(reservation.startDate).toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Départ</span>
                <span className="font-medium">
                  {new Date(reservation.endDate).toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Durée</span>
                <span className="font-medium">{nights} nuit(s)</span>
              </div>
            </CardContent>
          </Card>

          {/* Récapitulatif prix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Récapitulatif
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  {property.pricePerNight.toLocaleString()} FCFA x {nights} nuits
                </span>
                <span>{(property.pricePerNight * nights).toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Frais de service</span>
                <span>{Math.round(reservation.totalPrice * 0.05).toLocaleString()} FCFA</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">{reservation.totalPrice.toLocaleString()} FCFA</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
