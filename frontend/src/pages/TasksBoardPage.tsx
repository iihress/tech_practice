import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, MoreHorizontal, Calendar, X, MapPin } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import type { KanbanBoard, Task, TaskStatus, TaskPriority } from '../types'
import api from '../lib/api'
import { cn, formatDate } from '../lib/utils'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

// ─── Column config ──────────────────────────────────────────────
const COLUMNS: { id: TaskStatus; label: string; color: string; dot: string }[] = [
  { id: 'TODO', label: 'До виконання', color: 'text-slate-600', dot: 'bg-slate-300' },
  { id: 'IN_PROGRESS', label: 'В процесі', color: 'text-blue-600', dot: 'bg-blue-500' },
  { id: 'REVIEW', label: 'Перевірка', color: 'text-orange-500', dot: 'bg-orange-500' },
  { id: 'DONE', label: 'Виконано', color: 'text-green-600', dot: 'bg-green-500' },
]

// ─── Task Card (sortable) ────────────────────────────────────────
function TaskCard({ task, overlay = false, disabled = false }: { task: Task; overlay?: boolean, disabled?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task._id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-task-id={task._id}
      className={cn(
        'bg-white border border-slate-100 rounded-2xl p-5 shadow-sm select-none',
        !disabled && 'cursor-grab active:cursor-grabbing hover:shadow-md hover:border-slate-200 transition-all',
        disabled && 'cursor-default',
        isDragging && !overlay && 'opacity-40',
        overlay && 'shadow-md scale-[1.01] rotate-1 border-slate-300 cursor-grabbing',
      )}
    >
      {/* Priority + menu */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <Badge variant="priority" value={task.priority} />
        <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Title */}
      <p className="text-sm font-bold text-slate-800 leading-snug mb-3">{task.title}</p>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {task.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 font-medium border border-slate-100">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
        <div className="flex flex-col gap-1.5">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(task.dueDate)}
            </div>
          )}
          {task.location && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-[120px]">{task.location}</span>
            </div>
          )}
        </div>
        <div className="ml-auto">
          {task.assignees?.length > 0 ? (
            <div className="flex -space-x-2">
              {task.assignees.slice(0, 3).map((a) => (
                <Avatar key={a._id} name={a.name} src={a.avatar} size="xs" className="ring-2 ring-white" />
              ))}
              {task.assignees.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 ring-2 ring-white">
                  +{task.assignees.length - 3}
                </div>
              )}
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center bg-slate-50">
              <Plus className="w-3 h-3 text-slate-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
// ─── Custom Select Component ──────────────────────────────────────
function CustomSelect({ 
  value, 
  onChange, 
  options 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  options: { label: string, value: string }[] 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selected = options.find(o => o.value === value)

  return (
    <div className="relative w-full z-40">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 bg-slate-50/50 border border-slate-200 rounded-xl pl-4 pr-10 text-sm text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 cursor-pointer hover:border-slate-300 transition-all text-left flex items-center justify-between"
      >
        <span>{selected?.label || 'Оберіть...'}</span>
        <svg className={cn("fill-current h-4 w-4 text-slate-400 transition-transform", isOpen && "rotate-180")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-2 z-50 max-h-60 overflow-y-auto"
            >
              {options.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm font-medium transition-colors hover:bg-orange-50/80",
                    value === opt.value ? "text-orange-600 bg-orange-50/50" : "text-slate-700"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Create Task Modal ───────────────────────────────────────────
interface CreateTaskModalProps {
  onClose: () => void
  onCreated: (task: Task) => void
  missionId: string
}

function CreateTaskModal({ onClose, onCreated, missionId }: CreateTaskModalProps) {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<{
    title: string
    description: string
    priority: TaskPriority
    status: TaskStatus
    dueDate: string
    tags: string
    location: string
    maxAssignees: string
  }>({
    defaultValues: { priority: 'MEDIUM', status: 'TODO', location: '', maxAssignees: '' },
  })

  const priorityValue = watch('priority')
  const statusValue = watch('status')

  const onSubmit = async (data: any) => {
    try {
      const tags = data.tags ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []
      const res = await api.post('/tasks', {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate || null,
        tags,
        location: data.location || '',
        maxAssignees: data.maxAssignees ? parseInt(data.maxAssignees, 10) : null,
        mission: missionId || undefined,
      })
      onCreated(res.data)
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Нове завдання</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Назва завдання</label>
            <Input placeholder="Що потрібно зробити?" className="bg-slate-50/50" {...register('title', { required: true })} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Опис</label>
            <textarea
              {...register('description')}
              placeholder="Детальний опис..."
              rows={3}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Пріоритет</label>
              <CustomSelect
                value={priorityValue}
                onChange={(val) => setValue('priority', val as TaskPriority)}
                options={[
                  { value: 'LOW', label: 'Низький' },
                  { value: 'MEDIUM', label: 'Середній' },
                  { value: 'HIGH', label: 'Високий' },
                  { value: 'URGENT', label: 'Терміново' },
                ]}
              />
            </div>
            <div className="relative">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Статус</label>
              <CustomSelect
                value={statusValue}
                onChange={(val) => setValue('status', val as TaskStatus)}
                options={[
                  { value: 'TODO', label: 'До виконання' },
                  { value: 'IN_PROGRESS', label: 'В процесі' },
                  { value: 'REVIEW', label: 'Перевірка' },
                  { value: 'DONE', label: 'Виконано' },
                ]}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Дедлайн</label>
              <Input type="date" className="bg-slate-50/50" {...register('dueDate')} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Локація (Місто)</label>
              <Input placeholder="Напр. Львів" className="bg-slate-50/50" {...register('location')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Теги (через кому)</label>
              <Input placeholder="гуманітарна, збір, доставка" className="bg-slate-50/50" {...register('tags')} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Макс. виконавців</label>
              <Input type="number" min="1" placeholder="Не обмежено" className="bg-slate-50/50" {...register('maxAssignees')} />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors">
              Скасувати
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95">
              Створити
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Kanban Column ───────────────────────────────────────────────
import { useDroppable } from '@dnd-kit/core'

function KanbanColumn({
  column,
  tasks,
  isCoordinatorOrAdmin,
}: {
  column: (typeof COLUMNS)[number]
  tasks: Task[]
  isCoordinatorOrAdmin: boolean
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  })

  return (
    <div className="flex flex-col min-w-[300px] max-w-[320px] flex-1 bg-slate-50/50 rounded-2xl p-3 border border-slate-100">
      <div className="flex items-center gap-2 mb-4 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
        <span className={cn('w-2 h-2 rounded-full flex-shrink-0', column.dot)} />
        <span className={cn('text-sm font-bold', column.color)}>
          {column.label}
        </span>
        <span className="ml-auto text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
        id={column.id}
      >
        <div ref={setNodeRef} className="kanban-column flex flex-col gap-3 min-h-[500px]">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <TaskCard 
                  task={task} 
                  disabled={false} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {tasks.length === 0 && (
            <div className="flex items-center justify-center py-10 opacity-50">
              <p className="text-sm font-medium text-slate-400">Тут поки порожньо</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────
import { TaskDetailModal } from '../components/modals/TaskDetailModal'
import { Filter } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

import { demoMissions } from './MissionsPage'

export function TasksBoardPage() {
  const { user } = useAuthStore()
  const [board, setBoard] = useState<KanbanBoard>({
    TODO: [],
    IN_PROGRESS: [],
    REVIEW: [],
    DONE: [],
  })
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [locationFilter, setLocationFilter] = useState('')
  const [missions, setMissions] = useState<any[]>([])
  const [selectedMission, setSelectedMission] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const isCoordinatorOrAdmin = user?.role === 'COORDINATOR' || user?.role === 'ADMIN'

  const sensors = useSensors(
    useSensor(PointerSensor, { 
      activationConstraint: { distance: 8 } 
    }),
  )

  const [searchParams] = useSearchParams()
  const initialMissionId = searchParams.get('missionId')

  useEffect(() => {
    api.get('/missions').then((res) => {
      const availableMissions = isCoordinatorOrAdmin 
        ? res.data 
        : res.data.filter((m: any) => m.members?.some((member: any) => member._id === user?.id || member === user?.id))

      if (availableMissions.length > 0) {
        setMissions(availableMissions)
        if (initialMissionId && availableMissions.some((m: any) => m._id === initialMissionId)) {
          setSelectedMission(initialMissionId)
        } else {
          setSelectedMission(availableMissions[0]._id)
        }
      } else {
        setMissions([])
        setSelectedMission('')
      }
    }).catch(() => {
      setMissions([])
      setSelectedMission('')
    })
  }, [isCoordinatorOrAdmin, user?.id, initialMissionId])

  useEffect(() => {
    if (selectedMission) fetchBoard(selectedMission)
    else setLoading(false)
  }, [selectedMission])

  const fetchBoard = async (missionId: string) => {
    try {
      const res = await api.get(`/tasks/board${missionId ? `?mission=${missionId}` : ''}`)
      
      const emptyBoard: KanbanBoard = {
        TODO: [],
        IN_PROGRESS: [],
        REVIEW: [],
        DONE: [],
      }
      
      setBoard({ ...emptyBoard, ...res.data })
    } catch (error) {
      console.error('Failed to load board', error)
      setBoard({
        TODO: [],
        IN_PROGRESS: [],
        REVIEW: [],
        DONE: [],
      })
    } finally {
      setLoading(false)
    }
  }

  const findTaskById = (id: string): Task | null => {
    for (const col of Object.values(board)) {
      const found = col.find((t: Task) => t._id === id)
      if (found) return found
    }
    return null
  }

  const findColumnOfTask = (taskId: string): TaskStatus | null => {
    for (const [colId, tasks] of Object.entries(board)) {
      if ((tasks as Task[]).find((t) => t._id === taskId)) {
        return colId as TaskStatus
      }
    }
    return null
  }

  const canMoveTask = (task: Task | null | undefined) => {
    if (!task) return false;
    if (isCoordinatorOrAdmin) return true;
    return task.assignees?.some((a: any) => a._id === user?.id || a === user?.id);
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    const task = findTaskById(active.id as string)
    if (!task) return

    if (task.status === 'DONE' && !isCoordinatorOrAdmin) {
      toast.error('Виконані завдання не можна редагувати')
      return
    }

    if (!canMoveTask(task)) {
      toast.error('Ви можете переміщувати лише ті завдання, на які призначені')
      return
    }
    setActiveTask(task)
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return
    const activeCol = findColumnOfTask(active.id as string)
    const overCol = COLUMNS.find((c) => c.id === over.id)?.id ?? findColumnOfTask(over.id as string)

    if (!activeCol || !overCol || activeCol === overCol) return

    const activeTask = board[activeCol].find((t) => t._id === active.id)
    if (!canMoveTask(activeTask)) return

    if (overCol === 'DONE' && !isCoordinatorOrAdmin) {
      return
    }

    setBoard((prev) => {
      const activeTask = prev[activeCol].find((t) => t._id === active.id)
      if (!activeTask) return prev
      return {
        ...prev,
        [activeCol]: prev[activeCol].filter((t) => t._id !== active.id),
        [overCol]: [...prev[overCol], { ...activeTask, status: overCol }],
      }
    })
  }

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    const taskToMove = activeTask || findTaskById(active.id as string)
    setActiveTask(null)
    if (!over || !canMoveTask(taskToMove)) return
    const col = findColumnOfTask(active.id as string)
    if (!col) return

    if (col === 'DONE' && !isCoordinatorOrAdmin) {
      toast.error('Тільки координатори можуть переводити завдання у "Виконано"')
      fetchBoard(selectedMission)
      return
    }

    try {
      await api.patch(`/tasks/${active.id}`, { status: col })
      toast.success('Статус оновлено')
    } catch {
      toast.error('Помилка оновлення статусу')
      fetchBoard(selectedMission)
    }
  }

  const handleTaskCreated = (task: Task) => {
    setBoard((prev) => ({
      ...prev,
      [task.status]: [task, ...prev[task.status]],
    }))
  }

  const handleTaskUpdate = (updatedTask: Task & { isDeleted?: boolean }) => {
    setBoard((prev) => {
      const newBoard = { ...prev }
      for (const col of Object.keys(prev)) {
        if (updatedTask.isDeleted) {
          newBoard[col as TaskStatus] = newBoard[col as TaskStatus].filter(t => t._id !== updatedTask._id)
        } else {
          newBoard[col as TaskStatus] = newBoard[col as TaskStatus].map(t => 
            t._id === updatedTask._id ? updatedTask : t
          )
        }
      }
      return newBoard
    })
  }

  const filteredBoard = Object.fromEntries(
    Object.entries(board).map(([col, tasks]) => [
      col,
      tasks.filter((t: Task) => !locationFilter || t.location?.toLowerCase().includes(locationFilter.toLowerCase()))
    ])
  ) as KanbanBoard

  const hasAnyTasks = Object.values(board).some(tasks => tasks.length > 0)

  const generateDemoTasks = async () => {
    if (!selectedMission) {
      toast.error('Оберіть місію спочатку!')
      return
    }
    try {
      const missionObj = missions.find(m => m._id === selectedMission)
      const missionName = (missionObj?.name || missionObj?.title || '').toLowerCase()
      
      let demoTasks = []
      
      if (missionName.includes('евакуація') || missionName.includes('притулк')) {
        demoTasks = [
          { title: 'Організувати транспорт для тварин', description: 'Знайти 2 мікроавтобуси для поїздки.', status: 'TODO', priority: 'HIGH', tags: ['логістика', 'авто'], location: 'Київ', mission: selectedMission, assignees: user ? [user.id] : [] },
          { title: 'Закупівля корму та переносок', description: 'Придбати 100 кг сухого корму та 20 кліток.', status: 'TODO', priority: 'MEDIUM', tags: ['тварини', 'закупівля'], location: 'Мукачево', mission: selectedMission },
          { title: 'Зв\'язатися з ветклінікою', description: 'Домовитися про огляд евакуйованих тварин.', status: 'IN_PROGRESS', priority: 'URGENT', tags: ['медицина', 'домовленість'], location: 'Львів', mission: selectedMission, assignees: user ? [user.id] : [] },
          { title: 'Підготовка тимчасових вольєрів', description: 'Розчистити територію та встановити вольєри.', status: 'DONE', priority: 'HIGH', tags: ['фізична праця', 'притулок'], location: 'Львів', mission: selectedMission },
        ]
      } else if (missionName.includes('схід') || missionName.includes('конвой')) {
        demoTasks = [
          { title: 'Зібрати аптечки для евакуації', description: 'Потрібно укомплектувати 50 аптечок за стандартами IFAK.', status: 'TODO', priority: 'URGENT', tags: ['медицина', 'збір'], location: 'Мукачево', mission: selectedMission, assignees: user ? [user.id] : [] },
          { title: 'Завантажити 2 буси на Схід', description: 'Завантажити продукти, воду та медикаменти.', status: 'TODO', priority: 'HIGH', tags: ['логістика', 'вантажники'], location: 'Дніпро', mission: selectedMission },
          { title: 'Перевірка маскувальних сіток', description: 'Перевірити якість сплетених сіток перед відправкою.', status: 'REVIEW', priority: 'MEDIUM', tags: ['сітки', 'перевірка'], location: 'Львів', mission: selectedMission, assignees: user ? [user.id] : [] },
          { title: 'Узгодити маршрут з військовими', description: 'Отримати перепустки та маршрут проїзду.', status: 'DONE', priority: 'URGENT', tags: ['документи', 'координація'], location: 'Київ', mission: selectedMission },
        ]
      } else if (missionName.includes('речей') || missionName.includes('одяг')) {
        demoTasks = [
          { title: 'Сортування теплого одягу', description: 'Розсортувати гуманітарну допомогу за розмірами.', status: 'IN_PROGRESS', priority: 'HIGH', tags: ['гуманітарка', 'склад'], location: 'Київ, Склад №1', mission: selectedMission, assignees: user ? [user.id] : [] },
          { title: 'Закупівля термобілизни', description: 'Купити 100 комплектів розмірів L та XL.', status: 'TODO', priority: 'URGENT', tags: ['закупівля', 'одяг'], location: 'Київ', mission: selectedMission },
          { title: 'Пошук пакувальних коробок', description: 'Знайти 50 великих коробок для відправки.', status: 'REVIEW', priority: 'LOW', tags: ['пакування'], location: 'Львів', mission: selectedMission, assignees: user ? [user.id] : [] },
          { title: 'Скласти списки потреб', description: 'Опитати підрозділи щодо потрібних розмірів взуття.', status: 'DONE', priority: 'MEDIUM', tags: ['координація', 'документи'], location: 'Онлайн', mission: selectedMission },
        ]
      } else {
        // Fallback generic tasks
        demoTasks = [
          { title: 'Загальне завдання 1', description: 'Опис першого завдання.', status: 'TODO', priority: 'MEDIUM', tags: ['загальне'], location: 'Онлайн', mission: selectedMission },
          { title: 'Організація зустрічі волонтерів', description: 'Обговорити подальші плани.', status: 'IN_PROGRESS', priority: 'LOW', tags: ['команда'], location: 'Офіс', mission: selectedMission },
        ]
      }
      
      setLoading(true)
      
      // Clear existing tasks for this mission first
      await api.delete(`/tasks/mission/${selectedMission}`)
      
      for (const t of demoTasks) {
        await api.post('/tasks', t)
      }
      toast.success('Тематичні тестові завдання успішно оновлено!')
      fetchBoard(selectedMission)
    } catch (e) {
      toast.error('Помилка генерації завдань')
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-12 font-sans text-slate-800 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-sm text-slate-500 font-medium mb-1.5 flex items-center gap-1.5">
            {missions.find(m => m._id === selectedMission)?.teamId?.name || 'Команда'} 
            <span className="text-slate-300">/</span> 
            <span className="text-slate-700">Завдання місії</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Завдання місії
            {missions.length > 0 && (
              <div className="relative inline-block ml-2 z-40">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-lg font-bold bg-white border-2 border-slate-200 text-slate-700 rounded-xl pl-4 pr-3 py-1.5 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 cursor-pointer hover:border-slate-300 transition-all shadow-sm"
                >
                  <span className="truncate max-w-[250px] md:max-w-[350px]">
                    {missions.find(m => m._id === selectedMission)?.name || missions.find(m => m._id === selectedMission)?.title}
                  </span>
                  <svg className={cn("fill-current h-4 w-4 text-slate-400 transition-transform", isDropdownOpen && "rotate-180")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-[350px] bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden py-2 z-50 max-h-80 overflow-y-auto"
                      >
                        {missions.map(m => (
                          <button
                            key={m._id}
                            onClick={() => {
                              setSelectedMission(m._id)
                              setIsDropdownOpen(false)
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2.5 text-sm font-bold transition-colors hover:bg-orange-50/80",
                              selectedMission === m._id ? "text-orange-600 bg-orange-50/50" : "text-slate-700"
                            )}
                          >
                            {m.name || m.title}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Координуйте процеси та відстежуйте прогрес. Загалом {Object.values(board).flat().length} активних завдань.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {isCoordinatorOrAdmin && (
            <>
              <button 
                onClick={generateDemoTasks}
                className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors"
              >
                Згенерувати тестові
              </button>
              <button 
                onClick={() => setShowCreate(true)}
                className="px-5 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Нове завдання
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Фільтр за локацією (напр. Мукачево)..."
            className="w-full sm:w-80 h-10 bg-white border border-slate-200 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500 font-medium">Завантаження...</p>
      ) : missions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Немає доступних місій</h2>
            <p className="text-slate-500 mb-6">
              Ви ще не приєдналися до жодної місії. Перейдіть до списку місій та оберіть ту, де потрібна ваша допомога.
            </p>
            <Link 
              to="/app/missions"
              className="px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center gap-2"
            >
              Перейти до місій
            </Link>
          </div>
        </div>
      ) : !hasAnyTasks ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">У вас ще немає завдань</h2>
            <p className="text-slate-500 mb-6">
              Завдання допомагають координувати вашу команду.
            </p>
            {isCoordinatorOrAdmin && (
              <button 
                onClick={() => setShowCreate(true)}
                className="px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Створити перше завдання
              </button>
            )}
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-4 flex-1">
            {COLUMNS.map((col) => (
              <div key={col.id} onClick={(e) => {
                const target = e.target as HTMLElement;
                const card = target.closest('[data-task-id]');
                if (card) setSelectedTaskId(card.getAttribute('data-task-id'));
              }}>
                <KanbanColumn 
                  column={col} 
                  tasks={filteredBoard[col.id]} 
                  isCoordinatorOrAdmin={isCoordinatorOrAdmin}
                />
              </div>
            ))}
          </div>

          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} overlay />}
          </DragOverlay>
        </DndContext>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showCreate && (
          <CreateTaskModal
            onClose={() => setShowCreate(false)}
            onCreated={handleTaskCreated}
            missionId={selectedMission}
          />
        )}
        {selectedTaskId && (
          <TaskDetailModal
            taskId={selectedTaskId}
            onClose={() => setSelectedTaskId(null)}
            onUpdate={handleTaskUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
