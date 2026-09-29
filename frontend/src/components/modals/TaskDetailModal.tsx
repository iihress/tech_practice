import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Calendar, MapPin, MessageSquare, Send, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Badge } from '../ui/Badge'
import { Avatar } from '../ui/Avatar'
import { Input } from '../ui/Input'
import api from '../../lib/api'
import { formatDate } from '../../lib/utils'
import type { Task, TaskComment } from '../../types'
import { useAuthStore } from '../../store/authStore'

interface TaskDetailModalProps {
  taskId: string
  onClose: () => void
  onUpdate: (task: Task) => void
}

export function TaskDetailModal({ taskId, onClose, onUpdate }: TaskDetailModalProps) {
  const { user } = useAuthStore()
  const [task, setTask] = useState<Task | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [showAssignDropdown, setShowAssignDropdown] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  const isCoordinatorOrAdmin = user?.role === 'COORDINATOR' || user?.role === 'ADMIN'

  useEffect(() => {
    fetchTask()
  }, [taskId])

  const fetchTask = async () => {
    try {
      const [taskRes, usersRes] = await Promise.all([
        api.get(`/tasks/${taskId}`),
        isCoordinatorOrAdmin ? api.get('/users') : Promise.resolve({ data: [] })
      ])
      setTask(taskRes.data)
      if (isCoordinatorOrAdmin) {
        setUsers(usersRes.data.filter((u: any) => u.role !== 'ADMIN'))
      }
    } catch (e) {
      toast.error('Помилка завантаження завдання')
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !task) return
    try {
      const res = await api.post(`/tasks/${task._id}/comments`, { text: commentText })
      setTask(res.data)
      onUpdate(res.data)
      setCommentText('')
    } catch (e) {
      toast.error('Помилка додавання коментаря')
    }
  }

  const handleJoin = async () => {
    if (!task || !user) return
    if (task.maxAssignees && task.assignees.length >= task.maxAssignees) {
      toast.error('Досягнуто ліміт виконавців для цього завдання')
      return
    }
    try {
      const assignees = [...(task.assignees?.map(a => a._id) || []), user.id]
      const res = await api.patch(`/tasks/${task._id}`, { assignees })
      setTask(res.data)
      onUpdate(res.data)
      toast.success('Ви приєдналися до завдання')
    } catch (e) {
      toast.error('Помилка оновлення')
    }
  }

  const handleAssign = async (userId: string) => {
    if (!task) return
    if (task.maxAssignees && task.assignees.length >= task.maxAssignees) {
      toast.error('Досягнуто ліміт виконавців')
      return
    }
    try {
      const assignees = [...(task.assignees?.map(a => a._id) || []), userId]
      const res = await api.patch(`/tasks/${task._id}`, { assignees })
      setTask(res.data)
      onUpdate(res.data)
      toast.success('Волонтера призначено')
      api.post('/notifications', { 
        userId, 
        title: 'Нове завдання', 
        message: `Вас призначено на завдання: "${task.title}"`,
        type: 'SYSTEM'
      }).catch(() => {})
      setShowAssignDropdown(false)
    } catch (e) {
      toast.error('Помилка призначення')
    }
  }

  const handleRemoveAssignee = async (userId: string) => {
    if (!task) return
    try {
      const assignees = task.assignees.filter(a => a._id !== userId).map(a => a._id)
      const res = await api.patch(`/tasks/${task._id}`, { assignees })
      setTask(res.data)
      onUpdate(res.data)
      toast.success('Виконавця знято із завдання')
      setShowAssignDropdown(false)
    } catch (e) {
      toast.error('Помилка оновлення')
    }
  }

  useEffect(() => {
    if (task && isEditing) {
      reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags?.join(', ') || '',
        location: task.location || '',
        maxAssignees: task.maxAssignees ? String(task.maxAssignees) : ''
      })
    }
  }, [task, isEditing, reset])

  const onEditSubmit = async (data: any) => {
    try {
      const tags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      const maxAssignees = data.maxAssignees ? parseInt(data.maxAssignees, 10) : null
      const res = await api.patch(`/tasks/${task!._id}`, {
        ...data,
        tags,
        maxAssignees,
        dueDate: data.dueDate || null,
      })
      setTask(res.data)
      onUpdate(res.data)
      setIsEditing(false)
      toast.success('Завдання оновлено')
    } catch (e) {
      toast.error('Помилка оновлення')
    }
  }

  if (loading || !task) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl">Завантаження...</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {isEditing ? (
          <form onSubmit={handleSubmit(onEditSubmit)} className="flex-1 overflow-y-auto border-r border-slate-100 p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">Редагування завдання</h2>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Назва завдання</label>
              <Input {...register('title')} required className="bg-slate-50/50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Опис</label>
              <textarea 
                {...register('description')} 
                className="w-full h-32 bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Пріоритет</label>
                <select {...register('priority')} className="w-full h-11 bg-slate-50/50 border border-slate-200 rounded-xl px-3 text-sm">
                  <option value="LOW">Низький</option>
                  <option value="MEDIUM">Середній</option>
                  <option value="HIGH">Високий</option>
                  <option value="URGENT">Терміново</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Статус</label>
                <select {...register('status')} className="w-full h-11 bg-slate-50/50 border border-slate-200 rounded-xl px-3 text-sm">
                  <option value="TODO">До виконання</option>
                  <option value="IN_PROGRESS">В процесі</option>
                  <option value="REVIEW">Перевірка</option>
                  <option value="DONE">Виконано</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Дедлайн</label>
                <Input type="date" {...register('dueDate')} className="bg-slate-50/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Локація</label>
                <Input {...register('location')} className="bg-slate-50/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Теги</label>
                <Input {...register('tags')} placeholder="тег1, тег2" className="bg-slate-50/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Макс. виконавців</label>
                <Input type="number" min="1" {...register('maxAssignees')} className="bg-slate-50/50" />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Скасувати
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Збереження...' : 'Зберегти'}
              </button>
            </div>
          </form>
        ) : (
        <div className="flex-1 overflow-y-auto border-r border-slate-100 p-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="priority" value={task.priority} />
              <Badge variant="status" value={task.status} />
            </div>
            <button onClick={onClose} className="md:hidden p-2 rounded hover:bg-slate-100 text-slate-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-2">{task.title}</h2>
            <p className="text-slate-600 text-sm whitespace-pre-wrap">{task.description}</p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
            {task.dueDate && (
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <Calendar className="w-4 h-4" />
                {formatDate(task.dueDate)}
              </div>
            )}
            {task.location && (
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <MapPin className="w-4 h-4" />
                {task.location}
              </div>
            )}
          </div>

          {task.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-6 justify-between items-end">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Виконавці ({task.assignees?.length || 0}{task.maxAssignees ? ` / ${task.maxAssignees}` : ''})
              </h3>
              {task.assignees?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="flex -space-x-3">
                      {task.assignees.slice(0, 5).map(a => (
                        <div key={a._id} className="relative group z-10">
                          <Avatar name={a.name} src={a.avatar} size="md" className="ring-2 ring-white" />
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                            {a.name}
                          </div>
                        </div>
                      ))}
                      {task.assignees.length > 5 && (
                        <div className="relative group z-0">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 ring-2 ring-white">
                            +{task.assignees.length - 5}
                          </div>
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                            Ще {task.assignees.length - 5}
                          </div>
                        </div>
                      )}
                    </div>
                    {(!user || !task.assignees.some(a => a._id === user.id)) && (!task.maxAssignees || task.assignees.length < task.maxAssignees) && (
                      <button 
                        onClick={handleJoin}
                        className="ml-2 w-8 h-8 rounded-full border-2 border-dashed border-orange-300 flex items-center justify-center bg-orange-50 hover:bg-orange-100 hover:border-orange-400 text-orange-500 transition-colors"
                        title="Приєднатися"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {isCoordinatorOrAdmin && (
                    <div className="relative">
                      <button 
                        onClick={() => setShowAssignDropdown(!showAssignDropdown)} 
                        className="px-3 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors h-full flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Керування виконавцями
                      </button>
                      {showAssignDropdown && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setShowAssignDropdown(false)} />
                          <div className="absolute bottom-full mb-2 left-0 w-72 bg-white border border-slate-200 shadow-xl rounded-xl py-3 z-40 max-h-[60vh] flex flex-col">
                            <div className="px-4 pb-2 border-b border-slate-100 shrink-0">
                              <h4 className="text-xs font-bold text-slate-500 uppercase">Поточні виконавці</h4>
                            </div>
                            <div className="overflow-y-auto max-h-40 py-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                              {task.assignees.length > 0 ? task.assignees.map(a => (
                                <div key={a._id} className="flex items-center justify-between px-4 py-1.5 hover:bg-slate-50">
                                  <div className="flex items-center gap-2">
                                    <Avatar name={a.name} size="xs" src={a.avatar} />
                                    <span className="text-sm font-medium text-slate-700">{a.name}</span>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveAssignee(a._id)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Зняти з завдання"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              )) : (
                                <div className="px-4 py-2 text-xs text-slate-500 text-center">Немає виконавців</div>
                              )}
                            </div>
                            
                            {(!task.maxAssignees || task.assignees.length < task.maxAssignees) && (
                              <>
                                <div className="px-4 py-2 border-y border-slate-100 bg-slate-50 shrink-0 mt-2">
                                  <h4 className="text-xs font-bold text-slate-500 uppercase">Додати волонтера</h4>
                                </div>
                                <div className="overflow-y-auto max-h-40 py-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                                  {users.filter(u => !task.assignees.some(a => a._id === u._id)).map(u => (
                                    <button 
                                      key={u._id} 
                                      onClick={() => handleAssign(u._id)}
                                      className="w-full flex items-center justify-between px-4 py-2 hover:bg-orange-50 transition-colors text-left group"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Avatar name={u.name} size="xs" src={u.avatar} />
                                        <span className="text-sm font-medium text-slate-700 group-hover:text-orange-700">{u.name}</span>
                                      </div>
                                      <Plus className="w-4 h-4 text-orange-400 opacity-0 group-hover:opacity-100" />
                                    </button>
                                  ))}
                                  {users.filter(u => !task.assignees.some(a => a._id === u._id)).length === 0 && (
                                    <div className="px-4 py-3 text-xs text-slate-500 text-center">Немає доступних волонтерів</div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <p className="text-sm font-medium text-orange-800">Виконавців ще немає</p>
                  {(!task.maxAssignees || task.assignees?.length < task.maxAssignees) && (
                    <button 
                      onClick={handleJoin}
                      className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-sm shrink-0"
                    >
                      Приєднатися
                    </button>
                  )}
                  {isCoordinatorOrAdmin && (!task.maxAssignees || task.assignees?.length < task.maxAssignees) && (
                    <div className="relative">
                      <button 
                        onClick={() => setShowAssignDropdown(!showAssignDropdown)} 
                        className="px-4 py-2 bg-orange-100 text-orange-700 text-sm font-bold rounded-lg hover:bg-orange-200 transition-colors shadow-sm shrink-0 flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" /> Додати волонтера
                      </button>
                      {showAssignDropdown && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setShowAssignDropdown(false)} />
                          <div className="absolute bottom-full mb-2 left-0 w-64 bg-white border border-slate-200 shadow-xl rounded-xl py-2 z-40 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                            <div className="px-4 pb-2 border-b border-slate-100 shrink-0 mb-2">
                              <h4 className="text-xs font-bold text-slate-500 uppercase">Оберіть волонтера</h4>
                            </div>
                            {users.map(u => (
                              <button 
                                key={u._id} 
                                onClick={() => handleAssign(u._id)}
                                className="w-full flex items-center justify-between gap-2 px-4 py-2 hover:bg-orange-50 transition-colors text-left group"
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar name={u.name} size="xs" src={u.avatar} />
                                  <span className="text-sm font-bold text-slate-700 group-hover:text-orange-700">{u.name}</span>
                                </div>
                                <Plus className="w-4 h-4 text-orange-400 opacity-0 group-hover:opacity-100" />
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            </div>

            {/* Action Buttons Separator */}
            {isCoordinatorOrAdmin && (
              <div className="w-full mt-6 pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row gap-3 justify-end items-center shrink-0">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-sm"
                >
                  Редагувати завдання
                </button>
                <button 
                  onClick={async () => {
                    if (window.confirm('Ви впевнені, що хочете видалити це завдання?')) {
                    try {
                      await api.delete(`/tasks/${task._id}`)
                      onUpdate({ ...task, isDeleted: true } as any)
                      toast.success('Завдання видалено.')
                      onClose()
                    } catch (e) {
                      toast.error('Помилка видалення')
                    }
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 border-2 border-red-100 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
              >
                Видалити завдання
              </button>
            </div>
            )}
            
            {/* Action Buttons (Non-admin) */}
            {!isCoordinatorOrAdmin && user && task.assignees?.some((a) => a._id === user.id) && (
              <div className="w-full mt-6 pt-4 border-t border-slate-200/60 flex gap-3 justify-end shrink-0">
                <button 
                  onClick={async () => {
                    try {
                      const assignees = task.assignees.filter(a => a._id !== user.id).map(a => a._id)
                      const res = await api.patch(`/tasks/${task._id}`, { assignees })
                      onUpdate(res.data)
                      setTask(res.data)
                      toast.success('Ви відмовились від завдання.')
                    } catch (e) {
                      toast.error('Помилка оновлення')
                    }
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors shadow-sm"
                >
                  Відмовитись від завдання
                </button>
              </div>
            )}
          </div>
        )}

        {/* Right Side: Comments */}
        <div className="w-full md:w-80 bg-slate-50 flex flex-col h-[50vh] md:h-auto">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Коментарі ({task.comments?.length || 0})
            </h3>
            <button onClick={onClose} className="hidden md:block p-1.5 rounded hover:bg-slate-100 text-slate-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {task.comments?.length === 0 ? (
              <p className="text-sm text-center text-slate-500 mt-10">Ще немає коментарів. Напишіть щось!</p>
            ) : (
              task.comments?.map((comment) => (
                <div key={comment._id} className="flex gap-3 group">
                  <Avatar name={comment.author.name} src={comment.author.avatar} size="sm" className="shrink-0" />
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm relative w-full">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className="text-xs font-bold text-slate-900">{comment.author.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {(user?.id === comment.author._id || isCoordinatorOrAdmin) && (
                          <button
                            onClick={async () => {
                              try {
                                const res = await api.delete(`/tasks/${task._id}/comments/${comment._id}`)
                                setTask(res.data)
                                onUpdate(res.data)
                              } catch (e) {
                                toast.error('Помилка видалення коментаря')
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-300 hover:text-red-500 transition-colors"
                            title="Видалити коментар"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-700">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddComment} className="p-4 bg-white border-t border-slate-200">
            <div className="relative">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Додати коментар..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
              <button 
                type="submit"
                disabled={!commentText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
