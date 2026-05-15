import type { Property, PropertyOption, PropertyStatus } from "@/lib/types"

type ApiResponse<T> = { data: T }

type BackendOption = {
  id: number | string
  name: string
  icon?: string | null
  description?: string | null
}

type BackendProperty = {
  id: number | string
  title: string
  type: string
  description: string
  address: string
  city: string
  postal_code?: string | null
  price_per_night: number
  surface: number
  bedrooms: number
  bathrooms: number
  capacity: number
  status: PropertyStatus
  images?: string[] | null
  options?: BackendOption[] | null
  agent_id?: number | string | null
  created_at?: string
}

function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
  if (envUrl) return envUrl

  if (typeof window !== "undefined") {
    const host = window.location.hostname
    const backendHost = host === "localhost" || host === "::1" ? "127.0.0.1" : host
    return `http://${backendHost}:8000/api`
  }

  return "http://127.0.0.1:8000/api"
}

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl().replace(/\/$/, "")
  const url = `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`

  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`API error ${res.status} on ${path}${text ? `: ${text}` : ""}`)
  }

  return (await res.json()) as T
}

function mapOption(option: BackendOption): PropertyOption {
  return {
    id: String(option.id),
    name: option.name,
    icon: option.icon ?? null,
    description: option.description ?? null,
  }
}

function mapProperty(property: BackendProperty): Property {
  return {
    id: String(property.id),
    title: property.title,
    type: property.type,
    description: property.description,
    address: property.address,
    city: property.city,
    postalCode: property.postal_code ?? null,
    pricePerNight: Number(property.price_per_night ?? 0),
    surface: Number(property.surface ?? 0),
    bedrooms: Number(property.bedrooms ?? 0),
    bathrooms: Number(property.bathrooms ?? 0),
    capacity: Number(property.capacity ?? 0),
    status: property.status,
    images: property.images ?? [],
    options: (property.options ?? []).map(mapOption),
    agentId: property.agent_id != null ? String(property.agent_id) : null,
    createdAt: property.created_at ?? new Date().toISOString(),
  }
}

export async function getProperties(): Promise<Property[]> {
  const payload = await fetchApi<ApiResponse<BackendProperty[]>>("/biens")
  return payload.data.map(mapProperty)
}

export async function getProperty(id: string): Promise<Property | null> {
  try {
    const payload = await fetchApi<ApiResponse<BackendProperty>>(`/properties/${encodeURIComponent(id)}`)
    return mapProperty(payload.data)
  } catch (e) {
    // If backend returns 404, fetchApi throws. For public pages, treat as not found.
    if (e instanceof Error && /API error 404/.test(e.message)) return null
    throw e
  }
}

export async function getPropertyOptions(): Promise<PropertyOption[]> {
  const payload = await fetchApi<ApiResponse<BackendOption[]>>("/options")
  return payload.data.map(mapOption)
}

// Reservations API
type BackendReservation = {
  id: number | string
  client_id?: number | string | null
  bien_immobilier_id: number | string
  date_debut: string | null
  date_fin: string | null
  statut: string
  commentaire_agent?: string | null
  totalPrice?: number
  created_at?: string
}

function mapReservation(r: BackendReservation) {
  return {
    id: String(r.id),
    clientId: r.client_id != null ? String(r.client_id) : null,
    propertyId: String(r.bien_immobilier_id),
    startDate: r.date_debut ? new Date(r.date_debut) : null,
    endDate: r.date_fin ? new Date(r.date_fin) : null,
    status: r.statut ?? r['status'] ?? 'en_attente',
    agentComment: r.commentaire_agent ?? null,
    totalPrice: Number(r.totalPrice ?? 0),
    createdAt: r.created_at ?? new Date().toISOString(),
  }
}

export async function createReservation(
  payload: { propertyId: string; startDate: string; endDate: string },
  token: string
): Promise<any> {
  const body = {
    property_id: payload.propertyId,
    start_date: payload.startDate,
    end_date: payload.endDate,
  }

  const res = await fetchApi<ApiResponse<BackendReservation>>(`/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  return mapReservation(res.data)
}

export async function getReservation(id: string, token?: string) {
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetchApi<ApiResponse<BackendReservation>>(`/reservations/${encodeURIComponent(id)}`, {
    headers,
  })
  return mapReservation(res.data)
}

export async function getReservations(token?: string) {
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetchApi<ApiResponse<BackendReservation[]>>(`/reservations`, {
    headers,
  })
  return res.data.map(mapReservation)
}

export async function updateReservation(id: string, data: Record<string, any>, token: string) {
  const res = await fetchApi<ApiResponse<BackendReservation>>(`/reservations/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  return mapReservation(res.data)
}

export async function createProperty(
  property: Omit<Property, 'id' | 'createdAt' | 'images'> & { imageUrl?: string; options?: string[] },
  token: string
): Promise<Property> {
  const payload = await fetchApi<ApiResponse<BackendProperty>>("/properties", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: property.title,
      type: property.type,
      description: property.description,
      address: property.address,
      city: property.city,
      postal_code: property.postalCode,
      price_per_night: property.pricePerNight,
      surface: property.surface,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      capacity: property.capacity,
      status: property.status,
      image_url: property.imageUrl,
      options: property.options?.map((id) => parseInt(id, 10)) ?? [],
    }),
  })
  return mapProperty(payload.data)
}

export async function updateProperty(
  id: string,
  property: Partial<Omit<Property, 'id' | 'createdAt' | 'images'> & { imageUrl?: string; options?: string[] }>,
  token: string
): Promise<Property> {
  const payload = await fetchApi<ApiResponse<BackendProperty>>(`/properties/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...(property.title && { title: property.title }),
      ...(property.type && { type: property.type }),
      ...(property.description && { description: property.description }),
      ...(property.address && { address: property.address }),
      ...(property.city && { city: property.city }),
      ...(property.postalCode !== undefined && { postal_code: property.postalCode }),
      ...(property.pricePerNight !== undefined && { price_per_night: property.pricePerNight }),
      ...(property.surface !== undefined && { surface: property.surface }),
      ...(property.bedrooms !== undefined && { bedrooms: property.bedrooms }),
      ...(property.bathrooms !== undefined && { bathrooms: property.bathrooms }),
      ...(property.capacity !== undefined && { capacity: property.capacity }),
      ...(property.status && { status: property.status }),
      ...(property.imageUrl !== undefined && { image_url: property.imageUrl }),
      ...(property.options && { options: property.options.map((id) => parseInt(id, 10)) }),
    }),
  })
  return mapProperty(payload.data)
}

export async function deleteProperty(id: string, token: string): Promise<void> {
  await fetchApi(`/properties/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getPropertyStats(token: string): Promise<Record<string, number>> {
  const payload = await fetchApi<ApiResponse<Record<string, number>>>("/properties/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return payload.data
}
