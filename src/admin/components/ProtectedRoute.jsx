import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Spinner } from './UI'

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: '#f8fafc', fontFamily: 'system-ui' }}>
      <Spinner size={36} />
      <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>Memuat session...</p>
    </div>
  )

  return admin ? children : <Navigate to="/login" replace />
}
