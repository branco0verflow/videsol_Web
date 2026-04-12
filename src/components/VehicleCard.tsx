'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Vehicle {
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
  catalogo?:          string | null
  colorSeleccionado?: string
  colores?:           Array<{ nombre: string; swatch: string; prin: string; imagenes: string[] }>
}

interface VehicleCardProps {
  vehicle:         Vehicle
  animationDelay?: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatKm(km: number): string {
  return km === 0 ? '0 km' : `${km.toLocaleString('es-UY')} km`
}

function formatPrice(price: number): string {
  return price.toLocaleString('en-US')
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function VehicleCard({ vehicle, animationDelay = 0 }: VehicleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isNew   = vehicle.km === 0

  useEffect(() => {
    if (!cardRef.current) return
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, delay: animationDelay, ease: 'power3.out' }
    )
  }, [animationDelay])

  const handleMouseEnter = () => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, { y: -6, duration: 0.25, ease: 'power2.out' })
  }
  const handleMouseLeave = () => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, { y: 0, duration: 0.25, ease: 'power2.out' })
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="opacity-0"
    >
      <Link href={`/vehiculos/${vehicle.id}`} className="block">
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)]">

          {/* Image */}
          <div className="relative bg-slate-50 h-32 sm:h-48 overflow-hidden">
            {vehicle.prin ? (
              <Image
                src={vehicle.prin}
                alt={`${vehicle.marca} ${vehicle.modelo}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PlaceholderCar />
              </div>
            )}

            {/* Badge */}
            <span
              className={`absolute top-3 left-3 text-[10px] font-medium px-3 py-1 rounded-full tracking-wide ${
                isNew
                  ? 'bg-[#1e3a5f] text-white'
                  : 'bg-white text-slate-500 border border-slate-200'
              }`}
            >
              {isNew ? '0 km' : 'Usado'}
            </span>

            {/* Financiación badge */}
            {vehicle.financiacion && (
              <span className="absolute bottom-3 left-3 text-[9px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 tracking-wide">
                Financiación
              </span>
            )}
          </div>

          {/* Body */}
          <div className="px-3 pb-3 pt-2.5 sm:px-5 sm:pb-5 sm:pt-4">
            <p className="text-[9px] sm:text-[10px] text-slate-400 tracking-[1.2px] uppercase mb-0.5 sm:mb-1">
              {vehicle.marca}
            </p>
            <h3 className="text-[14px] sm:text-[17px] font-medium text-slate-900 leading-snug">
              {vehicle.modelo}
            </h3>
            <p className="text-[11px] sm:text-[12px] text-slate-400 mb-2 sm:mb-4 truncate">
              {vehicle.version}
            </p>

            {/* Specs — en mobile solo Año y Km */}
            <div className="flex items-stretch mb-2 sm:mb-5">
              <SpecItem label="Año" value={String(vehicle.anio)} />
              <SpecDivider />
              <SpecItem label="Km"  value={formatKm(vehicle.km)} />
              <span className="hidden sm:contents">
                <SpecDivider />
                <SpecItem label="Comb." value={vehicle.combustible ?? '—'} />
                <SpecDivider />
                <SpecItem label="Caja"  value={vehicle.transmision?.split(' ')[0] ?? '—'} />
              </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 sm:pt-4 border-t border-slate-100">
              <div>
                <span className="text-[16px] sm:text-[21px] font-semibold text-slate-900">
                  ${formatPrice(vehicle.precio)}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 ml-1">USD</span>
              </div>
              <button suppressHydrationWarning className="text-[11px] sm:text-[12px] font-medium px-2.5 sm:px-4.5 py-1.5 sm:py-2.25 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#162d4a] transition-colors">
                Ver más
              </button>
            </div>
          </div>

        </div>
      </Link>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.75 flex-1 min-w-0">
      <span className="text-[13px] font-medium text-slate-900 truncate">{value}</span>
      <span className="text-[10px] text-slate-400">{label}</span>
    </div>
  )
}

function SpecDivider() {
  return <div className="w-px bg-slate-100 self-stretch mx-1 my-0.5" />
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
