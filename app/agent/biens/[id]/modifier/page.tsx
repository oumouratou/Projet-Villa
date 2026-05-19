"use client"

import { PropertyForm } from "@/components/property-form"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getProperty } from "@/lib/backend-api"
import type { Property } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user?.role !== "admin" && user?.role !== "agent"))) {
      router.push("/connexion")
    }
  }, [isAuthenticated, isLoading, user, router])

  useEffect(() => {
    async function loadProperty() {
      try {
        const data = await getProperty(params.id)
        if (!data) {
          router.push("/agent/biens")
          return
        }
        setProperty(data)
      } catch {
        router.push("/agent/biens")
      } finally {
        setLoading(false)
      }
    }
    loadProperty()
  }, [params.id, router])

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "agent")) {
    return null
  }

  if (!property) {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <PropertyForm property={property} />
      </div>
    </div>
  )
}
