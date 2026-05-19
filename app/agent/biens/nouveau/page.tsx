"use client"

import { PropertyForm } from "@/components/property-form"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function NewPropertyPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user?.role !== "admin" && user?.role !== "agent"))) {
      router.push("/connexion")
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>
  }

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "agent")) {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <PropertyForm />
      </div>
    </div>
  )
}
