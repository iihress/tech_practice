import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Heart, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email('Невірний email'),
  password: z.string().min(6, 'Мінімум 6 символів'),
})

type FormData = z.infer<typeof schema>

export function LoginPage() {
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      setError('')
      const res = await api.post('/auth/login', data)
      setAuth(res.data.user, res.data.access_token)
      toast.success('Ви успішно увійшли')
      navigate('/app/dashboard')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e?.response?.data?.message ?? 'Помилка авторизації')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 relative flex items-center justify-center px-4 font-sans text-slate-800 overflow-hidden">
      {/* Organic Background Shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors z-20">
        <ArrowLeft className="w-4 h-4" />
        На головну
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md z-10"
      >
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Heart className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">З поверненням 👋</h2>
            <p className="text-base text-slate-500 mt-2 font-medium">Раді бачити тебе знову!</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Пароль"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-10 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full mt-4"
            >
              Увійти в акаунт
            </Button>
          </form>

          <p className="text-center text-sm font-medium text-slate-500 mt-8">
            Ще не з нами?{' '}
            <Link
              to="/register"
              className="text-orange-600 hover:text-orange-700 transition-colors font-bold"
            >
              Долучайся до команди
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
