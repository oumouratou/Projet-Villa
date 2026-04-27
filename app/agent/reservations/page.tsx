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
  CheckCircle2, 
  XCircle, 
  Clock,
  CalendarDays,
  Filter
} from "lucide-react"
import Link from "next/link"
import { mockReservations, mockProperties, mockClients } from "@/lib/mock-data"

export default function AgentReservationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredReservations = mockReservations.filter(reservation => {
    const property = mockProperties.find(p => p.id === reservation.propertyId)
    const client = mockClients.find(c => c.id === reservation.clientId)
    const matchesSearch = 
      property?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${client?.firstName} ${client?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = [
    { 
      label: "Total", 
      value: mockReservations.length, 
      color: "text-foreground" 
    },
    { 
      label: "En attente", 
      value: mockReservations.filter(r => r.status === "en_attente").length, 
      color: "text-orange-600" 
    },
    { 
      label: "Confirmées", 
      value: mockReservations.filter(r => r.status === "confirmee").length, 
      color: "text-green-600" 
    },
    { 
      label: "Refusées", 
      value: mockReservations.filter(r => r.status === "refusee").length, 
      color: "text-red-600" 
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestion des réservations</h1>
        <p className="text-muted-foreground mt-1">
          Gérez toutes les demandes de réservation
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{stat.label}</span>
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
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
                placeholder="Rechercher par bien ou client..."
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
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="confirmee">Confirmée</SelectItem>
                <SelectItem value="refusee">Refusée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des réservations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Liste des réservations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bien</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => {
                  const property = mockProperties.find(p => p.id === reservation.propertyId)
                  const client = mockClients.find(c => c.id === reservation.clientId)
                  return (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                            <img 
                              src={property?.images[0]} 
                              alt={property?.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{property?.title}</p>
                            <p className="text-xs text-muted-foreground">{property?.city}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{client?.firstName} {client?.lastName}</p>
                        <p className="text-xs text-muted-foreground">{client?.email}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {new Date(reservation.startDate).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          au {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
                        </p>
                      </TableCell>
                      <TableCell className="font-medium">
                        {reservation.totalPrice.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/agent/reservations/${reservation.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {reservation.status === "en_attente" && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredReservations.length === 0 && (
            <div className="text-center py-12">
              <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucune réservation trouvée</h3>
              <p className="text-muted-foreground">Modifiez vos filtres de recherche</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
