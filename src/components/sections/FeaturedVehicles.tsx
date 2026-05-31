'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import VehicleCard, { Vehicle } from '@/components/VehicleCard'
import VehicleCardUsado from '@/components/VehicleCardUsado'
import Filtros, { FiltrosState, FILTROS_INICIALES } from '@/components/ui/Filtros'
import type { PaginaVehiculos } from '@/types/vehicle'

import { API as API_BASE } from '@/lib/config'

const PAGE_SIZE = 9

// ─────────────────────────────────────────────
// URL builders (module-level → referencia estable para useEffect)
// ─────────────────────────────────────────────
function buildUrlOkm(filtros: FiltrosState, page: number): string {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('size', String(PAGE_SIZE))
  if (filtros.marca       !== 'Todas')  params.set('marca',       filtros.marca)
  if (filtros.carroceria  !== 'Todas')  params.set('tipo',        filtros.carroceria)
  if (filtros.combustible !== 'Todos')  params.set('combustible', filtros.combustible)
  if (filtros.transmision !== 'Todas')  params.set('transmision', filtros.transmision)
  if (filtros.precioMax   !== null)     params.set('precioMax',   String(filtros.precioMax))
  return `${API_BASE}/okm?${params.toString()}`
}

function buildUrlUsados(filtros: FiltrosState, page: number): string {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('size', String(PAGE_SIZE))
  if (filtros.marca       !== 'Todas')  params.set('marca',       filtros.marca)
  if (filtros.carroceria  !== 'Todas')  params.set('tipo',        filtros.carroceria)
  if (filtros.combustible !== 'Todos')  params.set('combustible', filtros.combustible)
  if (filtros.transmision !== 'Todas')  params.set('transmision', filtros.transmision)
  if (filtros.precioMax   !== null)     params.set('precioMax',   String(filtros.precioMax))
  if (filtros.kmMax       !== null)     params.set('kmMax',       String(filtros.kmMax))
  if (filtros.anioMin     !== null)     params.set('anioMin',     String(filtros.anioMin))
  return `${API_BASE}/usados?${params.toString()}`
}

// ─────────────────────────────────────────────
// Hook compartido: estado + fetch + paginado
// ─────────────────────────────────────────────
function useVehicleSection(buildUrl: (f: FiltrosState, p: number) => string) {
  const [filtros,        setFiltros]        = useState<FiltrosState>(FILTROS_INICIALES)
  const [vehicles,       setVehicles]       = useState<Vehicle[]>([])
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState(false)
  const [page,           setPage]           = useState(0)
  const [totalPaginas,   setTotalPaginas]   = useState(0)
  const [totalElementos, setTotalElementos] = useState(0)
  const [esUltima,       setEsUltima]       = useState(true)

  useEffect(() => {
    const url = buildUrl(filtros, page)
    setLoading(true)
    setError(false)
    fetch(url)
      .then((res) => { if (!res.ok) throw new Error(); return res.json() as Promise<PaginaVehiculos> })
      .then((data) => {
        setVehicles(data.contenido)
        setTotalPaginas(data.totalPaginas)
        setTotalElementos(data.totalElementos)
        setEsUltima(data.esUltima)
      })
      .catch(() => { setVehicles([]); setError(true) })
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros.marca, filtros.carroceria, filtros.combustible, filtros.transmision,
      filtros.precioMax, filtros.kmMax, filtros.anioMin, page])

  const handleFiltrosChange = useCallback((nuevos: FiltrosState) => {
    setPage(0)
    setFiltros(nuevos)
  }, [])

  return {
    vehicles, loading, error,
    page, setPage, totalPaginas, totalElementos, esUltima,
    filtros, handleFiltrosChange,
  }
}

