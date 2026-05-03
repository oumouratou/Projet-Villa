import axios from 'axios'
import type { ApiResponse, DashboardStats, RowData } from '../types'
import type { MockOption, MockProperty } from './mock-data'
import { getStoredToken, clearSession, setSession } from './session'

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
    return data.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export async function getDetail(endpoint: string, id: string): Promise<RowData> {
  try {
    const { data } = await api.get<ApiResponse<RowData>>(`${endpoint}/${id}`)
    return data.data
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
    const { data } = await api.post<ApiResponse<RowData>>('/complaints', {
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
  status?: 'ouverte' | 'en_cours' | 'traitee' | 'fermee'
  subject?: string
  description?: string
}) {
  try {
    const { data } = await api.patch<ApiResponse<RowData>>(`/complaints/${payload.id}`, {
      statut: payload.status,
      subject: payload.subject,
      description: payload.description,
    })
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
  agent_id?: number | string | null
  created_at?: string | null
  options?: BackendOption[]
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
    images: item.images && item.images.length > 0 ? item.images : ['/placeholder.svg'],
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
    throw normalizeError(error)
  }
}
