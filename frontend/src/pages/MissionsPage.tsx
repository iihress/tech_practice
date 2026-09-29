import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Target, Users, X, Image as ImageIcon, Trash2, Edit3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import type { Mission } from '../types'
import api from '../lib/api'
import { cn } from '../lib/utils'

// Add placeholder photos to demo missions
export const demoMissions = [
  {
    _id: '651ac1a942a49b2518e9c1a1', name: 'Збір теплих речей та термобілизни', description: 'Збір та розподіл теплого одягу для переселенців на зиму 2024.',
    status: 'ACTIVE', budget: 150000, collected: 67500, createdAt: '2024-10-01', location: 'Львів',
    photo: '/images/van_loading_1791031424679.png',
    members: [
      { _id: '651ac1a942a49b2518e9c1b1', name: 'Олена К.', email: '', role: 'COORDINATOR', avatar: '', createdAt: '' },
      { _id: '651ac1a942a49b2518e9c1b2', name: 'Микола Д.', email: '', role: 'VOLUNTEER', avatar: '', createdAt: '' },
      { _id: '651ac1a942a49b2518e9c1b3', name: 'Ірина М.', email: '', role: 'VOLUNTEER', avatar: '', createdAt: '' },
    ],
  },
  {
    _id: '651ac1a942a49b2518e9c1a2', name: 'Плетіння маскувальних сіток', description: 'Волонтерський штаб потребує рук для плетіння маскувальних сіток.',
    status: 'ACTIVE', budget: 10000, collected: 8000, createdAt: '2024-09-15', location: 'Ужгород',
    photo: '/images/camo_nets_1791031436286.png',
    members: [
      { _id: '651ac1a942a49b2518e9c1b4', name: 'Андрій П.', email: '', role: 'COORDINATOR', avatar: '', createdAt: '' },
      { _id: '651ac1a942a49b2518e9c1b5', name: 'Соломія Б.', email: '', role: 'VOLUNTEER', avatar: '', createdAt: '' },
    ],
  },
  {
    _id: '651ac1a942a49b2518e9c1a3', name: 'Евакуація та допомога притулкам', description: 'Допомога у перевезенні тварин із прифронтових зон.',
    status: 'ACTIVE', budget: 50000, collected: 10000, createdAt: '2024-08-01', location: 'Харків',
    photo: '/images/animal_rescue_1791031446464.png',
    members: [
      { _id: '651ac1a942a49b2518e9c1b6', name: 'Василь Т.', email: '', role: 'VOLUNTEER', avatar: '', createdAt: '' },
    ],
  },
]

// Add useForm to imports and wire up Create Mission Modal
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useAuthStore } from '../store/authStore'

