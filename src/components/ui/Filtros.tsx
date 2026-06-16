'use client'

import { useState, useCallback } from 'react'

// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────
export interface FiltrosState {
  marca:       string
  carroceria:  string
  combustible: string
  transmision: string
  precioMax:   number | null
  kmMax:       number | null
  anioMin:     number | null
}

export const FILTROS_INICIALES: FiltrosState = {
  marca:       'Todas',
  carroceria:  'Todas',
  combustible: 'Todos',
  transmision: 'Todas',
  precioMax:   null,
  kmMax:       null,
  anioMin:     null,
}

interface FiltrosProps {
  onFiltrosChange: (filtros: FiltrosState) => void
  totalResultados: number
  variant?: 'okm' | 'usados'
}

// ─────────────────────────────────────────────
// OPCIONES
// ─────────────────────────────────────────────
const MARCAS        = ['Todas', 'BYD', 'Chevrolet', 'Citroen', 'Nissan', 'Peugeot', 'Renault', 'Riddara', 'Subaru']
const CARROCERIAS   = ['Todas', 'SUV', 'Pick-Up', 'Hatchback', 'Sedán', 'Furgón', 'Clásico', 'Utilitario', 'Crossover']
const COMBUSTIBLES  = ['Todos', 'Nafta', 'Diesel', 'Híbrido', 'Eléctrico']
const TRANSMISIONES = ['Todas', 'Manual', 'Automática', 'Automática (CVT)']

const RANGOS_PRECIO = [
  { label: 'Cualquiera',       value: null  },
  { label: 'Hasta USD 25.000', value: 25000 },
  { label: 'Hasta USD 30.000', value: 30000 },
  { label: 'Hasta USD 50.000', value: 50000 },
  { label: 'Hasta USD 85.000', value: 85000 },
]

const RANGOS_KM = [
  { label: 'Cualquiera',        value: null   },
  { label: 'Hasta 30.000 km',   value: 30000  },
  { label: 'Hasta 50.000 km',   value: 50000  },
  { label: 'Hasta 80.000 km',   value: 80000  },
  { label: 'Hasta 120.000 km',  value: 120000 },
]

const ANIO_MIN_OPCIONES = [
  { label: 'Cualquiera', value: null },
  { label: 'Desde 2022', value: 2022 },
  { label: 'Desde 2020', value: 2020 },
  { label: 'Desde 2018', value: 2018 },
  { label: 'Desde 2015', value: 2015 },
]

// ─────────────────────────────────────────────
// SUB-COMPONENTES
// ─────────────────────────────────────────────
function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-bold tracking-[2px] text-slate-400 uppercase mb-2">
      {children}
    </p>
  )
}

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      suppressHydrationWarning
      className={`
        px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all duration-150 w-full text-left
        ${active
          ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
          : 'bg-transparent text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700'
        }
      `}
    >
      {label}
    </button>
  )
}

function RadioRow({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      suppressHydrationWarning
      className={`flex items-center gap-2 text-left text-[11px] transition-colors duration-150 group ${
        active ? 'text-[#1e3a5f] font-semibold' : 'text-slate-400 hover:text-slate-700'
      }`}
    >
      <span className={`w-3 h-3 rounded-full border-2 shrink-0 transition-all ${
        active ? 'border-[#1e3a5f] bg-[#1e3a5f]' : 'border-slate-300 group-hover:border-slate-400'
      }`} />
      {label}
    </button>
  )
}

