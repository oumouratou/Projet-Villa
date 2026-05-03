"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, SlidersHorizontal, MapPin, Bed, Bath, Maximize, X, Calendar } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import type { Property, PropertyOption } from "@/lib/types"
import { getProperties, getPropertyOptions } from "@/lib/backend-api"

export default function ClientSearchPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [options, setOptions] = useState<PropertyOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [searchCity, setSearchCity] = useState("")
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [surfaceMin, setSurfaceMin] = useState("")
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setLoadError(null)
      try {
        const [props, opts] = await Promise.all([getProperties(), getPropertyOptions()])
        if (cancelled) return
        setProperties(props)
        setOptions(opts)
      } catch (e) {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : "Erreur lors du chargement")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const availableProperties = properties.filter((p) => p.status === "disponible")

  const filteredProperties = useMemo(() => {
    let result = [...availableProperties]

    if (searchCity) {
      result = result.filter(p =>
        p.city.toLowerCase().includes(searchCity.toLowerCase()) ||
        (p.postalCode ?? "").includes(searchCity)
      )
    }

    if (priceMin) {
      result = result.filter(p => p.pricePerNight >= Number(priceMin))
    }

    if (priceMax) {
      result = result.filter(p => p.pricePerNight <= Number(priceMax))
    }

    if (surfaceMin) {
      result = result.filter(p => p.surface >= Number(surfaceMin))
    }

    if (selectedOptions.length > 0) {
      result = result.filter(p =>
        selectedOptions.every(optId => p.options.some(opt => opt.id === optId))
      )
    }

    return result
  }, [availableProperties, searchCity, priceMin, priceMax, surfaceMin, selectedOptions])

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  const clearFilters = () => {
    setSearchCity("")
    setPriceMin("")
    setPriceMax("")
    setSurfaceMin("")
    setSelectedOptions([])
  }

  const hasActiveFilters = searchCity || priceMin || priceMax || surfaceMin || selectedOptions.length > 0

  return (
    <>
      <DashboardHeader title="Rechercher un bien" subtitle="Trouvez votre prochain logement" />

      <main className="flex-1 p-6 overflow-auto">
        {/* Search Bar */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par ville ou code postal..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
                showFilters || hasActiveFilters
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-input text-foreground hover:bg-muted"
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filtres
              {hasActiveFilters && (
                <span className="bg-primary-foreground text-primary px-1.5 py-0.5 rounded text-xs font-medium">
                  {(searchCity ? 1 : 0) + (priceMin ? 1 : 0) + (priceMax ? 1 : 0) + (surfaceMin ? 1 : 0) + selectedOptions.length}
                </span>
              )}
            </button>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Prix minimum</label>
                  <input
                    type="number"
                    placeholder="Min FCFA/nuit"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Prix maximum</label>
                  <input
                    type="number"
                    placeholder="Max FCFA/nuit"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Surface minimum</label>
                  <input
                    type="number"
                    placeholder="Min m2"
                    value={surfaceMin}
                    onChange={(e) => setSurfaceMin(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">Options</label>
                <div className="flex flex-wrap gap-2">
                  {options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => toggleOption(option.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        selectedOptions.includes(option.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Effacer les filtres
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <p className="text-muted-foreground mb-4">
          {isLoading ? "Chargement..." : `${filteredProperties.length} bien${filteredProperties.length > 1 ? "s" : ""} disponible${filteredProperties.length > 1 ? "s" : ""}`}
        </p>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border text-muted-foreground">Chargement des biens...</div>
        ) : loadError ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">Erreur de chargement</h3>
            <p className="text-muted-foreground mb-4">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Reessayer
            </button>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <article key={property.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={property.images[0] || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-primary text-primary-foreground rounded-lg font-semibold text-sm">
                    {property.pricePerNight.toLocaleString()} FCFA / nuit
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{property.title}</h3>
                  
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{property.city}</span>
                  </div>

                  <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
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
                    <div className="flex flex-wrap gap-1 mb-4">
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

                  <div className="flex gap-2">
                    <Link
                      href={`/biens/${property.id}`}
                      className="flex-1 text-center px-4 py-2 border border-input rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      Voir details
                    </Link>
                    <Link
                      href={`/client/reservations/nouvelle?bien=${property.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Calendar className="h-4 w-4" />
                      Reserver
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Aucun bien trouve</h3>
            <p className="text-muted-foreground mb-4">
              Essayez de modifier vos criteres de recherche
            </p>
            <button
              onClick={clearFilters}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Effacer tous les filtres
            </button>
          </div>
        )}
      </main>
    </>
  )
}
