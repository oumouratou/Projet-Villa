import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { 
  MapPin, Bed, Bath, Maximize, Calendar, ArrowLeft, 
  Wifi, Waves, Car, Snowflake, Trees, Sun, ArrowUp, PawPrint,
  Check
} from "lucide-react"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { mockProperties } from "@/lib/mock-data"

const iconMap: Record<string, React.ElementType> = {
  wifi: Wifi,
  waves: Waves,
  car: Car,
  snowflake: Snowflake,
  trees: Trees,
  sun: Sun,
  "arrow-up": ArrowUp,
  "paw-print": PawPrint,
}

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params
  const property = mockProperties.find(p => p.id === id)

  if (!property) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/biens"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux biens
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
                <Image
                  src={property.images[0] || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-medium ${
                  property.status === "disponible" 
                    ? "bg-green-100 text-green-800" 
                    : property.status === "loue" 
                    ? "bg-blue-100 text-blue-800"
                    : "bg-orange-100 text-orange-800"
                }`}>
                  {property.status === "disponible" ? "Disponible" : property.status === "loue" ? "Loue" : "En maintenance"}
                </div>
              </div>

              {/* Title and Location */}
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>{property.address}, {property.postalCode} {property.city}</span>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card rounded-lg border border-border p-4 text-center">
                  <Maximize className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-semibold text-foreground">{property.surface} m2</div>
                  <div className="text-sm text-muted-foreground">Surface</div>
                </div>
                <div className="bg-card rounded-lg border border-border p-4 text-center">
                  <div className="text-lg font-semibold text-foreground mb-2">{property.rooms}</div>
                  <div className="text-sm text-muted-foreground">Pieces</div>
                </div>
                <div className="bg-card rounded-lg border border-border p-4 text-center">
                  <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-semibold text-foreground">{property.bedrooms}</div>
                  <div className="text-sm text-muted-foreground">Chambres</div>
                </div>
                <div className="bg-card rounded-lg border border-border p-4 text-center">
                  <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-semibold text-foreground">{property.bathrooms}</div>
                  <div className="text-sm text-muted-foreground">Salles de bain</div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>

              {/* Options */}
              {property.options.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Equipements et options</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.options.map((option) => {
                      const Icon = iconMap[option.icon || ""] || Check
                      return (
                        <div key={option.id} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <span className="text-foreground">{option.name}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Reservation */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary">
                    {property.price.toLocaleString()} EUR
                  </div>
                  <div className="text-muted-foreground">par mois</div>
                </div>

                {property.status === "disponible" ? (
                  <>
                    <Link
                      href={`/connexion?redirect=/client/reservations/nouvelle?bien=${property.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors mb-4"
                    >
                      <Calendar className="h-5 w-5" />
                      Reserver ce bien
                    </Link>

                    <p className="text-sm text-muted-foreground text-center">
                      Connectez-vous pour effectuer une reservation
                    </p>
                  </>
                ) : (
                  <div className="text-center py-4 bg-muted rounded-lg">
                    <p className="text-muted-foreground">
                      Ce bien n&apos;est pas disponible a la reservation
                    </p>
                  </div>
                )}

                <hr className="my-6 border-border" />

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Informations</h3>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reference</span>
                      <span className="text-foreground font-medium">#{property.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ville</span>
                      <span className="text-foreground font-medium">{property.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Code postal</span>
                      <span className="text-foreground font-medium">{property.postalCode}</span>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-border" />

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Des questions ?</p>
                  <Link
                    href="/contact"
                    className="text-primary hover:text-primary/80 font-medium text-sm"
                  >
                    Contactez-nous
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
