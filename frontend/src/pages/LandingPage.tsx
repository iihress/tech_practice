import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, CheckCircle2, KanbanSquare, ShieldCheck, Users, Target, ArrowRight, Zap, Globe } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500/20">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900"
          >
            Допомагаємо організаціям <br className="hidden lg:block" />
            <span className="text-orange-500">керувати волонтерами</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg lg:text-xl text-slate-600 font-medium max-w-2xl leading-relaxed"
          >
            Зручна та ефективна платформа для координації місій, відстеження прогресу та об'єднання людей заради реальних змін.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 pt-4"
          >
            <Link
              to="/register"
              className="px-8 py-4 bg-orange-500 text-white text-base font-bold rounded shadow-sm hover:bg-orange-600 transition-colors"
            >
              Почати роботу
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-slate-900 border border-slate-200 text-base font-bold rounded shadow-sm hover:bg-slate-50 transition-colors"
            >
              Увійти
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 w-full relative"
        >
          <div className="relative rounded bg-slate-100 border border-slate-200 shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop" 
              alt="Волонтери садять дерева" 
              className="w-full h-auto object-cover aspect-[4/3] rounded"
            />
            
            {/* UI Widget Overlay */}
            <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:-bottom-6 sm:w-72 bg-white border border-slate-200 shadow-md rounded p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded bg-orange-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-none">Завдання виконано</p>
                  <p className="text-xs font-medium text-slate-500 mt-1.5">Посаджено 24 дерева</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Прогрес місії</span>
                  <span>80%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[80%]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-slate-200 bg-slate-50 mt-12 sm:mt-0">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-wrap justify-center sm:justify-between items-center gap-8">
          <div className="text-center sm:text-left flex items-center gap-4">
            <Users className="w-6 h-6 text-slate-400" />
            <div>
              <p className="text-2xl font-extrabold text-slate-900 leading-none">10,000+</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mt-1.5">Волонтерів</p>
            </div>
          </div>
          <div className="text-center sm:text-left flex items-center gap-4">
            <Target className="w-6 h-6 text-slate-400" />
            <div>
              <p className="text-2xl font-extrabold text-slate-900 leading-none">500+</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mt-1.5">Активних місій</p>
            </div>
          </div>
          <div className="text-center sm:text-left flex items-center gap-4">
            <Heart className="w-6 h-6 text-slate-400" />
            <div>
              <p className="text-2xl font-extrabold text-slate-900 leading-none">98%</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mt-1.5">Успішність</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid (Platform) */}
      <section id="platform" className="py-24 max-w-7xl mx-auto px-6 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Усе необхідне для координації</h2>
          <p className="text-lg text-slate-600 font-medium mt-4">Потужні інструменти, які дозволяють команді зосередитися на найголовнішому — на самій місії.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200 rounded p-8 hover:border-orange-500/50 transition-colors group shadow-sm">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded flex items-center justify-center mb-6 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
              <KanbanSquare className="w-6 h-6 text-slate-700 group-hover:text-orange-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Керування завданнями</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Організовуйте робочі процеси за допомогою інтуїтивних Kanban-дошок. Відстежуйте прогрес від плану до виконання.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded p-8 hover:border-orange-500/50 transition-colors group shadow-sm">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded flex items-center justify-center mb-6 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
              <Zap className="w-6 h-6 text-slate-700 group-hover:text-orange-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Координація в реальному часі</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Спілкуйтеся прямо в завданнях. Тримайте всіх у курсі завдяки миттєвим оновленням та сповіщенням.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded p-8 hover:border-orange-500/50 transition-colors group shadow-sm">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded flex items-center justify-center mb-6 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
              <ShieldCheck className="w-6 h-6 text-slate-700 group-hover:text-orange-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Перевірені місії</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Формуйте довіру у безпечному середовищі. Лише верифіковані координатори можуть створювати публічні збори та місії.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-24 bg-slate-50 border-y border-slate-200 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Рішення для будь-яких масштабів</h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                Незалежно від того, чи ви локальна ініціатива, що допомагає у своєму місті, чи велика міжнародна організація, VolunteerHub адаптується до ваших потреб. Ми надаємо гнучкі інструменти для зборів коштів, логістики та управління командами.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500" />
                  <span className="font-bold text-slate-800">Для благодійних фондів</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500" />
                  <span className="font-bold text-slate-800">Для локальних громадських організацій</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500" />
                  <span className="font-bold text-slate-800">Для кризових волонтерських штабів</span>
                </li>
              </ul>
              <div className="pt-4">
                <a href="#platform" className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors">
                  Дізнатись більше про платформу <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <img 
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1200&auto=format&fit=crop" 
                alt="Командна робота" 
                className="w-full h-auto object-cover rounded shadow-sm border border-slate-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-6 scroll-mt-16 text-center">
        <Globe className="w-12 h-12 text-orange-500 mx-auto mb-6" />
        <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">Наша мета — об'єднувати світ</h2>
        <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed mb-10">
          Платформу створено з глибоким розумінням того, що волонтери — це серце будь-яких позитивних змін у суспільстві. Ми прагнемо зняти операційне навантаження з координаторів, щоб вони могли приділяти більше часу людям та ідеям.
        </p>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-50 border-t border-slate-200 py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-6">Готові долучитися до змін?</h2>
          <p className="text-lg text-slate-600 font-medium mb-10">
            Приєднуйтеся до тисяч волонтерів та організацій, які вже використовують VolunteerHub.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-10 py-4 bg-slate-900 text-white text-lg font-bold rounded shadow-sm hover:bg-slate-800 transition-colors"
          >
            Створити акаунт
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-orange-500" strokeWidth={3} />
            <span className="text-sm font-bold text-slate-900">VolunteerHub © 2026</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Політика конфіденційності</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Умови використання</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Контакти</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
