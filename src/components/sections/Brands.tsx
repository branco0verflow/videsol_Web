'use client'

import { useRef } from 'react'
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

// Duplicate for seamless loop
const track = [...brands, ...brands]

// ─── Component ────────────────────────────────────────────────────────────────

export default function Brands() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.brands-header', {
        opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.brands-header', start: 'top 85%', once: true },
      })
      gsap.from('.brands-ticker-wrap', {
        opacity: 0, y: 20, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.brands-ticker-wrap', start: 'top 88%', once: true },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="marcas"
      ref={sectionRef}
      className="bg-white py-20 lg:py-20 border-y border-border overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="brands-header text-center mb-12">
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

      </div>

      {/* Ticker — full width, outside the max-w container */}
      <div className="brands-ticker-wrap relative w-full overflow-hidden">
        {/* fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-34 z-10 bg-linear-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-34 z-10 bg-linear-to-l from-white to-transparent" />

        <div className="flex w-max animate-marquee">
          {track.map((brand, i) => (
            <div
              key={i}
              className="flex items-center justify-center mx-10 sm:mx-14"
              style={{ width: 'clamp(80px, 12vw, 130px)', height: 'clamp(48px, 7vw, 70px)' }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  sizes="130px"
                  className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
