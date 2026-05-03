import Link from "next/link"
import { Search, Shield, Clock, Users, ArrowRight, Building2, MapPin } from "lucide-react"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { PropertyCard } from "@/components/property-card"
import { getProperties } from "@/lib/backend-api"
import type { Property } from "@/lib/types"

export default async function HomePage() {
  let featuredProperties: Property[] = []
  try {
    const properties = await getProperties()
    featuredProperties = properties.filter((p) => p.status === "disponible").slice(0, 3)
  } catch {
    featuredProperties = []
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-sidebar to-sidebar/90 text-sidebar-foreground py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
                Trouvez votre location ideale avec ImmoGestion
              </h1>
              <p className="text-lg lg:text-xl text-sidebar-foreground/80 mb-8 text-pretty">
                Decouvrez notre selection de biens immobiliers de qualite. 
                Appartements, maisons, studios - nous avons le logement parfait pour vous.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/biens"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Voir nos biens
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/inscription"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-sidebar-accent text-sidebar-accent-foreground rounded-lg font-semibold hover:bg-sidebar-accent/80 transition-colors"
                >
                  Creer un compte
                </Link>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <div className="bg-card rounded-xl shadow-lg p-4">
              <form className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="city" className="sr-only">Ville</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      id="city"
                      placeholder="Ville ou code postal"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="budget" className="sr-only">Budget max</label>
                  <select
                    id="budget"
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Budget max</option>
                    <option value="500">500 EUR/mois</option>
                    <option value="1000">1 000 EUR/mois</option>
                    <option value="1500">1 500 EUR/mois</option>
                    <option value="2000">2 000 EUR/mois</option>
                    <option value="3000">3 000 EUR/mois</option>
                    <option value="5000">5 000+ EUR/mois</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Search className="h-5 w-5" />
                  Rechercher
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Biens en vedette</h2>
                <p className="text-muted-foreground">Decouvrez nos dernieres opportunites de location</p>
              </div>
              <Link
                href="/biens"
                className="hidden sm:inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Voir tous les biens
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/biens"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Voir tous les biens
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 lg:py-24 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">Pourquoi nous choisir ?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Une experience locative simplifiee grace a notre plateforme moderne et notre equipe dediee
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-card rounded-xl p-6 border border-border text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Biens de qualite</h3>
                <p className="text-muted-foreground text-sm">
                  Selection rigoureuse de biens verifies et entretenus
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Securite garantie</h3>
                <p className="text-muted-foreground text-sm">
                  Transactions securisees et contrats conformes
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Reactivite</h3>
                <p className="text-muted-foreground text-sm">
                  Reponse rapide a toutes vos demandes
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Accompagnement</h3>
                <p className="text-muted-foreground text-sm">
                  Une equipe dediee a votre ecoute
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-2xl p-8 lg:p-12 text-center">
              <h2 className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-4">
                Pret a trouver votre prochain logement ?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Creez votre compte gratuitement et accedez a toutes nos fonctionnalites : 
                recherche avancee, alertes personnalisees, suivi de vos demandes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/inscription"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card text-foreground rounded-lg font-semibold hover:bg-card/90 transition-colors"
                >
                  Creer mon compte
                </Link>
                <Link
                  href="/biens"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-foreground/20 text-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground/30 transition-colors"
                >
                  Parcourir les biens
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
