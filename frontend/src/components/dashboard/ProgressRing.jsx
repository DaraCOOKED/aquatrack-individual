import { formatVolume } from '../../utils/format'

export default function ProgressRing({ total, goal, percent }) {
  const radius = 92
  const circumference = 2 * Math.PI * radius
  const visualPercent = Math.min(100, Math.max(0, percent))
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[260px]">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 220 220" aria-hidden="true">
        <circle cx="110" cy="110" r={radius} fill="none" stroke="#e8f5fb" strokeWidth="16" />
        <circle cx="110" cy="110" r={radius} fill="none" stroke="url(#progressGradient)" strokeWidth="16" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - visualPercent / 100)} className="transition-all duration-700" />
        <defs><linearGradient id="progressGradient"><stop stopColor="#36a9e1" /><stop offset="1" stopColor="#63d4eb" /></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-black tracking-tight text-ink-950">{formatVolume(total)}</span>
        <span className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">of {formatVolume(goal)}</span>
        <span className="mt-3 rounded-full bg-sky-pale px-3 py-1 text-sm font-extrabold text-sky-deep">{Math.round(percent)}%</span>
      </div>
    </div>
  )
}
