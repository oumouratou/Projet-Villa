export type RowData = Record<string, unknown>

export interface ApiResponse<T> {
  data: T
}

export interface DashboardStats {
  totalProperties: number
  totalReservations: number
  pendingReservations: number
  totalClients: number
  totalRevenue: number
  occupancyRate: number
}
