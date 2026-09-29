import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Clock, Users, Shield, ShieldAlert, Target } from 'lucide-react'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import type { Mission } from '../types'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'
import { toast } from 'sonner'
import { formatDate, cn } from '../lib/utils'
import { useForm } from 'react-hook-form'
import { X, Image as ImageIcon } from 'lucide-react'



export function MissionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [mission, setMission] = useState<Mission | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDonateModal, setShowDonateModal] = useState(false)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [donateAmount, setDonateAmount] = useState('')
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [photoBase64, setPhotoBase64] = useState<string>('')

  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { isSubmitting: isSubmittingEdit } } = useForm()

  const handleEditOpen = () => {
    resetEdit({
      name: mission?.name,
      description: mission?.description,
      budget: mission?.budget,
      location: mission?.location,
    })
    setPhotoBase64(mission?.photo || '')
    setShowEditModal(true)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Файл занадто великий (макс. 2МБ)')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setPhotoBase64(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const onEditSubmit = async (data: any) => {
    try {
      const res = await api.patch(`/missions/${mission?._id}`, {
        ...data,
        budget: data.budget ? Number(data.budget) : 0,
        photo: photoBase64
      })
      setMission(res.data)
      setShowEditModal(false)
      toast.success('Місію оновлено!')
    } catch {
      toast.error('Помилка редагування')
    }
  }

  const isCoordinatorOrAdmin = user?.role === 'COORDINATOR' || user?.role === 'ADMIN'

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const res = await api.get(`/missions/${id}`)
        setMission(res.data)
      } catch (e) {
        toast.error('Помилка завантаження місії')
        navigate('/app/missions')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchMission()
  }, [id, navigate])

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-medium">Завантаження місії...</div>
  }

  if (!mission) return null

  const progress = mission.budget ? Math.min(100, Math.round(((mission.collected || 0) / mission.budget) * 100)) : 0;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto font-sans text-slate-800 space-y-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Назад
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row">
        <div className="md:w-1/2 h-64 md:h-auto relative bg-slate-100 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden">
          <img 
            src={mission.photo || 'https://images.unsplash.com/photo-1593113565637-51c52b054928?q=80&w=800&auto=format&fit=crop'} 
            alt={mission.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <div className="mb-4">
            <span className={cn(
              "px-3 py-1 text-xs font-bold rounded-full shadow-sm border",
              mission.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' :
              mission.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700 border-slate-200' :
              'bg-yellow-100 text-yellow-700 border-yellow-200'
            )}>
              {mission.status === 'ACTIVE' ? 'Активно' : mission.status === 'COMPLETED' ? 'Завершено' : 'На паузі'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">{mission.name}</h1>
          <p className="text-slate-600 font-medium leading-relaxed mb-6">{mission.description}</p>
          
          <div className="flex items-center gap-6 text-sm font-medium text-slate-500 mb-8">
            {mission.location && (
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {mission.location}</span>
            )}
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {formatDate(mission.createdAt)}</span>
          </div>

          {(mission.budget ?? 0) > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-slate-900">
                  {(mission.collected || 0).toLocaleString()} ₴ <span className="text-slate-500 font-medium">зібрано з {(mission.budget || 0).toLocaleString()} ₴</span>
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mt-auto">
            <button 
              onClick={() => setShowDonateModal(true)}
              className="w-full sm:flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
            >
              Підтримати фінансово
            </button>
            {mission.members?.some((m: any) => m._id === user?.id) || mission.applicants?.some((m: any) => m._id === user?.id) ? (
              <>
                {mission.members?.some((m: any) => m._id === user?.id) && (
                  <button 
                    onClick={() => navigate(`/app/tasks?missionId=${mission._id}`)}
                    className="w-full sm:flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
                  >
                    Відкрити дошку
                  </button>
                )}
                {mission.members?.some((m: any) => m._id === user?.id) ? (
                  <button 
                    onClick={() => setShowLeaveModal(true)}
                    className="w-full sm:flex-1 py-3 bg-red-50 text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-100 transition-colors shadow-sm whitespace-nowrap"
                  >
                    Відмовитись від місії
                  </button>
                ) : (
                  <button disabled className="w-full sm:flex-1 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl cursor-not-allowed">
                    Заявка розглядається
                  </button>
                )}
              </>
            ) : (
              <button 
                onClick={async () => {
                  try {
                    const res = await api.post(`/missions/${mission._id}/join`)
                    setMission(res.data)
                    if (isCoordinatorOrAdmin) {
                      toast.success('Ви успішно приєдналися до місії (Миттєво)')
                    } else {
                      toast.success('Ваша заявка на приєднання надіслана координатору місії.')
                    }
                  } catch (e) {
                    toast.error('Помилка приєднання до місії.')
                  }
                }}
                className="w-full flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
              >
                {isCoordinatorOrAdmin ? 'Приєднатися до місії' : 'Приєднатися як волонтер'}
              </button>
            )}
          </div>

          {/* Admin Controls */}
          {isCoordinatorOrAdmin && (
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="relative inline-block z-40">
                <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="flex items-center justify-between min-w-[140px] bg-white border-2 border-slate-200 text-slate-700 text-sm font-bold rounded-xl pl-4 pr-3 py-2.5 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 cursor-pointer hover:border-slate-300 transition-all shadow-sm"
                >
                  <span>{mission.status === 'ACTIVE' ? 'Активна' : mission.status === 'COMPLETED' ? 'Завершена' : 'На паузі'}</span>
                  <svg className={cn("fill-current h-4 w-4 text-slate-400 transition-transform", isStatusDropdownOpen && "rotate-180")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </button>
                {isStatusDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsStatusDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-1 z-50"
                    >
                      {[
                        { value: 'ACTIVE', label: 'Активна' },
                        { value: 'PAUSED', label: 'На паузі' },
                        { value: 'COMPLETED', label: 'Завершена' }
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={async () => {
                            try {
                              const res = await api.patch(`/missions/${mission._id}`, { status: opt.value })
                              setMission(res.data)
                              toast.success('Статус оновлено')
                            } catch {
                              toast.error('Помилка оновлення статусу')
                            }
                            setIsStatusDropdownOpen(false)
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm font-bold transition-colors hover:bg-orange-50",
                            mission.status === opt.value ? "text-orange-600 bg-orange-50/50" : "text-slate-700"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleEditOpen}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors shadow-sm"
                >
                  Редагувати
                </button>
                <button 
                  onClick={async () => {
                    if (window.confirm('Ви впевнені, що хочете видалити місію та всі пов\'язані завдання?')) {
                      try {
                        await api.delete(`/missions/${mission._id}`)
                        toast.success('Місію видалено')
                        navigate('/app/missions')
                      } catch (e) {
                        toast.error('Помилка видалення місії')
                      }
                    }
                  }}
                  className="px-4 py-2 border border-red-200 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                >
                  Видалити місію
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Team */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Команда місії ({mission.members?.length || 0})
        </h2>
        
        {mission.members?.length === 0 ? (
          <p className="text-slate-500 text-sm font-medium text-center py-8">Команда ще не сформована. Станьте першим!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mission.members?.map(member => (
              <div key={member._id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <Avatar name={member.name} src={member.avatar} size="md" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{member.name}</p>
                  <p className="text-xs font-medium text-slate-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Applications Section for Coordinators */}
      {isCoordinatorOrAdmin && mission.applicants && mission.applicants.length > 0 && (
        <div className="bg-orange-50 border border-orange-100 p-8 rounded-3xl shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-orange-500" />
            Нові заявки на приєднання
          </h2>
          <div className="space-y-3">
            {mission.applicants.map((applicant) => (
              <div key={applicant._id} className="bg-white p-4 rounded-xl border border-orange-200/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar name={applicant.name} src={applicant.avatar} size="sm" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{applicant.name}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Хоче приєднатися як волонтер</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={async () => {
                      try {
                        const res = await api.post(`/missions/${mission._id}/approve/${applicant._id}`)
                        setMission(res.data)
                        toast.success('Заявку успішно схвалено!')
                      } catch (e) {
                        toast.error('Помилка схвалення заявки')
                      }
                    }}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Схвалити
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        const res = await api.post(`/missions/${mission._id}/reject/${applicant._id}`)
                        setMission(res.data)
                        toast.info('Заявку відхилено')
                      } catch (e) {
                        toast.error('Помилка відхилення заявки')
                      }
                    }}
                    className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Відхилити
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Donate Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setShowDonateModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-2">Підтримати місію</h3>
            <p className="text-sm text-slate-500 mb-6">Введіть суму, яку ви хочете задонатити (або відняти, якщо введено з мінусом).</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Сума (₴)</label>
                <input 
                  type="number"
                  value={donateAmount}
                  onChange={(e) => setDonateAmount(e.target.value)}
                  placeholder="Напр. 500"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={() => setShowDonateModal(false)}
                  className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Скасувати
                </button>
                <button 
                  onClick={async () => {
                    const amount = Number(donateAmount)
                    if (!amount) return
                    try {
                      const res = await api.patch(`/missions/${mission._id}`, { collected: (mission.collected || 0) + amount })
                      setMission(res.data)
                      setDonateAmount('')
                      setShowDonateModal(false)
                      toast.success(amount >= 0 ? `Дякуємо! Додано ${amount} ₴!` : `Віднято ${Math.abs(amount)} ₴`)
                    } catch (e) {
                      toast.error('Помилка оновлення суми')
                    }
                  }}
                  className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
                >
                  Підтвердити
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {/* Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setShowLeaveModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-2">Відмовитись від місії?</h3>
            <p className="text-sm text-slate-500 mb-6">Ви впевнені, що хочете покинути цю місію? Ви зможете надіслати заявку на приєднання знову пізніше.</p>
            
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => setShowLeaveModal(false)}
                className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Скасувати
              </button>
              <button 
                onClick={async () => {
                  try {
                    const res = await api.post(`/missions/${mission._id}/leave`)
                    setMission(res.data)
                    toast.success('Ви відмовились від місії')
                    setShowLeaveModal(false)
                  } catch (e) {
                    toast.error('Помилка відмови від місії')
                  }
                }}
                className="w-full py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-sm"
              >
                Відмовитись
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Mission Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setShowEditModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Редагувати місію</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitEdit(onEditSubmit)}>
              <div className="p-6 space-y-5">
                <label className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50/50 cursor-pointer transition-colors overflow-hidden relative">
                  {photoBase64 ? (
                    <img src={photoBase64} alt="Обкладинка" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">Завантажити обкладинку</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Назва місії</label>
                  <input {...registerEdit('name')} className="w-full h-11 bg-slate-50/50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Бюджет</label>
                    <input type="number" {...registerEdit('budget')} className="w-full h-11 bg-slate-50/50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Локація</label>
                    <input {...registerEdit('location')} className="w-full h-11 bg-slate-50/50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Опис</label>
                  <textarea {...registerEdit('description')} rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 resize-none" />
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Скасувати</button>
                <button type="submit" disabled={isSubmittingEdit} className="px-5 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-full hover:bg-orange-600 transition-all shadow-md active:scale-95 disabled:opacity-50">
                  {isSubmittingEdit ? 'Збереження...' : 'Зберегти зміни'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
