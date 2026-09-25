import React, { Suspense, lazy, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Discovery, Activity, Document, Chat, ShieldDone, TickSquare } from './icons'

// three.js globe ships in its own chunk and loads after first paint
const GlobeBackground = lazy(() => import('./GlobeBackground'))

const GlobeFallback = () => (
  <div className="aspect-square w-full rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(41,166,255,0.18),rgba(7,22,48,0.6)_55%,transparent_70%)]" />
)

// Software WebGL (no GPU acceleration) can't animate the globe smoothly, so those visitors get the static fallback
const hasHardwareWebGL = () => {
  try {
    const gl = document.createElement('canvas').getContext('webgl')
    if (!gl) return false
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return !/swiftshader|llvmpipe|software|basic render/i.test(renderer)
  } catch {
    return false
  }
}

const useDeferredGlobe = () => {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const conn = navigator.connection
    if (conn?.saveData || /2g/.test(conn?.effectiveType ?? '') || !hasHardwareWebGL()) return
    const start = () => setReady(true)
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(start, { timeout: 1500 })
      return () => cancelIdleCallback(id)
    }
    const t = setTimeout(start, 400)
    return () => clearTimeout(t)
  }, [])
  return ready
}

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

const pipeline = [
  { icon: Document, label: 'Ingest', detail: 'Docs, email, ERP', color: '#6BEBFF' },
  { icon: Discovery, label: 'Reason', detail: 'LLM + business rules', color: '#29A6FF' },
  { icon: ShieldDone, label: 'Validate', detail: 'Human-in-the-loop', color: '#8B6BFF' },
  { icon: Activity, label: 'Act', detail: 'Update systems', color: '#E062FF' },
]