function Divider() {
  return <hr className="border-slate-100" />
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
export default function Filtros({ onFiltrosChange, totalResultados, variant = 'okm' }: FiltrosProps) {
  const [filtros, setFiltros] = useState<FiltrosState>(FILTROS_INICIALES)

  const hayFiltrosActivos =
    filtros.marca !== 'Todas' ||
    filtros.carroceria !== 'Todas' ||
    filtros.combustible !== 'Todos' ||
    filtros.transmision !== 'Todas' ||
    filtros.precioMax !== null ||
    filtros.kmMax !== null ||
    filtros.anioMin !== null

  const actualizar = useCallback(
    (parcial: Partial<FiltrosState>) => {
      const nuevos = { ...filtros, ...parcial }
      setFiltros(nuevos)
      onFiltrosChange(nuevos)
    },
    [filtros, onFiltrosChange]
  )

  const resetear = useCallback(() => {
    setFiltros(FILTROS_INICIALES)
    onFiltrosChange(FILTROS_INICIALES)
  }, [onFiltrosChange])

  return (
    <aside className="w-28 sm:w-36 shrink-0 self-start sticky top-24">
      <div className="bg-white rounded-sm border border-slate-100 shadow-sm overflow-hidden">

        {/* ── Header ── */}
        <div className="px-3 py-2.5 border-b border-slate-100">
          <p className="text-[10px] font-bold tracking-[2px] text-slate-400 uppercase">
            Filtros
          </p>
        </div>

        {/* ── Cuerpo ── */}
        <div className="p-2 flex flex-col gap-4">

          {/* Resultados */}
          <p className="text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">{totalResultados}</span>{' '}
            {totalResultados === 1 ? 'vehículo' : 'vehículos'}
          </p>

          <Divider />

          {/* Marca */}
          <div>
            <GroupLabel>Marca</GroupLabel>
            <div className="flex flex-col gap-1">
              {MARCAS.map((m) => (
                <Pill key={m} label={m} active={filtros.marca === m} onClick={() => actualizar({ marca: m })} />
              ))}
            </div>
          </div>

          <Divider />

          {/* Carrocería */}
          <div>
            <GroupLabel>Carrocería</GroupLabel>
            <div className="flex flex-col gap-1">
              {CARROCERIAS.map((c) => (
                <Pill key={c} label={c} active={filtros.carroceria === c} onClick={() => actualizar({ carroceria: c })} />
              ))}
            </div>
          </div>

          <Divider />

          {/* Combustible */}
          <div>
            <GroupLabel>Combustible</GroupLabel>
            <div className="flex flex-col gap-1">
              {COMBUSTIBLES.map((c) => (
                <Pill key={c} label={c} active={filtros.combustible === c} onClick={() => actualizar({ combustible: c })} />
              ))}
            </div>
          </div>

          <Divider />

          {/* Transmisión */}
          <div>
            <GroupLabel>Transmisión</GroupLabel>
            <div className="flex flex-col gap-1">
              {TRANSMISIONES.map((t) => (
                <Pill key={t} label={t} active={filtros.transmision === t} onClick={() => actualizar({ transmision: t })} />
              ))}
            </div>
          </div>

          <Divider />

          {/* Precio máximo */}
          <div>
            <GroupLabel>Precio máximo</GroupLabel>
            <div className="flex flex-col gap-1.5">
              {RANGOS_PRECIO.map((r) => (
                <RadioRow
                  key={r.label}
                  label={r.label}
                  active={filtros.precioMax === r.value}
                  onClick={() => actualizar({ precioMax: r.value })}
                />
              ))}
            </div>
          </div>

          {/* Filtros exclusivos de usados */}
          {variant === 'usados' && (
            <>
              <Divider />

              {/* Kilometraje máximo */}
              <div>
                <GroupLabel>Kilometraje máx.</GroupLabel>
                <div className="flex flex-col gap-1.5">
                  {RANGOS_KM.map((r) => (
                    <RadioRow
                      key={r.label}
                      label={r.label}
                      active={filtros.kmMax === r.value}
                      onClick={() => actualizar({ kmMax: r.value })}
                    />
                  ))}
                </div>
              </div>

              <Divider />

              {/* Año mínimo */}
              <div>
                <GroupLabel>Año mínimo</GroupLabel>
                <div className="flex flex-col gap-1.5">
                  {ANIO_MIN_OPCIONES.map((r) => (
                    <RadioRow
                      key={r.label}
                      label={r.label}
                      active={filtros.anioMin === r.value}
                      onClick={() => actualizar({ anioMin: r.value })}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Limpiar */}
          {hayFiltrosActivos && (
            <>
              <Divider />
              <button
                onClick={resetear}
                suppressHydrationWarning
                className="text-[11px] text-red-400 hover:text-red-600 font-medium underline underline-offset-2 transition-colors text-left"
              >
                Limpiar filtros
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
