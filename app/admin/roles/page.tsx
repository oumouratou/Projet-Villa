"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
  Plus, 
  Edit, 
  Trash2,
  Shield,
  Users,
  Settings
} from "lucide-react"

const mockRoles = [
  {
    id: "1",
    name: "Administrateur",
    description: "Accès complet à toutes les fonctionnalités",
    usersCount: 2,
    permissions: ["all"],
    isSystem: true
  },
  {
    id: "2",
    name: "Agent",
    description: "Gestion des biens, réservations et réclamations",
    usersCount: 5,
    permissions: ["biens.view", "biens.edit", "reservations.view", "reservations.edit", "reclamations.view", "reclamations.edit", "clients.view"],
    isSystem: true
  },
  {
    id: "3",
    name: "Superviseur",
    description: "Accès en lecture seule aux statistiques",
    usersCount: 1,
    permissions: ["stats.view", "biens.view", "reservations.view"],
    isSystem: false
  },
]

export default function RolesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<typeof mockRoles[0] | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des rôles</h1>
          <p className="text-muted-foreground mt-1">
            Configurez les rôles et niveaux d&apos;accès
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Créer un rôle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau rôle</DialogTitle>
              <DialogDescription>
                Créez un nouveau rôle avec des permissions personnalisées
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Nom du rôle *</Label>
                <Input id="roleName" placeholder="Ex: Superviseur" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleDescription">Description</Label>
                <Textarea 
                  id="roleDescription" 
                  placeholder="Décrivez les responsabilités de ce rôle..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Créer le rôle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des rôles */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockRoles.map((role) => (
          <Card key={role.id} className="relative">
            {role.isSystem && (
              <Badge variant="secondary" className="absolute top-4 right-4">
                Système
              </Badge>
            )}
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  role.name === "Administrateur" ? "bg-primary/10" :
                  role.name === "Agent" ? "bg-green-100" : "bg-orange-100"
                }`}>
                  <Shield className={`h-6 w-6 ${
                    role.name === "Administrateur" ? "text-primary" :
                    role.name === "Agent" ? "text-green-600" : "text-orange-600"
                  }`} />
                </div>
                <div>
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {role.usersCount} utilisateur(s)
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {role.permissions.slice(0, 3).map((perm) => (
                  <Badge key={perm} variant="outline" className="text-xs">
                    {perm === "all" ? "Toutes" : perm.split('.')[0]}
                  </Badge>
                ))}
                {role.permissions.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{role.permissions.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedRole(role)
                    setIsEditDialogOpen(true)
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
                {!role.isSystem && (
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le rôle</DialogTitle>
            <DialogDescription>
              Modifiez les informations et permissions de ce rôle
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="editRoleName">Nom du rôle</Label>
                  <Input 
                    id="editRoleName" 
                    defaultValue={selectedRole.name}
                    disabled={selectedRole.isSystem}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Utilisateurs</Label>
                  <Input value={`${selectedRole.usersCount} utilisateur(s)`} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRoleDescription">Description</Label>
                <Textarea 
                  id="editRoleDescription" 
                  defaultValue={selectedRole.description}
                  rows={2}
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
