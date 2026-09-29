import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Shield, Save, Camera } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { toast } from 'sonner'
import { Input } from '../components/ui/Input'

export function ProfileSettingsPage() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // mock API call
    setTimeout(() => {
      setLoading(false)
      toast.success('Налаштування профілю збережено')
    }, 1000)
  }

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto font-sans text-slate-800 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Налаштування профілю</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Керуйте своїми особистими даними та налаштуваннями.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSave}>
          <div className="p-6 md:p-8 space-y-8">
            {/* Avatar section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                <button type="button" className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-slate-200 shadow-sm text-slate-600 hover:text-orange-500 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Фото профілю</h3>
                <p className="text-sm text-slate-500">Завантажте фото розміром до 2MB (JPG або PNG).</p>
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Повне ім'я
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 bg-slate-50 border-slate-200" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Email адреса
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-slate-50 border-slate-200" 
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Про себе (Біографія)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                placeholder="Розкажіть трохи про свій волонтерський досвід..."
              />
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button type="button" className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors">
              Скасувати
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Збереження...' : 'Зберегти зміни'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
