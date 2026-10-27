import { useCallback, useEffect, useState } from 'react'
import { BellRing, CalendarDays, ChevronRight, Droplets, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import Alert from '../components/common/Alert'
import LoadingScreen from '../components/common/LoadingScreen'
import WeeklyChart from '../components/charts/WeeklyChart'
import ProgressRing from '../components/dashboard/ProgressRing'
import QuickAdd from '../components/dashboard/QuickAdd'
import IntakeList from '../components/water/IntakeList'
import IntakeModal from '../components/water/IntakeModal'
import { useAuth } from '../contexts/AuthContext'
import { errorMessage } from '../services/api'
import { waterService } from '../services/waterService'
import { formatVolume, longDate } from '../utils/format'

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [modal, setModal] = useState({ open: false, preset: null, intake: null })

  const load = useCallback(async () => {
    try { setData(await waterService.dashboard()); setError('') }
    catch (err) { setError(errorMessage(err, 'Could not load today’s hydration.')) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    const now = new Date()
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const timer = setTimeout(load, tomorrow - now + 1000)
    return () => clearTimeout(timer)
  }, [load, data?.date])

  const saved = (_entry, message) => { setNotice(message); load() }
  const edit = (intake) => setModal({ open: true, intake, preset: null })

  if (loading) return <LoadingScreen />

  return (
    <div className="mx-auto max-w-[1440px] p-4 sm:p-7 xl:p-9">
      <header className="mb-7 flex items-start justify-between gap-4">
        <div><p className="mb-1 text-sm font-bold text-sky-brand">{longDate(data?.date)}</p><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Good day, {user.name.split(' ')[0]} <span aria-hidden="true">👋</span></h1><p className="mt-2 text-sm text-slate-500">Here’s your hydration flow so far.</p></div>
        <Link to="/settings" className="hidden items-center gap-2 rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm font-bold text-ink-700 shadow-sm hover:border-sky-300 sm:flex"><BellRing size={18} className="text-sky-brand" /> Reminders</Link>
      </header>

      <div className="mb-5 space-y-3">{error && <Alert>{error}</Alert>}{notice && <Alert type="success" onClose={() => setNotice('')}>{notice}</Alert>}</div>

      {data && <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <section className="card relative overflow-hidden p-6 sm:p-8">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-bl-full bg-sky-pale/70" />
          <div className="relative grid items-center gap-7 md:grid-cols-[minmax(250px,.85fr)_1.15fr]">
            <ProgressRing total={data.total_ml} goal={data.goal_ml} percent={data.progress_percent} />
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-sky-brand">Today’s progress</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Every sip counts.</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">You have <strong className="text-ink-950">{formatVolume(data.remaining_ml)}</strong> remaining to reach the personal goal you set for today.</p>
              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-3xl bg-sky-pale p-4"><Target className="mb-3 text-sky-brand" size={21} /><p className="text-xs font-bold text-slate-500">Daily goal</p><p className="mt-1 text-xl font-black">{formatVolume(data.goal_ml)}</p></div>
                <div className="rounded-3xl bg-[#f1fbf8] p-4"><Droplets className="mb-3 text-emerald-500" size={21} /><p className="text-xs font-bold text-slate-500">Consumed</p><p className="mt-1 text-xl font-black">{formatVolume(data.total_ml)}</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="card p-6 sm:p-7"><QuickAdd onAdd={(preset) => setModal({ open: true, preset, intake: null })} /></section>

        <section className="card p-6 sm:p-7">
          <div className="mb-3 flex items-center justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-sky-brand">7-day view</p><h2 className="mt-1 text-xl font-black">Hydration rhythm</h2></div><CalendarDays className="text-slate-300" /></div>
          <WeeklyChart data={data.weekly} />
        </section>

        <section className="card p-6 sm:p-7">
          <div className="mb-2 flex items-center justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-sky-brand">Today</p><h2 className="mt-1 text-xl font-black">Recent drinks</h2></div><Link to="/history" className="flex items-center text-xs font-extrabold text-sky-deep">View history <ChevronRight size={16} /></Link></div>
          <IntakeList items={data.recent_intakes} onEdit={edit} compact />
        </section>
      </div>}

      <IntakeModal {...modal} onClose={() => setModal({ open: false, preset: null, intake: null })} onSaved={saved} />
    </div>
  )
}
