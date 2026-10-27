import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const current = await authService.me()
      setUser(current)
      return current
    } catch (error) {
      if (error.response?.status === 401) setUser(null)
      else throw error
    }
  }, [])

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [refreshUser])

  const login = async (credentials) => {
    const response = await authService.login(credentials)
    setUser(response.data)
  }

  const register = async (details) => {
    const response = await authService.register(details)
    setUser(response.data)
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const value = useMemo(() => ({ user, loading, login, register, logout, refreshUser }), [user, loading, refreshUser])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
