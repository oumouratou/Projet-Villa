const TOKEN_KEY = 'immogestion_token'
const USER_KEY = 'immogestion_user'

const readObject = (value: string | null): unknown | null => {
  if (!value) return null

  try {
    return JSON.parse(value) as unknown
  } catch {
    return null
  }
}

export const getUserRole = (user: unknown): string | null => {
  if (!user || typeof user !== 'object') return null

  const data = user as {
    role?: unknown
    roles?: Array<{ name?: unknown }>
    data?: { role?: unknown }
  }

  if (typeof data.role === 'string' && data.role.trim()) {
    return data.role
  }

  if (typeof data.data?.role === 'string' && data.data.role.trim()) {
    return data.data.role
  }

  const firstRole = data.roles?.[0]?.name
  if (typeof firstRole === 'string' && firstRole.trim()) {
    return firstRole
  }

  return null
}

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export const getStoredUser = (): unknown | null => {
  if (typeof window === 'undefined') return null

  return readObject(window.localStorage.getItem(USER_KEY))
}

export const getStoredRole = (): string | null => getUserRole(getStoredUser())

export const setSession = (token: string, user: unknown) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TOKEN_KEY, token)
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const clearSession = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(USER_KEY)
}