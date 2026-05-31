'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CargarUsadoForm from './CargarUsadoForm'
import ToastListo from '../0km/ToastListo'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StockItem {
  pilotId:     string
  marca:       string
  modelo:      string
  version:     string
  anio:        string
  km:          string
  combustible: string
  color:       string
  precio:      string
  estado:      'ACTIVO' | 'INACTIVO' | 'NO_CARGADO' | null
}

// ─── Constants ────────────────────────────────────────────────────────────────

import { API_BASE } from '@/lib/config'

const PAGE_SIZE = 20

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatKm(km: string) {
  const n = parseInt(km)
  return isNaN(n) ? km : n.toLocaleString('en-US')
}

function formatPrice(precio: string) {
  const n = parseFloat(precio)
  return isNaN(n) ? precio : n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function EstadoBadge({ estado }: { estado: StockItem['estado'] }) {
  if (estado === 'ACTIVO' || estado === null) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Activo
      </span>
    )
  }
  if (estado === 'INACTIVO') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        No publicado
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
      No cargado
    </span>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: 'emerald' | 'amber' | 'red' | 'violet' }) {
  const styles    = {
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    amber:   'bg-amber-50   border-amber-100   text-amber-700',
    red:     'bg-red-50     border-red-100     text-red-700',
    violet:  'bg-violet-50  border-violet-100  text-violet-700',
  }
  const numStyles = {
    emerald: 'text-emerald-800',
    amber:   'text-amber-800',
    red:     'text-red-800',
    violet:  'text-violet-800',
  }
  return (
    <div className={`rounded-xl border px-5 py-4 ${styles[color]}`}>
      <p className={`text-[28px] font-bold leading-none mb-1 ${numStyles[color]}`}>{value}</p>
      <p className="text-[11px] font-semibold tracking-wide uppercase opacity-70">{label}</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CargarUsadosPage() {
  const [view,         setView]         = useState<'stock' | 'form'>('stock')
  const [seleccionado, setSeleccionado] = useState<StockItem | null>(null)
  const [showListo,    setShowListo]    = useState(false)

  const [items,   setItems]   = useState<StockItem[]>([])
  const [page,    setPage]    = useState(1)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // ── Fetch stock ───────────────────────────────────────────────────────────

  const fetchStock = useCallback(async (p: number) => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(`${API_BASE}/api/admin/pilot/stock?page=${p}&limit=${PAGE_SIZE}`)
      if (!res.ok) throw new Error()
      const data: StockItem[] = await res.json()
      setItems(data)
      setHasMore(data.length >= PAGE_SIZE)
    } catch {
      setError(true)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStock(page) }, [page, fetchStock])

  // ── Stats ─────────────────────────────────────────────────────────────────

  const counts = {
    activos:    items.filter((i) => i.estado === 'ACTIVO' || i.estado === null).length,
    inactivos:  items.filter((i) => i.estado === 'INACTIVO').length,
    noCargados: items.filter((i) => i.estado === 'NO_CARGADO').length,
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleCargar = (item: StockItem) => {
    setSeleccionado(item)
    setView('form')
  }

  const handleFormSuccess = () => {
    setView('stock')
    setSeleccionado(null)
    setShowListo(true)
    setTimeout(() => {
      setShowListo(false)
      fetchStock(page)
    }, 1200)
  }

  // ── Form view ─────────────────────────────────────────────────────────────

  if (view === 'form' && seleccionado) {
    return (
      <div className="min-h-screen bg-slate-100">
        <ToastListo visible={showListo} />
        <header className="bg-[#1e3a5f] text-white px-6 py-3 flex items-center gap-4">
          <Image src="/images/logo22.png" alt="Videsol" width={100} height={34} className="h-8 w-auto object-contain" />
          <div className="w-px h-6 bg-white/20" />
          <div>
            <p className="text-[11px] text-white/50 font-medium tracking-widest uppercase leading-none">Panel de administración</p>
            <p className="text-[15px] font-semibold leading-tight">Cargar usado</p>
          </div>
        </header>
        <CargarUsadoForm
          vehiculo={seleccionado}
          onCancel={() => { setView('stock'); setSeleccionado(null) }}
          onSuccess={handleFormSuccess}
        />
      </div>
    )
  }

  // ── Stock list view ───────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-100">

      <ToastListo visible={showListo} />

      {/* Top bar */}
      <header className="bg-[#1e3a5f] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/images/logo22.png" alt="Videsol" width={100} height={34} className="h-8 w-auto object-contain" />
          <div className="w-px h-6 bg-white/20" />
          <div>
            <p className="text-[11px] text-white/50 font-medium tracking-widest uppercase leading-none">Panel de administración</p>
            <p className="text-[15px] font-semibold leading-tight">Stock de usados — Pilot</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Breadcrumb */}
        <Link
          href="/Lorem-admin"
          className="inline-flex items-center gap-1.5 text-[12px] text-slate-600 hover:text-[#1e3a5f] font-medium transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>

        {/* Stats */}
        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total"        value={items.length}      color="violet"  />
            <StatCard label="Activos"      value={counts.activos}    color="emerald" />
            <StatCard label="No publicado" value={counts.inactivos}  color="amber"   />
            <StatCard label="No cargados"  value={counts.noCargados} color="red"     />
          </div>
        )}

        {/* Table card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-slate-700">
              {loading
                ? 'Consultando stock…'
                : error
                ? 'Error al consultar'
                : `${items.length} vehículo${items.length !== 1 ? 's' : ''} · Página ${page}`}
            </h3>
            <button
              onClick={() => fetchStock(page)}
              disabled={loading}
              className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 hover:text-[#1e3a5f] transition-colors disabled:opacity-40"
            >
              <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="divide-y divide-slate-50">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="px-6 py-4 flex gap-4">
                  <div className="h-4 bg-slate-100 rounded animate-pulse w-32" />
                  <div className="h-4 bg-slate-100 rounded animate-pulse flex-1" />
                  <div className="h-4 bg-slate-100 rounded animate-pulse w-20" />
                  <div className="h-4 bg-slate-100 rounded animate-pulse w-24" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="px-6 py-16 text-center">
              <p className="text-[14px] font-medium text-slate-600 mb-1">No se pudo conectar con Pilot</p>
              <p className="text-[12px] text-slate-400">Verificá que el servidor esté activo e intentá de nuevo.</p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && items.length === 0 && (
            <div className="px-6 py-16 text-center">
              <p className="text-[14px] font-medium text-slate-600">Sin vehículos en el stock</p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && items.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Vehículo', 'Año', 'KM', 'Precio ref.', 'Color', 'Combustible', 'Estado', 'Acción'].map((h) => (
                      <th key={h} className="px-4 py-3 text-[10px] font-bold text-slate-400 tracking-widest uppercase whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((item) => (
                    <tr key={item.pilotId} className="hover:bg-slate-50/60 transition-colors">

                      {/* Vehículo */}
                      <td className="px-4 py-3.5">
                        <p className="text-[13px] font-semibold text-slate-800 leading-snug">
                          {item.marca} {item.modelo}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-50">{item.version}</p>
                      </td>

                      {/* Año */}
                      <td className="px-4 py-3.5 text-[13px] text-slate-600 whitespace-nowrap">
                        {item.anio}
                      </td>

                      {/* KM */}
                      <td className="px-4 py-3.5 text-[13px] text-slate-600 whitespace-nowrap">
                        {formatKm(item.km)}&nbsp;<span className="text-[10px] text-slate-400">km</span>
                      </td>

                      {/* Precio */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-[14px] font-semibold text-slate-900">${formatPrice(item.precio)}</span>
                        <span className="text-[10px] text-slate-400 ml-1">USD</span>
                      </td>

                      {/* Color */}
                      <td className="px-4 py-3.5 text-[12px] text-slate-500 whitespace-nowrap">
                        {item.color.charAt(0).toUpperCase() + item.color.slice(1).toLowerCase()}
                      </td>

                      {/* Combustible */}
                      <td className="px-4 py-3.5 text-[12px] text-slate-500 whitespace-nowrap">
                        {item.combustible}
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <EstadoBadge estado={item.estado} />
                      </td>

                      {/* Acción */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {item.estado === 'NO_CARGADO' && (
                          <button
                            onClick={() => handleCargar(item)}
                            className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                          >
                            Cargar vehículo
                          </button>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* Pagination */}
        {!loading && !error && (items.length > 0 || page > 1) && (
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] text-slate-400">Página {page}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore}
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
