import { motion } from 'framer-motion'
import { Target, Shield, Users, HeartHandshake, CheckCircle2, ChevronRight, Rocket, Code, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AboutPage() {
  return (
    <div className="bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-20 lg:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm"
          >
            <Heart className="w-8 h-8 text-orange-500" strokeWidth={2.5} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-8"
          >
            Ми робимо волонтерство <br className="hidden md:block" />
            <span className="text-orange-500">прозорим і ефективним</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto"
          >
            Технологічна платформа, що об'єднує тих, хто хоче допомагати, з тими, хто потребує допомоги. Ми віримо, що за кожною великою справою стоять звичайні небайдужі люди, озброєні правильними інструментами.
          </motion.p>
        </div>
      </section>

      {/* History & Context */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-b border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">Як усе починалось</h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-6">
              VolunteerHub створений командою українських розробників, волонтерів та громадських діячів. З перших днів повномасштабного вторгнення ми на власному досвіді зіткнулися з хаосом у координації благодійних ініціатив: сотні чатів у Telegram, загублені таблиці Excel, вигорання координаторів.
            </p>
            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8">
              Ми зрозуміли, що енергію людей потрібно направляти в правильне русло, а не витрачати на бюрократію. Так виникла ідея створити єдину екосистему, яка б автоматизувала рутину, забезпечила прозорість зборів та зробила допомогу системною. Сьогодні ми пишаємося тим, що наша платформа допомагає рятувати життя та відновлювати країну.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-orange-500" />
                <span className="text-slate-800 font-bold text-lg">Засновано у 2023 році в Києві</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-orange-500" />
                <span className="text-slate-800 font-bold text-lg">Понад 10,000 активних користувачів</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-orange-500" />
                <span className="text-slate-800 font-bold text-lg">Офіційне партнерство з 50+ фондами</span>
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 rounded-3xl translate-x-4 translate-y-4 -z-10 opacity-20 blur-sm" />
            <img 
              src="/images/hero_volunteers_1791031470501.png" 
              alt="Команда засновників" 
              className="w-full h-auto object-cover rounded-3xl shadow-xl border border-slate-200"
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-900 text-white py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Наші фундаментальні цінності</h2>
            <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto">Це принципи, на яких будується кожен рядок коду нашої платформи та кожне рішення команди.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-orange-500/50 transition-colors">
              <Shield className="w-10 h-10 text-orange-500 mb-6" />
              <h3 className="text-xl font-bold mb-3">Безпека та Верифікація</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Ми ретельно перевіряємо кожну організацію перед тим, як надати їй доступ до створення публічних зборів. Довіра — наш головний капітал.</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-orange-500/50 transition-colors">
              <Target className="w-10 h-10 text-orange-500 mb-6" />
              <h3 className="text-xl font-bold mb-3">Швидкість реагування</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Коли йдеться про евакуацію чи термінові збори, кожна хвилина має значення. Наш Kanban-інтерфейс дозволяє розподіляти задачі миттєво.</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-orange-500/50 transition-colors">
              <Users className="w-10 h-10 text-orange-500 mb-6" />
              <h3 className="text-xl font-bold mb-3">Сила Спільноти</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Один волонтер може багато, але організована команда здатна на неможливе. Ми створюємо інструменти для горизонтальних зв'язків.</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-orange-500/50 transition-colors">
              <HeartHandshake className="w-10 h-10 text-orange-500 mb-6" />
              <h3 className="text-xl font-bold mb-3">Прозорість процесів</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Кожен внесок і кожна витрачена гривня фіксуються. Ми надаємо зручні інструменти для автоматичної звітності перед донорами.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Команда розробників</h2>
          <p className="text-slate-600 font-medium text-lg max-w-2xl mx-auto">Люди, які щодня покращують платформу.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[
            { name: 'Олександр Коваленко', role: 'Founder & CEO', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop' },
            { name: 'Марія Сидоренко', role: 'Head of Product', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop' },
            { name: 'Дмитро Василенко', role: 'Lead Engineer', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop' },
            { name: 'Анна Мельник', role: 'Community Manager', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop' },
          ].map((member, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden shadow-sm ring-4 ring-slate-50">
                <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{member.name}</h3>
              <p className="text-sm text-orange-600 font-bold mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-50 border-t border-orange-100 py-20 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Бажаєте стати частиною нашої історії?</h2>
        <p className="text-lg text-slate-600 font-medium mb-8 max-w-2xl mx-auto">
          Платформа постійно розвивається. Якщо ви розробник, дизайнер або просто хочете допомагати на місцях — приєднуйтесь до нас.
        </p>
        <Link 
          to="/how-to-volunteer"
          onClick={() => window.scrollTo(0, 0)}
          className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white text-lg font-bold rounded-xl shadow-sm hover:bg-orange-600 transition-colors"
        >
          Як долучитись <ChevronRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  )
}
