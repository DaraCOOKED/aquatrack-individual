import { useState } from 'react'
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../components/common/Alert'
import AuthLayout from '../components/layout/AuthLayout'
import { useAuth } from '../contexts/AuthContext'
import { errorMessage } from '../services/api'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const submit = async (event) => {
    event.preventDefault(); setError('')
    if (form.password !== form.password_confirmation) return setError('Passwords do not match.')
    setSubmitting(true)
    try { await register(form); navigate('/') }
    catch (err) { setError(errorMessage(err, 'We could not create your account.')) }
    finally { setSubmitting(false) }
  }

  return (
    <AuthLayout
      eyebrow="Start fresh"
      title="Build a habit, one glass at a time."
      description="Your 1,500 mL starting goal is fully adjustable and is not medical advice."
      quote="Healthy habits grow one sip at a time."
      quoteCaption="Start small, stay consistent, and let every glass move you closer to feeling your best."
    >
      <form onSubmit={submit} className="space-y-4">
        {error && <Alert>{error}</Alert>}
        <label className="block"><span className="label">Display name</span><span className="relative block"><UserRound className="absolute left-4 top-3.5 text-slate-400" size={18} /><input className="field pl-11" name="name" autoComplete="name" required value={form.name} onChange={change} placeholder="Dara" /></span></label>
        <label className="block"><span className="label">Email address</span><span className="relative block"><Mail className="absolute left-4 top-3.5 text-slate-400" size={18} /><input className="field pl-11" name="email" type="email" autoComplete="email" required value={form.email} onChange={change} placeholder="you@example.com" /></span></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label><span className="label">Password</span><span className="relative block"><LockKeyhole className="absolute left-4 top-3.5 text-slate-400" size={18} /><input className="field pl-11" name="password" type="password" minLength="8" autoComplete="new-password" required value={form.password} onChange={change} placeholder="8+ characters" /></span></label>
          <label><span className="label">Confirm</span><input className="field" name="password_confirmation" type="password" minLength="8" autoComplete="new-password" required value={form.password_confirmation} onChange={change} placeholder="Repeat password" /></label>
        </div>
        <button className="btn-primary mt-2 w-full" disabled={submitting}>{submitting ? 'Creating account…' : <>Create account <ArrowRight size={18} /></>}</button>
      </form>
      <p className="mt-7 text-center text-sm text-slate-500">Already tracking? <Link className="font-extrabold text-sky-deep hover:underline" to="/login">Sign in</Link></p>
    </AuthLayout>
  )
}
