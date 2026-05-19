"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Wifi,
  Car,
  Waves,
  Wind,
  Tv,
  UtensilsCrossed,
  Settings
} from "lucide-react"
import { mockOptions } from "@/lib/mock-data"

const iconOptions = [
  { value: "wifi", label: "WiFi", icon: Wifi },
  { value: "car", label: "Parking", icon: Car },
  { value: "waves", label: "Piscine", icon: Waves },
  { value: "wind", label: "Climatisation", icon: Wind },
  { value: "tv", label: "Télévision", icon: Tv },
  { value: "utensils", label: "Cuisine", icon: UtensilsCrossed },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  car: Car,
  waves: Waves,
  wind: Wind,
  tv: Tv,
  utensils: UtensilsCrossed,
}

export default function OptionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<typeof mockOptions[0] | null>(null)

  const filteredOptions = mockOptions.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des options</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les équipements et options des biens
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une option
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle option</DialogTitle>
              <DialogDescription>
                Créez une nouvelle option pour les biens immobiliers
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l&apos;option</Label>
                <Input id="name" placeholder="Ex: Piscine chauffée" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icône</Label>
                <Select>
                  <SelectTrigger id="icon">
                    <SelectValue placeholder="Choisir une icône" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optionnel)</Label>
                <Input id="description" placeholder="Description de l'option" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Créer l&apos;option
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une option..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des options */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredOptions.map((option) => {
          const Icon = (option.icon && iconMap[option.icon]) || Settings
          return (
            <Card key={option.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{option.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {option.description || "Aucune description"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <Badge variant="secondary">
                    Utilisé dans {Math.floor(Math.random() * 10) + 1} biens
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => {
                        setSelectedOption(option)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredOptions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Aucune option trouvée</h3>
            <p className="text-muted-foreground text-center mt-1">
              Modifiez votre recherche ou créez une nouvelle option
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l&apos;option</DialogTitle>
            <DialogDescription>
              Modifiez les informations de cette option
            </DialogDescription>
          </DialogHeader>
          {selectedOption && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom de l&apos;option</Label>
                <Input id="edit-name" defaultValue={selectedOption.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icône</Label>
                <Select defaultValue={selectedOption.icon || undefined}>
                  <SelectTrigger id="edit-icon">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input 
                  id="edit-description" 
                  defaultValue={selectedOption.description || ""} 
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
