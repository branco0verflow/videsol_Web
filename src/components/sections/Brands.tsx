'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// ─── Data ─────────────────────────────────────────────────────────────────────

const brands = [
  { name: 'BYD',     image: '/images/marcas/Marca1.png' },
  { name: 'Nissan',  image: '/images/marcas/Marca2.png' },
  { name: 'Citroën', image: '/images/marcas/Marca3.png' },
  { name: 'Peugeot', image: '/images/marcas/Marca4.png' },
  { name: 'Riddara', image: '/images/marcas/Marca5.png' },
  { name: 'Renault', image: '/images/marcas/Marca6.png' },
  { name: 'Subaru',  image: '/images/marcas/Marca7.png' },
]

const len = brands.length
const mod = (n: number) => ((n % len) + len) % len

// ─── Component ────────────────────────────────────────────────────────────────

export default function Brands() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [paused,    setPaused]    = useState(false)

  const sectionRef  = useRef<HTMLElement>(null)
  const trackRef    = useRef<HTMLDivElement>(null)
  const dirRef      = useRef<1 | -1>(1)
  const animatingRef = useRef(false)

  // ── Autoplay ──
  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      dirRef.current = 1
      advance(1)
    }, 3200)
    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, activeIdx])

  // ── Slide animation ──
  const advance = (dir: 1 | -1) => {
    if (animatingRef.current) return
    animatingRef.current = true
    dirRef.current = dir

    const track = trackRef.current
    if (!track) { animatingRef.current = false; return }

    gsap.fromTo(
      track,
      { x: dir * 80, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.5, ease: 'power3.out',
        onComplete: () => { animatingRef.current = false },
      }
    )

    setActiveIdx((p) => mod(p + dir))
  }

  const navigate = (dir: 1 | -1) => {
    setPaused(true)
    advance(dir)
  }

  // ── Header entrance ──
  useGSAP(
    () => {
      gsap.from('.brands-header', {
        opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.brands-header', start: 'top 85%', once: true },
      })
      gsap.from('.brands-track-wrap', {
        opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.brands-track-wrap', start: 'top 88%', once: true },
      })
    },
    { scope: sectionRef }
  )

  const prev   = mod(activeIdx - 1)
  const next   = mod(activeIdx + 1)
  const items  = [prev, activeIdx, next]

  return (
    <section
      id="marcas"
      ref={sectionRef}
      className="bg-white py-24 lg:py-32 border-y border-border overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="brands-header text-center mb-16">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <span className="w-6 h-0.5 bg-navy rounded-full" />
            <p className="text-navy text-xs font-bold tracking-[0.25em] uppercase">Marcas oficiales</p>
            <span className="w-6 h-0.5 bg-navy rounded-full" />
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold text-slate-900"
            style={{ fontFamily: 'var(--font-oswald)' }}
          >
            7 marcas.{' '}
            <span className="text-gradient">Una sola dirección.</span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Representantes oficiales con garantía de fábrica, repuestos originales y asistencia técnica certificada.
          </p>
        </div>

        {/* Carousel */}
        <div
          className="brands-track-wrap"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="flex items-center justify-center gap-3 sm:gap-6">

            {/* Prev arrow */}
            <ArrowBtn direction="prev" onClick={() => navigate(-1)} />

            {/* Track */}
            <div ref={trackRef} className="flex items-center justify-center gap-4 sm:gap-8 flex-1 max-w-2xl">
              {items.map((idx, pos) => {
                const isCenter = pos === 1
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-center transition-all duration-500"
                    style={{
                      flex: isCenter ? '0 0 auto' : '0 0 auto',
                      width:   isCenter ? 'clamp(140px, 22vw, 200px)' : 'clamp(80px, 13vw, 120px)',
                      opacity: isCenter ? 1 : 0.28,
                      filter:  isCenter ? 'none' : 'grayscale(40%)',
                      transform: isCenter ? 'scale(1)' : 'scale(0.85)',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: isCenter ? 'clamp(80px, 12vw, 110px)' : 'clamp(48px, 7vw, 68px)',
                      }}
                    >
                      <Image
                        src={brands[idx].image}
                        alt={brands[idx].name}
                        fill
                        sizes="200px"
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Next arrow */}
            <ArrowBtn direction="next" onClick={() => navigate(1)} />

          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {brands.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setPaused(true)
                  dirRef.current = i > activeIdx ? 1 : -1
                  if (!animatingRef.current) {
                    animatingRef.current = true
                    const track = trackRef.current
                    if (track) {
                      const d = i > activeIdx ? 1 : -1
                      gsap.fromTo(track,
                        { x: d * 80, opacity: 0 },
                        { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out', onComplete: () => { animatingRef.current = false } }
                      )
                    } else {
                      animatingRef.current = false
                    }
                    setActiveIdx(i)
                  }
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIdx
                    ? 'w-6 h-1.5 bg-navy'
                    : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Ver ${brands[i].name}`}
                suppressHydrationWarning
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

// ─── Arrow Button ─────────────────────────────────────────────────────────────

function ArrowBtn({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)

  const onEnter = () => { if (ref.current) gsap.to(ref.current, { scale: 1.1, duration: 0.2, ease: 'power2.out' }) }
  const onLeave = () => { if (ref.current) gsap.to(ref.current, { scale: 1,   duration: 0.2, ease: 'power2.out' }) }

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-400 hover:border-navy hover:text-navy transition-colors duration-200 shrink-0"
      aria-label={direction === 'prev' ? 'Anterior' : 'Siguiente'}
      suppressHydrationWarning
    >
      {direction === 'prev' ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}
