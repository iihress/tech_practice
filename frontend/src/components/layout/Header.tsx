import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Search, Bell, Check, Users, Target, Heart, ChevronDown, Building2, Plus, X, Settings, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Avatar } from '../ui/Avatar'
import { useAuthStore } from '../../store/authStore'
import api from '../../lib/api'
import { toast } from 'sonner'
import { cn } from '../../lib/utils'

const mockNotifications = [
  {
    id: 1,
    title: 'Вас додали до місії "Тепло"',
    desc: 'Організатор чекає на ваше підтвердження',
    time: '5 хв тому',
    icon: Target,
    color: 'text-orange-500',
    bg: 'bg-orange-100',
    read: false,
  },
  {
    id: 2,
    title: 'Нове завдання: Розгрузка',
    desc: 'Додано нове термінове завдання у вашому місті.',
    time: '2 год тому',
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-100',
    read: false,
  },
  {
    id: 3,
    title: 'Місію завершено',
    desc: 'Дякуємо за вашу допомогу!',
    time: '1 день тому',
    icon: Check,
    color: 'text-green-500',
    bg: 'bg-green-100',
    read: true,
  },
]

const navLinks = [
  { path: '/app', label: 'Дашборд' },
  { path: '/app/missions', label: 'Місії' },
  { path: '/app/tasks', label: 'Завдання' },
  { path: '/app/team', label: 'Команда' },
]

