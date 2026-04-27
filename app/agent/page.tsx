"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  CalendarCheck, 
  MessageSquare, 
  Users,
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowRight,
  Home,
  CheckCircle2,
  XCircle
} from "lucide-react"
import Link from "next/link"
import { mockProperties, mockReservations, mockComplaints, mockClients } from "@/lib/mock-data"

export default function AgentDashboard() {
  const pendingReservations = mockReservations.filter(r => r.status === "en_attente")
  const pendingComplaints = mockComplaints.filter(c => c.status === "ouverte" || c.status === "en_cours")
  const availableProperties = mockProperties.filter(p => p.status === "disponible")

  const stats = [
    {
      title: "Biens gérés",
      value: mockProperties.length,
      icon: Building2,
      description: `${availableProperties.length} disponibles`,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Réservations en attente",
      value: pendingReservations.length,
      icon: Clock,
      description: "À traiter",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Réclamations ouvertes",
      value: pendingComplaints.length,
      icon: MessageSquare,
      description: "En cours de traitement",
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "Clients actifs",
      value: mockClients.length,
      icon: Users,
      description: "Inscrits sur la plateforme",
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord Agent</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenue, gérez vos biens et réservations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Réservations en attente */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Réservations en attente
              </CardTitle>
              <CardDescription>Actions requises</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/agent/reservations">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingReservations.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Aucune réservation en attente
              </p>
            ) : (
              <div className="space-y-4">
                {pendingReservations.slice(0, 4).map((reservation) => {
                  const property = mockProperties.find(p => p.id === reservation.propertyId)
                  const client = mockClients.find(c => c.id === reservation.clientId)
                  return (
                    <div 
                      key={reservation.id} 
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Home className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{property?.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {client?.firstName} {client?.lastName} • {new Date(reservation.startDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 text-green-600 border-green-600 hover:bg-green-50">
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 text-red-600 border-red-600 hover:bg-red-50">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Réclamations récentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Réclamations ouvertes
              </CardTitle>
              <CardDescription>À traiter en priorité</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/agent/reclamations">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingComplaints.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Aucune réclamation ouverte
              </p>
            ) : (
              <div className="space-y-4">
                {pendingComplaints.slice(0, 4).map((complaint) => {
                  const client = mockClients.find(c => c.id === complaint.clientId)
                  return (
                    <div 
                      key={complaint.id} 
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{complaint.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {client?.firstName} {client?.lastName} • {new Date(complaint.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <Badge variant={complaint.status === "ouverte" ? "destructive" : "secondary"}>
                        {complaint.status === "ouverte" ? "Ouverte" : "En cours"}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Biens récents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Biens immobiliers
            </CardTitle>
            <CardDescription>Aperçu de votre portefeuille</CardDescription>
          </div>
          <Button asChild>
            <Link href="/agent/biens/nouveau">
              Ajouter un bien
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Bien</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ville</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Prix/nuit</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Statut</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockProperties.slice(0, 5).map((property) => (
                  <tr key={property.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                          <img 
                            src={property.images[0]} 
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium">{property.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{property.city}</td>
                    <td className="py-3 px-4 font-medium">{property.pricePerNight.toLocaleString()} FCFA</td>
                    <td className="py-3 px-4">
                      <Badge variant={
                        property.status === "disponible" ? "default" :
                        property.status === "reserve" ? "secondary" : "outline"
                      }>
                        {property.status === "disponible" ? "Disponible" :
                         property.status === "reserve" ? "Réservé" : "Maintenance"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/agent/biens/${property.id}`}>
                          Voir
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
