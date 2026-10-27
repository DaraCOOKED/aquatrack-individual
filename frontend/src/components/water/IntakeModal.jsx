import { useEffect, useState } from 'react'
import { Clock3, Droplet, Save } from 'lucide-react'
import Alert from '../common/Alert'
import Modal from '../common/Modal'
import { errorMessage } from '../../services/api'
import { waterService } from '../../services/waterService'
import { dateTimeLocalValue } from '../../utils/format'

export default function IntakeModal({ open, intake, preset, onClose, onSaved }) {
  const [amount, setAmount] = useState(250)
  const [consumedAt, setConsumedAt] = useState(dateTimeLocalValue())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setAmount(intake?.amount_ml ?? preset ?? 250)
      setConsumedAt(dateTimeLocalValue(intake?.consumed_at))
      setError('')
    }
  }, [open, intake, preset])

  const submit = async (event) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true); setError('')
    try {
      const payload = { amount_ml: Number(amount), consumed_at: new Date(consumedAt).toISOString() }
      const saved = intake ? await waterService.update(intake.id, payload) : await waterService.create(payload)
      onSaved(saved, intake ? 'Water entry updated.' : `${amount} mL added to today.`)
      onClose()
    } catch (err) { setError(errorMessage(err, 'Could not save this drink.')) }
    finally { setSubmitting(false) }
  }

  return (
    <Modal open={open} title={intake ? 'Edit drink' : 'Add a drink'} onClose={submitting ? () => {} : onClose}>
      <form onSubmit={submit} className="space-y-5">
        {error && <Alert>{error}</Alert>}
        <div>
          <span className="label">Amount</span>
          <div className="mb-3 grid grid-cols-3 gap-2">{[150, 250, 500].map((value) => <button key={value} type="button" onClick={() => setAmount(value)} className={`rounded-2xl border px-2 py-3 text-sm font-extrabold transition ${Number(amount) === value ? 'border-sky-brand bg-sky-brand text-white' : 'border-slate-200 text-ink-700 hover:border-sky-200'}`}>{value} mL</button>)}</div>
          <label className="relative block"><Droplet className="absolute left-4 top-3.5 text-sky-brand" size={18} /><input className="field pl-11" type="number" min="1" max="10000" required value={amount} onChange={(e) => setAmount(e.target.value)} aria-label="Custom amount in milliliters" /></label>
        </div>
        <label className="block"><span className="label">Date and time</span><span className="relative block"><Clock3 className="absolute left-4 top-3.5 text-slate-400" size={18} /><input className="field pl-11" type="datetime-local" required value={consumedAt} onChange={(e) => setConsumedAt(e.target.value)} /></span></label>
        <button className="btn-primary w-full" disabled={submitting}><Save size={18} />{submitting ? 'Saving…' : 'Save drink'}</button>
      </form>
    </Modal>
  )
}
