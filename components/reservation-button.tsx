"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "lucide-react"

interface ReservationButtonProps {
  propertyId: string
}

export function ReservationButton({ propertyId }: ReservationButtonProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    setIsAuthenticated(!!token)
  }, [])

  const handleClick = () => {
    if (isAuthenticated) {
      router.push(`/client/reservations/nouvelle?bien=${propertyId}`)
    } else {
      router.push(`/inscription?redirect=/client/reservations/nouvelle?bien=${propertyId}`)
    }
  }

  if (isAuthenticated === null) {
    return <div className="w-full h-12 bg-muted rounded-lg animate-pulse" />
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors mb-4"
      >
        <Calendar className="h-5 w-5" />
        Réserver ce bien
      </button>

      {!isAuthenticated && (
        <p className="text-sm text-muted-foreground text-center">
          Créez un compte pour effectuer une réservation
        </p>
      )}
    </div>
  )
}