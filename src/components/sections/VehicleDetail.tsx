'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import ContactModal from '@/components/ui/ContactModal'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface VehicleData {
  id:           string
  marca:        string
  modelo:       string
  version:      string
  anio:         number
  km:           number
  precio:       number
  tipo:         string | null
  cilindrada:   string | null
  potencia:     string | null
  combustible:  string | null
  color:        string | null
  puertas:      number
  direccion:    string | null
  transmision:  string | null
  garantia:     boolean
  financiacion: boolean
  descripcion:  string
  prin:         string
  imagenes:     string[]
  catalogo?:    string | null
}

interface VehicleDetailProps {
  vehicle: VehicleData
}

// ─── Equipamiento estático por categoría ─────────────────────────────────────

const EQUIPAMIENTO = [
  {
    id: 'seguridad',
    label: 'Seguridad',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    items: [
      'Airbag conductor',
      'Airbag pasajero',
      'Airbag de cortina',
      'Frenos ABS',
      'Control de tracción',
      'Control de estabilidad',
      'Asistencia de arranque en pendiente',
      'Faros antinieblas delanteros',
      'Sistema Isofix',
    ],
  },
  {
    id: 'confort',
    label: 'Confort',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    items: [
      'Climatizador automático',
      'Apertura sin llave Keyless',
      'Cristales eléctricos',
      'Espejos eléctricos',
      'Volante multifunción',
      'Cámara de retroceso',
      'Sensor de estacionamiento',
      'Control de velocidad crucero',
      'Regulación de altura del volante',
      'Computadora de abordo',
    ],
  },
  {
    id: 'entretenimiento',
    label: 'Multimedia',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    items: [
      'Pantalla multimedia',
      'Android Auto',
      'Apple CarPlay',
      'Radio AM/FM',
      'Bluetooth',
      'Entrada USB',
      'Comando satelital de stereo',
    ],
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatKm(km: number) {
  return km === 0 ? '0 km' : `${km.toLocaleString('es-UY')} km`
}

function formatPrice(price: number) {
  return price.toLocaleString('en-US')
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function VehicleDetail({ vehicle }: VehicleDetailProps) {
  const [activeIdx, setActiveIdx]         = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [paused, setPaused]               = useState(false)
  const [activeTab, setActiveTab]         = useState('seguridad')
  const [modalOpen, setModalOpen]         = useState(false)

  const mainImgRef = useRef<HTMLDivElement>(null)
  const infoRef    = useRef<HTMLDivElement>(null)
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = vehicle.imagenes.length

  // ── Entrance animation ──
  useEffect(() => {
    const tl = gsap.timeline()
    if (mainImgRef.current)
      tl.fromTo(mainImgRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
    if (infoRef.current)
      tl.fromTo(infoRef.current,    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
  }, [])

  // ── Autoplay ──
  const goTo = useCallback((idx: number) => {
    if (idx === activeIdx || transitioning) return
    setTransitioning(true)
    setActiveIdx(idx)
    setTimeout(() => setTransitioning(false), 350)
  }, [activeIdx, transitioning])

  useEffect(() => {
    if (total <= 1 || paused) return
    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % total)
    }, 3000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [total, paused])

  const handleThumbClick = (idx: number) => {
    setPaused(true)
    goTo(idx)
  }

  const goPrev = () => { setPaused(true); goTo(Math.max(0, activeIdx - 1)) }
  const goNext = () => { setPaused(true); goTo(Math.min(total - 1, activeIdx + 1)) }

  const isNew = vehicle.km === 0

  const specs = [
    { label: 'Combustible', value: vehicle.combustible  },
    { label: 'Transmisión', value: vehicle.transmision  },
    { label: 'Cilindrada',  value: vehicle.cilindrada   },
    { label: 'Potencia',    value: vehicle.potencia     },
    { label: 'Puertas',     value: String(vehicle.puertas) },
    { label: 'Dirección',   value: vehicle.direccion    },
    { label: 'Color',       value: vehicle.color        },
    { label: 'Tipo',        value: vehicle.tipo         },
  ].filter((s) => s.value != null && s.value !== '') as { label: string; value: string }[]

  const tabActivo = EQUIPAMIENTO.find((e) => e.id === activeTab)

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-8">
          <Link href="/" className="hover:text-slate-700 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/#catalogo" className="hover:text-slate-700 transition-colors">Catálogo</Link>
          <span>/</span>
          <span className="text-slate-600">{vehicle.marca} {vehicle.modelo}</span>
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* ── Left column: gallery + equipamiento ── */}
          <div className="w-full lg:w-[58%] flex flex-col gap-6">

            {/* Gallery */}
            <div ref={mainImgRef} className="opacity-0">

              {/* Main image */}
              <div
                className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3]"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {vehicle.imagenes.map((src, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 transition-opacity duration-350 ease-in-out"
                    style={{ opacity: i === activeIdx ? 1 : 0, zIndex: i === activeIdx ? 2 : 1 }}
                  >
                    <Image
                      src={src}
                      alt={`${vehicle.marca} ${vehicle.modelo} — foto ${i + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                ))}

                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`text-[11px] font-medium px-3 py-1.5 rounded-full tracking-wide ${
                    isNew ? 'bg-[#1e3a5f] text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}>
                    {isNew ? '0 km' : 'Usado'}
                  </span>
                </div>

                {/* Autoplay indicator */}
                {total > 1 && (
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => setPaused((p) => !p)}
                      className="w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
                      title={paused ? 'Reanudar' : 'Pausar'}
                    >
                      {paused ? (
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="white">
                          <polygon points="3,2 14,8 3,14" />
                        </svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="white">
                          <rect x="3" y="2" width="3.5" height="12" rx="1" />
                          <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}

                {/* Arrows */}
                {total > 1 && (
                  <>
                    <ArrowBtn direction="left"  onClick={goPrev} disabled={activeIdx === 0}           className="absolute left-3  top-1/2 -translate-y-1/2 z-10" />
                    <ArrowBtn direction="right" onClick={goNext} disabled={activeIdx === total - 1}    className="absolute right-3 top-1/2 -translate-y-1/2 z-10" />
                  </>
                )}

                {/* Progress bar autoplay */}
                {total > 1 && !paused && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-10">
                    <div
                      key={activeIdx}
                      className="h-full bg-white/70"
                      style={{ animation: 'progress 3s linear forwards' }}
                    />
                  </div>
                )}

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                  {vehicle.imagenes.map((_, i) => (
                    <button
                      key={i}
                      aria-label='imagen'
                      onClick={() => handleThumbClick(i)}
                      className={`rounded-full transition-all duration-200 ${
                        i === activeIdx ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                {vehicle.imagenes.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => handleThumbClick(i)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      i === activeIdx
                        ? 'border-[#1e3a5f] shadow-sm scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-300'
                    }`}
                  >
                    <Image src={src} alt={`Vista ${i + 1}`} fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* ── Equipamiento ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

              {/* Tabs */}
              <div className="flex border-b border-slate-100">
                {EQUIPAMIENTO.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-[12px] font-medium transition-all duration-150 border-b-2 ${
                      activeTab === cat.id
                        ? 'border-[#1e3a5f] text-[#1e3a5f]'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span className={activeTab === cat.id ? 'text-[#1e3a5f]' : 'text-slate-300'}>
                      {cat.icon}
                    </span>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Items grid */}
              {tabActivo && (
                <div className="p-5">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                    {tabActivo.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-[13px] text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f]/40 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>

          {/* ── Info Panel (right) ── */}
          <div ref={infoRef} className="w-full lg:w-[42%] lg:sticky lg:top-24 opacity-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

              {/* Header */}
              <div className="px-7 pt-7 pb-5 border-b border-slate-100">
                <p className="text-[10px] font-semibold tracking-[2px] text-slate-400 uppercase mb-1">
                  {vehicle.marca}
                </p>
                <h1 className="text-[26px] font-medium text-slate-900 leading-snug">
                  {vehicle.modelo}
                </h1>
                <p className="text-[14px] text-slate-500 mt-0.5 mb-4">
                  {vehicle.version}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge>{vehicle.anio}</Badge>
                  <Badge>{formatKm(vehicle.km)}</Badge>
                  <Badge>{vehicle.tipo}</Badge>
                </div>
                <div className="mt-5">
                  <span className="text-[32px] font-semibold text-slate-900 leading-none">
                    ${formatPrice(vehicle.precio)}
                  </span>
                  <span className="text-[13px] text-slate-400 ml-2">USD</span>
                </div>
              </div>

              {/* Specs */}
              <div className="px-7 py-5 border-b border-slate-100">
                <p className="text-[10px] font-semibold tracking-[2px] text-slate-400 uppercase mb-4">
                  Especificaciones
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
                  {specs.map((s) => (
                    <div key={s.label}>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">{s.label}</p>
                      <p className="text-[13px] font-medium text-slate-800">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="px-7 py-5 border-b border-slate-100">
                <p className="text-[10px] font-semibold tracking-[2px] text-slate-400 uppercase mb-3">
                  Descripción
                </p>
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  {vehicle.descripcion}
                </p>
              </div>

              {/* Garantías */}
              {(vehicle.garantia || vehicle.financiacion) && (
                <div className="px-7 py-4 border-b border-slate-100 flex flex-col gap-2">
                  {vehicle.garantia && (
                    <div className="flex items-center gap-2 text-[12px] text-emerald-600 font-medium">
                      <CheckIcon /> Garantía de fábrica
                    </div>
                  )}
                  {vehicle.financiacion && (
                    <div className="flex items-center gap-2 text-[12px] text-emerald-600 font-medium">
                      <CheckIcon /> Financiación disponible
                    </div>
                  )}
                </div>
              )}

              {/* CTAs */}
              <div className="px-7 py-6 flex flex-col gap-3">
                <button
                  onClick={() => setModalOpen(true)}
                  suppressHydrationWarning
                  className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-[14px] font-semibold py-3.5 rounded-xl transition-colors duration-200"
                >
                  <PhoneIcon /> Me interesa
                </button>
                {vehicle.financiacion && (
                  <a
                    href="https://www.miauto.com.uy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 border border-slate-200 hover:border-[#1e3a5f] text-slate-700 hover:text-[#1e3a5f] text-[13px] font-medium py-3 rounded-xl transition-all duration-200"
                  >
                    <Image src="/images/miauto.png" alt="MiAuto" width={60} height={20} className="object-contain h-5 w-auto" />
                    <span>Ver financiación</span>
                  </a>
                )}
                {vehicle.catalogo && (
                  <a
                    href={vehicle.catalogo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-[#1e3a5f] text-slate-700 hover:text-[#1e3a5f] text-[13px] font-medium py-3 rounded-xl transition-all duration-200"
                  >
                    <CatalogoIcon />
                    Ver catálogo
                  </a>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>

      <ContactModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        vehiculo={`${vehicle.marca} ${vehicle.modelo} ${vehicle.version}`}
      />

      {/* CSS para la barra de progreso */}
      <style jsx global>{`
        @keyframes progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
      {children}
    </span>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill="#d1fae5" />
      <path d="M5 8l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.02 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
    </svg>
  )
}

function CatalogoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function ArrowBtn({
  direction, onClick, disabled, className,
}: {
  direction: 'left' | 'right'
  onClick: () => void
  disabled: boolean
  className?: string
}) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const handleEnter = () => { if (!disabled && btnRef.current) gsap.to(btnRef.current, { scale: 1.1, duration: 0.2, ease: 'power2.out' }) }
  const handleLeave = () => { if (btnRef.current) gsap.to(btnRef.current, { scale: 1, duration: 0.2, ease: 'power2.out' }) }

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 shadow-md flex items-center justify-center transition-opacity duration-200 ${
        disabled ? 'opacity-30 cursor-not-allowed' : 'opacity-90 hover:opacity-100'
      } ${className}`}
    >
      {direction === 'left' ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M6 4l4 4-4 4" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}