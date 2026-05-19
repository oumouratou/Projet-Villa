"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import Link from "next/link"

interface ReservationAuthGuardProps {
  propertyId: string
  children: React.ReactNode
}

export function ReservationAuthGuard({ propertyId, children }: ReservationAuthGuardProps) {
  const { isAuthenticated } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleReservationClick = () => {
    if (isAuthenticated) {
      // The actual reservation logic is handled by the child component (ReservationButton)
      // This parent component just ensures the user is authenticated.
      // We can let the click event propagate to the child.
    } else {
      setShowModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <div onClick={handleReservationClick}>
        {children}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connexion requise</DialogTitle>
            <DialogDescription>
              Pour réserver ce bien, vous devez être connecté.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button asChild>
              <Link href={`/connexion?redirect=/biens/${propertyId}`}>Se connecter</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/inscription?redirect=/biens/${propertyId}`}>Créer un compte</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
