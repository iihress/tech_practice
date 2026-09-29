import { motion } from 'framer-motion'
import { ArrowRight, Clock, MapPin, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

const stories = [
  {
    id: 1,
    title: 'Як команда з 5 людей зібрала фуру за 2 дні завдяки координації тут',
    excerpt: 'Хаос у чатах часто призводить до втрати фокусу. Коли Київський штаб почав використовувати Kanban-дошку, ефективність зросла втричі. У цій статті координатор ділиться секретами оптимізації волонтерських процесів.',
    date: '10 Жовтня 2023',
    location: 'Київ',
    img: '/images/van_loading_1791031424679.png',
    featured: true
  },
  {
    id: 2,
    title: 'Плетіння сіток більше не проблема: як залучили 200 нових рук',
    excerpt: 'Волонтерський хаб в Ужгороді шукав людей, але пости у Facebook не працювали. Через VolunteerHub вдалося закрити потребу за 4 години.',
    date: '5 Жовтня 2023',
    location: 'Ужгород',
    img: '/images/camo_nets_1791031436286.png',
  },
  {
    id: 3,
    title: 'Евакуація 50 тварин з-під обстрілів: історія порятунку',
    excerpt: 'Завдяки швидкому реагуванню та розподілу завдань, волонтерам вдалося знайти транспорт, водіїв та тимчасові домівки для тварин.',
    date: '1 Вересня 2023',
    location: 'Харків',
    img: '/images/animal_rescue_1791031446464.png',
  },
  {
    id: 4,
    title: 'Відновлення лісів: 5000 дерев за одні вихідні',
    excerpt: 'Еко-ініціатива зібрала рекордну кількість небайдужих. Як правильно організувати логістику та інструктаж для великого натовпу.',
    date: '20 Серпня 2023',
    location: 'Львівська область',
    img: '/images/tree_planting_1791031459206.png',
  }
]

export function StoriesPage() {
  const featuredStory = stories.find(s => s.featured)
  const regularStories = stories.filter(s => !s.featured)

  return (
    <div className="bg-slate-50 font-sans text-slate-900 pb-20">
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6"
          >
            Блог та <span className="text-orange-500">Історії успіху</span>
          </motion.h1>
          <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Реальний досвід волонтерів, інсайти від координаторів фондів та новини нашої платформи. Надихайтеся тими, хто вже змінює світ.
          </p>
        </div>
      </section>

      {/* Featured Story */}
      {featuredStory && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => toast.info('Стаття скоро буде доступна!')}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row group cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="lg:w-3/5 aspect-video lg:aspect-auto relative overflow-hidden bg-slate-100">
              <img 
                src={featuredStory.img} 
                alt={featuredStory.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="lg:w-2/5 p-10 lg:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-sm font-bold text-slate-500 mb-4">
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full uppercase tracking-wider text-xs">Головне</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {featuredStory.date}</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6 leading-[1.2] group-hover:text-orange-600 transition-colors">
                {featuredStory.title}
              </h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8">
                {featuredStory.excerpt}
              </p>
              <div className="mt-auto flex items-center text-orange-600 text-lg font-bold group-hover:text-orange-700 transition-colors">
                Читати повністю <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Grid Stories */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <h3 className="text-2xl font-extrabold text-slate-900 mb-8 border-b border-slate-200 pb-4">Більше історій</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularStories.map((story) => (
            <motion.article 
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => toast.info('Стаття скоро буде доступна!')}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-orange-500/50 transition-colors cursor-pointer group"
            >
              <div className="aspect-video bg-slate-100 overflow-hidden shrink-0 relative">
                <img 
                  src={story.img} 
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-4">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {story.date}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {story.location}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 leading-snug group-hover:text-orange-600 transition-colors">
                  {story.title}
                </h2>
                <p className="text-slate-600 font-medium text-base leading-relaxed mb-8">
                  {story.excerpt}
                </p>
                <div className="mt-auto flex items-center text-orange-600 text-sm font-bold group-hover:text-orange-700 transition-colors">
                  Читати повністю <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-4xl mx-auto px-6 py-20 mt-10">
        <div className="bg-slate-900 rounded-3xl p-10 lg:p-16 text-center shadow-xl shadow-slate-900/10">
          <Mail className="w-12 h-12 text-orange-500 mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-white mb-4">Не пропускайте важливе</h2>
          <p className="text-slate-400 font-medium text-lg mb-8 max-w-xl mx-auto">
            Підпишіться на наш дайджест, щоб раз на тиждень отримувати найцікавіші історії волонтерів та корисні поради.
          </p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-3" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Ваш email" 
              className="flex-1 h-12 bg-slate-800 border border-slate-700 rounded-xl px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
            <button className="h-12 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors">
              Підписатись
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
