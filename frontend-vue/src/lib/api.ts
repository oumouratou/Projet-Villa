import axios from 'axios'
import type { ApiResponse, DashboardStats, RowData } from '../types'
import type { MockOption, MockProperty } from './mock-data'
import { getStoredToken, clearSession, setSession } from './session'
import { DEFAULT_IMAGE_SRC, resolveImageSrc } from './image'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/v1',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearSession()
    }
    return Promise.reject(error)
  },
)

function normalizeError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const detail = error.response?.data

    if (detail && typeof detail === 'object') {
      const message = (detail as { message?: string; errors?: Record<string, string[]> }).message
      if (message) {
        return new Error(message)
      }

      const errors = (detail as { errors?: Record<string, string[]> }).errors
      if (errors) {
        const firstError = Object.values(errors)[0]?.[0]
        if (firstError) {
          return new Error(firstError)
        }
      }
    }

    return new Error(`API error ${status ?? 'unknown'}: ${JSON.stringify(detail ?? error.message)}`)
  }

  return error instanceof Error ? error : new Error('Unknown API error')
}

function unwrapApiData<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data
  }

  return payload as T
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const { data } = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats')
    return data.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function getList(endpoint: string): Promise<RowData[]> {
  try {
    const { data } = await api.get<ApiResponse<RowData[]>>(endpoint)
    const unwrapped = unwrapApiData<RowData[] | RowData[]>(data)
    if (!Array.isArray(unwrapped)) return []

    // If this is a list of backend properties, normalize each item so that
    // frontend code can rely on `images` being an array of resolved URLs.
    try {
      const first = unwrapped[0] as unknown as BackendProperty
      if (first && (first.propertyImages || first.image_url || first.images)) {
        return (unwrapped as unknown as BackendProperty[]).map(mapBackendProperty) as unknown as RowData[]
      }
    } catch {
      // ignore and fall through
    }

    return unwrapped
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function getDetail(endpoint: string, id: string): Promise<RowData> {
  try {
    const { data } = await api.get<ApiResponse<RowData>>(`${endpoint}/${id}`)
    const unwrapped = unwrapApiData<RowData>(data)
    // If the returned resource looks like a backend Property, map it to the
    // frontend shape so components can always read `images` and `imageUrl`.
    try {
      const candidate = unwrapped as unknown as BackendProperty
      if (candidate && (candidate.propertyImages || candidate.image_url || candidate.images)) {
        return mapBackendProperty(candidate) as unknown as RowData
      }
    } catch {
      // ignore and return raw
    }

    return unwrapped
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const { data } = await api.post<ApiResponse<{ token: string; user: RowData }>>('/auth/login', { email, password })
    setSession(data.data.token, data.data.user)
    return data.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function registerUser(payload: {
  first_name?: string
  last_name?: string
  name?: string
  email: string
  phone?: string
  password: string
}) {
  try {
    const { data } = await api.post<ApiResponse<RowData>>('/auth/register', payload)
    return data.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function fetchCurrentUser(): Promise<RowData | null> {
  try {
    const { data } = await api.get<ApiResponse<RowData | null>>('/auth/me')
    return data.data
  } catch (error) {
    clearSession()
    throw normalizeError(error)
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } finally {
    clearSession()
  }
}

export type NotificationItem = {
  id: number
  type: 'reservation' | 'complaint'
  message: string
  status?: string
  subject?: string
  time?: string | null
  unread?: boolean
}

export type NotificationSummary = {
  pendingReservations: number
  openComplaints: number
  unreadCount: number
  notifications: NotificationItem[]
}

export async function getNotificationSummary(): Promise<NotificationSummary> {
  try {
    const { data } = await api.get<ApiResponse<NotificationSummary>>('/notifications/summary')
    return data.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function createReservation(payload: {
  propertyId: string
  startDate: string
  endDate: string
  guestName?: string
  guestEmail?: string
  guestPhone?: string
}) {
  try {
    const { data } = await api.post<ApiResponse<RowData>>('/reservations', {
      property_id: Number(payload.propertyId),
      start_date: payload.startDate,
      end_date: payload.endDate,
      ...(payload.guestName ? { guest_name: payload.guestName } : {}),
      ...(payload.guestEmail ? { guest_email: payload.guestEmail } : {}),
      ...(payload.guestPhone ? { guest_phone: payload.guestPhone } : {}),
    })
    return data.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function updateReservation(payload: {
  id: string
  status?: 'en_attente' | 'confirmee' | 'refusee' | 'annulee'
  comment?: string
}) {
  try {
    const { data } = await api.patch<ApiResponse<RowData>>(`/reservations/${payload.id}`, {
      statut: payload.status,
      commentaire_agent: payload.comment,
    })
    return data.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function createComplaint(payload: { reservationId: string; subject: string; description: string }) {
  try {
    const { data } = await api.post<ApiResponse<RowData>>('/reclamations', {
      reservation_id: Number(payload.reservationId),
      subject: payload.subject,
      description: payload.description,
    })
    return data.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function updateComplaint(payload: {
  id: string
  status?: 'en_attente' | 'approuver' | 'refuser'
  subject?: string
  description?: string
}) {
  try {
    const { data } = await api.patch<ApiResponse<RowData>>(`/reclamations/${payload.id}`, {
      statut: payload.status,
      subject: payload.subject,
      agent_response: payload.description,
    })
    return data.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function postData(endpoint: string, payload: any) {
  // Accept both /complaints and /reclamations paths from older code
  const normalized = endpoint.replace('/complaints', '/reclamations')
  try {
    const { data } = await api.post<ApiResponse<any>>(normalized, payload)
    return data.data
  } catch (error) {
    throw normalizeError(error)
  }
}

type BackendOption = {
  id: number | string
  name: string
  icon?: string | null
  description?: string | null
}

type PropertyStatus = 'disponible' | 'reserve' | 'maintenance'

type BackendProperty = {
  id: number | string
  title: string
  type?: string | null
  description?: string | null
  address?: string | null
  city?: string | null
  postal_code?: string | null
  price?: number | null
  price_per_night?: number | null
  surface?: number | null
  bedrooms?: number | null
  bathrooms?: number | null
  capacity?: number | null
  status?: 'disponible' | 'reserve' | 'maintenance' | null
  images?: string[] | null
  image_url?: string | null
  agent_id?: number | string | null
  created_at?: string | null
  options?: BackendOption[]
}

const DEFAULT_PROPERTY_IMAGE = '/placeholder.svg'

type PropertyPayload = {
  title: string
  type: string
  description: string
  address: string
  city: string
  postalCode?: string
  pricePerNight: number
  surface: number
  bedrooms: number
  bathrooms: number
  capacity: number
  status: PropertyStatus
  imageUrl?: string
  images?: string[]
  options?: string[]
}

const normalizeImageList = (images?: string[] | null, imageUrl?: string | null) => {
  const normalized = (images ?? [])
    .map((image) => resolveImageSrc(image))
    .filter((image) => image !== DEFAULT_IMAGE_SRC)

  if (normalized.length > 0) {
    return normalized
  }

  const resolvedImageUrl = resolveImageSrc(imageUrl)
  if (resolvedImageUrl !== DEFAULT_IMAGE_SRC) {
    return [resolvedImageUrl]
  }

  return [DEFAULT_PROPERTY_IMAGE]
}

function mapBackendOption(option: BackendOption): MockOption {
  return {
    id: String(option.id),
    name: option.name,
    icon: option.icon || 'wifi',
    description: option.description || option.name,
  }
}

function mapBackendProperty(item: BackendProperty): MockProperty {
  const mappedPrice = Number(item.price_per_night ?? item.price ?? 0)
  const images = normalizeImageList(item.images ?? null, item.image_url ?? null)

  return {
    id: String(item.id),
    title: item.title,
    type: item.type || 'villa',
    description: item.description || '',
    address: item.address || '',
    city: item.city || '',
    postalCode: item.postal_code || '',
    price: mappedPrice,
    pricePerNight: mappedPrice,
    surface: Number(item.surface ?? 0),
    bedrooms: Number(item.bedrooms ?? 0),
    bathrooms: Number(item.bathrooms ?? 0),
    capacity: Number(item.capacity ?? 0),
    status: item.status || 'disponible',
    images,
    options: (item.options || []).map(mapBackendOption),
    agentId: String(item.agent_id ?? 'agent-1'),
    createdAt: item.created_at ? new Date(item.created_at) : new Date(),
  }
}

export async function getProperties(): Promise<MockProperty[]> {
  try {
    const { data } = await api.get<ApiResponse<BackendProperty[]>>('/properties')
    return data.data.map(mapBackendProperty)
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function getProperty(id: string): Promise<MockProperty> {
  try {
    const { data } = await api.get<ApiResponse<BackendProperty>>(`/properties/${id}`)
    return mapBackendProperty(data.data)
  } catch (error) {
    try {
      const { data } = await api.get<ApiResponse<BackendProperty>>(`/biens/${id}`)
      return mapBackendProperty(data.data)
    } catch (fallbackError) {
      throw normalizeError(fallbackError)
    }
  }
}

export async function getPropertyOptions(): Promise<MockOption[]> {
  try {
    const { data } = await api.get<ApiResponse<BackendOption[]>>('/options')
    return data.data.map(mapBackendOption)
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function createProperty(property: PropertyPayload): Promise<MockProperty> {
  try {
    const imageUrl = resolveImageSrc(property.imageUrl)
    const resolvedImageUrl = imageUrl !== DEFAULT_IMAGE_SRC ? imageUrl : undefined

    // If imageUrl not provided but property.images contains a data URL, upload it
    let uploadedUrl: string | undefined
    const firstImageCandidate = property.images?.[0]
    if (!resolvedImageUrl && typeof firstImageCandidate === 'string' && firstImageCandidate.startsWith('data:')) {
      // convert data URL to Blob
      const res = await fetch(firstImageCandidate)
      const blob = await res.blob()
      const form = new FormData()
      form.append('file', blob, 'photo.jpg')
      const resp = await api.post<ApiResponse<{ url: string }>>('/uploads', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      uploadedUrl = resp.data.data.url
    }

    const { data } = await api.post<ApiResponse<BackendProperty>>('/properties', {
      title: property.title,
      type: property.type,
      description: property.description,
      address: property.address,
      city: property.city,
      postal_code: property.postalCode ?? '',
      price_per_night: property.pricePerNight,
      surface: property.surface,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      capacity: property.capacity,
      status: property.status,
      ...(resolvedImageUrl ? { image_url: resolvedImageUrl } : {}),
      ...(uploadedUrl ? { image_url: uploadedUrl } : {}),
      options: (property.options ?? []).map((id) => Number(id)).filter((id) => Number.isFinite(id)),
    })

    return mapBackendProperty(data.data)
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function updateProperty(id: string, property: Partial<PropertyPayload>): Promise<MockProperty> {
  try {
    const imageUrl = resolveImageSrc(property.imageUrl)
    const resolvedImageUrl = imageUrl !== DEFAULT_IMAGE_SRC ? imageUrl : undefined

    const { data } = await api.put<ApiResponse<BackendProperty>>(`/properties/${encodeURIComponent(id)}`, {
      ...(property.title !== undefined ? { title: property.title } : {}),
      ...(property.type !== undefined ? { type: property.type } : {}),
      ...(property.description !== undefined ? { description: property.description } : {}),
      ...(property.address !== undefined ? { address: property.address } : {}),
      ...(property.city !== undefined ? { city: property.city } : {}),
      ...(property.postalCode !== undefined ? { postal_code: property.postalCode } : {}),
      ...(property.pricePerNight !== undefined ? { price_per_night: property.pricePerNight } : {}),
      ...(property.surface !== undefined ? { surface: property.surface } : {}),
      ...(property.bedrooms !== undefined ? { bedrooms: property.bedrooms } : {}),
      ...(property.bathrooms !== undefined ? { bathrooms: property.bathrooms } : {}),
      ...(property.capacity !== undefined ? { capacity: property.capacity } : {}),
      ...(property.status !== undefined ? { status: property.status } : {}),
      ...(resolvedImageUrl ? { image_url: resolvedImageUrl } : {}),
      ...(property.options !== undefined
        ? { options: property.options.map((id) => Number(id)).filter((id) => Number.isFinite(id)) }
        : {}),
    })

    return mapBackendProperty(data.data)
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function deleteProperty(id: string): Promise<void> {
  try {
    await api.delete(`/properties/${encodeURIComponent(id)}`)
  } catch (error) {
    throw normalizeError(error)
  }
}
