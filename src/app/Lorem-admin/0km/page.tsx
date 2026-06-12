'use client'

import { useState } from 'react'
import Image from 'next/image'
import CargarVehiculoForm from './CargarVehiculoForm'
import ToastListo from './ToastListo'
import { adminFetch } from '@/lib/adminFetch'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PrecioItem {
  id?:         number | null
  code:        string
  marca:       string
  modelo:      string
  version:     string
  precio:      number
  tipoNegocio: string
  estado:      'ACTIVO' | 'INACTIVO' | 'NO_CARGADO' | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  return price.toLocaleString('en-US')
}

function EstadoBadge({ estado }: { estado: PrecioItem['estado'] }) {
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

function ActionBtn({ estado, onClick }: { estado: PrecioItem['estado']; onClick?: () => void }) {
  if (estado === 'ACTIVO' || estado === null) {
    return (
      <button
        onClick={onClick}
        className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
      >
        Quitar de web
      </button>
    )
  }
  if (estado === 'INACTIVO') {
    return (
      <button
        onClick={onClick}
        className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors"
      >
        Mostrar en web
      </button>
    )
  }
  // NO_CARGADO
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-[#1e3a5f] hover:bg-[#162d4a] text-white transition-colors"
    >
      Cargar vehículo
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [view,         setView]         = useState<'search' | 'form'>('search')
  const [seleccionado, setSeleccionado] = useState<PrecioItem | null>(null)
  const [showListo,    setShowListo]    = useState(false)
  const [deletingCode, setDeletingCode] = useState<string | null>(null)

  const [marca,    setMarca]    = useState('')
  const [modelo,   setModelo]   = useState('')
  const [items,    setItems]    = useState<PrecioItem[]>([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(false)
  const [searched, setSearched] = useState(false)

  // ── Search (extraído para poder llamarlo después de toggle) ───────────────

  const doSearch = async (m: string, mo: string) => {
    setLoading(true)
    setError(false)
    try {
      const params = new URLSearchParams({ marca: m, modelo: mo })
      const res = await adminFetch(`/admin/pilot/precios?${params}`)
      if (!res.ok) throw new Error()
      const data: PrecioItem[] = await res.json()
      setItems(data)
    } catch {
      setError(true)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const m = marca.trim()
    const mo = modelo.trim()
    if (!m || !mo) return
    setSearched(true)
    await doSearch(m, mo)
  }

  // ── Toggle activo/inactivo ────────────────────────────────────────────────

  const handleToggleActivo = async (item: PrecioItem, activo: boolean) => {
    try {
      const res = await adminFetch(
        `/admin/okm/code/${item.code}/activar?activo=${activo}`,
        { method: 'PATCH' }
      )
      if (!res.ok) throw new Error()
      setShowListo(true)
      setTimeout(() => {
        setShowListo(false)
        doSearch(marca.trim(), modelo.trim())
      }, 750)
    } catch {
      // TODO: mostrar error
    }
  }

  // ── Eliminar registro ────────────────────────────────────────────────────

  const handleEliminar = async (code: string) => {
    setDeletingCode(code)
    try {
      const res = await adminFetch(`/admin/okm/code/${code}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setShowListo(true)
      setTimeout(() => {
        setShowListo(false)
        doSearch(marca.trim(), modelo.trim())
      }, 750)
    } catch {
      // TODO: mostrar error
    } finally {
      setDeletingCode(null)
    }
  }

  const handleCargar = (item: PrecioItem) => {
    setSeleccionado(item)
    setView('form')
  }

  // ── Counts ────────────────────────────────────────────────────────────────

  const counts = {
    publicados: items.filter((i) => i.estado === 'ACTIVO' || i.estado === null).length,
    inactivos:  items.filter((i) => i.estado === 'INACTIVO').length,
    noCargados: items.filter((i) => i.estado === 'NO_CARGADO').length,
  }

  // ── Views ─────────────────────────────────────────────────────────────────

  if (view === 'form' && seleccionado) {
    return (
      <CargarVehiculoForm
        vehiculo={seleccionado}
        onCancel={() => setView('search')}
        onSuccess={() => { setView('search'); setItems([]); setSearched(false) }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">

      <ToastListo visible={showListo} />

      {/* ── Top bar ── */}
      <header className="bg-[#1e3a5f] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/images/logo22.png" alt="Videsol" width={100} height={34} className="h-8 w-auto object-contain" />
          <div className="w-px h-6 bg-white/20" />
          <div>
            <p className="text-[11px] text-white/50 font-medium tracking-widest uppercase leading-none">
              Panel de administración
            </p>
            <p className="text-[15px] font-semibold leading-tight">Gestión de visibilidad 0 km</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Search ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-[13px] font-bold text-slate-500 tracking-widest uppercase mb-4">
            Consultar precios — Pilot
          </h2>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Marca  (ej: Citroen)"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className="flex-1 px-4 py-2.5 text-[13px] border border-slate-200 rounded-lg outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all placeholder:text-slate-300"
            />
            <input
              type="text"
              placeholder="Modelo  (ej: C3)"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              className="flex-1 px-4 py-2.5 text-[13px] border border-slate-200 rounded-lg outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all placeholder:text-slate-300"
            />
            <button
              type="submit"
              disabled={loading || !marca.trim() || !modelo.trim()}
              className="px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-[13px] font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {loading ? 'Consultando…' : 'Consultar'}
            </button>
          </form>
        </div>

        {/* ── Stats ── */}
        {searched && !loading && !error && items.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Activos"       value={counts.publicados} color="emerald" />
            <StatCard label="No publicados" value={counts.inactivos}  color="amber"   />
            <StatCard label="No cargados"   value={counts.noCargados} color="red"     />
          </div>
        )}

        {/* ── Results ── */}
        {searched && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-slate-700">
                {loading ? 'Cargando…' : error ? 'Error al consultar' : `${items.length} ${items.length === 1 ? 'resultado' : 'resultados'}`}
              </h3>
              {!loading && !error && items.length > 0 && (
                <span className="text-[11px] text-slate-400">
                  {marca.toUpperCase()} · {modelo.toUpperCase()}
                </span>
              )}
            </div>

            {loading && (
              <div className="divide-y divide-slate-50">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 flex gap-4">
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-20" />
                    <div className="h-4 bg-slate-100 rounded animate-pulse flex-1" />
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-24" />
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="px-6 py-12 text-center">
                <p className="text-[14px] font-medium text-slate-600 mb-1">No se pudo conectar con Pilot</p>
                <p className="text-[12px] text-slate-400">Verificá que el servidor esté activo e intentá de nuevo.</p>
              </div>
            )}

            {!loading && !error && items.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-[14px] font-medium text-slate-600 mb-1">Sin resultados</p>
                <p className="text-[12px] text-slate-400">
                  No se encontraron precios para <strong>{marca}</strong> <strong>{modelo}</strong>.
                </p>
              </div>
            )}

            {!loading && !error && items.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {['Código', 'Versión', 'Tipo', 'Precio', 'Estado', 'Acción', 'Eliminar'].map((h) => (
                        <th key={h} className="px-4 py-3 text-[10px] font-bold text-slate-400 tracking-widest uppercase whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {items.map((item) => (
                      <tr key={item.code} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3.5 text-[12px] font-mono text-slate-500 whitespace-nowrap">
                          {item.code}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-[13px] font-medium text-slate-800 leading-snug">{item.version}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.marca} · {item.modelo}</p>
                        </td>
                        <td className="px-4 py-3.5 text-[12px] text-slate-500 whitespace-nowrap">
                          {item.tipoNegocio}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-[14px] font-semibold text-slate-900">${formatPrice(item.precio)}</span>
                          <span className="text-[10px] text-slate-400 ml-1">USD</span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <EstadoBadge estado={item.estado} />
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <ActionBtn
                            estado={item.estado}
                            onClick={
                              item.estado === 'NO_CARGADO'
                                ? () => handleCargar(item)
                                : item.estado === 'INACTIVO'
                                ? () => handleToggleActivo(item, true)
                                : () => handleToggleActivo(item, false)
                            }
                          />
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {item.estado !== 'NO_CARGADO' && (
                            <button
                              onClick={() => handleEliminar(item.code)}
                              disabled={deletingCode === item.code}
                              className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {deletingCode === item.code ? 'Eliminando…' : 'Eliminar'}
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
        )}
      </div>
    </div>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number; color: 'emerald' | 'amber' | 'red' }) {
  const styles    = { emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700', amber: 'bg-amber-50 border-amber-100 text-amber-700', red: 'bg-red-50 border-red-100 text-red-700' }
  const numStyles = { emerald: 'text-emerald-800', amber: 'text-amber-800', red: 'text-red-800' }
  return (
    <div className={`rounded-xl border px-5 py-4 ${styles[color]}`}>
      <p className={`text-[28px] font-bold leading-none mb-1 ${numStyles[color]}`}>{value}</p>
      <p className="text-[11px] font-semibold tracking-wide uppercase opacity-70">{label}</p>
    </div>
  )
}
