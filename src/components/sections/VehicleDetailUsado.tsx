'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import ContactModal from '@/components/ui/ContactModal'
import type { VehicleUsadoDetailAPI } from '@/types/vehicle'

interface Props {
  vehicle: VehicleUsadoDetailAPI
}

// ─── Tabs de equipamiento ─────────────────────────────────────────────────────

const EQUIP_TABS = [
  {
    id: 'seguridad' as const,
    label: 'Seguridad',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: 'confort' as const,
    label: 'Confort',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'multimedia' as const,
    label: 'Multimedia',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
]

type EquipTabId = typeof EQUIP_TABS[number]['id']

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatKm(km: number) {
  return km === 0 ? '0 km' : `${km.toLocaleString('es-UY')} km`
}

function formatPrice(price: number) {
  return price.toLocaleString('en-US')
}

export default function VehicleDetailUsado({ vehicle }: Props) {
  const images = [...vehicle.imagenes]
    .sort((a, b) => a.orden - b.orden)
    .map((img) => img.url)
  const total = images.length

  const [activeIdx,     setActiveIdx]     = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [paused,        setPaused]        = useState(false)
  const [activeTab,     setActiveTab]     = useState<EquipTabId>('seguridad')
  const [modalOpen,     setModalOpen]     = useState(false)

  const mainImgRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const infoRef    = useRef<HTMLDivElement>(null)
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null)

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

  const handleThumbClick = (idx: number) => { setPaused(true); goTo(idx) }
  const goPrev = () => { setPaused(true); goTo(Math.max(0, activeIdx - 1)) }
  const goNext = () => { setPaused(true); goTo(Math.min(total - 1, activeIdx + 1)) }

  const tabItems = vehicle.caracteristicas?.[activeTab] ?? []

  const specs = [
    { label: 'Combustible', value: vehicle.combustible           },
    { label: 'Transmisión', value: vehicle.transmision           },
    { label: 'Kilómetros',  value: formatKm(vehicle.km)         },
    { label: 'Cilindrada',  value: vehicle.cilindrada            },
    { label: 'Potencia',    value: vehicle.potencia              },
    { label: 'Puertas',     value: String(vehicle.puertas)       },
    { label: 'Dirección',   value: vehicle.direccion             },
    { label: 'Color',       value: vehicle.color                 },
    { label: 'Tipo',        value: vehicle.tipo                  },
  ].filter((s) => s.value != null && s.value !== '') as { label: string; value: string }[]

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-8">
          <Link href="/" className="hover:text-slate-700 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/#usados" className="hover:text-slate-700 transition-colors">Usados</Link>
          <span>/</span>
          <span className="text-slate-600">{vehicle.marca} {vehicle.modelo}</span>
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* ── Left column: gallery + equipamiento ── */}
          <div className="w-full lg:w-[58%] flex flex-col gap-6">
            <div ref={mainImgRef} className="opacity-0">

              {/* Main image */}
              <div
                ref={galleryRef}
                className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-4/3"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {total > 0 ? images.map((src, i) => (
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
                )) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlaceholderCar />
                  </div>
                )}

                {/* Badge Usado */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[11px] font-medium px-3 py-1.5 rounded-full tracking-wide bg-white text-slate-600 border border-slate-200">
                    Usado
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
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="white"><polygon points="3,2 14,8 3,14" /></svg>
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
                    <ArrowBtn direction="left"  onClick={goPrev} disabled={activeIdx === 0}         className="absolute left-3  top-1/2 -translate-y-1/2 z-10" />
                    <ArrowBtn direction="right" onClick={goNext} disabled={activeIdx === total - 1}  className="absolute right-3 top-1/2 -translate-y-1/2 z-10" />
                  </>
                )}

                {/* Progress bar */}
                {total > 1 && !paused && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-10">
                    <div key={activeIdx} className="h-full bg-white/70" style={{ animation: 'progress 3s linear forwards' }} />
                  </div>
                )}

                {/* Dots */}
                {total > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        aria-label="imagen"
                        onClick={() => handleThumbClick(i)}
                        className={`rounded-full transition-all duration-200 ${
                          i === activeIdx ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {total > 1 && (
                <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => handleThumbClick(i)}
                      className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        i === activeIdx
                          ? 'border-[#1e3a5f] shadow-sm scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-300'
                      }`}
                    >
                      <Image src={src} alt={`Vista ${i + 1}`} fill sizes="64px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Equipamiento ── */}
            {vehicle.caracteristicas && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                  {EQUIP_TABS.map((cat) => (
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

                {/* Items */}
                <div className="p-5">
                  {tabItems.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                      {tabItems.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-[13px] text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f]/40 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[13px] text-slate-400">Sin información disponible.</p>
                  )}
                </div>

              </div>
            )}

          </div>

          {/* ── Info Panel (right) ── */}
          <div ref={infoRef} className="w-full lg:w-[42%] lg:sticky lg:top-24 opacity-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

              {/* Header */}
              <div className="px-7 pt-7 pb-5 border-b border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-semibold tracking-[2px] text-slate-400 uppercase">
                    {vehicle.marca}
                  </p>
                  <ShareButton />
                </div>
                <h1 className="text-[26px] font-medium text-slate-900 leading-snug">
                  {vehicle.modelo}
                </h1>
                <p className="text-[14px] text-slate-500 mt-0.5 mb-4">
                  {vehicle.version}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge>{vehicle.anio}</Badge>
                  <Badge>{formatKm(vehicle.km)}</Badge>
                  {vehicle.tipo && <Badge>{vehicle.tipo}</Badge>}
                </div>
                <div className="mt-5">
                  <span className="text-[32px] font-semibold text-slate-900 leading-none">
                    ${formatPrice(vehicle.precio ?? 0)}
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

              {/* Único dueño + Garantías + Financiación */}
              {(vehicle.garantia || vehicle.financiacion || vehicle.unicoDueno != null) && (
                <div className="px-7 py-4 border-b border-slate-100 flex flex-col gap-2">
                  {/* Único dueño — siempre visible si el campo existe */}
                  {vehicle.unicoDueno != null && (
                    <div className={`flex items-center gap-2 text-[12px] font-medium ${vehicle.unicoDueno ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {vehicle.unicoDueno ? <CheckIcon /> : <CrossIcon />}
                      {vehicle.unicoDueno ? 'Único dueño' : 'Múltiples dueños'}
                    </div>
                  )}
                  {vehicle.garantia && (
                    <div className="flex items-center gap-2 text-[12px] text-emerald-600 font-medium">
                      <CheckIcon /> Garantía incluida
                    </div>
                  )}
                  {vehicle.financiacion && (
                    <div className="flex items-center gap-2 text-[12px] text-emerald-600 font-medium">
                      <CheckIcon /> Financiación disponible
                    </div>
                  )}
                </div>
              )}

              {/* Patente */}
              {(vehicle.patenteMensual != null || vehicle.patenteAnual != null) && (
                <div className="px-7 py-4 border-b border-slate-100">
                  <p className="text-[10px] font-semibold tracking-[2px] text-slate-400 uppercase mb-3">
                    Patente
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {vehicle.patenteMensual != null && (
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Mensual</p>
                        <p className="text-[15px] font-semibold text-slate-800">
                          ${formatPrice(vehicle.patenteMensual)}
                          <span className="text-[10px] font-normal text-slate-400 ml-1">USD</span>
                        </p>
                      </div>
                    )}
                    {vehicle.patenteAnual != null && (
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Anual</p>
                        <p className="text-[15px] font-semibold text-slate-800">
                          ${formatPrice(vehicle.patenteAnual)}
                          <span className="text-[10px] font-normal text-slate-400 ml-1">USD</span>
                        </p>
                      </div>
                    )}
                  </div>
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
              </div>

            </div>
          </div>

        </div>
      </div>

      <ContactModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        vehiculo={`${vehicle.marca} ${vehicle.modelo} ${vehicle.version}`}
        vehiculoId={vehicle.id}
        vehiculoTipo="usado"
      />

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

function CrossIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill="#f1f5f9" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
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

function PlaceholderCar() {
  return (
    <svg width="200" height="90" viewBox="0 0 230 100" fill="none" opacity={0.12}>
      <rect x="15" y="50" width="200" height="28" rx="8" fill="#0f172a" />
      <rect x="52" y="24" width="118" height="30" rx="12" fill="#0f172a" />
      <circle cx="64" cy="81" r="15" stroke="#0f172a" strokeWidth="2.5" fill="none" />
      <circle cx="64" cy="81" r="5" fill="#0f172a" />
      <circle cx="166" cy="81" r="15" stroke="#0f172a" strokeWidth="2.5" fill="none" />
      <circle cx="166" cy="81" r="5" fill="#0f172a" />
      <rect x="178" y="54" width="26" height="12" rx="4" fill="#0f172a" opacity={0.4} />
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

function ShareButton() {
  const [open,   setOpen]   = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const getUrl = () => typeof window !== 'undefined' ? window.location.href : ''

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'twitter' | 'instagram') => {
    const url  = encodeURIComponent(getUrl())
    const text = encodeURIComponent('Mirá este vehículo en Videsol: ')
    if (platform === 'instagram') {
      navigator.clipboard.writeText(getUrl())
      setCopied(true)
      setTimeout(() => { setCopied(false); setOpen(false) }, 1600)
      return
    }
    const links = {
      whatsapp: `https://wa.me/?text=${text}${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter:  `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    }
    window.open(links[platform], '_blank', 'noopener,noreferrer,width=620,height=500')
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((p) => !p)}
        suppressHydrationWarning
        title="Compartir"
        className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#1e3a5f] transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      </button>

      <div className={`absolute right-0 top-10 z-20 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden w-48 transition-all duration-200 origin-top-right ${
        open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="py-1.5">
          {/* WhatsApp */}
          <button onClick={() => handleShare('whatsapp')} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-[#25D366] transition-colors font-medium">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366] shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.528 5.855L.057 23.882a.5.5 0 0 0 .61.61l6.086-1.459A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 0 1-5.127-1.418l-.364-.216-3.792.91.944-3.706-.236-.374A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            WhatsApp
          </button>
          {/* Facebook */}
          <button onClick={() => handleShare('facebook')} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-[#1877F2] transition-colors font-medium">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-[#1877F2] shrink-0">
              <path d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg>
            Facebook
          </button>
          {/* Twitter / X */}
          <button onClick={() => handleShare('twitter')} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-slate-800 shrink-0">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X (Twitter)
          </button>
          {/* Instagram — copia el enlace */}
          <button onClick={() => handleShare('instagram')} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-[#E1306C] transition-colors font-medium">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E1306C] shrink-0">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
            </svg>
            {copied ? '¡Enlace copiado!' : 'Copiar para Instagram'}
          </button>
        </div>
      </div>
    </div>
  )
}
