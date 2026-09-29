import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Target,
  LogOut,
  Heart,
  Settings,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { Avatar } from '../ui/Avatar'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Дашборд' },
  { to: '/app/tasks', icon: CheckSquare, label: 'Завдання' },
  { to: '/app/team', icon: Users, label: 'Команда' },
  { to: '/app/missions', icon: Target, label: 'Місії' },
]

export function Sidebar() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-[220px] flex-shrink-0 bg-zinc-950 border-r border-zinc-800/60 flex flex-col h-screen sticky top-0"
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
            <Heart className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-sm font-bold text-zinc-100 tracking-tight">
              VolunteerHub
            </span>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Platform
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-widest text-zinc-600 px-2 mb-3">
          Навігація
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900',
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    'w-4 h-4 flex-shrink-0',
                    isActive ? 'text-violet-400' : 'text-zinc-600',
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-zinc-800/60 space-y-1">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-all w-full">
          <Settings className="w-4 h-4 text-zinc-600" />
          Налаштування
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Вийти
        </button>

        {user && (
          <div className="flex items-center gap-2.5 px-3 py-3 mt-2 rounded-lg bg-zinc-900 border border-zinc-800">
            <Avatar name={user.name} src={user.avatar} size="sm" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">{user.name}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider truncate">
                {user.role}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  )
}
