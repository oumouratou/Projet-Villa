"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Plus, 
  Shield,
  Building2,
  CalendarCheck,
  MessageSquare,
  Users,
  Settings,
  Eye,
  Edit,
  Trash2,
  Save
} from "lucide-react"

const permissionGroups = [
  {
    name: "Biens immobiliers",
    icon: Building2,
    permissions: [
      { id: "biens.view", name: "Voir les biens", description: "Accès en lecture aux biens" },
      { id: "biens.create", name: "Créer des biens", description: "Ajouter de nouveaux biens" },
      { id: "biens.edit", name: "Modifier les biens", description: "Éditer les biens existants" },
      { id: "biens.delete", name: "Supprimer les biens", description: "Supprimer des biens" },
    ]
  },
  {
    name: "Réservations",
    icon: CalendarCheck,
    permissions: [
      { id: "reservations.view", name: "Voir les réservations", description: "Accès en lecture" },
      { id: "reservations.confirm", name: "Confirmer", description: "Confirmer les réservations" },
      { id: "reservations.reject", name: "Refuser", description: "Refuser les réservations" },
      { id: "reservations.delete", name: "Supprimer", description: "Supprimer les réservations" },
    ]
  },
  {
    name: "Réclamations",
    icon: MessageSquare,
    permissions: [
      { id: "reclamations.view", name: "Voir les réclamations", description: "Accès en lecture" },
      { id: "reclamations.respond", name: "Répondre", description: "Répondre aux réclamations" },
      { id: "reclamations.close", name: "Clôturer", description: "Fermer les réclamations" },
    ]
  },
  {
    name: "Clients",
    icon: Users,
    permissions: [
      { id: "clients.view", name: "Voir les clients", description: "Accès en lecture" },
      { id: "clients.edit", name: "Modifier", description: "Modifier les informations clients" },
      { id: "clients.delete", name: "Supprimer", description: "Supprimer des clients" },
    ]
  },
  {
    name: "Administration",
    icon: Settings,
    permissions: [
      { id: "admin.users", name: "Gérer les utilisateurs", description: "CRUD sur les agents" },
      { id: "admin.roles", name: "Gérer les rôles", description: "Configurer les rôles" },
      { id: "admin.permissions", name: "Gérer les permissions", description: "Attribuer les permissions" },
      { id: "admin.settings", name: "Paramètres système", description: "Configuration globale" },
    ]
  },
]

const roles = [
  { id: "admin", name: "Administrateur", permissions: ["all"] },
  { id: "agent", name: "Agent", permissions: ["biens.view", "biens.create", "biens.edit", "reservations.view", "reservations.confirm", "reservations.reject", "reclamations.view", "reclamations.respond", "clients.view"] },
  { id: "supervisor", name: "Superviseur", permissions: ["biens.view", "reservations.view", "reclamations.view", "clients.view"] },
]

export default function PermissionsPage() {
  const [selectedRole, setSelectedRole] = useState("agent")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const currentRole = roles.find(r => r.id === selectedRole)
  const hasPermission = (permId: string) => {
    return currentRole?.permissions.includes("all") || currentRole?.permissions.includes(permId)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des permissions</h1>
          <p className="text-muted-foreground mt-1">
            Configurez les permissions par rôle
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle permission
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle permission</DialogTitle>
              <DialogDescription>
                Créez une nouvelle permission personnalisée
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="permName">Nom de la permission *</Label>
                <Input id="permName" placeholder="Ex: rapports.view" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="permLabel">Libellé</Label>
                <Input id="permLabel" placeholder="Ex: Voir les rapports" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="permDesc">Description</Label>
                <Input id="permDesc" placeholder="Description de la permission" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sélection du rôle */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Rôles
            </CardTitle>
            <CardDescription>Sélectionnez un rôle à configurer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedRole === role.id 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "hover:bg-muted"
                }`}
              >
                <p className="font-medium">{role.name}</p>
                <p className={`text-xs ${selectedRole === role.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {role.permissions.includes("all") 
                    ? "Toutes les permissions" 
                    : `${role.permissions.length} permissions`}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Permissions - {currentRole?.name}</CardTitle>
                <CardDescription>
                  Cochez les permissions à accorder à ce rôle
                </CardDescription>
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={permissionGroups.map(g => g.name)} className="space-y-4">
              {permissionGroups.map((group) => (
                <AccordionItem key={group.name} value={group.name} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <group.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{group.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {group.permissions.filter(p => hasPermission(p.id)).length}/{group.permissions.length} actives
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {group.permissions.map((permission) => (
                        <div 
                          key={permission.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border ${
                            hasPermission(permission.id) ? "bg-green-50 border-green-200" : ""
                          }`}
                        >
                          <Checkbox 
                            id={permission.id}
                            checked={hasPermission(permission.id)}
                            disabled={currentRole?.permissions.includes("all")}
                          />
                          <div className="flex-1">
                            <label 
                              htmlFor={permission.id}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {permission.name}
                            </label>
                            <p className="text-xs text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
