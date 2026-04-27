import Link from "next/link"
import { Building2, Mail, Phone, MapPin } from "lucide-react"

export function PublicFooter() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-sidebar-primary" />
              <span className="text-xl font-bold">ImmoGestion</span>
            </div>
            <p className="text-sidebar-foreground/70 text-sm">
              Votre partenaire de confiance pour la gestion de vos locations immobilieres depuis 2010.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/biens" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Nos Biens
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-sidebar-foreground/70">Gestion locative</li>
              <li className="text-sidebar-foreground/70">Location longue duree</li>
              <li className="text-sidebar-foreground/70">Location saisonniere</li>
              <li className="text-sidebar-foreground/70">Conseil immobilier</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-sidebar-foreground/70">
                <MapPin className="h-4 w-4" />
                <span>15 Avenue de la Republique, 75011 Paris</span>
              </li>
              <li className="flex items-center gap-2 text-sidebar-foreground/70">
                <Phone className="h-4 w-4" />
                <span>01 23 45 67 89</span>
              </li>
              <li className="flex items-center gap-2 text-sidebar-foreground/70">
                <Mail className="h-4 w-4" />
                <span>contact@immogestion.fr</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sidebar-border mt-8 pt-8 text-center text-sm text-sidebar-foreground/70">
          <p>&copy; {new Date().getFullYear()} ImmoGestion. Tous droits reserves.</p>
        </div>
      </div>
    </footer>
  )
}
