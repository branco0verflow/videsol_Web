'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { BrandInfo } from '@/lib/brands'
import VehicleCard, { Vehicle } from '@/components/VehicleCard'

gsap.registerPlugin(ScrollTrigger)

interface BrandPageProps {
  brand:    BrandInfo
  vehicles: Vehicle[]
}

type Catalogo = 'todos' | 'okm' | 'usados'

export default function BrandPage({ brand, vehicles }: BrandPageProps) {
  const [catalogo, setCatalogo] = useState<Catalogo>('todos')
  const heroRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const filtered = vehicles.filter((v) => {
    if (catalogo === 'okm')    return v.km === 0
    if (catalogo === 'usados') return v.km > 0
    return true
  })

  const countOkm    = vehicles.filter((v) => v.km === 0).length
  const countUsados = vehicles.filter((v) => v.km > 0).length

  // Hero entrance
  useEffect(() => {
    if (!heroRef.current) return
    const tl = gsap.timeline()
    tl.fromTo('.brand-hero-logo',  { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .fromTo('.brand-hero-title', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .fromTo('.brand-hero-sub',   { opacity: 0 },        { opacity: 1, duration: 0.4 }, '-=0.2')
  }, [])

  // Re-animate grid on filter change
  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll('.brand-card-wrapper')
    if (!cards.length) return
    gsap.fromTo(cards,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' }
    )
  }, [catalogo])

  return (
    <div className="min-h-screen bg-[#f4f5f7]">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative w-full h-64 overflow-hidden">

        {/* Imagen de fondo full-width */}
        <Image
          src={brand.image}
          alt={brand.name}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />

        {/* Overlay oscuro para legibilidad */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Contenido encima */}
        <div className="relative h-full flex items-center justify-between max-w-7xl mx-auto px-6 lg:px-12">

          {/* Breadcrumb */}
          <nav className="brand-hero-logo opacity-0 flex items-center gap-2 text-[12px] text-white/50">
            <Link href="/" className="hover:text-white/80 transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/#marcas" className="hover:text-white/80 transition-colors">Marcas</Link>
            <span>/</span>
            <span className="text-white/80">{brand.name}</span>
          </nav>

          {/* Nombre de la marca */}
          <h1
            className="brand-hero-title opacity-0 text-3xl lg:text-4xl font-bold text-white tracking-wide"
            style={{ fontFamily: 'var(--font-oswald)' }}
          >
            {brand.name}
          </h1>

          {/* Contador */}
          <p className="brand-hero-sub opacity-0 text-white/50 text-[13px] hidden sm:block">
            {vehicles.length} {vehicles.length === 1 ? 'vehículo' : 'vehículos'}
          </p>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">

        {/* Filter tabs */}
        {vehicles.length > 0 && (
          <div className="flex items-center gap-2 mb-10">
            {([
              { key: 'todos',  label: 'Todos',  count: vehicles.length },
              { key: 'okm',    label: '0 km',   count: countOkm },
              { key: 'usados', label: 'Usados', count: countUsados },
            ] as { key: Catalogo; label: string; count: number }[]).map((tab) => (
              tab.count > 0 || tab.key === 'todos' ? (
                <button
                  key={tab.key}
                  onClick={() => setCatalogo(tab.key)}
                  suppressHydrationWarning
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                    catalogo === tab.key
                      ? 'bg-navy text-white'
                      : 'bg-white text-slate-500 border border-border hover:border-navy/30 hover:text-navy'
                  }`}
                >
                  {tab.label}
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium ${
                    catalogo === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ) : null
            ))}
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((v, i) => (
              <div key={v.id} className="brand-card-wrapper">
                <VehicleCard vehicle={v} animationDelay={i * 0.06} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-white border border-border flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[16px] font-semibold text-slate-700 mb-1">Sin stock disponible</p>
            <p className="text-[13px] text-slate-400 max-w-xs">
              Por el momento no tenemos vehículos {brand.name} en esta categoría. Consultanos por disponibilidad.
            </p>
            <Link
              href="#contacto"
              className="mt-6 inline-flex items-center gap-2 bg-navy text-white text-[13px] font-semibold px-6 py-3 rounded-full hover:bg-navy-dark transition-colors"
            >
              Consultar disponibilidad
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
