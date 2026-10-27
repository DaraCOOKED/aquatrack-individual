import { X } from 'lucide-react'

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/35 p-0 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-2xl sm:max-w-md sm:rounded-[2rem]" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="mb-6 flex items-center justify-between">
          <h2 id="modal-title" className="text-xl font-extrabold text-ink-950">{title}</h2>
          <button className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:text-ink-950" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
        </div>
        {children}
      </section>
    </div>
  )
}
