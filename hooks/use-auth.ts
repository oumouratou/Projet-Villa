import { useEffect, useState } from "react"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: "admin" | "agent" | "client"
  status: "actif" | "inactif"
  created_at?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Try to get token and user from localStorage
    const storedToken = localStorage.getItem("auth_token")
    const storedUser = localStorage.getItem("auth_user")

    if (storedToken) {
      setToken(storedToken)
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch {
          // Invalid JSON, clear storage
          localStorage.removeItem("auth_user")
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("auth_token", newToken)
    localStorage.setItem("auth_user", JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    setToken(null)
    setUser(null)
  }

  return {
    user,
    token,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!token,
  }
}