// Illustrative product UI — shows the kind of system GhostGrid builds
const Console = () => (
  <div className="gradient-border glass relative rounded-[28px] p-2 sm:p-3">
    <div className="rounded-[22px] border border-white/[0.06] bg-[#070C17]/90">
      {/* window chrome */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]/80" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]/80" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]/80" />
        </div>
        <p className="truncate px-2 text-xs font-semibold tracking-wide text-slate-400">ghostgrid / operations-agent</p>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Live
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 p-3 text-left sm:p-6 lg:grid-cols-[1.35fr_1fr]">
        {/* pipeline */}
        <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Workflow pipeline</p>
          <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <svg className="pointer-events-none absolute left-0 top-7 hidden h-2 w-full sm:block" preserveAspectRatio="none" viewBox="0 0 100 2">
              <line x1="10" y1="1" x2="90" y2="1" stroke="url(#flow)" strokeWidth="0.6" strokeDasharray="2 2" className="animate-flow" />
              <defs>
                <linearGradient id="flow" x1="0" x2="1">
                  <stop offset="0" stopColor="#6BEBFF" />
                  <stop offset="1" stopColor="#E062FF" />
                </linearGradient>
              </defs>
            </svg>
            {pipeline.map(({ icon: Icon, label, detail, color }) => (
              <div key={label} className="relative flex flex-col items-center text-center">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-[#0A1122]"
                  style={{ borderColor: `${color}55`, boxShadow: `0 0 30px -6px ${color}88` }}
                >
                  <Icon set="bold" primaryColor={color} size={26} />
                </div>
                <p className="mt-3 text-sm font-bold text-white">{label}</p>
                <p className="mt-0.5 text-[11px] leading-4 text-slate-500">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2.5">
            {[
              ['Invoice #4821 matched to PO', 'auto-approved'],
              ['Supplier email classified: delivery delay', 'routed to ops'],
              ['Contract clause flagged for review', 'awaiting human'],
            ].map(([task, status], i) => (
              <div key={task} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <TickSquare set="bulk" size={18} primaryColor={i === 2 ? '#8B6BFF' : '#34D399'} secondaryColor={i === 2 ? '#8B6BFF' : '#34D399'} />
                  <span className="truncate text-xs text-slate-300 sm:text-sm">{task}</span>
                </div>
                <span className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:inline ${i === 2 ? 'bg-violet-400/10 text-violet-300' : 'bg-emerald-400/10 text-emerald-300'}`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* insight panel */}
        <div className="flex min-w-0 flex-col gap-4">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Throughput</p>
              <span className="text-[11px] font-semibold text-slate-500">Last 30 days</span>
            </div>
            <svg viewBox="0 0 200 70" preserveAspectRatio="none" className="mt-4 h-28 w-full">
              <defs>
                <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#29A6FF" stopOpacity="0.45" />
                  <stop offset="1" stopColor="#29A6FF" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="line" x1="0" x2="1">
                  <stop offset="0" stopColor="#6BEBFF" />
                  <stop offset="1" stopColor="#8B6BFF" />
                </linearGradient>
              </defs>
              <path d="M0 58 C20 55 30 50 45 48 S70 40 85 36 S110 34 125 26 S160 18 175 12 L200 8 V70 H0Z" fill="url(#area)" />
              <path d="M0 58 C20 55 30 50 45 48 S70 40 85 36 S110 34 125 26 S160 18 175 12 L200 8" fill="none" stroke="url(#line)" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#29A6FF]/10 to-[#8B6BFF]/10 p-5">
            <div className="flex items-start gap-3">
              <div className="icon-tile h-10 w-10 shrink-0 rounded-xl">
                <Chat set="bulk" size={20} primaryColor="#6BEBFF" secondaryColor="#29A6FF" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Agent recommendation</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Three suppliers share the same delay pattern. Suggest rerouting next week's orders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const Hero = () => {
  const showGlobe = useDeferredGlobe()

  return (
    <section id="hero" className="relative isolate -mt-[76px] overflow-hidden px-4 pb-24 pt-40 text-center sm:px-8">
      {/* Vibrant backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora-blob animate-aurora-a left-1/2 top-[-18%] h-[620px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(41,166,255,0.75),transparent)]" />
        <div className="aurora-blob animate-aurora-b left-[6%] top-[6%] h-[460px] w-[460px] bg-[radial-gradient(closest-side,rgba(107,235,255,0.5),transparent)]" />
        <div className="aurora-blob animate-aurora-a right-[4%] top-[2%] h-[480px] w-[480px] bg-[radial-gradient(closest-side,rgba(139,107,255,0.7),transparent)]" />
        <div className="aurora-blob animate-aurora-b right-[22%] top-[38%] h-[360px] w-[360px] bg-[radial-gradient(closest-side,rgba(224,98,255,0.45),transparent)]" />
        <div className="bg-grid absolute inset-0" />

        {/* 3D globe with data arcs between continents */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-1/2 top-[110px] w-[165vw] max-w-[1180px] -translate-x-1/2 sm:top-[70px] sm:w-[125vw]"
        >
          <Suspense fallback={<GlobeFallback />}>{showGlobe ? <GlobeBackground /> : <GlobeFallback />}</Suspense>
        </motion.div>

        {/* keep the headline readable over the globe */}
        <div className="absolute inset-x-0 top-0 h-[1000px] bg-[radial-gradient(ellipse_38%_30%_at_50%_42%,rgba(5,8,15,0.72),rgba(5,8,15,0.25)_65%,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-transparent via-[#05080F]/70 to-[#05080F]" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center">
        <motion.a
          href="#services"
          {...fadeUp(0.1)}
          className="glass group mb-8 inline-flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 text-xs font-semibold text-slate-300 sm:text-sm"
        >
          <span className="rounded-full bg-gradient-to-r from-[#29A6FF] to-[#8B6BFF] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            New
          </span>
          AI readiness assessments for growing teams
          <ArrowRight set="light" size={16} primaryColor="#94A3B8" />
        </motion.a>

        <motion.h1
          {...fadeUp(0.2)}
          className="max-w-5xl text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl md:text-7xl xl:text-[88px]"
        >
          AI that moves your
          <br className="hidden sm:block" /> business <span className="text-gradient">forward.</span>
        </motion.h1>

        <motion.p {...fadeUp(0.35)} className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
          GhostGrid is an AI and technology consultancy. We find where automation and intelligent systems create real value,
          then design, build, and deploy them alongside your team.
        </motion.p>

        <motion.div {...fadeUp(0.5)} className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <a href="#contact-us" className="btn-primary w-full px-7 py-3.5 text-sm sm:w-auto sm:text-base">
            Book a strategy call
            <ArrowRight set="light" size={20} primaryColor="#05080F" />
          </a>
          <a href="#our-work" className="btn-ghost w-full px-7 py-3.5 text-sm sm:w-auto sm:text-base">
            See our solutions
          </a>
        </motion.div>

        <motion.ul {...fadeUp(0.6)} className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-300">
          {['Strategy to deployment', 'Vendor-neutral advice', 'Built for real operations'].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <TickSquare set="bulk" size={18} primaryColor="#29A6FF" secondaryColor="#8B6BFF" />
              {item}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-20 w-full max-w-6xl"
        >
          <div className="pointer-events-none absolute -inset-x-10 -top-10 bottom-10 -z-10 rounded-[40px] bg-[radial-gradient(ellipse_at_center,rgba(41,166,255,0.35),transparent_65%)] blur-2xl" />
          <Console />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
