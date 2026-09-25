import React, { useId } from 'react'

// Hexagonal "G" with a glowing core node — same geometry as /public/ghostgrid-mark.svg
export const LogoMark = ({ className = 'h-10 w-10' }) => {
  const id = useId().replace(/:/g, '')

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-stroke`} x1="8" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6BEBFF" />
          <stop offset="0.45" stopColor="#29A6FF" />
          <stop offset="1" stopColor="#7C5CFF" />
        </linearGradient>
        <radialGradient id={`${id}-core`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.55" stopColor="#9BEFFF" />
          <stop offset="1" stopColor="#29A6FF" />
        </radialGradient>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M54.5 21.5 L32 8.5 L9.5 21.5 V42.5 L32 55.5 L54.5 42.5 V32 H40"
        fill="none"
        stroke={`url(#${id}-stroke)`}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="30.5" cy="32" r="4.6" fill={`url(#${id}-core)`} filter={`url(#${id}-glow)`} />
    </svg>
  )
}

const Logo = ({ className = '', markClassName = 'h-10 w-10 sm:h-11 sm:w-11', textClassName = 'text-xl sm:text-2xl' }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <LogoMark className={`${markClassName} drop-shadow-[0_0_14px_rgba(41,166,255,0.45)]`} />
    <span className={`font-extrabold tracking-[-0.03em] text-white ${textClassName}`}>
      Ghost<span className="bg-gradient-to-r from-[#29A6FF] to-[#8B6BFF] bg-clip-text text-transparent">Grid</span>
    </span>
  </span>
)

export default Logo
