import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, Sparkles, Map, HeartHandshake, ChevronDown, Rocket, Shield, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  {
    title: 'Крок 1: Зареєструйся',
    desc: 'Заповніть базову інформацію про себе за пару хвилин. Жодного попереднього досвіду не потрібно! Ваш профіль стане вашим резюме добрих справ.',
    icon: UserPlus,
  },
  {
    title: 'Крок 2: Обери напрямок',
    desc: 'Вкажіть, що вам ближче: працювати руками (сортування, плетіння сіток), допомагати онлайн (SMM, дизайн, IT), чи з авто (перевезення).',
    icon: Sparkles,
  },
  {
    title: 'Крок 3: Пройди короткий інструктаж',
    desc: 'Перш ніж приступити, ознайомтеся з базовими правилами безпеки та роботи обраного фонду. Це займає до 10 хвилин і гарантує ефективність.',
    icon: Map,
  },
  {
    title: 'Крок 4: Виконай першу місію',
    desc: 'Приєднуйтесь до команди, виконуйте завдання з Kanban-дошки, спілкуйтесь з однодумцями та змінюйте світ на краще прямо зараз.',
    icon: HeartHandshake,
  },
]

const faqs = [
  {
    q: 'Що робити, якщо я маю лише 1-2 години на тиждень?',
    a: 'Цього більш ніж достатньо! На платформі є багато мікро-завдань: наприклад, написати пост для соцмереж фонду, зробити кілька телефонних дзвінків, або допомогти віддалено з перекладом.',
  },
  {
    q: 'Чи потрібен мені попередній досвід волонтерства?',
    a: 'Абсолютно ні. Більшість наших місій розраховані на людей без досвіду. Координатори на місці (або онлайн) завжди допоможуть, проведуть інструктаж та навчать усьому необхідному.',
  },
  {
    q: 'Як я дізнаюсь, що моя допомога дійсно приносить користь?',
    a: 'Кожна місія на VolunteerHub має прозору систему звітності. Ви завжди бачитимете статус виконання завдань, фотографії з результатами збору чи проекту, та отримуватимете фідбек від координаторів.',
  },
  {
    q: 'Чи безпечно брати участь у місіях?',
    a: 'Безпека волонтерів — наш пріоритет. Всі організації та фонди, що створюють місії на платформі, проходять сувору верифікацію нашою командою.',
  },
  {
    q: 'Я не маю грошей на благодійність. Чи можу я бути корисним?',
    a: 'Так! Ваш час та навички часто набагато цінніші за гроші. Власне, платформа створена саме для координації "рук" та "мізків", а не просто для збору коштів.',
  }
]

export function HowToVolunteerPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]"
            >
              Почніть свій шлях <span className="text-orange-500">сьогодні</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 font-medium max-w-xl leading-relaxed"
            >
              Люди часто бояться невідомості. Але допомагати — це просто. Ми розбили весь процес на 4 зрозумілі кроки. Від вашої першої доброї справи вас відділяє лише реєстрація.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-6"
            >
              <Link to="/app/missions" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm text-lg inline-flex items-center gap-3">
                <Rocket className="w-5 h-5" />
                Знайти місію
              </Link>
            </motion.div>
          </div>
          <div className="flex-1 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-orange-900/10 border-4 border-white bg-slate-100"
            >
              <img 
                src="/images/hero_volunteers_1791031470501.png" 
                alt="Група волонтерів" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Простий алгоритм дій
          </h2>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            Жодних складних процедур чи бюрократії.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative group hover:border-orange-500/50 transition-colors"
            >
              <div className="absolute -top-4 -right-4 text-9xl font-black text-slate-50 opacity-50 group-hover:text-orange-50 transition-colors select-none">
                {i + 1}
              </div>
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 relative z-10">
                <step.icon className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">{step.title}</h3>
              <p className="text-slate-600 font-medium leading-relaxed relative z-10">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-5 p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Верифіковані організації</h4>
                <p className="text-slate-600 font-medium">Ми ретельно перевіряємо всі фонди. Ви можете бути впевнені, що ваша праця принесе реальну користь.</p>
              </div>
            </div>
            <div className="flex items-start gap-5 p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Гнучкий графік</h4>
                <p className="text-slate-600 font-medium">Допомагайте тоді, коли маєте час. Від 1 години на тиждень до повноцінних місій на вихідних.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Популярні запитання</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
            >
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-bold text-slate-900 text-lg pr-8">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-4 mt-2">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
