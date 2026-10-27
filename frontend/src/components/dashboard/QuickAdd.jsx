import { Plus } from 'lucide-react'

export default function QuickAdd({ onAdd }) {
  return (
    <div>
      <div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-sky-brand">Quick add</p><h2 className="mt-1 text-xl font-black">What did you drink?</h2></div></div>
      <div className="grid grid-cols-3 gap-3">
        {[150, 250, 500].map((amount, index) => <button key={amount} onClick={() => onAdd(amount)} className="group rounded-3xl border border-sky-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-card"><div className={`mb-4 grid h-10 w-10 place-items-center rounded-2xl ${index === 1 ? 'bg-sky-brand text-white' : 'bg-sky-pale text-sky-brand'}`}><Plus size={20} /></div><p className="text-lg font-black text-ink-950">{amount}</p><p className="text-xs font-semibold text-slate-400">milliliters</p></button>)}
      </div>
      <button onClick={() => onAdd(null)} className="btn-secondary mt-3 w-full"><Plus size={18} /> Add custom amount</button>
    </div>
  )
}
