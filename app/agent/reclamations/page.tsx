"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Search, 
  Eye, 
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react"
import Link from "next/link"
import { mockComplaints, mockClients, mockReservations, mockProperties } from "@/lib/mock-data"

export default function AgentComplaintsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredComplaints = mockComplaints.filter(complaint => {
    const client = mockClients.find(c => c.id === complaint.clientId)
    const matchesSearch = 
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${client?.firstName} ${client?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = [
    { 
      label: "Total", 
      value: mockComplaints.length, 
      color: "text-foreground",
      bgColor: "bg-muted"
    },
    { 
      label: "Ouvertes", 
      value: mockComplaints.filter(c => c.status === "ouverte").length, 
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    { 
      label: "En cours", 
      value: mockComplaints.filter(c => c.status === "en_cours").length, 
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    { 
      label: "Traitées", 
      value: mockComplaints.filter(c => c.status === "traitee").length, 
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestion des réclamations</h1>
        <p className="text-muted-foreground mt-1">
          Traitez les réclamations des clients
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <MessageSquare className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par sujet ou client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="ouverte">Ouverte</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="traitee">Traitée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Liste des réclamations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Réservation liée</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.map((complaint) => {
                  const client = mockClients.find(c => c.id === complaint.clientId)
                  const reservation = complaint.reservationId 
                    ? mockReservations.find(r => r.id === complaint.reservationId)
                    : null
                  const property = reservation 
                    ? mockProperties.find(p => p.id === reservation.propertyId)
                    : null
                  
                  return (
                    <TableRow key={complaint.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            complaint.status === "ouverte" ? "bg-red-100" :
                            complaint.status === "en_cours" ? "bg-orange-100" : "bg-green-100"
                          }`}>
                            {complaint.status === "ouverte" && <AlertCircle className="h-5 w-5 text-red-600" />}
                            {complaint.status === "en_cours" && <Clock className="h-5 w-5 text-orange-600" />}
                            {complaint.status === "traitee" && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                          </div>
                          <div>
                            <p className="font-medium">{complaint.subject}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {complaint.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{client?.firstName} {client?.lastName}</p>
                        <p className="text-xs text-muted-foreground">{client?.email}</p>
                      </TableCell>
                      <TableCell>
                        {property ? (
                          <p className="text-sm">{property.title}</p>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(complaint.createdAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          complaint.status === "traitee" ? "default" :
                          complaint.status === "en_cours" ? "secondary" : "destructive"
                        }>
                          {complaint.status === "traitee" ? "Traitée" :
                           complaint.status === "en_cours" ? "En cours" : "Ouverte"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/agent/reclamations/${complaint.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Traiter
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredComplaints.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucune réclamation trouvée</h3>
              <p className="text-muted-foreground">Modifiez vos filtres de recherche</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
