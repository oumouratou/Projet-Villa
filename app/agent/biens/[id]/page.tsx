"use client"

import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Bed, 
  Bath, 
  Users, 
  Maximize,
  Wifi,
  Car,
  Waves,
  Wind,
  Tv,
  UtensilsCrossed,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react"
import Link from "next/link"
import { mockProperties, mockReservations, mockClients, mockOptions } from "@/lib/mock-data"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  car: Car,
  waves: Waves,
  wind: Wind,
  tv: Tv,
  utensils: UtensilsCrossed,
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const property = mockProperties.find(p => p.id === id)
  
  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold">Bien non trouvé</h1>
        <Button className="mt-4" asChild>
          <Link href="/agent/biens">Retour à la liste</Link>
        </Button>
      </div>
    )
  }

  const propertyReservations = mockReservations.filter(r => r.propertyId === property.id)
  const propertyOptions = mockOptions.filter(o => property.options.includes(o.id))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/agent/biens">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{property.title}</h1>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{property.address}, {property.city}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/agent/biens/${property.id}/modifier`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Galerie photos */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 aspect-video rounded-xl overflow-hidden">
          <img 
            src={property.images[0]} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
          {property.images.slice(1, 3).map((img, idx) => (
            <div key={idx} className="aspect-video rounded-xl overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Informations principales */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Informations</CardTitle>
                <Badge variant={
                  property.status === "disponible" ? "default" :
                  property.status === "reserve" ? "secondary" : "outline"
                }>
                  {property.status === "disponible" ? "Disponible" :
                   property.status === "reserve" ? "Réservé" : "Maintenance"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                  <Maximize className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Surface</p>
                    <p className="font-medium">{property.surface} m²</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                  <Bed className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Chambres</p>
                    <p className="font-medium">{property.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                  <Bath className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Salles de bain</p>
                    <p className="font-medium">{property.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Capacité</p>
                    <p className="font-medium">{property.capacity} pers.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">{property.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Équipements et options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {propertyOptions.map((option) => {
                  const Icon = iconMap[option.icon] || Wifi
                  return (
                    <div key={option.id} className="flex items-center gap-2 p-3 rounded-lg border">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{option.name}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Historique des réservations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Historique des réservations
              </CardTitle>
              <CardDescription>
                {propertyReservations.length} réservation(s) pour ce bien
              </CardDescription>
            </CardHeader>
            <CardContent>
              {propertyReservations.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Aucune réservation pour ce bien
                </p>
              ) : (
                <div className="space-y-3">
                  {propertyReservations.map((reservation) => {
                    const client = mockClients.find(c => c.id === reservation.clientId)
                    return (
                      <div 
                        key={reservation.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium">
                            {client?.firstName} {client?.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(reservation.startDate).toLocaleDateString('fr-FR')} - {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{reservation.totalPrice.toLocaleString()} FCFA</span>
                          <Badge variant={
                            reservation.status === "confirmee" ? "default" :
                            reservation.status === "en_attente" ? "secondary" : "destructive"
                          }>
                            {reservation.status === "confirmee" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                            {reservation.status === "en_attente" && <Clock className="mr-1 h-3 w-3" />}
                            {reservation.status === "refusee" && <XCircle className="mr-1 h-3 w-3" />}
                            {reservation.status === "confirmee" ? "Confirmée" :
                             reservation.status === "en_attente" ? "En attente" : "Refusée"}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tarification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">
                  {property.pricePerNight.toLocaleString()}
                </p>
                <p className="text-muted-foreground">FCFA / nuit</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total réservations</span>
                <span className="font-medium">{propertyReservations.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Confirmées</span>
                <span className="font-medium text-green-600">
                  {propertyReservations.filter(r => r.status === "confirmee").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">En attente</span>
                <span className="font-medium text-orange-600">
                  {propertyReservations.filter(r => r.status === "en_attente").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Revenus totaux</span>
                <span className="font-medium">
                  {propertyReservations
                    .filter(r => r.status === "confirmee")
                    .reduce((sum, r) => sum + r.totalPrice, 0)
                    .toLocaleString()} FCFA
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/agent/biens/${property.id}/modifier`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier le bien
                </Link>
              </Button>
              <Button className="w-full" variant="outline">
                Changer le statut
              </Button>
              <Button className="w-full" variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
