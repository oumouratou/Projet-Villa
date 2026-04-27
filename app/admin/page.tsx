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
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  UserCog,
  Shield,
  Activity
} from "lucide-react"
import Link from "next/link"
import { mockProperties, mockReservations, mockComplaints, mockClients, mockAgents } from "@/lib/mock-data"

export default function AdminDashboard() {
  const totalRevenue = mockReservations
    .filter(r => r.status === "confirmee")
    .reduce((sum, r) => sum + r.totalPrice, 0)

  const stats = [
    {
      title: "Revenus totaux",
      value: `${totalRevenue.toLocaleString()} FCFA`,
      icon: DollarSign,
      change: "+12.5%",
      changeType: "positive",
      description: "vs mois dernier"
    },
    {
      title: "Biens actifs",
      value: mockProperties.length,
      icon: Building2,
      change: "+3",
      changeType: "positive",
      description: "nouveaux ce mois"
    },
    {
      title: "Réservations",
      value: mockReservations.length,
      icon: CalendarCheck,
      change: "+18%",
      changeType: "positive",
      description: "vs mois dernier"
    },
    {
      title: "Clients inscrits",
      value: mockClients.length,
      icon: Users,
      change: "+24",
      changeType: "positive",
      description: "nouveaux ce mois"
    },
  ]

  const quickStats = [
    {
      title: "Agents",
      value: mockAgents.length,
      icon: UserCog,
      href: "/admin/utilisateurs"
    },
    {
      title: "Réclamations ouvertes",
      value: mockComplaints.filter(c => c.status === "ouverte").length,
      icon: MessageSquare,
      href: "/admin/reclamations"
    },
    {
      title: "Taux d'occupation",
      value: "78%",
      icon: TrendingUp,
      href: "#"
    },
    {
      title: "Rôles configurés",
      value: 3,
      icon: Shield,
      href: "/admin/roles"
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord Administrateur</h1>
        <p className="text-muted-foreground mt-1">
          Vue d&apos;ensemble de la plateforme
        </p>
      </div>

      {/* Stats principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.changeType === "positive" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-xs font-medium ${
                  stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats rapides */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Derniers agents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Agents récents
              </CardTitle>
              <CardDescription>Liste des agents de l&apos;agence</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/utilisateurs">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAgents.slice(0, 4).map((agent) => (
                <div 
                  key={agent.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-medium text-primary">
                        {agent.firstName[0]}{agent.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{agent.firstName} {agent.lastName}</p>
                      <p className="text-xs text-muted-foreground">{agent.email}</p>
                    </div>
                  </div>
                  <Badge variant={agent.status === "actif" ? "default" : "secondary"}>
                    {agent.status === "actif" ? "Actif" : "Inactif"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activité récente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activité récente
            </CardTitle>
            <CardDescription>Dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Nouvelle réservation", user: "Jean Dupont", time: "Il y a 5 min", type: "reservation" },
                { action: "Bien ajouté", user: "Marie Agent", time: "Il y a 15 min", type: "property" },
                { action: "Réclamation traitée", user: "Paul Agent", time: "Il y a 30 min", type: "complaint" },
                { action: "Client inscrit", user: "Sophie Martin", time: "Il y a 1h", type: "user" },
                { action: "Réservation confirmée", user: "Marie Agent", time: "Il y a 2h", type: "reservation" },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === "reservation" ? "bg-green-500" :
                    activity.type === "property" ? "bg-blue-500" :
                    activity.type === "complaint" ? "bg-orange-500" : "bg-primary"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      par {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Répartition des réservations */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des réservations par statut</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600">
                    {mockReservations.filter(r => r.status === "confirmee").length}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-green-800">Confirmées</p>
                  <p className="text-sm text-green-600">
                    {Math.round(mockReservations.filter(r => r.status === "confirmee").length / mockReservations.length * 100)}% du total
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-orange-600">
                    {mockReservations.filter(r => r.status === "en_attente").length}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-orange-800">En attente</p>
                  <p className="text-sm text-orange-600">
                    {Math.round(mockReservations.filter(r => r.status === "en_attente").length / mockReservations.length * 100)}% du total
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-red-600">
                    {mockReservations.filter(r => r.status === "refusee").length}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-red-800">Refusées</p>
                  <p className="text-sm text-red-600">
                    {Math.round(mockReservations.filter(r => r.status === "refusee").length / mockReservations.length * 100)}% du total
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
