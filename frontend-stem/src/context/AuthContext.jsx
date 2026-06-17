import { createContext, useContext, useState, useEffect } from 'react'
import { useUserEmail } from './UserEmailContext'
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const { setUserEmail } = useUserEmail()

  // Обработка автоматического логаута при 401
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null)
      setUserEmail(null)
      localStorage.removeItem('stem_access_token')
      setShowModal(true)
    }

    window.addEventListener('unauthorized', handleUnauthorized)
    return () => window.removeEventListener('unauthorized', handleUnauthorized)
  }, [setUserEmail])

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('stem_access_token')
        if (token) {
          try {
            const userData = await getCurrentUser(token)
            setUser(userData)
            setUserEmail(userData.email)
          } catch (err) {
            // Если получить пользователя не удалось, очистить токен
            localStorage.removeItem('stem_access_token')
            setUser(null)
          }
        }
      } catch (err) {
        console.error('Auth check error:', err)
        localStorage.removeItem('stem_access_token')
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [setUserEmail])

  const register = async (phone, password) => {
    const data = await apiRegister(phone, password)
    localStorage.setItem('stem_access_token', data.access_token)
    const userData = await getCurrentUser(data.access_token)
    setUser(userData)
    setUserEmail(userData.email || userData.phone)
    setShowModal(false)
    return userData
  }

  const login = async (phone, password) => {
    const data = await apiLogin(phone, password)
    localStorage.setItem('stem_access_token', data.access_token)
    const userData = await getCurrentUser(data.access_token)
    setUser(userData)
    setUserEmail(userData.email || userData.phone)
    setShowModal(false)
    return userData
  }

  const logout = () => {
    apiLogout()
    setUser(null)
    setUserEmail(null)
    setShowModal(false)
  }

  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      showModal,
      openModal,
      closeModal,
      isAuthenticated: !!user,
      isAdmin: user?.is_admin === true,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}