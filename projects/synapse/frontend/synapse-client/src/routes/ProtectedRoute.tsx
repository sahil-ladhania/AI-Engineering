import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}
