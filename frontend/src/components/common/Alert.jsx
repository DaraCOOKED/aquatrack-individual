import { CheckCircle2, CircleAlert, X } from 'lucide-react'

export default function Alert({ type = 'error', children, onClose }) {
  const success = type === 'success'
  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${success ? 'border-emerald-100 bg-emerald-50 text-emerald-800' : 'border-rose-100 bg-rose-50 text-rose-800'}`} role={success ? 'status' : 'alert'}>
      {success ? <CheckCircle2 className="mt-0.5 shrink-0" size={18} /> : <CircleAlert className="mt-0.5 shrink-0" size={18} />}
      <span className="flex-1 font-medium">{children}</span>
      {onClose && <button onClick={onClose} aria-label="Dismiss"><X size={17} /></button>}
    </div>
  )
}
