import { Droplets } from 'lucide-react'

export default function LoadingScreen({ compact = false }) {
  return (
    <div className={compact ? 'flex min-h-44 items-center justify-center' : 'flex min-h-screen items-center justify-center bg-sky-pale'} role="status">
      <div className="flex flex-col items-center gap-3 text-sky-deep">
        <div className="animate-bounce rounded-2xl bg-white p-3 shadow-card"><Droplets size={28} /></div>
        <span className="text-sm font-bold">Loading AquaTrack…</span>
      </div>
    </div>
  )
}
