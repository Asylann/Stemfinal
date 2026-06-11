import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * AdminGuard — wraps any route that requires admin authentication.
 *
 * - Still loading auth state  → renders nothing (prevents flash)
 * - Not authenticated          → redirects to /admin/login
 * - Authenticated, not admin  → redirects to /admin/login (with state message)
 * - Authenticated admin        → renders children
 */
export default function AdminGuard({ children }) {
  const { loading, isAuthenticated, isAdmin } = useAuth()

  if (loading) return null

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
