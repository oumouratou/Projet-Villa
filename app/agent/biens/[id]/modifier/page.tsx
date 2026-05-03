"use client"

import { PropertyForm } from "@/components/property-form"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getProperty } from "@/lib/backend-api"
import type { Property } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user?.role !== "admin" && user?.role !== "agent"))) {
      router.push("/connexion")
    }
  }, [isAuthenticated, isLoading, user, router])

  useEffect(() => {
    async function loadProperty() {
      try {
        const data = await getProperty(params.id)
        if (!data) {
          router.push("/agent/biens")
          return
        }
        setProperty(data)
      } catch {
        router.push("/agent/biens")
      } finally {
        setLoading(false)
      }
    }
    loadProperty()
  }, [params.id, router])

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "agent")) {
    return null
  }

  if (!property) {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <PropertyForm property={property} />
      </div>
    </div>
  )
}
          <Link href={`/agent/biens/${property.id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Modifier le bien</h1>
          <p className="text-muted-foreground mt-1">
            {property.title}
          </p>
        </div>
      </div>

      <form className="space-y-6">
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du bien *</Label>
                <Input id="title" defaultValue={property.title} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type de bien *</Label>
                <Select defaultValue={property.type}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="appartement">Appartement</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="maison">Maison</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description" 
                defaultValue={property.description}
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address">Adresse *</Label>
                <Input id="address" defaultValue={property.address} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ville *</Label>
                <Select defaultValue={property.city.toLowerCase()}>
                  <SelectTrigger id="city">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abidjan">Abidjan</SelectItem>
                    <SelectItem value="bouake">Bouaké</SelectItem>
                    <SelectItem value="yamoussoukro">Yamoussoukro</SelectItem>
                    <SelectItem value="san-pedro">San Pedro</SelectItem>
                    <SelectItem value="korhogo">Korhogo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Caractéristiques */}
        <Card>
          <CardHeader>
            <CardTitle>Caractéristiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="surface">Surface (m²) *</Label>
                <Input id="surface" type="number" defaultValue={property.surface} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Chambres *</Label>
                <Input id="bedrooms" type="number" defaultValue={property.bedrooms} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Salles de bain *</Label>
                <Input id="bathrooms" type="number" defaultValue={property.bathrooms} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacité (pers.) *</Label>
                <Input id="capacity" type="number" defaultValue={property.capacity} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tarification */}
        <Card>
          <CardHeader>
            <CardTitle>Tarification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Prix par nuit (FCFA) *</Label>
                <Input id="price" type="number" defaultValue={property.pricePerNight} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut *</Label>
                <Select defaultValue={property.status}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="reserve">Réservé</SelectItem>
                    <SelectItem value="maintenance">En maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle>Options et équipements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={option.id}
                    checked={selectedOptions.includes(option.id)}
                    onCheckedChange={() => handleOptionToggle(option.id)}
                  />
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {option.name}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Photos du bien</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <Button type="button" variant="outline" size="sm">
                Ajouter des photos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/agent/biens/${property.id}`}>Annuler</Link>
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </div>
  )
}
