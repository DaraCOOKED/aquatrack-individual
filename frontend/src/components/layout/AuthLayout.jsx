import { Droplet, Droplets, Quote, ShieldCheck, Sparkles } from 'lucide-react'

export default function AuthLayout({ eyebrow, title, description, quote, quoteCaption, children }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3f9ff] p-4 sm:p-8">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-cyan-100/70 blur-3xl" />
      <div className="relative mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[2.2rem] bg-white shadow-card sm:min-h-[calc(100vh-4rem)] lg:grid-cols-[1.05fr_.95fr]">
        <HydrationVisual quote={quote} quoteCaption={quoteCaption} />
        <section className="flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <div className="mb-10 flex items-center gap-3 lg:hidden"><span className="rounded-2xl bg-sky-brand p-2 text-white"><Droplets /></span><span className="text-xl font-black">AquaTrack</span></div>
            <div className="mb-8 hidden items-center gap-4 rounded-3xl bg-sky-pale p-4 text-ink-700 sm:flex lg:hidden">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-sky-brand shadow-sm"><Droplet className="fill-sky-100" size={22} /></span>
              <p className="text-sm font-bold leading-6">“{quote}”</p>
            </div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[.2em] text-sky-brand">{eyebrow}</p>
            <h1 className="text-3xl font-black tracking-tight text-ink-950 sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
            <div className="mt-8">{children}</div>
          </div>
        </section>
      </div>
    </main>
  )
}

function HydrationVisual({ quote, quoteCaption }) {
  return (
    <section className="auth-visual-panel relative hidden overflow-hidden p-8 text-white lg:flex lg:flex-col xl:p-12">
      <div className="absolute -left-20 top-1/3 h-52 w-52 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
      <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full border-[44px] border-white/10" aria-hidden="true" />
      <Droplet className="absolute right-10 top-24 fill-white/10 text-white/20" size={28} aria-hidden="true" />

      <div className="relative z-10 flex items-center gap-3 text-xl font-black">
        <span className="rounded-2xl bg-white/20 p-2.5 backdrop-blur"><Droplets /></span>
        AquaTrack
      </div>

      <div className="relative z-10 my-auto grid grid-cols-[minmax(0,1fr)_10rem] items-center gap-6 py-8 xl:grid-cols-[minmax(0,1fr)_11rem] xl:gap-9">
        <blockquote>
          <Quote className="mb-4 h-8 w-8 fill-white/15 text-white/70" aria-hidden="true" />
          <p className="text-3xl font-black leading-tight tracking-tight xl:text-4xl">“{quote}”</p>
          <footer className="mt-5 text-sm leading-6 text-white/75 xl:text-base xl:leading-7">{quoteCaption}</footer>
        </blockquote>

        <div className="relative mx-auto" aria-label="Illustration of a water glass filled to 75 percent">
          <div className="auth-glass" aria-hidden="true">
            <div className="auth-water">
              <span className="auth-bubble left-[28%] top-[24%] h-2.5 w-2.5" />
              <span className="auth-bubble right-[24%] top-[46%] h-4 w-4" />
              <span className="auth-bubble bottom-[16%] left-[46%] h-2 w-2" />
            </div>
          </div>
          <div className="absolute -right-5 top-8 rounded-2xl border border-white/30 bg-white/20 px-3 py-2 text-center shadow-lg backdrop-blur">
            <Droplet className="mx-auto mb-1 fill-white/30" size={17} />
            <span className="text-sm font-black">75%</span>
          </div>
          <div className="mx-auto mt-3 h-3 w-28 rounded-[50%] bg-sky-900/15 blur-sm" aria-hidden="true" />
        </div>
      </div>

      <div className="relative z-10">
        <div className="rounded-3xl border border-white/20 bg-white/15 p-4 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-bold">Today’s hydration</span>
            <span className="font-black">1.5 L / 2 L</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-sky-900/20">
            <div className="h-full w-3/4 rounded-full bg-white" />
          </div>
          <p className="mt-3 text-xs text-white/70">Just two more glasses to reach your goal.</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-xs font-bold backdrop-blur"><ShieldCheck size={15} /> Private by design</span>
          <span className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-xs font-bold backdrop-blur"><Sparkles size={15} /> Progress you can see</span>
        </div>
      </div>
    </section>
  )
}
