"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Upload, X, Save, Building2 } from "lucide-react"
import Link from "next/link"
import { mockOptions } from "@/lib/mock-data"

export default function NewPropertyPage() {
  const [images, setImages] = useState<string[]>([])
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/agent/biens">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ajouter un bien</h1>
          <p className="text-muted-foreground mt-1">
            Remplissez les informations du nouveau bien immobilier
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
            <CardDescription>
              Détails principaux du bien
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du bien *</Label>
                <Input id="title" placeholder="Ex: Villa moderne avec piscine" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type de bien *</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionner le type" />
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
                placeholder="Décrivez le bien en détail..."
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address">Adresse *</Label>
                <Input id="address" placeholder="Adresse complète" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ville *</Label>
                <Select>
                  <SelectTrigger id="city">
                    <SelectValue placeholder="Sélectionner la ville" />
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
            <CardDescription>
              Dimensions et capacité du bien
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="surface">Surface (m²) *</Label>
                <Input id="surface" type="number" placeholder="Ex: 120" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Chambres *</Label>
                <Input id="bedrooms" type="number" placeholder="Ex: 3" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Salles de bain *</Label>
                <Input id="bathrooms" type="number" placeholder="Ex: 2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacité (pers.) *</Label>
                <Input id="capacity" type="number" placeholder="Ex: 6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tarification */}
        <Card>
          <CardHeader>
            <CardTitle>Tarification</CardTitle>
            <CardDescription>
              Prix et statut du bien
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Prix par nuit (FCFA) *</Label>
                <Input id="price" type="number" placeholder="Ex: 50000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut *</Label>
                <Select defaultValue="disponible">
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

        {/* Options et équipements */}
        <Card>
          <CardHeader>
            <CardTitle>Options et équipements</CardTitle>
            <CardDescription>
              Sélectionnez les équipements disponibles
            </CardDescription>
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
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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
            <CardDescription>
              Ajoutez des photos attractives (max 10)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Glissez-déposez vos images ici ou
              </p>
              <Button type="button" variant="outline">
                Parcourir les fichiers
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG jusqu&apos;à 5MB
              </p>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
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
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/agent/biens">Annuler</Link>
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer le bien
          </Button>
        </div>
      </form>
    </div>
  )
}
