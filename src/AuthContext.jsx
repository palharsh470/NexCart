import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  apiLogin,
  apiLogout,
  apiGetMe,
  saveTokens,
  clearTokens,
  saveUser,
  getSavedUser,
  getAccessToken,
} from './api'

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSavedUser())
  const [loading, setLoading] = useState(true)

  /* On mount, try to restore session from stored token */
  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      setLoading(false)
      return
    }

    apiGetMe()
      .then((userData) => {
        setUser(userData)
        saveUser(userData)
      })
      .catch(() => {
        // Token expired or invalid
        clearTokens()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  /* Login */
  const login = useCallback(async (username, password) => {
    const data = await apiLogin({ username, password })
    saveTokens(data.access, data.refresh)
    saveUser(data.user)
    setUser(data.user)
    return data.user
  }, [])

  /* Logout */
  const logout = useCallback(async () => {
    await apiLogout()
    clearTokens()
    setUser(null)
  }, [])

  /* Update local user state (e.g. after profile edit) */
  const refreshUser = useCallback(async () => {
    try {
      const userData = await apiGetMe()
      setUser(userData)
      saveUser(userData)
      return userData
    } catch {
      clearTokens()
      setUser(null)
      return null
    }
  }, [])

  const value = {
    user,
    loading,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
