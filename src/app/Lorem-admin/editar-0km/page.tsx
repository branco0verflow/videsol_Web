'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import type { VehicleAPI, PaginaVehiculos } from '@/types/vehicle'

import { API as API_BASE } from '@/lib/config'

const PAGE_SIZE = 9

function buildUrl(page: number) {
  return `${API_BASE}/okm?page=${page}&size=${PAGE_SIZE}`
}

function formatPrice(p: number) {
  return p.toLocaleString('en-US')
}

// ─── Vehicle card (admin) ─────────────────────────────────────────────────────

function AdminCard({ vehicle }: { vehicle: VehicleAPI }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">

      {/* Image */}
      <div className="relative h-36 bg-slate-100 shrink-0">
        {vehicle.imagenPrincipalUrl ? (
          <Image
            src={vehicle.imagenPrincipalUrl}
            alt={`${vehicle.marca} ${vehicle.modelo}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="60" height="28" viewBox="0 0 230 100" fill="none" opacity={0.15}>
              <rect x="15" y="50" width="200" height="28" rx="8" fill="#0f172a" />
              <rect x="52" y="24" width="118" height="30" rx="12" fill="#0f172a" />
              <circle cx="64" cy="81" r="15" stroke="#0f172a" strokeWidth="2.5" fill="none" />
              <circle cx="166" cy="81" r="15" stroke="#0f172a" strokeWidth="2.5" fill="none" />
            </svg>
          </div>
        )}
        {vehicle.code && (
          <span className="absolute top-2 left-2 text-[10px] font-mono bg-white/90 backdrop-blur-sm text-slate-600 px-2 py-0.5 rounded border border-slate-200/60">
            {vehicle.code}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-4 pt-3 pb-4 flex flex-col gap-2 flex-1">
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{vehicle.marca}</p>
          <h3 className="text-[14px] font-semibold text-slate-800 leading-snug">{vehicle.modelo}</h3>
          <p className="text-[11px] text-slate-500 truncate">{vehicle.version}</p>
        </div>

        {/* Specs mini */}
        <div className="flex gap-2 text-[11px] text-slate-500 flex-wrap">
          <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">{vehicle.anio}</span>
          <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">{vehicle.combustible}</span>
          <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
            {vehicle.transmision?.split(' ')[0]}
          </span>
        </div>

        {/* Price + guarantees */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
          <div>
            <span className="text-[15px] font-bold text-slate-900">${formatPrice(vehicle.precio)}</span>
            <span className="text-[10px] text-slate-400 ml-1">USD</span>
          </div>
          <div className="flex gap-1">
            {vehicle.garantia && (
              <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded">
                Gtía
              </span>
            )}
            {vehicle.financiacion && (
              <span className="text-[9px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded">
                Fin.
              </span>
            )}
          </div>
        </div>

        {/* Edit button */}
        <Link
          href={`/Lorem-admin/editar-0km/${vehicle.id}`}
          className="block w-full mt-1 py-2 text-center text-[12px] font-semibold bg-[#1e3a5f] hover:bg-[#162d4a] text-white rounded-lg transition-colors"
        >
          Editar
        </Link>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Editar0kmPage() {
  const gridRef = useRef<HTMLDivElement>(null)

  const [vehicles,       setVehicles]       = useState<VehicleAPI[]>([])
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState(false)
  const [page,           setPage]           = useState(0)
  const [totalPaginas,   setTotalPaginas]   = useState(0)
  const [totalElementos, setTotalElementos] = useState(0)
  const [esUltima,       setEsUltima]       = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch(buildUrl(page))
      .then((res) => { if (!res.ok) throw new Error(); return res.json() as Promise<PaginaVehiculos> })
      .then((data) => {
        setVehicles(data.contenido)
        setTotalPaginas(data.totalPaginas)
        setTotalElementos(data.totalElementos)
        setEsUltima(data.esUltima)
      })
      .catch(() => { setVehicles([]); setError(true) })
      .finally(() => setLoading(false))
  }, [page])

  // GSAP on data change
  useEffect(() => {
    if (!gridRef.current || !vehicles.length) return
    gsap.fromTo(
      gridRef.current.querySelectorAll('.admin-card'),
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out' }
    )
  }, [vehicles])

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Top bar */}
      <header className="bg-[#1e3a5f] text-white px-6 py-3 flex items-center gap-4">
        <Image src="/images/logo22.png" alt="Videsol" width={100} height={34} className="h-8 w-auto object-contain" />
        <div className="w-px h-6 bg-white/20" />
        <div>
          <p className="text-[11px] text-white/50 font-medium tracking-widest uppercase leading-none">
            Panel de administración
          </p>
          <p className="text-[15px] font-semibold leading-tight">Editar 0 km</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Breadcrumb */}
        <Link
          href="/Lorem-admin"
          className="inline-flex items-center gap-1.5 text-[12px] text-slate-600 hover:text-[#1e3a5f] font-medium transition-colors mb-6"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <h1 className="text-[22px] font-semibold text-slate-800">Vehículos 0 km</h1>
          {!loading && !error && totalElementos > 0 && (
            <span className="text-[13px] text-slate-400">
              {totalElementos} {totalElementos === 1 ? 'vehículo' : 'vehículos'}
            </span>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 h-72 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white rounded-xl border border-slate-200 px-6 py-16 text-center">
            <p className="text-[15px] font-medium text-slate-700 mb-1">No se pudo cargar el catálogo</p>
            <p className="text-[13px] text-slate-400">Verificá que el servidor esté activo e intentá de nuevo.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && vehicles.length > 0 && (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {vehicles.map((v) => (
              <div key={v.id} className="admin-card">
                <AdminCard vehicle={v} />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && vehicles.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 px-6 py-16 text-center">
            <p className="text-[15px] font-medium text-slate-700">Sin vehículos cargados</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPaginas > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[12px] text-slate-400 order-2 sm:order-1">
              Página {page + 1} de {totalPaginas} · {totalElementos} vehículos
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
              <div className="flex gap-1">
                {Array.from({ length: totalPaginas }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
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
    </div>
  )
}
