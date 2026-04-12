'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import VehicleCard, { Vehicle } from '@/components/VehicleCard'
import Filtros, { FiltrosState } from '@/components/ui/Filtros'
import vehiculos from '../../../db/vehiculos'

// ─────────────────────────────────────────────
// LÓGICA DE FILTRADO
// ─────────────────────────────────────────────
function aplicarFiltros(lista: Vehicle[], filtros: FiltrosState): Vehicle[] {
  return lista.filter((v) => {
    if (filtros.marca !== 'Todas' && v.marca?.toLowerCase() !== filtros.marca.toLowerCase())
      return false
    if (filtros.carroceria !== 'Todas' && v.tipo?.toLowerCase() !== filtros.carroceria.toLowerCase())
      return false
    if (filtros.combustible !== 'Todos' && v.combustible?.toLowerCase() !== filtros.combustible.toLowerCase())
      return false
    if (filtros.transmision !== 'Todas' && !v.transmision?.toLowerCase().includes(filtros.transmision.toLowerCase()))
      return false
    if (filtros.precioMax !== null && v.precio > filtros.precioMax)
      return false
    return true
  })
}

// ─────────────────────────────────────────────
// TÍTULOS por catálogo
// ─────────────────────────────────────────────
const TITULO = {
  okm: 'Vehículos 0 km',
  usados: 'Vehículos usados',
}

// ─────────────────────────────────────────────
// COMPONENTE
// ─────────────────────────────────────────────
export default function FeaturedVehicles() {
  const gridRef    = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const [filtros, setFiltros] = useState<FiltrosState>({
    catalogo: 'okm',
    marca: 'Todas',
    carroceria: 'Todas',
    combustible: 'Todos',
    transmision: 'Todas',
    precioMax: null,
  })

  // Seleccionar lista según catálogo activo
  const listaBase = filtros.catalogo === 'okm' ? vehiculos.okm : vehiculos.usados

  const vehiculosFiltrados = aplicarFiltros(listaBase, filtros)

  // ── GSAP: heading al montar ──
  useEffect(() => {
    if (!sectionRef.current) return
    const heading = sectionRef.current.querySelector('.section-heading')
    const sub     = sectionRef.current.querySelector('.section-sub')
    gsap.fromTo(
      [heading, sub],
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    )
  }, [])

  // ── GSAP: reanimar cards al cambiar filtros ──
  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll('.vehicle-card-wrapper')
    if (!cards.length) return
    gsap.fromTo(
      cards,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
    )
  }, [vehiculosFiltrados.length, filtros])

  // ── Escuchar evento del Navbar ──
  useEffect(() => {
    const handler = (e: Event) => {
      const { catalogo } = (e as CustomEvent<{ catalogo: 'okm' | 'usados' }>).detail
      setFiltros((prev) => ({
        ...prev,
        catalogo,
        marca: 'Todas',
        carroceria: 'Todas',
        combustible: 'Todos',
        transmision: 'Todas',
        precioMax: null,
      }))
    }
    window.addEventListener('videsol:set-catalogo', handler)
    return () => window.removeEventListener('videsol:set-catalogo', handler)
  }, [])

  // ── Notificar al Navbar cuando cambia el catálogo (desde sidebar) ──
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('videsol:catalogo-changed', { detail: { catalogo: filtros.catalogo } })
    )
  }, [filtros.catalogo])

  const handleFiltrosChange = useCallback((nuevos: FiltrosState) => {
    setFiltros(nuevos)
  }, [])

  return (
    <section id="vehiculos" ref={sectionRef} className="py-12 px-4 sm:px-6 lg:px-8 bg-[#eff5f8]">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8">
          <p className="section-sub text-[11px] font-medium tracking-[2px] text-[#1e3a5f] uppercase mb-2 opacity-0">
            Catálogo
          </p>
          <div className="flex items-end justify-between gap-4">
            <h2 className="section-heading text-[26px] sm:text-[32px] font-medium text-slate-900 leading-tight opacity-0">
              {TITULO[filtros.catalogo]}
            </h2>
            <span className="text-[13px] text-slate-400 hidden sm:block shrink-0">
              {vehiculosFiltrados.length}{' '}
              {vehiculosFiltrados.length === 1 ? 'vehículo' : 'vehículos'} disponibles
            </span>
          </div>
        </div>

        {/* ── Layout: sidebar + grid ── */}
        <div className="flex flex-row gap-5 lg:gap-8 items-start">

          {/* Filtros — siempre lateral */}
          <Filtros
            onFiltrosChange={handleFiltrosChange}
            totalResultados={vehiculosFiltrados.length}
          />

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {vehiculosFiltrados.length > 0 ? (
              <div
                ref={gridRef}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
              >
                {vehiculosFiltrados.map((vehicle, i) => (
                  <div key={vehicle.id} className="vehicle-card-wrapper">
                    <VehicleCard vehicle={vehicle} animationDelay={i * 0.06} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-[15px] font-medium text-slate-700 mb-1">Sin resultados</p>
                <p className="text-[13px] text-slate-400">
                  No hay vehículos que coincidan con los filtros seleccionados.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}