import { Clock3, Droplet, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { formatTime } from '../../utils/format'

export default function IntakeList({ items, onEdit, onDelete, compact = false }) {
  if (!items?.length) return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-sky-200 bg-sky-pale/50 px-5 py-10 text-center">
      <span className="mb-3 rounded-2xl bg-white p-3 text-sky-brand shadow-sm"><Droplet size={24} /></span>
      <p className="font-extrabold text-ink-950">No drinks recorded here</p>
      <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">When you add water, each drink and its exact time will appear here.</p>
    </div>
  )

  return <div className="divide-y divide-slate-100">{items.map((item) => (
    <article key={item.id} className={`group flex items-center gap-3 ${compact ? 'py-3' : 'py-4'}`}>
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-pale text-sky-brand"><Droplet size={20} fill="currentColor" /></div>
      <div className="min-w-0 flex-1"><p className="font-extrabold text-ink-950">{item.amount_ml} mL</p><p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500"><Clock3 size={13} />{formatTime(item.consumed_at)}</p></div>
      {(onEdit || onDelete) ? <div className="flex gap-1">
        {onEdit && <button onClick={() => onEdit(item)} className="rounded-xl p-2 text-slate-400 transition hover:bg-sky-pale hover:text-sky-deep" aria-label={`Edit ${item.amount_ml} mL entry`}><Pencil size={17} /></button>}
        {onDelete && <button onClick={() => onDelete(item)} className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete ${item.amount_ml} mL entry`}><Trash2 size={17} /></button>}
      </div> : <MoreHorizontal className="text-slate-300" size={18} />}
    </article>
  ))}</div>
}
