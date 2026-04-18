'use client'

import { useState, useMemo } from 'react'
import { Users, TrendingUp, CalendarDays, Award, ChevronRight, Download, X, FileSpreadsheet } from 'lucide-react'
import leadsData from '../../../db/leads'

// ─── Types ────────────────────────────────────────────────────────────────────

type Lead = {
  nombre: string
  apellido: string
  email: string
  telefono: string
  comentario: string
  vehiculoNombreMarca: string
  fecha: string
}

// ─── Config ───────────────────────────────────────────────────────────────────

const BRANDS = ['BYD', 'Nissan', 'Citroën', 'Peugeot', 'Riddara', 'Renault', 'Subaru', 'Otros'] as const
type Brand = (typeof BRANDS)[number]

const BRAND_HUE: Record<Brand, string> = {
  BYD:     '#0078D4',
  Nissan:  '#C3002F',
  Citroën: '#7B2FBE',
  Peugeot: '#1B4D8E',
  Riddara: '#2C7A4B',
  Renault: '#D97706',
  Subaru:  '#003087',
  Otros:   '#6B7280',
}

const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function startOfWeek(d: Date) {
  const copy = new Date(d)
  copy.setDate(d.getDate() - d.getDay())
  copy.setHours(0, 0, 0, 0)
  return copy
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LeadsDashboard() {
  const [view,          setView]          = useState<'month' | 'week'>('month')
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [expandedLead,  setExpandedLead]  = useState<Lead | null>(null)
  const [exportOpen,    setExportOpen]    = useState(false)
  const [exportMonth,   setExportMonth]   = useState(new Date().getMonth())
  const [exportYear,    setExportYear]    = useState(new Date().getFullYear())

  const leads = leadsData.leads as Lead[]
  const today = new Date()

  // ── CSV download ──
  const downloadCSV = () => {
    const monthLeads = leads.filter(l => {
      const d = new Date(l.fecha)
      return d.getMonth() === exportMonth && d.getFullYear() === exportYear
    })

    const monthName = MONTHS[exportMonth]

    // Resumen por marca
    const brandSummary = BRANDS.map(brand => {
      const count = monthLeads.filter(l =>
        brand === 'Otros'
          ? !BRANDS.slice(0, -1).includes(l.vehiculoNombreMarca as Brand)
          : l.vehiculoNombreMarca === brand
      ).length
      return { brand, count }
    }).filter(b => b.count > 0)

    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`

    const rows: string[] = []

    // Sección 1: resumen
    rows.push(`RESUMEN DE LEADS — ${monthName} ${exportYear}`)
    rows.push('')
    rows.push('Marca,Consultas')
    brandSummary.forEach(b => rows.push(`${b.brand},${b.count}`))
    rows.push(`TOTAL,${monthLeads.length}`)
    rows.push('')
    rows.push('')

    // Sección 2: detalle
    rows.push(`DETALLE DE LEADS — ${monthName} ${exportYear}`)
    rows.push('')
    rows.push('Nombre,Apellido,Email,Teléfono,Marca,Fecha,Comentario')
    monthLeads
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      .forEach(l =>
        rows.push([
          escape(l.nombre),
          escape(l.apellido),
          escape(l.email),
          escape(l.telefono),
          escape(l.vehiculoNombreMarca),
          escape(new Date(l.fecha).toLocaleDateString('es-UY')),
          escape(l.comentario),
        ].join(','))
      )

    // BOM para que Excel abra UTF-8 correctamente
    const blob = new Blob(['\uFEFF' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `leads-videsol-${monthName.toLowerCase()}-${exportYear}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setExportOpen(false)
  }

  // Filtrar por marca si hay una seleccionada
  const filteredLeads = selectedBrand
    ? leads.filter(l =>
        selectedBrand === 'Otros'
          ? !BRANDS.slice(0, -1).includes(l.vehiculoNombreMarca as Brand)
          : l.vehiculoNombreMarca === selectedBrand
      )
    : leads

  // ── KPIs ──
  const thisMonthLeads = leads.filter(l => {
    const d = new Date(l.fecha)
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
  })
  const weekStart = startOfWeek(today)
  const thisWeekLeads = leads.filter(l => new Date(l.fecha) >= weekStart)
  const topBrand = [...BRANDS.slice(0, -1)].sort((a, b) =>
    leads.filter(l => l.vehiculoNombreMarca === b).length -
    leads.filter(l => l.vehiculoNombreMarca === a).length
  )[0]

  // ── Chart: mensual (últimos 6 meses) ──
  const monthlyData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1)
      const count = filteredLeads.filter(l => {
        const ld = new Date(l.fecha)
        return ld.getMonth() === d.getMonth() && ld.getFullYear() === d.getFullYear()
      }).length
      return { label: MONTHS[d.getMonth()], count }
    })
  }, [filteredLeads, today])

  // ── Chart: semanal (últimas 8 semanas) ──
  const weeklyData = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const ws = new Date(today)
      ws.setDate(today.getDate() - (7 - i) * 7 - today.getDay())
      ws.setHours(0, 0, 0, 0)
      const we = new Date(ws)
      we.setDate(ws.getDate() + 6)
      we.setHours(23, 59, 59)
      const count = filteredLeads.filter(l => {
        const ld = new Date(l.fecha)
        return ld >= ws && ld <= we
      }).length
      return { label: `${ws.getDate()} ${MONTHS[ws.getMonth()]}`, count }
    })
  }, [filteredLeads, today])

  const chartData = view === 'month' ? monthlyData : weeklyData
  const maxCount  = Math.max(...chartData.map(d => d.count), 1)

  // ── Conteos por marca (último mes) ──
  const brandCounts = useMemo(() =>
    BRANDS.map(brand => ({
      brand,
      count: thisMonthLeads.filter(l =>
        brand === 'Otros'
          ? !BRANDS.slice(0, -1).includes(l.vehiculoNombreMarca as Brand)
          : l.vehiculoNombreMarca === brand
      ).length,
      total: leads.filter(l =>
        brand === 'Otros'
          ? !BRANDS.slice(0, -1).includes(l.vehiculoNombreMarca as Brand)
          : l.vehiculoNombreMarca === brand
      ).length,
    }))
  , [thisMonthLeads, leads])

  const maxBrandCount = Math.max(...brandCounts.map(b => b.count), 1)

  // ── Últimos leads ──
  const recentLeads = [...filteredLeads]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-[#EEF2F7] p-5 lg:p-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[11px] font-bold tracking-[0.25em] text-slate-400 uppercase mb-1">Videsol — Panel interno</p>
          <h1 className="text-[1.6rem] font-black text-slate-900">Panel de Leads</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Export button */}
          <button
            onClick={() => setExportOpen(true)}
            suppressHydrationWarning
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold rounded-xl transition-colors shadow-sm"
          >
            <FileSpreadsheet size={14} />
            <span className="hidden sm:inline">Exportar Excel</span>
          </button>

          {/* View toggle */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1">
            {(['month', 'week'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                suppressHydrationWarning
                className={`px-4 py-1.5 text-[12px] font-bold rounded-lg transition-all ${
                  view === v ? 'bg-navy text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {v === 'month' ? 'Mensual' : 'Semanal'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total leads',    value: leads.length,          icon: Users,        color: 'text-navy',    bg: 'bg-navy/8'    },
          { label: 'Este mes',       value: thisMonthLeads.length, icon: CalendarDays, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Esta semana',    value: thisWeekLeads.length,  icon: TrendingUp,   color: 'text-violet-600',  bg: 'bg-violet-50'  },
          { label: 'Marca top',      value: topBrand,              icon: Award,        color: 'text-amber-600',   bg: 'bg-amber-50'   },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className={`w-8 h-8 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>
              <kpi.icon size={15} className={kpi.color} />
            </div>
            <p className="text-[11px] text-slate-400 font-medium mb-1">{kpi.label}</p>
            <p className="text-2xl font-black text-slate-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* ── Main: Chart + Brand panel ── */}
      <div className="grid lg:grid-cols-[1fr_260px] gap-5 mb-5">

        {/* Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[15px] font-black text-slate-900">
                Leads por {view === 'month' ? 'mes' : 'semana'}
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {selectedBrand ? `Filtrando: ${selectedBrand}` : 'Todas las marcas'}
              </p>
            </div>
            {selectedBrand && (
              <button
                onClick={() => setSelectedBrand(null)}
                suppressHydrationWarning
                className="text-[11px] font-semibold text-slate-400 hover:text-navy border border-slate-200 rounded-lg px-3 py-1.5 transition-colors"
              >
                Limpiar filtro ×
              </button>
            )}
          </div>

          {/* Bar Chart */}
          {(() => {
            const MAX_PX    = 148
            const isMax     = (count: number) => count === maxCount && count > 0
            return (
              <>
                {/* Bars row */}
                <div className="flex items-end gap-1.5 sm:gap-2.5 px-1" style={{ height: MAX_PX + 32 }}>
                  {chartData.map((d, i) => {
                    const barH = maxCount > 0
                      ? Math.max(Math.round((d.count / maxCount) * MAX_PX), d.count > 0 ? 8 : 3)
                      : 3
                    const peak = isMax(d.count)
                    return (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center justify-end gap-1.5"
                      >
                        {/* Count always visible */}
                        <span
                          className="text-[11px] font-black leading-none"
                          style={{ color: d.count === 0 ? '#CBD5E1' : peak ? '#059669' : '#374151' }}
                        >
                          {d.count}
                        </span>
                        {/* Bar with gradient */}
                        <div
                          className="w-full rounded-t-lg transition-all duration-700"
                          style={{
                            height: barH,
                            background: d.count === 0
                              ? '#F1F5F9'
                              : peak
                              ? 'linear-gradient(to top, #065f46, #10b981)'
                              : 'linear-gradient(to top, #047857, #34d399)',
                            boxShadow: peak && d.count > 0 ? '0 -2px 12px rgba(16,185,129,0.35)' : 'none',
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
                {/* Labels row */}
                <div className="flex gap-1.5 sm:gap-2.5 px-1 mt-2.5">
                  {chartData.map((d, i) => (
                    <div key={i} className="flex-1 text-center">
                      <span className="text-[10px] text-slate-400 font-semibold tracking-wide">{d.label}</span>
                    </div>
                  ))}
                </div>
              </>
            )
          })()}
        </div>

        {/* Brand Panel */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-5">
            <h2 className="text-[15px] font-black text-slate-900">Por marca</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Último mes — click para filtrar</p>
          </div>

          <div className="space-y-2">
            {brandCounts
              .sort((a, b) => b.count - a.count)
              .map(({ brand, count, total }) => {
                const isSelected = selectedBrand === brand
                const barW = maxBrandCount > 0 ? (count / maxBrandCount) * 100 : 0
                return (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(isSelected ? null : brand as Brand)}
                    suppressHydrationWarning
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all group ${
                      isSelected
                        ? 'bg-navy/6 border border-navy/20'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: BRAND_HUE[brand as Brand] }}
                        />
                        <span className={`text-[12px] font-semibold ${isSelected ? 'text-navy' : 'text-slate-700'}`}>
                          {brand}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-black text-slate-900">{count}</span>
                        <span className="text-[10px] text-slate-300">/ {total}</span>
                        <ChevronRight size={11} className={`text-slate-300 transition-transform ${isSelected ? 'rotate-90 text-navy' : ''}`} />
                      </div>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${barW}%`,
                          backgroundColor: BRAND_HUE[brand as Brand],
                        }}
                      />
                    </div>
                  </button>
                )
              })}
          </div>
        </div>
      </div>

      {/* ── Últimos leads ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[15px] font-black text-slate-900">Últimos leads</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {selectedBrand ? `${selectedBrand} — ` : ''}{filteredLeads.length} total
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {recentLeads.map((lead, i) => (
            <div key={i}>
              <button
                suppressHydrationWarning
                onClick={() => setExpandedLead(expandedLead === lead ? null : lead)}
                className="w-full text-left flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                  style={{ backgroundColor: BRAND_HUE[lead.vehiculoNombreMarca as Brand] ?? '#6B7280' }}
                >
                  {lead.nombre[0]}{lead.apellido[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-800 truncate">
                    {lead.nombre} {lead.apellido}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{lead.comentario}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: `${BRAND_HUE[lead.vehiculoNombreMarca as Brand] ?? '#6B7280'}18`,
                      color: BRAND_HUE[lead.vehiculoNombreMarca as Brand] ?? '#6B7280',
                    }}
                  >
                    {lead.vehiculoNombreMarca}
                  </span>
                  <span className="text-[10px] text-slate-300">
                    {new Date(lead.fecha).toLocaleDateString('es-UY', { day: '2-digit', month: 'short' })}
                  </span>
                  <ChevronRight
                    size={13}
                    className={`text-slate-300 transition-transform ${expandedLead === lead ? 'rotate-90' : ''}`}
                  />
                </div>
              </button>

              {/* Expanded detail */}
              {expandedLead === lead && (
                <div className="mx-4 mb-2 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[12px] mb-3">
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-0.5">Email</p>
                      <p className="text-slate-700 font-medium">{lead.email}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-0.5">Teléfono</p>
                      <p className="text-slate-700 font-medium">{lead.telefono}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-0.5">Fecha</p>
                      <p className="text-slate-700 font-medium">
                        {new Date(lead.fecha).toLocaleDateString('es-UY', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-0.5">Mensaje</p>
                    <p className="text-slate-600 text-[12px] leading-relaxed">{lead.comentario}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <a
                      href={`https://wa.me/${lead.telefono.replace(/\D/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-[11px] font-bold px-3 py-1.5 bg-[#25D366] text-white rounded-lg hover:bg-[#1ebe5a] transition-colors"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-[11px] font-bold px-3 py-1.5 bg-navy text-white rounded-lg hover:bg-navy-dark transition-colors"
                    >
                      Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Export Modal ── */}
      {exportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setExportOpen(false)}
          />

          {/* Panel */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 z-10">

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3">
                  <FileSpreadsheet size={18} className="text-emerald-600" />
                </div>
                <h2 className="text-[17px] font-black text-slate-900">Exportar leads</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Seleccioná el período a descargar</p>
              </div>
              <button
                onClick={() => setExportOpen(false)}
                suppressHydrationWarning
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
                  Mes
                </label>
                <select
                  value={exportMonth}
                  onChange={e => setExportMonth(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-slate-800 focus:outline-none focus:border-navy/40 transition-colors"
                >
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
                  Año
                </label>
                <select
                  value={exportYear}
                  onChange={e => setExportYear(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-slate-800 focus:outline-none focus:border-navy/40 transition-colors"
                >
                  {[2024, 2025, 2026].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preview */}
            {(() => {
              const preview = leads.filter(l => {
                const d = new Date(l.fecha)
                return d.getMonth() === exportMonth && d.getFullYear() === exportYear
              })
              const byBrand = BRANDS.map(b => ({
                brand: b,
                count: preview.filter(l =>
                  b === 'Otros'
                    ? !BRANDS.slice(0, -1).includes(l.vehiculoNombreMarca as Brand)
                    : l.vehiculoNombreMarca === b
                ).length,
              })).filter(b => b.count > 0)

              return (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-3">
                    Vista previa — {MONTHS[exportMonth]} {exportYear}
                  </p>
                  {preview.length === 0 ? (
                    <p className="text-[13px] text-slate-400 text-center py-2">Sin leads para este período</p>
                  ) : (
                    <>
                      <div className="space-y-1.5 mb-3">
                        {byBrand.map(({ brand, count }) => (
                          <div key={brand} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: BRAND_HUE[brand as Brand] ?? '#6B7280' }}
                              />
                              <span className="text-[12px] text-slate-600">{brand}</span>
                            </div>
                            <span className="text-[12px] font-bold text-slate-900">{count}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-slate-200 pt-2 flex justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total</span>
                        <span className="text-[13px] font-black text-navy">{preview.length} leads</span>
                      </div>
                    </>
                  )}
                </div>
              )
            })()}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setExportOpen(false)}
                suppressHydrationWarning
                className="flex-1 py-3 rounded-xl border border-slate-200 text-[13px] font-bold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={downloadCSV}
                suppressHydrationWarning
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold transition-colors"
              >
                <Download size={14} />
                Descargar .CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
