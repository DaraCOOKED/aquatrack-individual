import { BarChart3, Droplets, LogOut, Settings } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useReminderScheduler } from '../../hooks/useReminderScheduler'

const nav = [
  { to: '/', label: 'Today', icon: Droplets },
  { to: '/history', label: 'History', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const NavItem = ({ item, mobile = false }) => {
  const Icon = item.icon
  return <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => `${mobile ? 'flex flex-1 flex-col items-center gap-1 py-2 text-[11px]' : 'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm'} font-bold transition ${isActive ? 'bg-sky-brand text-white shadow-lg shadow-sky-200' : 'text-ink-700 hover:bg-sky-pale hover:text-sky-deep'}`}><Icon size={mobile ? 21 : 19} />{item.label}</NavLink>
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  useReminderScheduler(user?.settings)

  return (
    <div className="min-h-screen bg-[#f3f9ff] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-sky-100 bg-white px-5 py-7 lg:flex">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="rounded-2xl bg-sky-brand p-2.5 text-white"><Droplets size={25} /></div>
          <div><div className="text-lg font-black tracking-tight">AquaTrack</div><div className="text-[11px] font-semibold text-slate-400">YOUR DAILY FLOW</div></div>
        </div>
        <nav className="space-y-2">{nav.map((item) => <NavItem key={item.to} item={item} />)}</nav>
        <div className="mt-auto rounded-3xl bg-sky-pale p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-sky-brand font-black text-white">{user?.name?.[0]?.toUpperCase()}</div>
            <div className="min-w-0"><p className="truncate text-sm font-bold">{user?.name}</p><p className="truncate text-xs text-slate-500">{user?.email}</p></div>
          </div>
          <button onClick={logout} className="flex w-full items-center gap-2 text-xs font-bold text-slate-500 hover:text-rose-600"><LogOut size={15} /> Sign out</button>
        </div>
      </aside>

      <main className="min-w-0 pb-24 lg:col-start-2 lg:pb-8"><Outlet /></main>

      <nav className="fixed inset-x-3 bottom-3 z-40 flex rounded-[1.4rem] border border-white bg-white/95 p-1.5 shadow-2xl backdrop-blur lg:hidden">
        {nav.map((item) => <NavItem key={item.to} item={item} mobile />)}
      </nav>
    </div>
  )
}
