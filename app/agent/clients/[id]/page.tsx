"use client"

import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  Home
} from "lucide-react"
import Link from "next/link"
import { mockClients, mockReservations, mockComplaints, mockProperties } from "@/lib/mock-data"

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  const client = mockClients.find(c => c.id === id)
  const clientReservations = mockReservations.filter(r => r.clientId === id)
  const clientComplaints = mockComplaints.filter(c => c.clientId === id)

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold">Client non trouvé</h1>
        <Button className="mt-4" asChild>
          <Link href="/agent/clients">Retour à la liste</Link>
        </Button>
      </div>
    )
  }

  const totalSpent = clientReservations
    .filter(r => r.status === "confirmee")
    .reduce((sum, r) => sum + r.totalPrice, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/agent/clients">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profil client</h1>
          <p className="text-muted-foreground mt-1">
            Détails et historique du client
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Infos client */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {client.firstName[0]}{client.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">
                {client.firstName} {client.lastName}
              </h2>
              <Badge variant={client.status === "actif" ? "default" : "secondary"} className="mt-2">
                {client.status === "actif" ? "Actif" : "Inactif"}
              </Badge>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="font-medium">{client.address || "Non renseignée"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Inscrit le</p>
                  <p className="font-medium">
                    {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats et historique */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-primary">{clientReservations.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Réservations</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-green-600">
                  {clientReservations.filter(r => r.status === "confirmee").length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Confirmées</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold">{totalSpent.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">FCFA dépensés</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="reservations">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reservations">
                Réservations ({clientReservations.length})
              </TabsTrigger>
              <TabsTrigger value="reclamations">
                Réclamations ({clientComplaints.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reservations" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des réservations</CardTitle>
                </CardHeader>
                <CardContent>
                  {clientReservations.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Aucune réservation pour ce client
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {clientReservations.map((reservation) => {
                        const property = mockProperties.find(p => p.id === reservation.propertyId)
                        return (
                          <div 
                            key={reservation.id}
                            className="flex items-center justify-between p-4 rounded-lg border"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                                <img 
                                  src={property?.images[0]} 
                                  alt={property?.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{property?.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(reservation.startDate).toLocaleDateString('fr-FR')} - {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
                                </p>
                                <p className="text-sm font-medium text-primary">
                                  {reservation.totalPrice.toLocaleString()} FCFA
                                </p>
                              </div>
                            </div>
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
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reclamations" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Réclamations</CardTitle>
                </CardHeader>
                <CardContent>
                  {clientComplaints.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Aucune réclamation pour ce client
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {clientComplaints.map((complaint) => (
                        <div 
                          key={complaint.id}
                          className="flex items-center justify-between p-4 rounded-lg border"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                              <MessageSquare className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium">{complaint.subject}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {complaint.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(complaint.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <Badge variant={
                            complaint.status === "traitee" ? "default" :
                            complaint.status === "en_cours" ? "secondary" : "destructive"
                          }>
                            {complaint.status === "traitee" ? "Traitée" :
                             complaint.status === "en_cours" ? "En cours" : "Ouverte"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
