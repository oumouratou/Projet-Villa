"use client"

import { useEffect, useState } from "react"
import { PropertyCard } from "@/components/property-card"
import { getProperties } from "@/lib/backend-api"
import { Property } from "@/lib/types"

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true)
        const fetchedProperties = await getProperties()
        setProperties(fetchedProperties)
        setError(null)
      } catch (error) {
        console.error("Failed to fetch properties:", error)
        setError("Impossible de charger les biens pour le moment. Veuillez réessayer plus tard.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tous nos biens disponibles</h1>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-4 animate-pulse">
              <div className="h-48 bg-muted rounded"></div>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-destructive">{error}</p>}

      {!isLoading && !error && properties.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
       {!isLoading && !error && properties.length === 0 && (
        <p>Aucun bien disponible pour le moment.</p>
      )}
    </div>
  )
}