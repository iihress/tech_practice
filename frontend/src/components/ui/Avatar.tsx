import { cn, getInitials } from '../../lib/utils'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-7 w-7 text-[11px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
}

const colors = [
  'bg-violet-600',
  'bg-blue-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-cyan-600',
  'bg-indigo-600',
]

function getColorFromName(name: string) {
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name)
  const color = getColorFromName(name)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover ring-1 ring-zinc-700', sizeClasses[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white ring-1 ring-zinc-700 flex-shrink-0',
        color,
        sizeClasses[size],
        className,
      )}
    >
      {initials}
    </div>
  )
}
