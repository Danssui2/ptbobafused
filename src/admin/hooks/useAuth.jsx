import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  // Cek token saat pertama load
  useEffect(() => {
    const token = localStorage.getItem('ptboba_token')
    if (!token) { setLoading(false); return }

    api.me()
      .then(res => setAdmin(res.admin))
      .catch(() => localStorage.removeItem('ptboba_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (username, password) => {
    const res = await api.login(username, password)
    localStorage.setItem('ptboba_token', res.token)
    setAdmin(res.admin)
    return res
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('ptboba_token')
    setAdmin(null)
  }, [])

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
