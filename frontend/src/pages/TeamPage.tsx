import { TeamSettingsPanel } from '../components/team/TeamSettingsPanel'

export function TeamPage() {
  return (
    <div className="p-6 md:p-12 space-y-6 max-w-4xl mx-auto font-sans text-slate-800">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Команда
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Управління вашою командою волонтерів.
        </p>
      </div>

      <TeamSettingsPanel />
    </div>
  )
}
