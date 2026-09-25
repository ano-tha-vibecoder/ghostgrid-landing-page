import React, { useEffect, useMemo, useRef, useState } from 'react'
import Globe from 'react-globe.gl'
import { MeshPhongMaterial, Color } from 'three'
import { feature } from 'topojson-client'
import countriesTopo from 'world-atlas/countries-110m.json'

// Hubs the data arcs travel between
const hubs = [
  { name: 'New York', lat: 40.71, lng: -74.0 },
  { name: 'São Paulo', lat: -23.55, lng: -46.63 },
  { name: 'London', lat: 51.5, lng: -0.12 },
  { name: 'Lagos', lat: 6.52, lng: 3.38 },
  { name: 'Nairobi', lat: -1.29, lng: 36.82 },
  { name: 'Harare', lat: -17.83, lng: 31.05 },
  { name: 'Johannesburg', lat: -26.2, lng: 28.05 },
  { name: 'Dubai', lat: 25.2, lng: 55.27 },
  { name: 'Mumbai', lat: 19.08, lng: 72.88 },
  { name: 'Singapore', lat: 1.35, lng: 103.82 },
  { name: 'Tokyo', lat: 35.68, lng: 139.69 },
  { name: 'Sydney', lat: -33.87, lng: 151.21 },
  { name: 'San Francisco', lat: 37.77, lng: -122.42 },
  { name: 'Frankfurt', lat: 50.11, lng: 8.68 },
]

const byName = Object.fromEntries(hubs.map((h) => [h.name, h]))

const routes = [
  ['Harare', 'London'], ['Harare', 'Dubai'], ['Johannesburg', 'New York'], ['Nairobi', 'Mumbai'],
  ['Lagos', 'São Paulo'], ['London', 'New York'], ['Frankfurt', 'Singapore'], ['Dubai', 'Tokyo'],
  ['San Francisco', 'Tokyo'], ['Singapore', 'Sydney'], ['New York', 'São Paulo'], ['Mumbai', 'Frankfurt'],
  ['Johannesburg', 'Sydney'], ['Lagos', 'London'], ['San Francisco', 'London'], ['Nairobi', 'Dubai'],
]

const arcColors = [
  ['rgba(107,235,255,0.05)', 'rgba(107,235,255,1)'],
  ['rgba(41,166,255,0.05)', 'rgba(139,107,255,1)'],
  ['rgba(139,107,255,0.05)', 'rgba(224,98,255,1)'],
]

// North Korea's 110m outline makes h3's hex conversion throw, so it's left out (a few dots at this scale)
const countries = feature(countriesTopo, countriesTopo.objects.countries).features.filter((f) => f.id !== '408')

const GlobeBackground = () => {
  const wrapRef = useRef(null)
  const globeRef = useRef(null)
  const [size, setSize] = useState(0)
  const [lowPower, setLowPower] = useState(false)
  const stalled = useRef(false)

  const isMobile = size > 0 && size < 640
  const reduceMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  const arcs = useMemo(
    () =>
      routes.slice(0, isMobile || lowPower ? 8 : routes.length).map(([from, to], i) => ({
        startLat: byName[from].lat,
        startLng: byName[from].lng,
        endLat: byName[to].lat,
        endLng: byName[to].lng,
        color: arcColors[i % arcColors.length],
        speed: 2200 + (i % 5) * 450,
      })),
    [isMobile, lowPower]
  )

  const material = useMemo(
    () =>
      new MeshPhongMaterial({
        color: new Color('#071630'),
        emissive: new Color('#04102A'),
        emissiveIntensity: 0.6,
        shininess: 12,
        transparent: true,
        opacity: 0.95,
      }),
    []
  )

  // Keep the canvas square and sized to its container
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setSize(Math.round(entry.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Stop rendering while the hero is off-screen
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      const g = globeRef.current
      if (!g) return
      if (entry.isIntersecting && !stalled.current) g.resumeAnimation()
      else g.pauseAnimation()
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const onReady = () => {
    const g = globeRef.current
    if (!g) return
    g.pointOfView({ lat: 12, lng: 20, altitude: 2.1 }, 0)
    g.renderer().setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5))
    const controls = g.controls()
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableRotate = false
    controls.autoRotate = !reduceMotion
    controls.autoRotateSpeed = 0.45
    if (!reduceMotion) watchFrameRate()
  }

  // Frame-rate governor: weak GPUs get a lighter globe, and if that still can't keep up
  // the globe freezes on its current frame instead of dragging the whole page down
  const sampleFps = (ms) =>
    new Promise((resolve) => {
      let frames = 0
      const start = performance.now()
      const tick = (now) => {
        frames++
        if (now - start < ms) requestAnimationFrame(tick)
        else resolve((frames * 1000) / (now - start))
      }
      requestAnimationFrame(tick)
    })

  const watchFrameRate = async () => {
    await sampleFps(1000) // let the intro animation settle
    if ((await sampleFps(2000)) >= 30) return
    setLowPower(true)
    globeRef.current?.renderer().setPixelRatio(1)
    if ((await sampleFps(2000)) >= 15) return
    stalled.current = true
    globeRef.current?.pauseAnimation()
  }

  return (
    <div ref={wrapRef} className="aspect-square w-full">
      {size > 0 && (
        <Globe
          ref={globeRef}
          width={size}
          height={size}
          backgroundColor="rgba(0,0,0,0)"
          rendererConfig={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
          animateIn
          onGlobeReady={onReady}
          enablePointerInteraction={false}
          globeMaterial={material}
          showAtmosphere
          atmosphereColor="#29A6FF"
          atmosphereAltitude={0.2}
          hexPolygonsData={countries}
          hexPolygonResolution={isMobile ? 2 : 3}
          hexPolygonMargin={0.45}
          hexPolygonUseDots
          hexPolygonDotResolution={6}
          hexPolygonColor={() => 'rgba(125, 211, 252, 0.75)'}
          arcsData={arcs}
          arcColor="color"
          arcStroke={isMobile ? 0.6 : 0.45}
          arcAltitudeAutoScale={0.32}
          arcDashLength={0.35}
          arcDashGap={1.2}
          arcDashInitialGap={() => Math.random()}
          arcDashAnimateTime={reduceMotion ? 0 : (d) => d.speed}
          pointsData={hubs}
          pointColor={() => '#6BEBFF'}
          pointAltitude={0.012}
          pointRadius={0.38}
          pointsMerge
          ringsData={reduceMotion || lowPower ? [] : hubs}
          ringColor={() => (t) => `rgba(107,235,255,${1 - t})`}
          ringMaxRadius={3.2}
          ringPropagationSpeed={2.2}
          ringRepeatPeriod={1400}
        />
      )}
    </div>
  )
}

export default GlobeBackground
