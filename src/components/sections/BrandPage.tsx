'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { BrandInfo } from '@/lib/brands'
import type { VehicleAPI, PaginaVehiculos } from '@/types/vehicle'
import VehicleCard from '@/components/VehicleCard'
import VehicleCardUsado from '@/components/VehicleCardUsado'
import { API as API_BASE } from '@/lib/config'

gsap.registerPlugin(ScrollTrigger)
const PAGE_SIZE = 50

// ─── Types ────────────────────────────────────────────────────────────────────

interface BrandPageProps {
  brand: BrandInfo
}

type Catalogo = 'todos' | 'okm' | 'usados'

// ─── Component ────────────────────────────────────────────────────────────────

export default function BrandPage({ brand }: BrandPageProps) {
  const [catalogo,       setCatalogo]       = useState<Catalogo>('todos')
  const [okmVehicles,    setOkmVehicles]    = useState<VehicleAPI[]>([])
  const [usadosVehicles, setUsadosVehicles] = useState<VehicleAPI[]>([])
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // ── Fetch both catalogs in parallel ──────────────────────────────────────

  useEffect(() => {
    setLoading(true)
    setError(false)
    const m = encodeURIComponent(brand.name)
    Promise.all([
      fetch(`${API_BASE}/okm?page=0&size=${PAGE_SIZE}&marca=${m}`)
        .then((r) => { if (!r.ok) throw new Error(); return r.json() as Promise<PaginaVehiculos> }),
      fetch(`${API_BASE}/usados?page=0&size=${PAGE_SIZE}&marca=${m}`)
        .then((r) => { if (!r.ok) throw new Error(); return r.json() as Promise<PaginaVehiculos> }),
    ])
      .then(([okmData, usadosData]) => {
        setOkmVehicles(okmData.contenido)
        setUsadosVehicles(usadosData.contenido)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [brand.name])

  // ── Hero entrance animation ───────────────────────────────────────────────

  useEffect(() => {
    if (!heroRef.current) return
    const tl = gsap.timeline()
    tl.fromTo('.brand-hero-logo',  { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .fromTo('.brand-hero-title', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .fromTo('.brand-hero-sub',   { opacity: 0 },        { opacity: 1, duration: 0.4 }, '-=0.2')
  }, [])

  // ── Re-animate grid on tab or data change ─────────────────────────────────

  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll('.brand-card-wrapper')
    if (!cards.length) return
    gsap.fromTo(cards,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' }
    )
  }, [catalogo, okmVehicles, usadosVehicles])

  // ── Derived data ──────────────────────────────────────────────────────────

  const totalCount = okmVehicles.length + usadosVehicles.length

  type Item = { vehicle: VehicleAPI; tipo: 'okm' | 'usados' }
  const items: Item[] = [
    ...(catalogo !== 'usados' ? okmVehicles.map((v)    => ({ vehicle: v, tipo: 'okm'    as const })) : []),
    ...(catalogo !== 'okm'    ? usadosVehicles.map((v) => ({ vehicle: v, tipo: 'usados' as const })) : []),
  ]

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f4f5f7]">

      {/* ── Hero ── */}
      <div ref={heroRef} className="relative w-full h-64 overflow-hidden">
        <Image
          src={brand.image}
          alt={brand.name}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-between max-w-7xl mx-auto px-6 lg:px-12">

          <nav className="brand-hero-logo opacity-0 flex items-center gap-2 text-[12px] text-white/50">
            <Link href="/" className="hover:text-white/80 transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/#marcas" className="hover:text-white/80 transition-colors">Marcas</Link>
            <span>/</span>
            <span className="text-white/80">{brand.name}</span>
          </nav>

          <h1
            className="brand-hero-title opacity-0 text-3xl lg:text-4xl font-bold text-white tracking-wide"
            style={{ fontFamily: 'var(--font-oswald)' }}
          >
            {brand.name}
          </h1>

          <p className="brand-hero-sub opacity-0 text-white/50 text-[13px] hidden sm:block">
            {loading
              ? '…'
              : `${totalCount} ${totalCount === 1 ? 'vehículo' : 'vehículos'}`
            }
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 h-72 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-[15px] font-medium text-slate-700 mb-1">No se pudo cargar el catálogo</p>
            <p className="text-[13px] text-slate-400">Verificá que el servidor esté activo e intentá de nuevo.</p>
          </div>
        )}

        {/* Tabs + Grid */}
        {!loading && !error && (
          <>
            {/* Filter tabs */}
            {totalCount > 0 && (
              <div className="flex items-center gap-2 mb-10">
                {([
                  { key: 'todos',  label: 'Todos',  count: totalCount           },
                  { key: 'okm',    label: '0 km',   count: okmVehicles.length   },
                  { key: 'usados', label: 'Usados', count: usadosVehicles.length },
                ] as { key: Catalogo; label: string; count: number }[]).map((tab) =>
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
                )}
              </div>
            )}

            {/* Grid */}
            {items.length > 0 ? (
              <div
                ref={gridRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {items.map(({ vehicle, tipo }, i) => (
                  <div key={`${tipo}-${vehicle.id}`} className="brand-card-wrapper">
                    {tipo === 'usados'
                      ? <VehicleCardUsado vehicle={vehicle} animationDelay={i * 0.06} />
                      : <VehicleCard vehicle={vehicle} animationDelay={i * 0.06} catalogo="okm" />
                    }
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
                  href="/#contacto"
                  className="mt-6 inline-flex items-center gap-2 bg-navy text-white text-[13px] font-semibold px-6 py-3 rounded-full hover:bg-navy/80 transition-colors"
                >
                  Consultar disponibilidad
                </Link>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}