// ─────────────────────────────────────────────
// Sección 0 km
// ─────────────────────────────────────────────
function SectionOkm() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)

  const {
    vehicles, loading, error,
    page, setPage, totalPaginas, totalElementos, esUltima,
    handleFiltrosChange,
  } = useVehicleSection(buildUrlOkm)

  useEffect(() => {
    if (!sectionRef.current) return
    const heading = sectionRef.current.querySelector('.section-heading')
    const sub     = sectionRef.current.querySelector('.section-sub')
    gsap.fromTo([heading, sub], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' })
  }, [])

  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll('.vehicle-card-wrapper')
    if (!cards.length) return
    gsap.fromTo(cards, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' })
  }, [vehicles])

  return (
    <section id="okm" ref={sectionRef} className="py-12 px-4 sm:px-6 lg:px-8 bg-[#eff5f8]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="section-sub text-[11px] font-medium tracking-[2px] text-[#1e3a5f] uppercase mb-2 opacity-0">
            Catálogo
          </p>
          <div className="flex items-end justify-between gap-4">
            <h2 className="section-heading text-[26px] sm:text-[32px] font-medium text-slate-900 leading-tight opacity-0">
              Vehículos 0 km
            </h2>
            <span className="text-[13px] text-slate-400 hidden sm:block shrink-0">
              {totalElementos} {totalElementos === 1 ? 'vehículo' : 'vehículos'} disponibles
            </span>
          </div>
        </div>

        <div className="flex flex-row gap-5 lg:gap-8 items-start">
          <Filtros
            onFiltrosChange={handleFiltrosChange}
            totalResultados={totalElementos}
            variant="okm"
          />
          <VehiclesPanel
            vehicles={vehicles} loading={loading} error={error}
            page={page} setPage={setPage}
            totalPaginas={totalPaginas} totalElementos={totalElementos} esUltima={esUltima}
            gridRef={gridRef} catalogo="okm"
          />
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// Sección Usados
// ─────────────────────────────────────────────
function SectionUsados() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)

  const {
    vehicles, loading, error,
    page, setPage, totalPaginas, totalElementos, esUltima,
    handleFiltrosChange,
  } = useVehicleSection(buildUrlUsados)

  useEffect(() => {
    if (!sectionRef.current) return
    const heading = sectionRef.current.querySelector('.section-heading')
    const sub     = sectionRef.current.querySelector('.section-sub')
    gsap.fromTo([heading, sub], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' })
  }, [])

  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll('.vehicle-card-wrapper')
    if (!cards.length) return
    gsap.fromTo(cards, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' })
  }, [vehicles])

  return (
    <section id="usados" ref={sectionRef} className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="section-sub text-[11px] font-medium tracking-[2px] text-[#1e3a5f] uppercase mb-2 opacity-0">
            Catálogo
          </p>
          <div className="flex items-end justify-between gap-4">
            <h2 className="section-heading text-[26px] sm:text-[32px] font-medium text-slate-900 leading-tight opacity-0">
              Vehículos usados
            </h2>
            <span className="text-[13px] text-slate-400 hidden sm:block shrink-0">
              {totalElementos} {totalElementos === 1 ? 'vehículo' : 'vehículos'} disponibles
            </span>
          </div>
        </div>

        <div className="flex flex-row gap-5 lg:gap-8 items-start">
          <Filtros
            onFiltrosChange={handleFiltrosChange}
            totalResultados={totalElementos}
            variant="usados"
          />
          <VehiclesPanel
            vehicles={vehicles} loading={loading} error={error}
            page={page} setPage={setPage}
            totalPaginas={totalPaginas} totalElementos={totalElementos} esUltima={esUltima}
            gridRef={gridRef} catalogo="usados"
          />
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// Panel compartido: grid + paginado
// ─────────────────────────────────────────────
interface VehiclesPanelProps {
  vehicles:       Vehicle[]
  loading:        boolean
  error:          boolean
  page:           number
  setPage:        (fn: (p: number) => number) => void
  totalPaginas:   number
  totalElementos: number
  esUltima:       boolean
  gridRef:        React.RefObject<HTMLDivElement | null>
  catalogo:       'okm' | 'usados'
}

function VehiclesPanel({
  vehicles, loading, error,
  page, setPage, totalPaginas, totalElementos, esUltima,
  gridRef, catalogo,
}: VehiclesPanelProps) {
  return (
    <div className="flex-1 min-w-0">

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 h-72 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-[15px] font-medium text-slate-700 mb-1">No se pudo cargar el catálogo</p>
          <p className="text-[13px] text-slate-400">Verificá que el servidor esté activo e intentá de nuevo.</p>
        </div>
      )}

      {!loading && !error && vehicles.length > 0 && (
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {vehicles.map((vehicle, i) => (
            <div key={vehicle.id} className="vehicle-card-wrapper">
              {catalogo === 'usados'
                ? <VehicleCardUsado vehicle={vehicle} animationDelay={i * 0.06} />
                : <VehicleCard vehicle={vehicle} animationDelay={i * 0.06} catalogo="okm" />
              }
            </div>
          ))}
        </div>
      )}

      {!loading && !error && vehicles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[15px] font-medium text-slate-700 mb-1">Sin resultados</p>
          <p className="text-[13px] text-slate-400">No hay vehículos que coincidan con los filtros seleccionados.</p>
        </div>
      )}

      {!loading && !error && totalPaginas > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[12px] text-slate-400 order-2 sm:order-1">
            Página {page + 1} de {totalPaginas} · {totalElementos}{' '}
            {totalElementos === 1 ? 'vehículo' : 'vehículos'}
          </span>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPaginas }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(() => i)}
                  className={`w-8 h-8 text-[12px] font-medium rounded-lg transition-colors ${
                    i === page ? 'bg-[#1e3a5f] text-white' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={esUltima}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Export principal
// ─────────────────────────────────────────────
export default function FeaturedVehicles() {
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash === 'okm' || hash === 'usados') {
      const timer = setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <SectionOkm />
      <SectionUsados />
    </>
  )
}
