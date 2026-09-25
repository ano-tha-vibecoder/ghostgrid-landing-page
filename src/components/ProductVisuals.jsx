import React from 'react'

// Illustrative placeholders for the Solutions cards — swap for real product shots via `image` in OurWork.jsx

const Chip = ({ children, className = '' }) => (
  <span className={`rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur ${className}`}>
    {children}
  </span>
)

export const CropShieldVisual = () => (
  <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(160deg,#0B2A1E,#07160F_60%,#05080F)]">
    {/* crop rows */}
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 240" preserveAspectRatio="none">
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d={`M${-120 + i * 36} 240 L${60 + i * 26} 0`} stroke="#34D399" strokeOpacity={0.12 + (i % 3) * 0.05} strokeWidth="7" strokeLinecap="round" />
      ))}
    </svg>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(52,211,153,0.25),transparent_55%)]" />

    {/* leaf under inspection */}
    <svg className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_24px_rgba(52,211,153,0.45)]" viewBox="0 0 100 100">
      <path d="M50 92 C18 72 14 36 50 8 C86 36 82 72 50 92Z" fill="#22C55E" fillOpacity="0.85" />
      <path d="M50 92 V14 M50 40 L34 28 M50 54 L30 44 M50 40 L66 28 M50 54 L70 44 M50 68 L36 62 M50 68 L64 62" stroke="#0B2A1E" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="64" cy="48" r="6" fill="#A16207" fillOpacity="0.9" />
      <circle cx="58" cy="60" r="3.5" fill="#A16207" fillOpacity="0.8" />
    </svg>

    {/* detection box */}
    <div className="absolute left-[52%] top-[36%] h-16 w-16 rounded-md border-2 border-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.6)]">
      <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-extrabold text-black">
        Leaf rust · 94%
      </span>
    </div>

    {/* scan line */}
    <div className="animate-scan absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent shadow-[0_0_12px_#6EE7B7]" />

    <Chip className="absolute right-4 top-4 text-emerald-300">Field 12 · Scanning</Chip>
    <div className="absolute bottom-10 left-4 flex gap-1.5">
      <Chip className="text-emerald-300">Healthy 87%</Chip>
      <Chip className="text-amber-300">At risk 13%</Chip>
    </div>
  </div>
)

