"use client"

import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Shield,
  Building2,
  CalendarCheck,
  MessageSquare
} from "lucide-react"
import Link from "next/link"
import { mockAgents, mockProperties, mockReservations, mockComplaints } from "@/lib/mock-data"

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  const agent = mockAgents.find(a => a.id === id)

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold">Utilisateur non trouvé</h1>
        <Button className="mt-4" asChild>
          <Link href="/admin/utilisateurs">Retour à la liste</Link>
        </Button>
      </div>
    )
  }

  // Stats simulées pour l'agent
  const managedProperties = Math.floor(Math.random() * 10) + 3
  const processedReservations = Math.floor(Math.random() * 50) + 10
  const handledComplaints = Math.floor(Math.random() * 20) + 5

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/utilisateurs">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profil utilisateur</h1>
            <p className="text-muted-foreground mt-1">
              Détails et statistiques de l&apos;agent
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/utilisateurs/${agent.id}/modifier`}>
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profil */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {agent.firstName[0]}{agent.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">
                {agent.firstName} {agent.lastName}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={agent.role === "admin" ? "default" : "secondary"}>
                  <Shield className="mr-1 h-3 w-3" />
                  {agent.role === "admin" ? "Administrateur" : "Agent"}
                </Badge>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{agent.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{agent.phone || "Non renseigné"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Membre depuis</p>
                  <p className="font-medium">
                    {new Date(agent.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex items-center justify-between">
              <span className="font-medium">Compte actif</span>
              <Switch checked={agent.status === "actif"} />
            </div>
          </CardContent>
        </Card>

        {/* Stats et activités */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{managedProperties}</p>
                    <p className="text-sm text-muted-foreground">Biens gérés</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <CalendarCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{processedReservations}</p>
                    <p className="text-sm text-muted-foreground">Réservations traitées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{handledComplaints}</p>
                    <p className="text-sm text-muted-foreground">Réclamations traitées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissions
              </CardTitle>
              <CardDescription>
                Droits d&apos;accès de l&apos;utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { name: "Gérer les biens", enabled: true },
                  { name: "Gérer les réservations", enabled: true },
                  { name: "Traiter les réclamations", enabled: true },
                  { name: "Voir les clients", enabled: true },
                  { name: "Gérer les utilisateurs", enabled: agent.role === "admin" },
                  { name: "Gérer les rôles", enabled: agent.role === "admin" },
                  { name: "Voir les statistiques", enabled: agent.role === "admin" },
                  { name: "Paramètres système", enabled: agent.role === "admin" },
                ].map((permission) => (
                  <div 
                    key={permission.name}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      permission.enabled ? "bg-green-50 border-green-200" : "bg-muted"
                    }`}
                  >
                    <span className="text-sm font-medium">{permission.name}</span>
                    <Badge variant={permission.enabled ? "default" : "secondary"}>
                      {permission.enabled ? "Oui" : "Non"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activité récente */}
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Réservation confirmée", date: "Aujourd'hui, 14:30" },
                  { action: "Bien modifié - Villa Cocody", date: "Aujourd'hui, 10:15" },
                  { action: "Réclamation traitée", date: "Hier, 16:45" },
                  { action: "Nouveau bien ajouté", date: "Il y a 2 jours" },
                  { action: "Connexion", date: "Il y a 2 jours" },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm">{activity.action}</span>
                    <span className="text-xs text-muted-foreground">{activity.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
