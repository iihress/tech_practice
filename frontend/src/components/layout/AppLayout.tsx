import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