export const LyfVisual = () => (
  <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(160deg,#2A1760,#140C33_55%,#05080F)]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(224,98,255,0.3),transparent_60%)]" />

    {/* floating side cards */}
    <div className="absolute left-5 top-12 w-28 -rotate-6 rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur">
      <div className="h-1.5 w-10 rounded-full bg-fuchsia-300/70" />
      <div className="mt-2 h-1.5 w-16 rounded-full bg-white/20" />
      <div className="mt-1.5 h-1.5 w-12 rounded-full bg-white/10" />
    </div>
    <div className="absolute right-5 top-20 w-28 rotate-6 rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur">
      <div className="flex items-end gap-1">
        {[40, 65, 50, 80, 70].map((h, i) => (
          <div key={i} className="w-3 rounded-sm bg-gradient-to-t from-violet-500 to-fuchsia-300" style={{ height: h * 0.4 }} />
        ))}
      </div>
    </div>

    {/* phone */}
    <div className="absolute left-1/2 top-6 h-[260px] w-[132px] -translate-x-1/2 rounded-[26px] border border-white/15 bg-[#0B0820] p-2 shadow-[0_20px_60px_-10px_rgba(139,107,255,0.6)]">
      <div className="mx-auto h-1.5 w-10 rounded-full bg-white/15" />
      <p className="mt-3 px-1 text-[9px] font-semibold text-slate-400">Good morning</p>
      <p className="px-1 text-xs font-extrabold text-white">Your journey</p>
      <div className="relative mx-auto mt-2 h-16 w-16">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="url(#lyf)" strokeWidth="4" strokeLinecap="round" strokeDasharray="94.2" strokeDashoffset="28" />
          <defs>
            <linearGradient id="lyf"><stop offset="0" stopColor="#8B6BFF" /><stop offset="1" stopColor="#E062FF" /></linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-white">70%</span>
      </div>
      <div className="mt-2 space-y-1.5">
        {[['Onboarding', true], ['Set your goals', true], ['Daily plan', false]].map(([label, done]) => (
          <div key={label} className="flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-2 py-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${done ? 'bg-fuchsia-400' : 'border border-white/30'}`} />
            <span className="text-[9px] font-semibold text-slate-200">{label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

// Deterministic candle data so the chart is stable between renders
const candles = [
  [52, 58, 48, 60], [58, 55, 53, 62], [55, 61, 54, 64], [61, 66, 59, 68], [66, 63, 61, 69],
  [63, 60, 57, 65], [60, 67, 58, 70], [67, 72, 65, 75], [72, 70, 68, 76], [70, 76, 69, 79],
  [76, 81, 74, 84], [81, 78, 76, 84], [78, 84, 77, 87], [84, 89, 82, 92], [89, 87, 85, 93],
  [87, 93, 86, 96],
]

export const GhostTraderVisual = () => {
  const y = (v) => 200 - (v - 45) * 3.2
  const ma = candles.map(([o, c], i) => `${i ? 'L' : 'M'}${20 + i * 23} ${y((o + c) / 2 - 2)}`).join(' ')

  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(160deg,#0B2A4A,#07121F_55%,#05080F)]">
      <div className="bg-grid absolute inset-0 opacity-60 [mask-image:none]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 390 240" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gt-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#29A6FF" stopOpacity="0.3" />
            <stop offset="1" stopColor="#29A6FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${ma} L${20 + 15 * 23} 240 L20 240Z`} fill="url(#gt-area)" />
        {candles.map(([o, c, l, h], i) => {
          const up = c >= o
          const x = 20 + i * 23
          const color = up ? '#34D399' : '#F87171'
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={y(h)} y2={y(l)} stroke={color} strokeWidth="1.5" />
              <rect x={x - 6} width="12" y={y(Math.max(o, c))} height={Math.max(3, Math.abs(y(o) - y(c)))} rx="1.5" fill={color} />
            </g>
          )
        })}
        <path d={ma} fill="none" stroke="#6BEBFF" strokeWidth="2" strokeLinecap="round" />
        {/* signal markers */}
        <g transform={`translate(${20 + 6 * 23} ${y(56)})`}>
          <path d="M0 0 L-6 10 H6Z" fill="#34D399" />
        </g>
        <g transform={`translate(${20 + 11 * 23} ${y(86)})`}>
          <path d="M0 0 L-6 -10 H6Z" fill="#F87171" />
        </g>
      </svg>

      <div className="absolute left-4 top-4 flex items-center gap-2">
        <Chip className="text-white">GGX / USD</Chip>
        <Chip className="text-emerald-300">+2.4%</Chip>
      </div>
      <div className="absolute right-4 top-4 rounded-xl border border-[#29A6FF]/30 bg-black/50 px-3 py-2 backdrop-blur">
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Signal</p>
        <p className="text-xs font-extrabold text-emerald-300">Momentum · Buy</p>
      </div>
    </div>
  )
}

const riskFactors = [
  ['Blood pressure', 82, '#F43F5E'],
  ['Cholesterol', 64, '#FB7185'],
  ['Age', 48, '#8B6BFF'],
  ['Activity', 30, '#29A6FF'],
]

export const CardioRiskVisual = () => (
  <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(160deg,#3A0D1E,#1A0A18_50%,#05080F)]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(244,63,94,0.28),transparent_55%)]" />

    {/* ECG trace */}
    <svg className="absolute inset-x-0 top-[18%] h-20 w-full" viewBox="0 0 400 80" preserveAspectRatio="none">
      <path
        d="M0 45 H60 L70 40 L78 45 H110 L118 52 L128 8 L138 70 L146 45 H200 L210 38 L220 45 H260 L268 52 L278 8 L288 70 L296 45 H350 L360 40 L368 45 H400"
        fill="none"
        stroke="#FB7185"
        strokeWidth="2.2"
        strokeLinejoin="round"
        className="animate-ecg drop-shadow-[0_0_6px_rgba(251,113,133,0.9)]"
      />
    </svg>

    <div className="absolute left-4 top-4 flex items-center gap-2">
      <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-300 backdrop-blur">
        Patient A-1042
      </span>
      <span className="flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-1 text-[10px] font-bold text-rose-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" /> 72 bpm
      </span>
    </div>

    {/* risk gauge */}
    <div className="absolute bottom-4 left-4 w-32 rounded-2xl border border-white/10 bg-black/50 p-3 backdrop-blur">
      <svg viewBox="0 0 100 56" className="w-full">
        <defs>
          <linearGradient id="cr-gauge">
            <stop offset="0" stopColor="#34D399" />
            <stop offset="0.5" stopColor="#FBBF24" />
            <stop offset="1" stopColor="#F43F5E" />
          </linearGradient>
        </defs>
        <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" strokeLinecap="round" />
        <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="url(#cr-gauge)" strokeWidth="9" strokeLinecap="round" strokeDasharray="125.7" strokeDashoffset="36" />
      </svg>
      <p className="-mt-1 text-center text-lg font-extrabold leading-none text-white">72%</p>
      <p className="mt-1 text-center text-[9px] font-bold uppercase tracking-wider text-rose-300">High risk</p>
    </div>

    {/* contributing factors */}
    <div className="absolute bottom-4 right-4 w-[46%] rounded-2xl border border-white/10 bg-black/50 p-3 backdrop-blur">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Top risk drivers</p>
      <div className="mt-2 space-y-1.5">
        {riskFactors.map(([label, value, color]) => (
          <div key={label}>
            <div className="flex justify-between text-[9px] font-semibold text-slate-300">
              <span>{label}</span>
              <span>{value}</span>
            </div>
            <div className="mt-0.5 h-1 rounded-full bg-white/10">
              <div className="h-1 rounded-full" style={{ width: `${value}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)
