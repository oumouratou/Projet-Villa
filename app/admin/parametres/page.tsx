"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Settings,
  Building,
  Mail,
  Bell,
  Globe,
  Shield,
  Save,
  Upload
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Paramètres système</h1>
        <p className="text-muted-foreground mt-1">
          Configuration générale de la plateforme
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Informations de l'agence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informations de l&apos;agence
            </CardTitle>
            <CardDescription>
              Informations affichées sur le site public
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agencyName">Nom de l&apos;agence</Label>
              <Input id="agencyName" defaultValue="ImmoGestion" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agencyEmail">Email de contact</Label>
              <Input id="agencyEmail" type="email" defaultValue="contact@immogestion.ci" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agencyPhone">Téléphone</Label>
              <Input id="agencyPhone" defaultValue="+225 27 22 XX XX XX" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agencyAddress">Adresse</Label>
              <Textarea 
                id="agencyAddress" 
                defaultValue="Cocody, Abidjan, Côte d'Ivoire"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Logo de l&apos;agence</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <Button type="button" variant="outline" size="sm">
                  Télécharger un logo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de réservation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres de réservation
            </CardTitle>
            <CardDescription>
              Configuration des réservations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minNights">Nombre minimum de nuits</Label>
              <Input id="minNights" type="number" defaultValue="1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxNights">Nombre maximum de nuits</Label>
              <Input id="maxNights" type="number" defaultValue="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advanceBooking">Réservation à l&apos;avance (jours)</Label>
              <Input id="advanceBooking" type="number" defaultValue="90" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceFee">Frais de service (%)</Label>
              <Input id="serviceFee" type="number" defaultValue="5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Confirmation automatique</Label>
                <p className="text-xs text-muted-foreground">
                  Confirmer automatiquement les réservations
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Notifications email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Notifications email
            </CardTitle>
            <CardDescription>
              Configuration des emails automatiques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Nouvelle réservation</Label>
                <p className="text-xs text-muted-foreground">
                  Notifier les agents des nouvelles réservations
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Réservation confirmée</Label>
                <p className="text-xs text-muted-foreground">
                  Notifier le client de la confirmation
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Nouvelle réclamation</Label>
                <p className="text-xs text-muted-foreground">
                  Notifier les agents des réclamations
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Rappel de séjour</Label>
                <p className="text-xs text-muted-foreground">
                  Rappeler les clients avant leur séjour
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres régionaux */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Paramètres régionaux
            </CardTitle>
            <CardDescription>
              Langue, devise et format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Langue par défaut</Label>
              <Select defaultValue="fr">
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select defaultValue="xof">
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xof">Franc CFA (FCFA)</SelectItem>
                  <SelectItem value="eur">Euro (EUR)</SelectItem>
                  <SelectItem value="usd">Dollar US (USD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Select defaultValue="africa_abidjan">
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="africa_abidjan">Africa/Abidjan (GMT+0)</SelectItem>
                  <SelectItem value="europe_paris">Europe/Paris (GMT+1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Format de date</Label>
              <Select defaultValue="dd_mm_yyyy">
                <SelectTrigger id="dateFormat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd_mm_yyyy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="mm_dd_yyyy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="yyyy_mm_dd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Paramètres de sécurité de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label>Authentification à deux facteurs</Label>
                  <p className="text-xs text-muted-foreground">
                    Obliger la 2FA pour les agents
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label>Expiration de session</Label>
                  <p className="text-xs text-muted-foreground">
                    Déconnexion après 30min d&apos;inactivité
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label>Log des activités</Label>
                  <p className="text-xs text-muted-foreground">
                    Enregistrer toutes les actions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label>Notifications de connexion</Label>
                  <p className="text-xs text-muted-foreground">
                    Alerter en cas de nouvelle connexion
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button variant="outline">Annuler les modifications</Button>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Enregistrer les paramètres
        </Button>
      </div>
    </div>
  )
}
