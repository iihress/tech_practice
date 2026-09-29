import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
  delay?: number
  onClick?: () => void
  hover?: boolean
}

export function Card({ children, className, animate = true, delay = 0, onClick, hover = false }: CardProps) {
  const content = (
    <div
      className={cn(
        'bg-zinc-900 border border-zinc-800 rounded-xl p-5',
        hover && 'card-hover cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )

  if (!animate) return content

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      className={cn(
        'bg-zinc-900 border border-zinc-800 rounded-xl p-5',
        hover && 'card-hover cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-sm font-semibold text-zinc-100 tracking-tight', className)}>
      {children}
    </h3>
  )
}
