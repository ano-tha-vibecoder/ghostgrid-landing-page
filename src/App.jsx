import React, { Suspense, lazy, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { Toaster } from 'react-hot-toast'
import ChatLauncher from './components/chat/ChatLauncher'

// Below-the-fold sections load as separate chunks after the hero renders
const TrustedBy = lazy(() => import('./components/TrustedBy'))
const Services = lazy(() => import('./components/Services'))
const OurWork = lazy(() => import('./components/OurWork'))
const Teams = lazy(() => import('./components/Teams'))
const About = lazy(() => import('./components/About'))
const ContactUs = lazy(() => import('./components/ContactUs'))
const Footer = lazy(() => import('./components/Footer'))

const App = () => {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const dotRef = useRef(null)
  const outlineRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const position = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Touch devices hide the custom cursor, so skip the animation loop entirely
    if (window.matchMedia('(pointer: coarse), (max-width: 768px)').matches) return

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      dotRef.current?.style.setProperty('opacity', '1')
      outlineRef.current?.style.setProperty('opacity', '1')
    }

    document.addEventListener('mousemove', handleMouseMove)

    let frame
    const animate = () => {
      position.current.x += (mouse.current.x - position.current.x) * 0.1
      position.current.y += (mouse.current.y - position.current.y) * 0.1

      if (dotRef.current && outlineRef.current) {
        dotRef.current.style.transform = `translate3D(${mouse.current.x - 4}px, ${mouse.current.y - 4}px, 0)`
        outlineRef.current.style.transform = `translate3D(${position.current.x - 20}px, ${position.current.y - 20}px, 0)`
      }
      frame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="relative overflow-x-hidden bg-[#05080F] text-slate-100">
      {/* Page-wide ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="aurora-blob animate-aurora-b left-[-15%] top-[40%] h-[520px] w-[520px] bg-[#29A6FF]/10" />
        <div className="aurora-blob animate-aurora-a right-[-12%] top-[65%] h-[480px] w-[480px] bg-[#8B6BFF]/10" />
        <div className="bg-noise absolute inset-0" />
      </div>

      <div className="relative z-10">
        <Toaster
          toastOptions={{
            style: { background: '#0B1220', color: '#E2E8F0', border: '1px solid rgba(148,163,184,0.18)' },
          }}
        />
        <Navbar />
        <Hero />
        <Suspense fallback={<div className="min-h-screen" />}>
          <TrustedBy />
          <Services />
          <OurWork />
          <Teams />
          <About />
          <ContactUs />
          <Footer />
        </Suspense>
      </div>

      <ChatLauncher />

      <div
        ref={outlineRef}
        className="cursor-glow pointer-events-none fixed left-0 top-0 z-[9999] h-10 w-10 rounded-full border border-[#29A6FF]/70 shadow-[0_0_20px_rgba(41,166,255,0.35)]"
        style={{ transition: 'transform 0.1s ease-out', opacity: 0 }}
      />
      <div
        ref={dotRef}
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-[#6BEBFF]"
        style={{ opacity: 0 }}
      />
    </div>
  )
}

export default App
