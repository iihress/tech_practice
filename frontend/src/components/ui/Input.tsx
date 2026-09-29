import React from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[11px] uppercase tracking-wide text-slate-500 font-bold">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm text-slate-800 placeholder:text-slate-400',
              'focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 shadow-sm',
              'transition-all duration-200',
              icon && 'pl-11',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className,
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs font-medium text-red-500">{error}</p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'
