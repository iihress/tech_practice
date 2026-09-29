import { useState, useEffect } from 'react'
import api from '../lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, MapPin, Clock, Users, X, ListTodo, CheckCircle2, Timer, CheckSquare, Square, ChevronRight, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Link } from 'react-router-dom'
import { demoMissions } from './MissionsPage'

const getTeamColor = (name: string = '') => {
  const colors = [
    'bg-indigo-100 text-indigo-700',
    'bg-emerald-100 text-emerald-700',
    'bg-orange-100 text-orange-700',
    'bg-fuchsia-100 text-fuchsia-700',
    'bg-rose-100 text-rose-700',
    'bg-cyan-100 text-cyan-700',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

const mockTasks = [
  { id: 1, title: 'Оновити базу волонтерів', time: 'Сьогодні · 16:00', location: 'Онлайн', done: false },
  { id: 2, title: 'Написати звіт за вересень', time: 'Завтра · 10:00', location: 'Офіс', done: false },
  { id: 3, title: 'Сортування теплого одягу', time: '15 Жовтня · 12:00', location: 'Склад №1', done: true },
]

export function DashboardPage() {
  const { user, updateUser } = useAuthStore()
  const navigate = useNavigate()
  const [showBanner, setShowBanner] = useState(() => {
    return localStorage.getItem('hideBanner') !== 'true'
  })
  const [tasks, setTasks] = useState<any[]>([])
  const [missions, setMissions] = useState<any[]>([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  
  const firstName = user?.name?.split(' ')[0] || 'Волонтер'

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks')
        const myTasks = res.data.filter((t: any) => 
          t.assignees?.some((a: any) => a._id === user?.id || a.id === user?.id)
        )
        setTasks(myTasks)
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingTasks(false)
      }
    }
    const fetchMissions = async () => {
      try {
        const res = await api.get('/missions?all=true')
        setMissions(res.data)
      } catch (e) {
        console.error(e)
      }
    }
    fetchTasks()
    fetchMissions()
  }, [user])

  const handleSwitchTeam = async (targetTeamId: string, redirectUrl: string) => {
    if (user?.teamId !== targetTeamId) {
      try {
        const res = await api.post(`/teams/switch/${targetTeamId}`)
        if (res.data.user) {
          updateUser(res.data.user)
        }
      } catch (error) {
        console.error('Failed to switch team:', error)
      }
    }
    navigate(redirectUrl)
  }

  const handleTaskClick = (task: any) => {
    const teamId = task.mission?.teamId?._id || task.mission?.teamId?.id || (typeof task.mission?.teamId === 'string' ? task.mission?.teamId : null)
    if (teamId) {
      handleSwitchTeam(teamId, '/app/tasks')
    } else {
      navigate('/app/tasks')
    }
  }

  const handleMissionClick = (mission: any) => {
    const teamId = mission.teamId?._id || mission.teamId?.id || (typeof mission.teamId === 'string' ? mission.teamId : null)
    if (teamId) {
      handleSwitchTeam(teamId, `/app/missions/${mission._id}`)
    } else {
      navigate(`/app/missions/${mission._id}`)
    }
  }

  const toggleTask = async (task: any) => {
    try {
      let newStatus = 'DONE'
      if (task.status === 'DONE' || task.status === 'REVIEW') {
        newStatus = task.previousStatus || 'TODO'
      } else {
        newStatus = user?.role === 'VOLUNTEER' ? 'REVIEW' : 'DONE'
      }
      await api.patch(`/tasks/${task._id}`, { status: newStatus })
      setTasks(tasks.map(t => t._id === task._id ? { ...t, status: newStatus, previousStatus: task.status !== 'DONE' && task.status !== 'REVIEW' ? task.status : t.previousStatus } : t))
    } catch (e) {
      console.error(e)
    }
  }

  const handleCloseBanner = () => {
    setShowBanner(false)
    localStorage.setItem('hideBanner', 'true')
  }

  const upcomingMission = missions[0]

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans text-slate-800">
      
      {/* TOP SECTION: GREETING & BANNER */}
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Привіт, {firstName}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Раді бачити вас знову. Ось ваш огляд на сьогодні.
          </p>
        </div>

        <AnimatePresence>
          {showBanner && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="bg-orange-50 border border-orange-100 rounded-xl p-4 sm:p-5 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden"
            >
              <div>
                <h3 className="text-sm font-bold text-orange-900 mb-1">Ласкаво просимо до команди!</h3>
                <p className="text-sm text-orange-800/80 font-medium">Ось як ви можете долучитись до своєї першої місії та зробити внесок.</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <Link to="/how-to-volunteer" className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-orange-600 transition-colors">
                  Читати гайд
                </Link>
                <button 
                  onClick={handleCloseBanner}
                  className="p-1 text-orange-400 hover:text-orange-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* LOWER SECTION: 2-COLUMN */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        
        {/* Left (2/3): My Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Мої завдання</h2>
            <button onClick={() => tasks.length > 0 ? handleTaskClick(tasks[0]) : navigate('/app/tasks')} className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">
              Відкрити дошку
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {loadingTasks ? (
              <div className="p-8 text-center text-sm font-medium text-slate-500">Завантаження завдань...</div>
            ) : tasks.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-700">У вас немає активних завдань</p>
                <p className="text-xs text-slate-500 mt-1">Ви можете знайти завдання на дошці або в актуальних місіях.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div 
                  key={task._id} 
                  className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors flex items-start gap-4"
                >
                  <button 
                    onClick={() => toggleTask(task)}
                    className="mt-0.5 shrink-0 text-slate-400 hover:text-orange-500 transition-colors"
                  >
                    {task.status === 'DONE' || task.status === 'REVIEW' ? <CheckSquare className="w-5 h-5 text-orange-500" /> : <Square className="w-5 h-5" />}
                  </button>
                  <div className={`flex-1 ${task.status === 'DONE' || task.status === 'REVIEW' ? 'opacity-60 line-through' : ''}`}>
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-slate-900 cursor-pointer hover:text-orange-600 transition-colors" onClick={() => handleTaskClick(task)}>{task.title}</h3>
                      <span className={`shrink-0 ml-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        task.status === 'DONE' ? 'bg-emerald-100 text-emerald-700' :
                        task.status === 'REVIEW' ? 'bg-amber-100 text-amber-700' :
                        'bg-sky-100 text-sky-700'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
                      {task.mission?.teamId?.name && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 text-slate-700 border border-slate-200 rounded text-[11px] font-semibold max-w-[200px]">
                          <div className={`w-3.5 h-3.5 shrink-0 rounded-sm flex items-center justify-center text-[9px] font-bold ${getTeamColor(task.mission.teamId.name)}`}>
                            {task.mission.teamId.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate">{task.mission.teamId.name}</span>
                        </span>
                      )}
                      {task.dueDate && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(task.dueDate).toLocaleDateString()}</span>}
                      {task.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {task.location}</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right (1/3): Upcoming Mission */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Найближча місія</h2>
          
          {upcomingMission ? (
            <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm flex flex-col group cursor-pointer" onClick={() => handleMissionClick(upcomingMission)}>
              <div className="aspect-video w-full overflow-hidden bg-slate-100 relative shrink-0">
                <img 
                  src={upcomingMission.photo || 'https://images.unsplash.com/photo-1593113565637-51c52b054928?q=80&w=800&auto=format&fit=crop'} 
                  alt={upcomingMission.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 bg-white/95 text-[10px] font-bold text-slate-900 rounded shadow-sm uppercase tracking-wide">Активно</span>
                  {upcomingMission.teamId?.name && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 text-slate-700 rounded shadow-sm text-[10px] font-bold">
                      <div className={`w-3.5 h-3.5 shrink-0 rounded-sm flex items-center justify-center text-[9px] font-bold ${getTeamColor(upcomingMission.teamId.name)}`}>
                        {upcomingMission.teamId.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate max-w-[150px]">{upcomingMission.teamId.name}</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 leading-tight group-hover:text-orange-600 transition-colors">{upcomingMission.name}</h3>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> {upcomingMission.location || 'Без локації'}</p>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold text-orange-600 group-hover:text-orange-700">
                  Деталі місії <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-500">Поки немає найближчих місій</p>
              <p className="text-xs text-slate-400 mt-1">Долучайтесь до створення нових зборів!</p>
            </div>
          )}
        </div>

      </section>

      {/* ACTIVE CAMPAIGNS */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Актуальні збори та місії</h2>
          <button onClick={() => navigate('/app/missions')} className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">
            Всі місії →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {missions.map((mission: any) => {
            const progress = mission.budget ? Math.min(100, Math.round(((mission.collected || 0) / mission.budget) * 100)) : 0;
            return (
              <motion.div 
                key={mission._id}
                onClick={() => handleMissionClick(mission)}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm flex flex-col group cursor-pointer hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-100 shrink-0 border-b border-slate-100">
                  <img src={mission.photo || 'https://images.unsplash.com/photo-1593113565637-51c52b054928?q=80&w=800&auto=format&fit=crop'} alt={mission.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-white/95 text-[10px] font-bold text-slate-700 rounded shadow-sm">
                      {mission.location || 'Без локації'}
                    </span>
                  </div>
                  {mission.teamId?.name && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/95 text-slate-700 rounded shadow-sm text-[10px] font-bold">
                        <div className={`w-3.5 h-3.5 shrink-0 rounded-sm flex items-center justify-center text-[9px] font-bold ${getTeamColor(mission.teamId.name)}`}>
                          {mission.teamId.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[150px]">{mission.teamId.name}</span>
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-slate-900 leading-tight mb-4 group-hover:text-orange-600 transition-colors">{mission.name}</h3>
                  
                  {mission.budget > 0 && (
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-xs font-bold mb-1.5 text-slate-500">
                        <span>Прогрес</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 rounded-full" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
          {missions.length === 0 && (
            <div className="col-span-1 md:col-span-3 py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
              <p className="text-sm font-bold text-slate-500">Немає активних місій</p>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}

