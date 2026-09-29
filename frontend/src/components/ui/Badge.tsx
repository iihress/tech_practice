import { cn } from '../../lib/utils'
import type { TaskPriority, TaskStatus, UserRole } from '../../types'

type BadgeVariant = 'priority' | 'status' | 'role' | 'custom'

interface BadgeProps {
  variant?: BadgeVariant
  value: TaskPriority | TaskStatus | UserRole | string
  className?: string
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  LOW: { label: 'Низький', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  MEDIUM: { label: 'Середній', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  HIGH: { label: 'Високий', className: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  URGENT: { label: 'Терміново', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  TODO: { label: 'До виконання', className: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
  IN_PROGRESS: { label: 'В процесі', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  REVIEW: { label: 'Перевірка', className: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  DONE: { label: 'Виконано', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
}

const roleConfig: Record<UserRole, { label: string; className: string }> = {
  ADMIN: { label: 'Адмін', className: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  COORDINATOR: { label: 'Координатор', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  VOLUNTEER: { label: 'Волонтер', className: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
}

export function Badge({ variant = 'custom', value, className }: BadgeProps) {
  let label = value
  let colorClass = 'bg-zinc-800 text-zinc-400 border-zinc-700'

  if (variant === 'priority' && value in priorityConfig) {
    const config = priorityConfig[value as TaskPriority]
    label = config.label
    colorClass = config.className
  } else if (variant === 'status' && value in statusConfig) {
    const config = statusConfig[value as TaskStatus]
    label = config.label
    colorClass = config.className
  } else if (variant === 'role' && value in roleConfig) {
    const config = roleConfig[value as UserRole]
    label = config.label
    colorClass = config.className
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider border',
        colorClass,
        className,
      )}
    >
      {label}
    </span>
  )
}
