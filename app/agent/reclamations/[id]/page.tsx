"use client"

import { use, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  Home,
  Send
} from "lucide-react"
import Link from "next/link"
import { mockComplaints, mockClients, mockReservations, mockProperties } from "@/lib/mock-data"

export default function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [response, setResponse] = useState("")
  const [status, setStatus] = useState("")
  
  const complaint = mockComplaints.find(c => c.id === id)
  const client = complaint ? mockClients.find(c => c.id === complaint.clientId) : null
  const reservation = complaint?.reservationId 
    ? mockReservations.find(r => r.id === complaint.reservationId)
    : null
  const property = reservation 
    ? mockProperties.find(p => p.id === reservation.propertyId)
    : null

  if (!complaint || !client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold">Réclamation non trouvée</h1>
        <Button className="mt-4" asChild>
          <Link href="/agent/reclamations">Retour à la liste</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/agent/reclamations">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Réclamation #{complaint.id.slice(0, 8)}</h1>
            <p className="text-muted-foreground mt-1">
              Déposée le {new Date(complaint.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
        <Badge 
          variant={
            complaint.status === "traitee" ? "default" :
            complaint.status === "en_cours" ? "secondary" : "destructive"
          }
          className="text-sm px-4 py-2"
        >
          {complaint.status === "traitee" && <CheckCircle2 className="mr-2 h-4 w-4" />}
          {complaint.status === "en_cours" && <Clock className="mr-2 h-4 w-4" />}
          {complaint.status === "ouverte" && <AlertCircle className="mr-2 h-4 w-4" />}
          {complaint.status === "traitee" ? "Traitée" :
           complaint.status === "en_cours" ? "En cours" : "Ouverte"}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Contenu de la réclamation */}
          <Card>
            <CardHeader>
              <CardTitle>{complaint.subject}</CardTitle>
              <CardDescription>
                Soumise le {new Date(complaint.createdAt).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-muted">
                <p className="whitespace-pre-wrap">{complaint.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Réservation liée */}
          {reservation && property && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Réservation liée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden">
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{property.title}</p>
                    <p className="text-sm text-muted-foreground">{property.city}</p>
                    <p className="text-sm mt-1">
                      {new Date(reservation.startDate).toLocaleDateString('fr-FR')} - {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/agent/reservations/${reservation.id}`}>
                      Voir la réservation
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Réponse agent existante */}
          {complaint.agentResponse && (
            <Card>
              <CardHeader>
                <CardTitle>Réponse de l&apos;agent</CardTitle>
                <CardDescription>
                  Répondu le {new Date(complaint.updatedAt || complaint.createdAt).toLocaleDateString('fr-FR')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="whitespace-pre-wrap">{complaint.agentResponse}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formulaire de réponse */}
          {complaint.status !== "traitee" && (
            <Card>
              <CardHeader>
                <CardTitle>Traiter la réclamation</CardTitle>
                <CardDescription>
                  Répondez au client et mettez à jour le statut
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Nouveau statut</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_cours">En cours de traitement</SelectItem>
                      <SelectItem value="traitee">Traitée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="response">Votre réponse</Label>
                  <Textarea
                    id="response"
                    placeholder="Écrivez votre réponse au client..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={5}
                  />
                </div>

                <Button className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer la réponse
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Info client */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {client.firstName[0]}{client.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-3 font-semibold">{client.firstName} {client.lastName}</h3>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Client depuis {new Date(client.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href={`/agent/clients/${client.id}`}>
                  Voir le profil
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Historique */}
          <Card>
            <CardHeader>
              <CardTitle>Historique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium">Réclamation créée</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(complaint.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                {complaint.status !== "ouverte" && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-orange-500" />
                    <div>
                      <p className="text-sm font-medium">Prise en charge</p>
                      <p className="text-xs text-muted-foreground">
                        En cours de traitement
                      </p>
                    </div>
                  </div>
                )}
                {complaint.status === "traitee" && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                    <div>
                      <p className="text-sm font-medium">Réclamation traitée</p>
                      <p className="text-xs text-muted-foreground">
                        Réponse envoyée au client
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
