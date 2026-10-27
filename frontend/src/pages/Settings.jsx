import { useEffect, useMemo, useState } from 'react'
import { Bell, BellRing, Clock3, Goal, Info, LogOut, Save, UserRound } from 'lucide-react'
import Alert from '../components/common/Alert'
import LoadingScreen from '../components/common/LoadingScreen'
import { useAuth } from '../contexts/AuthContext'
import { errorMessage } from '../services/api'
import { waterService } from '../services/waterService'

const fallbackZones = ['Asia/Phnom_Penh', 'Asia/Bangkok', 'Asia/Singapore', 'Europe/London', 'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'UTC']

export default function SettingsPage() {
  const { refreshUser, logout } = useAuth()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [permission, setPermission] = useState(() => 'Notification' in window ? Notification.permission : 'unsupported')
  const zones = useMemo(() => typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : fallbackZones, [])

  useEffect(() => {
    waterService.getSettings().then(setForm).catch((err) => setError(errorMessage(err, 'Could not load settings.'))).finally(() => setLoading(false))
  }, [])

  const change = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const save = async (event) => {
    event.preventDefault(); setSaving(true); setError(''); setNotice('')
    try {
      const payload = { ...form, daily_goal_ml: Number(form.daily_goal_ml), reminder_interval_minutes: Number(form.reminder_interval_minutes) }
      const response = await waterService.updateSettings(payload)
      setForm(response.data); await refreshUser(); setNotice(response.message)
    } catch (err) { setError(errorMessage(err, 'Could not save settings.')) }
    finally { setSaving(false) }
  }

  const askPermission = async () => {
    if (!('Notification' in window)) return
    const result = await Notification.requestPermission()
    setPermission(result)
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-7 xl:p-9">
      <header className="mb-7"><p className="mb-1 text-sm font-bold text-sky-brand">Make it yours</p><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Settings</h1><p className="mt-2 text-sm text-slate-500">Adjust your goal and choose when AquaTrack checks in.</p></header>
      <div className="mb-5 space-y-3">{error && <Alert>{error}</Alert>}{notice && <Alert type="success" onClose={() => setNotice('')}>{notice}</Alert>}</div>

      {form && <form onSubmit={save} className="space-y-5">
        <section className="card p-6 sm:p-8">
          <SectionTitle icon={UserRound} title="Profile & daily goal" description="Your goal is personal and can be changed whenever your needs change." />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label><span className="label">Display name</span><input className="field" name="name" required maxLength="80" value={form.name} onChange={change} /></label>
            <label><span className="label">Daily goal (mL)</span><span className="relative block"><Goal className="absolute left-4 top-3.5 text-sky-brand" size={18} /><input className="field pl-11" name="daily_goal_ml" type="number" min="250" max="10000" step="50" required value={form.daily_goal_ml} onChange={change} /></span></label>
            <label className="sm:col-span-2"><span className="label">Preferred timezone</span><select className="field" name="timezone" required value={form.timezone} onChange={change}>{zones.map((zone) => <option key={zone} value={zone}>{zone.replaceAll('_', ' ')}</option>)}</select></label>
          </div>
          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-sky-pale p-4 text-xs leading-5 text-ink-700"><Info size={17} className="mt-0.5 shrink-0 text-sky-brand" />The 1,500 mL initial goal is a configurable demo starting point, not a universal medical recommendation. Choose a goal appropriate to you.</p>
        </section>

        <section className="card p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <SectionTitle icon={BellRing} title="Hydration reminders" description="Gentle browser notifications during the schedule you choose." />
            <label className="relative inline-flex shrink-0 cursor-pointer items-center"><input className="peer sr-only" type="checkbox" name="reminder_enabled" checked={form.reminder_enabled} onChange={change} /><span className="h-7 w-12 rounded-full bg-slate-200 transition peer-checked:bg-sky-brand after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" /></label>
          </div>
          <div className={`mt-6 grid gap-5 sm:grid-cols-3 ${!form.reminder_enabled ? 'pointer-events-none opacity-45' : ''}`}>
            <label><span className="label">Starts at</span><input className="field" name="reminder_start_time" type="time" required value={form.reminder_start_time} onChange={change} /></label>
            <label><span className="label">Ends at</span><input className="field" name="reminder_end_time" type="time" required value={form.reminder_end_time} onChange={change} /></label>
            <label><span className="label">Every</span><select className="field" name="reminder_interval_minutes" value={form.reminder_interval_minutes} onChange={change}>{[30, 45, 60, 90, 120, 180].map((minutes) => <option key={minutes} value={minutes}>{minutes} minutes</option>)}</select></label>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-sky-100 bg-sky-pale/60 p-4">
            <div className="flex items-center gap-3"><span className="rounded-2xl bg-white p-2.5 text-sky-brand"><Bell size={19} /></span><div><p className="text-sm font-extrabold">Browser permission: <span className="capitalize">{permission}</span></p><p className="text-xs text-slate-500">Required for on-screen notifications.</p></div></div>
            {permission === 'default' && <button className="btn-secondary !py-2.5" type="button" onClick={askPermission}>Allow notifications</button>}
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500"><Clock3 size={16} className="mt-0.5 shrink-0" />Reminders are scheduled while AquaTrack is open and active. Notifications are not guaranteed after you close the browser or application; this version does not implement background push.</p>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button type="button" onClick={logout} className="btn-secondary text-rose-600 lg:hidden"><LogOut size={18} />Sign out</button>
          <button className="btn-primary sm:ml-auto sm:min-w-48" disabled={saving}><Save size={18} />{saving ? 'Saving…' : 'Save settings'}</button>
        </div>
      </form>}
    </div>
  )
}

function SectionTitle({ icon: Icon, title, description }) {
  return <div className="flex items-start gap-3"><span className="rounded-2xl bg-sky-pale p-2.5 text-sky-brand"><Icon size={21} /></span><div><h2 className="text-lg font-black">{title}</h2><p className="mt-1 max-w-lg text-sm leading-6 text-slate-500">{description}</p></div></div>
}
