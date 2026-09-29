import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { TasksBoardPage } from './pages/TasksBoardPage'
import { TeamPage } from './pages/TeamPage'
import { MissionsPage } from './pages/MissionsPage'
import { MissionDetailPage } from './pages/MissionDetailPage'
import { ProfileSettingsPage } from './pages/ProfileSettingsPage'
import { HowToVolunteerPage } from './pages/HowToVolunteerPage'
import { AboutPage } from './pages/AboutPage'
import { StoriesPage } from './pages/StoriesPage'
import { AppLayout } from './components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicLayout } from './components/layout/PublicLayout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Unified Header */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-to-volunteer" element={<HowToVolunteerPage />} />
          <Route path="/stories" element={<StoriesPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected app shell */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="tasks" element={<TasksBoardPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="missions" element={<MissionsPage />} />
            <Route path="missions/:id" element={<MissionDetailPage />} />
            <Route path="settings" element={<ProfileSettingsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster theme="dark" position="bottom-right" />
    </BrowserRouter>
  )
}
