import Link from "next/link"
import Image from "next/image"
import { MapPin, Bed, Bath, Maximize } from "lucide-react"
import type { Property } from "@/lib/types"

interface PropertyCardProps {
  property: Property
  showStatus?: boolean
}

export function PropertyCard({ property, showStatus = false }: PropertyCardProps) {
  const statusColors = {
    disponible: "bg-green-100 text-green-800",
    reserve: "bg-blue-100 text-blue-800",
    maintenance: "bg-orange-100 text-orange-800",
  }

  const statusLabels = {
    disponible: "Disponible",
    reserve: "Reserve",
    maintenance: "En maintenance",
  }

  return (
    <Link href={`/biens/${property.id}`}>
      <article className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={property.images[0] || "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {showStatus && (
            <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${statusColors[property.status]}`}>
              {statusLabels[property.status]}
            </span>
          )}
          <div className="absolute bottom-3 left-3 px-3 py-1 bg-primary text-primary-foreground rounded-lg font-semibold">
            {property.pricePerNight.toLocaleString()} FCFA / nuit
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{property.title}</h3>
          
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4" />
            <span>{property.city}</span>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              <span>{property.surface} m2</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
          </div>

          {property.options.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {property.options.slice(0, 3).map((option) => (
                <span
                  key={option.id}
                  className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs"
                >
                  {option.name}
                </span>
              ))}
              {property.options.length > 3 && (
                <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs">
                  +{property.options.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
