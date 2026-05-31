'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ToastListo from './0km/ToastListo'
import { API } from '@/lib/config'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Inconsistencia {
  code:        string
  marca:       string | null
  modelo:      string | null
  version:     string | null
  precio:      number | null
  tipoNegocio: string | null
  estado:      string
}

interface InconsistenciaUsado {
  id:      number
  pilotId: string
  marca:   string
  modelo:  string
  version: string
  activo:  boolean
  motivo:  string
}

interface ImagenUsado {
  id:          number
  url:         string
  esPrincipal: boolean
  orden:       number
}

interface UsadoConImagenes {
  imagenes: ImagenUsado[]
}

// ─── Nav cards data ───────────────────────────────────────────────────────────

const ACCIONES = [
  {
    href:        '/Lorem-admin/0km',
    titulo:      'Gestión de visibilidad 0 km',
    descripcion: 'Consultá precios desde Pilot, activá o desactivá vehículos y cargá fichas técnicas.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color:    'bg-emerald-50 border-emerald-200 text-emerald-700',
    btnColor: 'bg-emerald-600 hover:bg-emerald-700',
  },
  {
    href:        '/Lorem-admin/editar-0km',
    titulo:      'Editar 0 km',
    descripcion: 'Visualizá y editá los vehículos 0 km ya cargados en la web.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    color:    'bg-blue-50 border-blue-200 text-blue-700',
    btnColor: 'bg-[#1e3a5f] hover:bg-[#162d4a]',
  },
  {
    href:        '/Lorem-admin/cargar-usados',
    titulo:      'Cargar datos de usados',
    descripcion: 'Consultá el stock de Pilot, cargá usados con fotos y datos técnicos para publicarlos.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
    color:    'bg-violet-50 border-violet-200 text-violet-700',
    btnColor: 'bg-violet-600 hover:bg-violet-700',
  },
  {
    href:        '/Lorem-admin/editar-usados',
    titulo:      'Editar usados',
    descripcion: 'Visualizá y editá los vehículos usados ya publicados en la web.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    color:    'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700',
    btnColor: 'bg-fuchsia-600 hover:bg-fuchsia-700',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [inconsistencias, setInconsistencias] = useState<Inconsistencia[] | null>(null)
  const [detecting,       setDetecting]       = useState(false)
  const [detectError,     setDetectError]     = useState(false)
  const [deletingCode,    setDeletingCode]    = useState<string | null>(null)
  const [showListo,       setShowListo]       = useState(false)

  // ── Usados inconsistencias ────────────────────────────────────────────────
  const [inconsistenciasUsados, setInconsistenciasUsados] = useState<InconsistenciaUsado[] | null>(null)
  const [detectingUsados,       setDetectingUsados]       = useState(false)
  const [detectErrorUsados,     setDetectErrorUsados]     = useState(false)
  const [deletingUsadoId,       setDeletingUsadoId]       = useState<number | null>(null)
  const [deletingStep,          setDeletingStep]          = useState<string | null>(null)

  // ── Detectar inconsistencias 0km ──────────────────────────────────────────

  const buscarInconsistencias = async () => {
    setDetecting(true)
    setDetectError(false)
    try {
      const res = await fetch('${API}/admin/inconsistencias')
      if (!res.ok) throw new Error()
      const data: Inconsistencia[] = await res.json()
      setInconsistencias(data)
    } catch {
      setDetectError(true)
    } finally {
      setDetecting(false)
    }
  }

  // ── Eliminar registro 0km ─────────────────────────────────────────────────

  const eliminarRegistro = async (code: string) => {
    setDeletingCode(code)
    try {
      const res = await fetch(`${API}/admin/okm/code/${code}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setShowListo(true)
      setTimeout(() => {
        setShowListo(false)
        setInconsistencias((prev) => prev?.filter((i) => i.code !== code) ?? null)
      }, 750)
    } catch {
      // TODO: show inline error
    } finally {
      setDeletingCode(null)
    }
  }

  // ── Detectar inconsistencias usados ──────────────────────────────────────

  const buscarInconsistenciasUsados = async () => {
    setDetectingUsados(true)
    setDetectErrorUsados(false)
    try {
      const res = await fetch('${API}/admin/usados/inconsistencias')
      if (!res.ok) throw new Error()
      const data: InconsistenciaUsado[] = await res.json()
      setInconsistenciasUsados(data)
    } catch {
      setDetectErrorUsados(true)
    } finally {
      setDetectingUsados(false)
    }
  }

  // ── Eliminar usado (S3 + DB) ──────────────────────────────────────────────

  const eliminarUsado = async (item: InconsistenciaUsado) => {
    setDeletingUsadoId(item.id)
    try {
      // 1. Obtener vehículo con sus imágenes
      setDeletingStep('Obteniendo imágenes…')
      const resVehiculo = await fetch(`${API}/admin/usados/${item.id}`)
      if (!resVehiculo.ok) throw new Error()
      const vehiculo: UsadoConImagenes = await resVehiculo.json()

      // 2. Eliminar imágenes de S3 (continúa aunque alguna falle)
      if (vehiculo.imagenes.length > 0) {
        setDeletingStep(`Eliminando ${vehiculo.imagenes.length} imagen${vehiculo.imagenes.length !== 1 ? 'es' : ''}…`)
        await Promise.allSettled(
          vehiculo.imagenes.map((img) =>
            fetch(`${API}/admin/imagenes?url=${encodeURIComponent(img.url)}`, { method: 'DELETE' })
          )
        )
      }

      // 3. Eliminar de la DB
      setDeletingStep('Eliminando registro…')
      const resDelete = await fetch(`${API}/admin/usados/${item.id}`, { method: 'DELETE' })
      if (!resDelete.ok) throw new Error()

      setShowListo(true)
      setTimeout(() => {
        setShowListo(false)
        setInconsistenciasUsados((prev) => prev?.filter((i) => i.id !== item.id) ?? null)
      }, 750)
    } catch {
      // TODO: show inline error
    } finally {
      setDeletingUsadoId(null)
      setDeletingStep(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">

      <ToastListo visible={showListo} />

      {/* Top bar */}
      <header className="bg-[#1e3a5f] text-white px-6 py-3 flex items-center gap-4">
        <Image src="/images/logo22.png" alt="Videsol" width={100} height={34} className="h-8 w-auto object-contain" />
        <div className="w-px h-6 bg-white/20" />
        <div>
          <p className="text-[11px] text-white/50 font-medium tracking-widest uppercase leading-none">
            Panel de administración
          </p>
          <p className="text-[15px] font-semibold leading-tight">Dashboard</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">

        <div className="mb-4">
          <h1 className="text-[26px] font-semibold text-slate-800 leading-tight">¿Qué querés hacer?</h1>
          <p className="text-[14px] text-slate-500 mt-1">Seleccioná una sección para comenzar.</p>
        </div>

        {/* ── Nav cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {ACCIONES.map((a) => (
            <div key={a.href} className={`rounded-2xl border p-6 flex flex-col gap-4 ${a.color}`}>
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-0.5">{a.icon}</div>
                <div>
                  <h2 className="text-[16px] font-bold leading-snug">{a.titulo}</h2>
                  <p className="text-[13px] mt-1 opacity-80 leading-relaxed">{a.descripcion}</p>
                </div>
              </div>
              <Link href={a.href} className={`self-start px-5 py-2 text-[13px] font-semibold text-white rounded-xl transition-colors ${a.btnColor}`}>
                Ir →
              </Link>
            </div>
          ))}
        </div>

        {/* ── Detectar inconsistencias ── */}
        <div className="rounded-2xl border bg-orange-50 border-orange-200 text-orange-800 p-6 flex flex-col gap-5">

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="shrink-0 mt-0.5">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-[16px] font-bold leading-snug">Detectar inconsistencias</h2>
                <p className="text-[13px] mt-1 opacity-80 leading-relaxed">
                  Encuentra vehículos cargados que ya no existen en Pilot.
                </p>
              </div>
            </div>
            <button
              onClick={buscarInconsistencias}
              disabled={detecting}
              className="shrink-0 px-5 py-2 text-[13px] font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {detecting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Detectando…
                </>
              ) : 'Detectar'}
            </button>
          </div>

          {/* Error */}
          {detectError && (
            <p className="text-[13px] font-medium text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
              No se pudo conectar con el servidor. Intentá de nuevo.
            </p>
          )}

          {/* Sin inconsistencias */}
          {inconsistencias !== null && inconsistencias.length === 0 && (
            <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3.5 rounded-xl">
              <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[13px] font-semibold">Todo está sincronizado</span>
            </div>
          )}

          {/* Lista de inconsistencias */}
          {inconsistencias !== null && inconsistencias.length > 0 && (
            <div className="bg-white rounded-xl border border-orange-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-orange-100 bg-orange-50/50">
                <p className="text-[12px] font-bold text-orange-700 uppercase tracking-wider">
                  {inconsistencias.length} registro{inconsistencias.length > 1 ? 's' : ''} sin respaldo en Pilot
                </p>
              </div>
              <ul className="divide-y divide-slate-100">
                {inconsistencias.map((item) => (
                  <li key={item.code} className="flex items-center justify-between gap-4 px-4 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Estado badge */}
                      <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.estado === 'ACTIVO'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {item.estado}
                      </span>
                      {/* Info */}
                      <div className="min-w-0">
                        <span className="text-[12px] font-mono font-semibold text-slate-700">{item.code}</span>
                        {item.marca && (
                          <span className="text-[12px] text-slate-500 ml-2">
                            {item.marca}{item.modelo ? ` · ${item.modelo}` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => eliminarRegistro(item.code)}
                      disabled={deletingCode === item.code}
                      className="shrink-0 px-3 py-1.5 text-[11px] font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {deletingCode === item.code ? 'Eliminando…' : 'Eliminar registro'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* ── Inconsistencias de usados ── */}
        <div className="rounded-2xl border bg-rose-50 border-rose-200 text-rose-800 p-6 flex flex-col gap-5">

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="shrink-0 mt-0.5">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h2 className="text-[16px] font-bold leading-snug">Inconsistencias de usados</h2>
                <p className="text-[13px] mt-1 opacity-80 leading-relaxed">
                  Detecta vehículos usados vendidos o no disponibles que aún están en la web.
                </p>
              </div>
            </div>
            <button
              onClick={buscarInconsistenciasUsados}
              disabled={detectingUsados}
              className="shrink-0 px-5 py-2 text-[13px] font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {detectingUsados ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Detectando…
                </>
              ) : 'Detectar'}
            </button>
          </div>

          {/* Error */}
          {detectErrorUsados && (
            <p className="text-[13px] font-medium text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
              No se pudo conectar con el servidor. Intentá de nuevo.
            </p>
          )}

          {/* Sin inconsistencias */}
          {inconsistenciasUsados !== null && inconsistenciasUsados.length === 0 && (
            <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3.5 rounded-xl">
              <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[13px] font-semibold">Sin vehículos vendidos</span>
            </div>
          )}

          {/* Lista */}
          {inconsistenciasUsados !== null && inconsistenciasUsados.length > 0 && (
            <div className="bg-white rounded-xl border border-rose-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-rose-100 bg-rose-50/50">
                <p className="text-[12px] font-bold text-rose-700 uppercase tracking-wider">
                  {inconsistenciasUsados.length} vehículo{inconsistenciasUsados.length > 1 ? 's' : ''} vendido{inconsistenciasUsados.length > 1 ? 's' : ''} o no disponible{inconsistenciasUsados.length > 1 ? 's' : ''}
                </p>
              </div>
              <ul className="divide-y divide-slate-100">
                {inconsistenciasUsados.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Activo badge */}
                      <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.activo
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {item.activo ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                      {/* Info */}
                      <div className="min-w-0">
                        <span className="text-[13px] font-semibold text-slate-800">
                          {item.marca} {item.modelo}
                        </span>
                        <span className="text-[12px] text-slate-400 ml-2 truncate">
                          {item.version}
                        </span>
                        <p className="text-[10px] text-rose-400 font-mono mt-0.5">{item.motivo}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => eliminarUsado(item)}
                      disabled={deletingUsadoId === item.id}
                      className="shrink-0 px-3 py-1.5 text-[11px] font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-27.5 text-center"
                    >
                      {deletingUsadoId === item.id
                        ? (deletingStep ?? 'Eliminando…')
                        : 'Eliminar registro'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
