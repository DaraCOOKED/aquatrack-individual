import { useCallback, useEffect, useMemo, useState } from 'react'
import { CalendarRange, ChevronLeft, ChevronRight, Droplets, Trash2, TrendingUp } from 'lucide-react'
import Alert from '../components/common/Alert'
import LoadingScreen from '../components/common/LoadingScreen'
import Modal from '../components/common/Modal'
import WeeklyChart from '../components/charts/WeeklyChart'
import IntakeList from '../components/water/IntakeList'
import IntakeModal from '../components/water/IntakeModal'
import { errorMessage } from '../services/api'
import { waterService } from '../services/waterService'
import { apiDate, formatVolume, longDate } from '../utils/format'

export default function HistoryPage() {
  const [date, setDate] = useState(() => new Date())
  const [entries, setEntries] = useState([])
  const [weekly, setWeekly] = useState(null)
  const [monthly, setMonthly] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)
  const selected = apiDate(date)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [list, week, month] = await Promise.all([
        waterService.list({ date: selected, per_page: 50 }),
        waterService.weekly(selected),
        waterService.monthly(selected.slice(0, 7)),
      ])
      setEntries(list.data); setWeekly(week); setMonthly(month); setError('')
    } catch (err) { setError(errorMessage(err, 'Could not load hydration history.')) }
    finally { setLoading(false) }
  }, [selected])

  useEffect(() => { load() }, [load])
  const dailyTotal = useMemo(() => entries.reduce((sum, item) => sum + item.amount_ml, 0), [entries])
  const move = (days) => setDate((current) => new Date(current.getFullYear(), current.getMonth(), current.getDate() + days))
  const isToday = selected >= apiDate(new Date())

  const remove = async () => {
    setBusy(true)
    try { await waterService.remove(deleting.id); setNotice('Water entry deleted.'); setDeleting(null); await load() }
    catch (err) { setError(errorMessage(err, 'Could not delete this entry.')); setDeleting(null) }
    finally { setBusy(false) }
  }

  return (
    <div className="mx-auto max-w-[1300px] p-4 sm:p-7 xl:p-9">
      <header className="mb-7"><p className="mb-1 text-sm font-bold text-sky-brand">Your hydration record</p><h1 className="text-3xl font-black tracking-tight sm:text-4xl">History & insights</h1><p className="mt-2 text-sm text-slate-500">Real totals, calculated from each drink you recorded.</p></header>
      <div className="mb-5 space-y-3">{error && <Alert>{error}</Alert>}{notice && <Alert type="success" onClose={() => setNotice('')}>{notice}</Alert>}</div>

      <section className="card mb-5 flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
        <button onClick={() => move(-1)} className="btn-secondary !p-3" aria-label="Previous day"><ChevronLeft /></button>
        <div className="text-center"><p className="text-lg font-black">{longDate(selected)}</p><p className="text-xs font-bold text-slate-400">{selected}</p></div>
        <button onClick={() => move(1)} disabled={isToday} className="btn-secondary !p-3" aria-label="Next day"><ChevronRight /></button>
      </section>

      {loading ? <LoadingScreen compact /> : <>
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat icon={Droplets} label="Selected day" value={formatVolume(dailyTotal)} tone="sky" />
          <Stat icon={CalendarRange} label="Last 7 days" value={formatVolume(weekly?.total_ml || 0)} tone="indigo" />
          <Stat icon={TrendingUp} label="This month" value={formatVolume(monthly?.total_ml || 0)} tone="emerald" />
          <Stat icon={TrendingUp} label="Daily average" value={formatVolume(monthly?.daily_average_ml || 0)} tone="amber" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
          <section className="card p-6 sm:p-7">
            <div className="mb-4"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-sky-brand">Individual records</p><h2 className="mt-1 text-xl font-black">{entries.length} {entries.length === 1 ? 'drink' : 'drinks'}</h2></div>
            <IntakeList items={entries} onEdit={setEditing} onDelete={setDeleting} />
          </section>
          <section className="card p-6 sm:p-7">
            <div className="mb-2"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-sky-brand">Recent days</p><h2 className="mt-1 text-xl font-black">Weekly pattern</h2></div>
            <WeeklyChart data={weekly?.days || []} height={310} />
          </section>
        </div>
      </>}

      <IntakeModal open={Boolean(editing)} intake={editing} onClose={() => setEditing(null)} onSaved={async (_item, message) => { setNotice(message); await load() }} />
      <Modal open={Boolean(deleting)} title="Delete this drink?" onClose={() => !busy && setDeleting(null)}>
        <p className="leading-7 text-slate-600">This will permanently remove the <strong>{deleting?.amount_ml} mL</strong> entry. Your totals and chart will be recalculated.</p>
        <div className="mt-7 grid grid-cols-2 gap-3"><button className="btn-secondary" onClick={() => setDeleting(null)} disabled={busy}>Keep it</button><button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 font-bold text-white disabled:opacity-60" onClick={remove} disabled={busy}><Trash2 size={18} />{busy ? 'Deleting…' : 'Delete'}</button></div>
      </Modal>
    </div>
  )
}

function Stat({ icon: Icon, label, value, tone }) {
  const tones = { sky: 'bg-sky-pale text-sky-brand', indigo: 'bg-indigo-50 text-indigo-500', emerald: 'bg-emerald-50 text-emerald-500', amber: 'bg-amber-50 text-amber-500' }
  return <div className="card p-4 sm:p-5"><div className={`mb-4 grid h-10 w-10 place-items-center rounded-2xl ${tones[tone]}`}><Icon size={20} /></div><p className="text-xs font-bold text-slate-500">{label}</p><p className="mt-1 text-xl font-black sm:text-2xl">{value}</p></div>
}
