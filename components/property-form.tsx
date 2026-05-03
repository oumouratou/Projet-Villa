import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Property, PropertyOption } from "@/lib/types"
import { createProperty, updateProperty, getPropertyOptions } from "@/lib/backend-api"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"

interface PropertyFormProps {
  property?: Property
  onSuccess?: () => void
}

export function PropertyForm({ property, onSuccess }: PropertyFormProps) {
  const router = useRouter()
  const { token } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [options, setOptions] = useState<PropertyOption[]>([])
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    property?.options?.map((o) => o.id) ?? []
  )

  const [formData, setFormData] = useState({
    title: property?.title ?? "",
    type: property?.type ?? "appartement",
    description: property?.description ?? "",
    address: property?.address ?? "",
    city: property?.city ?? "",
    postalCode: property?.postalCode ?? "",
    pricePerNight: property?.pricePerNight ?? 0,
    surface: property?.surface ?? 0,
    bedrooms: property?.bedrooms ?? 1,
    bathrooms: property?.bathrooms ?? 1,
    capacity: property?.capacity ?? 2,
    status: property?.status ?? "disponible",
    imageUrl: "",
  })

  useEffect(() => {
    async function loadOptions() {
      try {
        const opts = await getPropertyOptions()
        setOptions(opts)
      } catch (e) {
        console.error("Error loading options:", e)
      }
    }
    loadOptions()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }))
  }

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setError("Vous devez être connecté")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (property?.id) {
        await updateProperty(
          property.id,
          {
            ...formData,
            options: selectedOptions,
          },
          token
        )
      } else {
        await createProperty(
          {
            ...formData,
            options: selectedOptions,
          },
          token
        )
      }
      onSuccess?.()
      router.push("/agent/biens")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la sauvegarde")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{property ? "Modifier la propriété" : "Ajouter une nouvelle propriété"}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Villa moderne Cocody"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Type de propriété *</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="appartement">Appartement</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="maison">Maison</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Ex: Rue du Plateau"
                required
              />
            </div>
            <div>
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Ex: Abidjan"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="postalCode">Code postal</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="Ex: 01 BP 1234"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description détaillée de la propriété"
              rows={4}
              required
            />
          </div>

          {/* Pricing and Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="pricePerNight">Prix/nuit (XOF) *</Label>
              <Input
                id="pricePerNight"
                name="pricePerNight"
                type="number"
                value={formData.pricePerNight}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="surface">Surface (m²) *</Label>
              <Input
                id="surface"
                name="surface"
                type="number"
                value={formData.surface}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="bedrooms">Chambres *</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="bathrooms">Salles d'eau *</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capacity">Capacité *</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Statut *</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="reserve">Réservé</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <Label htmlFor="imageUrl">URL de l'image</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Options */}
          {options.length > 0 && (
            <div>
              <Label>Options/Services</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`option-${option.id}`}
                      checked={selectedOptions.includes(option.id)}
                      onCheckedChange={() => toggleOption(option.id)}
                    />
                    <label
                      htmlFor={`option-${option.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {option.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {property ? "Mettre à jour" : "Créer la propriété"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
