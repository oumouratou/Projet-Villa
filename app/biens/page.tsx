"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { PropertyCard } from "@/components/property-card"
import { mockProperties, mockOptions } from "@/lib/mock-data"

export default function PropertiesPage() {
  const [searchCity, setSearchCity] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "newest">("newest")

  const filteredProperties = useMemo(() => {
    let result = mockProperties.filter(p => p.status === "disponible")

    if (searchCity) {
      result = result.filter(p =>
        p.city.toLowerCase().includes(searchCity.toLowerCase()) ||
        p.postalCode.includes(searchCity)
      )
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (selectedOptions.length > 0) {
      result = result.filter(p =>
        selectedOptions.every(optId => p.options.some(opt => opt.id === optId))
      )
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "newest":
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
    }

    return result
  }, [searchCity, priceRange, selectedOptions, sortBy])

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  const clearFilters = () => {
    setSearchCity("")
    setPriceRange([0, 5000])
    setSelectedOptions([])
    setSortBy("newest")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Nos biens disponibles</h1>
            <p className="text-muted-foreground">
              {filteredProperties.length} bien{filteredProperties.length > 1 ? "s" : ""} disponible{filteredProperties.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-card rounded-xl border border-border p-4 mb-8">
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

              <div className="flex gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-4 py-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="newest">Plus recents</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix decroissant</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
                    showFilters || selectedOptions.length > 0
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-input text-foreground hover:bg-muted"
                  }`}
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  Filtres
                  {selectedOptions.length > 0 && (
                    <span className="bg-primary-foreground text-primary px-1.5 py-0.5 rounded text-xs font-medium">
                      {selectedOptions.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Budget: {priceRange[0]} EUR - {priceRange[1]} EUR/mois
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="flex-1"
                      />
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Options</label>
                    <div className="flex flex-wrap gap-2">
                      {mockOptions.map((option) => (
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
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Effacer les filtres
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Properties Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
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
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