export function Header() {
  const { user, updateUser } = useAuthStore()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const teamDropdownRef = useRef<HTMLDivElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [showTeamSwitcher, setShowTeamSwitcher] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)

  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [teamCode, setTeamCode] = useState('')
  const [teamName, setTeamName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamCode.trim()) return
    setIsSubmitting(true)
    try {
      const res = await api.post('/teams/join', { code: teamCode.trim() })
      toast.success('Ви приєдналися до команди!')
      await handleSwitchTeam(res.data._id)
      setShowJoinModal(false)
      setTeamCode('')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Не вдалося приєднатися')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName.trim()) return
    setIsSubmitting(true)
    try {
      const res = await api.post('/teams', { name: teamName.trim() })
      toast.success('Команду успішно створено!')
      await handleSwitchTeam(res.data._id)
      setShowCreateModal(false)
      setTeamName('')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Не вдалося створити команду')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchTeams = async () => {
    try {
      const res = await api.get('/teams/my-teams')
      setTeams(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSwitchTeam = async (teamId: string) => {
    if (teamId === user?.teamId) return
    setIsSwitching(true)
    try {
      const res = await api.post(`/teams/switch/${teamId}`)
      updateUser(res.data.user)
      toast.success('Команду змінено')
      setShowTeamSwitcher(false)
      window.location.reload() // Reload to refresh all data globally
    } catch (e) {
      toast.error('Помилка зміни команди')
    } finally {
      setIsSwitching(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotifications()
      fetchTeams()
    }
  }, [user])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (teamDropdownRef.current && !teamDropdownRef.current.contains(event.target as Node)) {
        setShowTeamSwitcher(false)
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all')
      fetchNotifications()
    } catch (e) {
      console.error(e)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      fetchNotifications()
    } catch (e) {
      console.error(e)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
      {/* Left — Logo */}
      <Link to="/app" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-md shadow-orange-500/20">
          <Heart className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-bold text-slate-900 tracking-tight hidden sm:block">VolunteerHub</span>
      </Link>

      {/* Left — Navigation */}
      {user && (
        <nav className="hidden lg:flex items-center gap-8 ml-8">
          {navLinks.map((link) => {
            const isActive = link.path === '/app' 
              ? location.pathname === '/app' 
              : location.pathname.startsWith(link.path)
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`relative py-5 text-sm font-bold transition-colors ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {link.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                  />
                )}
              </Link>
            )
          })}
        </nav>
      )}

      {/* Right — actions & info pages */}
      <div className="flex items-center gap-6 ml-auto">
        {!user && (
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/about" className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors">Про нас</Link>
            <Link to="/how-to-volunteer" className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors">Як стати волонтером</Link>
            <Link to="/stories" className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors">Історії успіху</Link>
          </nav>
        )}

        {user ? (
          <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
            {/* Team Switcher */}
            <div className="relative" ref={teamDropdownRef}>
                <button
                  onClick={() => setShowTeamSwitcher(!showTeamSwitcher)}
                  disabled={isSwitching}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 text-sm font-bold text-slate-700"
                >
                  <Building2 className="w-4 h-4 text-orange-500" />
                  <span className="max-w-[120px] truncate">
                    {teams.find(t => t._id === user.teamId)?.name || 'Обрати команду'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <AnimatePresence>
                  {showTeamSwitcher && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-1 z-50"
                    >
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ваші команди</p>
                      </div>
                      <div className="max-h-[250px] overflow-y-auto">
                        {teams.length === 0 && (
                          <div className="px-3 py-4 text-center">
                            <p className="text-sm font-medium text-slate-500">У вас ще немає команд</p>
                          </div>
                        )}
                        {teams.map(team => (
                          <button
                            key={team._id}
                            onClick={() => handleSwitchTeam(team._id)}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-left transition-colors",
                              user.teamId === team._id ? "bg-orange-50/50 text-orange-600" : "text-slate-700 hover:bg-slate-50"
                            )}
                          >
                            <span className="truncate pr-2">{team.name}</span>
                            {user.teamId === team._id && <Check className="w-4 h-4 shrink-0 text-orange-500" />}
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-slate-100 bg-slate-50 p-2">
                        <button 
                          onClick={() => {
                            setShowTeamSwitcher(false)
                            setShowJoinModal(true)
                          }}
                          className="w-full text-left px-3 py-2 text-sm font-bold text-slate-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Users className="w-4 h-4" />
                          Приєднатися до команди
                        </button>
                        <button 
                          onClick={() => {
                            setShowTeamSwitcher(false)
                            setShowCreateModal(true)
                          }}
                          className="w-full text-left px-3 py-2 text-sm font-bold text-slate-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-2 mt-1"
                        >
                          <Plus className="w-4 h-4" />
                          Створити нову команду
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            <div className="relative" ref={profileDropdownRef}>
              <div 
                className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-xl transition-colors"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-bold text-slate-900 leading-none mb-1">{user.name}</span>
                  <span className="text-xs font-semibold text-slate-500">
                    {user.role === 'COORDINATOR' ? 'Координатор' : user.role === 'ADMIN' ? 'Адміністратор' : 'Волонтер'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar name={user.name} src={user.avatar} size="sm" className="shadow-sm ring-2 ring-transparent" />
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 shadow-xl rounded-2xl py-2 z-50 origin-top-right overflow-hidden"
                  >
                    <Link 
                      to="/app/settings" 
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Налаштування профілю
                    </Link>
                    <div className="h-px bg-slate-100 my-1 mx-4" />
                    <button 
                      onClick={() => {
                        useAuthStore.getState().clearAuth()
                        window.location.href = '/'
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Вийти
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900">Увійти</Link>
            <Link to="/register" className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-sm">
              Приєднатися
            </Link>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {createPortal(
        <AnimatePresence>
          {showJoinModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/50" onClick={() => setShowJoinModal(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Приєднатися</h3>
                  <button onClick={() => setShowJoinModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleJoinTeam}>
                  <input
                    type="text"
                    placeholder="Введіть код команди"
                    value={teamCode}
                    onChange={(e) => setTeamCode(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 mb-4 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-bold uppercase tracking-wider text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    disabled={isSubmitting || !teamCode.trim()}
                    type="submit"
                    className="w-full h-12 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Завантаження...' : 'Приєднатися'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
          
          {showCreateModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/50" onClick={() => setShowCreateModal(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Створити команду</h3>
                  <button onClick={() => setShowCreateModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleCreateTeam}>
                  <input
                    type="text"
                    placeholder="Назва команди"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 mb-4 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-bold text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    disabled={isSubmitting || !teamName.trim()}
                    type="submit"
                    className="w-full h-12 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Завантаження...' : 'Створити'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  )
}
