import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { 
  MapPin, Bed, Bath, Maximize, ArrowLeft, 
  Wifi, Waves, Car, Snowflake, Trees, Sun, ArrowUp, PawPrint,
  Check
} from "lucide-react"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { ReservationButton } from "@/components/reservation-button"
import { getProperty } from "@/lib/backend-api"
import ImageGallery from "@/components/image-gallery"
import { ReservationAuthGuard } from "@/components/reservation-auth-guard"

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
  const property = await getProperty(id)

  if (!property) {
    notFound()
  }

  const rooms = Math.max(1, property.bedrooms + 1)

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/biens"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux biens
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative">
                <ImageGallery images={property.images} title={property.title} />
                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-medium ${
                  property.status === "disponible" 
                    ? "bg-green-100 text-green-800" 
                    : property.status === "reserve" 
                    ? "bg-blue-100 text-blue-800"
                    : "bg-orange-100 text-orange-800"
                }`}>
                  {property.status === "disponible" ? "Disponible" : property.status === "reserve" ? "Reserve" : "En maintenance"}
                </div>
              </div>

              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>
                    {property.address}
                    {property.postalCode ? `, ${property.postalCode}` : ""} {property.city}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card rounded-lg border border-border p-4 text-center">
                  <Maximize className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-semibold text-foreground">{property.surface} m2</div>
                  <div className="text-sm text-muted-foreground">Surface</div>
                </div>
                <div className="bg-card rounded-lg border border-border p-4 text-center">
                  <div className="text-lg font-semibold text-foreground mb-2">{rooms}</div>
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

              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>

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
              <div className="sticky top-24 bg-card border border-border rounded-xl p-6">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-foreground">{property.pricePerNight} €</span>
                  <span className="text-muted-foreground">/ nuit</span>
                </div>
                <ReservationAuthGuard propertyId={property.id}>
                  <ReservationButton propertyId={property.id} />
                </ReservationAuthGuard>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}