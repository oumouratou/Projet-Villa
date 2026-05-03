// Types pour l'application ImmoGestion

export type UserRole = "admin" | "agent" | "client"

export type UserStatus = "actif" | "inactif"

export type ReservationStatus = "en_attente" | "confirmee" | "refusee" | "annulee"

export type ComplaintStatus = "ouverte" | "en_cours" | "traitee"

export type PropertyStatus = "disponible" | "reserve" | "maintenance"

export interface PropertyOption {
  id: string
  name: string
  icon?: string | null
  description?: string | null
}

export interface Property {
  id: string
  title: string
  type: string
  description: string
  address: string
  city: string
  postalCode?: string | null
  pricePerNight: number
  surface: number
  bedrooms: number
  bathrooms: number
  capacity: number
  status: PropertyStatus
  images: string[]
  options: PropertyOption[]
  agentId?: string | null
  createdAt: string
}

export interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: string
  status: UserStatus
  createdAt: string
}

export interface Agent {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: "admin" | "agent"
  status: UserStatus
  createdAt: string
}

export interface Reservation {
  id: string
  propertyId: string
  clientId: string
  startDate: string
  endDate: string
  status: ReservationStatus
  totalPrice: number
  agentComment?: string
  createdAt: string
}

export interface Complaint {
  id: string
  reservationId?: string
  clientId: string
  subject: string
  description: string
  status: ComplaintStatus
  agentResponse?: string
  createdAt: string
  updatedAt?: string
}

export interface Permission {
  id: string
  name: string
  description: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
}

export interface DashboardStats {
  totalProperties: number
  totalReservations: number
  pendingReservations: number
  totalClients: number
  totalRevenue: number
  occupancyRate: number
}
