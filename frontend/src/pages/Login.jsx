import { useState } from 'react'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../components/common/Alert'
import AuthLayout from '../components/layout/AuthLayout'
import { useAuth } from '../contexts/AuthContext'
import { errorMessage } from '../services/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault(); setError(''); setSubmitting(true)
    try { await login(form); navigate('/') }
    catch (err) { setError(errorMessage(err, 'We could not sign you in.')) }
    finally { setSubmitting(false) }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Pick up your rhythm."
      description="Sign in to see today’s progress and your hydration history."
      quote="Every glass is a small promise to your future self."
      quoteCaption="Come back to your goal, celebrate your progress, and make your next sip count."
    >
      <form onSubmit={submit} className="space-y-5">
        {error && <Alert>{error}</Alert>}
        <label className="block"><span className="label">Email address</span><span className="relative block"><Mail className="absolute left-4 top-3.5 text-slate-400" size={18} /><input className="field pl-11" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></span></label>
        <label className="block"><span className="label">Password</span><span className="relative block"><LockKeyhole className="absolute left-4 top-3.5 text-slate-400" size={18} /><input className="field pl-11" type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Your password" /></span></label>
        <button className="btn-primary w-full" disabled={submitting}>{submitting ? 'Signing in…' : <>Sign in <ArrowRight size={18} /></>}</button>
      </form>
      <p className="mt-7 text-center text-sm text-slate-500">New to AquaTrack? <Link className="font-extrabold text-sky-deep hover:underline" to="/register">Create an account</Link></p>
    </AuthLayout>
  )
}
