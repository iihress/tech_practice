import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { WorkspaceGateway } from './components/team/WorkspaceGateway'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())
  const user = useAuthStore((s) => s.user)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // If user is authenticated but has no teamId, show the gateway instead of the app shell
  if (user && !user.teamId) {
    return <WorkspaceGateway />
  }

  return <Outlet />
}
