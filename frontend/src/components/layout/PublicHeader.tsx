import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export function PublicHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        
        {/* Left - Logo */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-500 flex items-center justify-center rounded-xl shadow-sm">
              <Heart className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">VolunteerHub</span>
          </Link>
        </div>

        {/* Center - Navigation (Absolute Centered) */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
          <Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Про нас</Link>
          <Link to="/how-to-volunteer" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Як стати волонтером</Link>
          <Link to="/stories" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Історії успіху</Link>
        </nav>

        {/* Right - Auth Actions */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
            Увійти
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
          >
            Приєднатися
          </Link>
        </div>
        
      </div>
    </header>
  )
}
