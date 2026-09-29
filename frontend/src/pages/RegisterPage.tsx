import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Heart, User, Eye, EyeOff, ArrowLeft, Briefcase } from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2, 'Мінімум 2 символи'),
  email: z.string().email('Невірний email'),
  password: z.string().min(6, 'Мінімум 6 символів'),
  confirmPassword: z.string(),
  role: z.enum(['VOLUNTEER', 'COORDINATOR', 'ADMIN']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Паролі не співпадають',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export function RegisterPage() {
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ 
    resolver: zodResolver(schema),
    defaultValues: { role: 'VOLUNTEER' }
  })

  const onSubmit = async (data: FormData) => {
    try {
      setError('')
      const res = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      })
      setAuth(res.data.user, res.data.access_token)
      toast.success(`Реєстрація успішна (Роль: ${data.role})`)
      navigate('/app/dashboard')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e?.response?.data?.message ?? 'Помилка реєстрації')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 relative flex items-center justify-center px-4 py-12 font-sans text-slate-800 overflow-hidden">
      {/* Organic Background Shapes */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-3xl translate-y-1/3 translate-x-1/3 pointer-events-none" />

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
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Створити акаунт</h2>
            <p className="text-base text-slate-500 mt-2 font-medium">Стань частиною спільноти волонтерів</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Ім'я та Прізвище"
              type="text"
              placeholder="Олексій Шевченко"
              icon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              {...register('name')}
            />
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
            <Input
              label="Підтвердити пароль"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-slate-700">Оберіть роль (для тестування)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                </div>
                <select
                  {...register('role')}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="VOLUNTEER">Волонтер</option>
                  <option value="COORDINATOR">Координатор</option>
                  <option value="ADMIN">Адміністратор</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
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
              Зареєструватись
            </Button>
          </form>

          <p className="text-center text-sm font-medium text-slate-500 mt-8">
            Вже маєш акаунт?{' '}
            <Link
              to="/login"
              className="text-orange-600 hover:text-orange-700 transition-colors font-bold"
            >
              Увійти
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
