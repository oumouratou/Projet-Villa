"use client"

import { useEffect, useState } from "react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  MapPin,
  Building2,
  Filter,
  Loader2,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import type { Property } from "@/lib/types"
import { getProperties, deleteProperty } from "@/lib/backend-api"

export default function AgentPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cityFilter, setCityFilter] = useState("all")
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  
  const { user, token, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "agent")) {
      router.push("/connexion")
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getProperties()
      // Filter to show only current user's properties if agent
      if (user?.role === "agent") {
        setProperties(data.filter((p) => p.agentId === user.id))
      } else {
        setProperties(data)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors du chargement")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (propertyId: string) => {
    if (!token) return

    try {
      await deleteProperty(propertyId, token)
      setProperties(properties.filter((p) => p.id !== propertyId))
      setDeleteConfirm(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la suppression")
    }
  }

  const cities = [...new Set(properties.map((p) => p.city))]
  const statuses = ["disponible", "reserve", "maintenance"]

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || property.status === statusFilter
    const matchesCity = cityFilter === "all" || property.city === cityFilter
    return matchesSearch && matchesStatus && matchesCity
  })

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "agent")) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des biens</h1>
          <p className="text-muted-foreground mt-1">
            {filteredProperties.length} bien{filteredProperties.length !== 1 ? 's' : ''} 
            {statusFilter !== "all" || cityFilter !== "all" ? " filtrés" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/agent/biens/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un bien
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un bien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === "disponible" ? "Disponible" :
                     status === "reserve" ? "Réservé" : "Maintenance"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Ville" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            <p className="text-muted-foreground mt-2">Chargement des biens...</p>
          </CardContent>
        </Card>
      )}

      {/* Liste des biens */}
      {!isLoading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video bg-muted">
                {property.images?.[0] && (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <Badge 
                  className="absolute top-3 right-3"
                  variant={
                    property.status === "disponible" ? "default" :
                    property.status === "reserve" ? "secondary" : "outline"
                  }
                >
                  {property.status === "disponible" ? "Disponible" :
                   property.status === "reserve" ? "Réservé" : "Maintenance"}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/agent/biens/${property.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir détails
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/agent/biens/${property.id}/modifier`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => setDeleteConfirm(property.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{property.address}, {property.city}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {property.bedrooms} ch.
                  </span>
                  <span>{property.surface} m²</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-lg font-bold text-primary">
                    {property.pricePerNight.toLocaleString()} FCFA
                    <span className="text-sm font-normal text-muted-foreground">/nuit</span>
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/agent/biens/${property.id}`}>
                      Détails
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProperties.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Aucun bien trouvé</h3>
            <p className="text-muted-foreground text-center mt-1">
              Modifiez vos filtres ou ajoutez un nouveau bien
            </p>
            <Button className="mt-4" asChild>
              <Link href="/agent/biens/nouveau">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un bien
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Supprimer le bien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Êtes-vous sûr de vouloir supprimer ce bien? Cette action est irréversible.</p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDelete(deleteConfirm)}
                >
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