export function MissionsPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [missions, setMissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [photoBase64, setPhotoBase64] = useState<string>('')
  const [editingMissionId, setEditingMissionId] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: { name: '', description: '', budget: '', location: '' }
  })

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

  const fetchMissions = async () => {
    try {
      const res = await api.get('/missions')
      setMissions(res.data)
    } catch (error) {
      console.error('Failed to load missions', error)
      setMissions([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Ви впевнені, що хочете видалити цю місію? Всі завдання будуть втрачені!')) return
    try {
      await api.delete(`/missions/${id}`)
      toast.success('Місію видалено')
      fetchMissions()
    } catch (err) {
      toast.error('Помилка видалення')
    }
  }

  useEffect(() => {
    fetchMissions()
  }, [])

  const onSubmit = async (data: any) => {
    try {
      if (editingMissionId) {
        await api.patch(`/missions/${editingMissionId}`, {
          name: data.name,
          description: data.description,
          budget: data.budget ? Number(data.budget) : 0,
          location: data.location || '',
          photo: photoBase64 || undefined,
        })
        toast.success('Місію оновлено!')
      } else {
        await api.post('/missions', {
          name: data.name,
          description: data.description,
          budget: data.budget ? Number(data.budget) : 0,
          location: data.location || '',
          photo: photoBase64,
        })
        toast.success('Місію створено!')
      }
      setIsModalOpen(false)
      setEditingMissionId(null)
      reset()
      setPhotoBase64('')
      fetchMissions()
    } catch (error) {
      toast.error('Помилка збереження місії')
    }
  }

  const openCreateModal = () => {
    setEditingMissionId(null)
    reset({ name: '', description: '', budget: '', location: '' })
    setPhotoBase64('')
    setIsModalOpen(true)
  }

  const handleEdit = (mission: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingMissionId(mission._id)
    setValue('name', mission.name)
    setValue('description', mission.description || '')
    setValue('budget', mission.budget ? String(mission.budget) : '')
    setValue('location', mission.location || '')
    setPhotoBase64(mission.photo || '')
    setIsModalOpen(true)
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto font-sans text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Місії та збори</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Разом ми вже підтримали {missions.length} активних ініціатив
          </p>
        </div>
        {(user?.role === 'COORDINATOR' || user?.role === 'ADMIN') && (
          <button 
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Створити місію
          </button>
        )}
      </div>

      {missions.length === 0 && !loading && (
        <div className="py-20 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-slate-50">
            <Target className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Місій поки немає</h3>
          <p className="text-slate-500 mb-8 text-base">
            Ваша команда ще не має активних місій. Створіть першу місію, щоб зібрати кошти або розпочати роботу над завданнями!
          </p>
          {(user?.role === 'COORDINATOR' || user?.role === 'ADMIN') && (
            <button 
              onClick={openCreateModal}
              className="px-8 py-3.5 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Створити першу місію
            </button>
          )}
        </div>
      )}

      {missions.length > 0 && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {missions.map((mission, i) => {
            const progress = mission.budget ? Math.min(100, Math.round(((mission.collected || 0) / mission.budget) * 100)) : 0;
            
            return (
              <motion.div
                key={mission._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm flex flex-col group hover:border-orange-500/50 transition-colors"
              >
                {/* Image Half */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={mission.photo || 'https://images.unsplash.com/photo-1593113565637-51c52b054928?q=80&w=800&auto=format&fit=crop'} 
                    alt={mission.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={cn(
                      "px-2.5 py-1 text-[10px] font-bold rounded shadow-sm border",
                      mission.status === 'ACTIVE' ? 'bg-green-100/95 text-green-700 border-green-200' :
                      mission.status === 'COMPLETED' ? 'bg-slate-100/95 text-slate-700 border-slate-200' :
                      'bg-yellow-100/95 text-yellow-700 border-yellow-200'
                    )}>
                      {mission.status === 'ACTIVE' ? 'Активно' : mission.status === 'COMPLETED' ? 'Завершено' : 'На паузі'}
                    </span>
                  </div>
                </div>

                {/* Content Half */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-tight">
                    {mission.name}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-6 flex-1 font-medium">
                    {mission.description}
                  </p>

                  {/* Progress Bar */}
                  {mission.budget > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-xs font-bold mb-2">
                        <span className="text-slate-900">
                          {(mission.collected || 0).toLocaleString()} ₴ <span className="text-slate-500 font-medium">зібрано з {mission.budget.toLocaleString()} ₴</span>
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-orange-500 rounded-full" 
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {mission.members?.slice(0, 3).map((member: any) => (
                          <Avatar
                            key={member._id}
                            name={member.name}
                            src={member.avatar}
                            size="sm"
                            className="ring-2 ring-white"
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-slate-500 ml-1 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5"/> {mission.members?.length} волонтерів
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {(user?.role === 'COORDINATOR' || user?.role === 'ADMIN') && (
                        <>
                          <button 
                            onClick={(e) => handleEdit(mission, e)}
                            className="text-slate-400 hover:text-orange-500 transition-colors p-1"
                            title="Редагувати місію"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => handleDelete(mission._id, e)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            title="Видалити місію"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => navigate(`/app/missions/${mission._id}`)}
                        className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        Приєднатися / Деталі
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Create Mission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">{editingMissionId ? 'Редагувати місію' : 'Нова місія'}</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6 space-y-5">
                  {/* Photo Upload area */}
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
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Назва місії</label>
                    <Input {...register('name', { required: true })} placeholder="Наприклад: Операція 'Тепло'" className="bg-slate-50/50 border-slate-200 focus:border-orange-500 focus:ring-orange-500/20" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Бюджет (Ціль)</label>
                      <Input type="number" {...register('budget')} placeholder="0 ₴" className="bg-slate-50/50 border-slate-200 focus:border-orange-500 focus:ring-orange-500/20" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Локація (Місто)</label>
                      <Input {...register('location')} placeholder="Київ, Львів..." className="bg-slate-50/50 border-slate-200 focus:border-orange-500 focus:ring-orange-500/20" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Опис</label>
                    <textarea 
                      {...register('description')}
                      rows={3}
                      placeholder="Розкажіть, для чого потрібна ця місія..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 flex items-center justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Скасувати
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Збереження...' : (editingMissionId ? 'Зберегти зміни' : 'Створити місію')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
