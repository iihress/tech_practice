import { Outlet } from 'react-router-dom'
import { PublicHeader } from './PublicHeader'

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500/20">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
