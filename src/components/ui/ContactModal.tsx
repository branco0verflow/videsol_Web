'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { X, ShieldCheck } from 'lucide-react'

interface ContactModalProps {
  open:      boolean
  onClose:   () => void
  vehiculo?: string   // "Marca Modelo Versión" para mostrar en el form
}

const COUNTRY_CODES = [
  { code: '+598', flag: '🇺🇾', label: 'UY' },
  { code: '+54',  flag: '🇦🇷', label: 'AR' },
  { code: '+55',  flag: '🇧🇷', label: 'BR' },
  { code: '+56',  flag: '🇨🇱', label: 'CL' },
  { code: '+1',   flag: '🇺🇸', label: 'US' },
]

export default function ContactModal({ open, onClose, vehiculo }: ContactModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const panelRef    = useRef<HTMLDivElement>(null)
  const [captchaDone, setCaptchaDone] = useState(false)
  const [countryCode, setCountryCode] = useState('+598')

  // ── Animate in/out ──
  useEffect(() => {
    if (!backdropRef.current || !panelRef.current) return
    if (open) {
      document.body.style.overflow = 'hidden'
      gsap.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' }
      )
      gsap.fromTo(panelRef.current,
        { opacity: 0, y: 32, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' }
      )
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleClose = () => {
    if (!backdropRef.current || !panelRef.current) { onClose(); return }
    gsap.to(panelRef.current,    { opacity: 0, y: 16, scale: 0.97, duration: 0.2, ease: 'power2.in' })
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: onClose })
  }

  if (!open) return null

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === backdropRef.current) handleClose() }}
    >
      <div
        ref={panelRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-[18px] font-bold text-slate-900">Me interesa</h2>
            {vehiculo && (
              <p className="text-[12px] text-slate-400 mt-0.5 truncate max-w-[280px]">{vehiculo}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            suppressHydrationWarning
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors shrink-0 ml-4"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <form
          className="px-6 py-5 flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Nombre + Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre" required>
              <input
                type="text"
                placeholder="Juan"
                suppressHydrationWarning
                className={inputCls}
              />
            </Field>
            <Field label="Apellido" required>
              <input
                type="text"
                placeholder="García"
                suppressHydrationWarning
                className={inputCls}
              />
            </Field>
          </div>

          {/* Email */}
          <Field label="Email" required>
            <input
              type="email"
              placeholder="juan@email.com"
              suppressHydrationWarning
              className={inputCls}
            />
          </Field>

          {/* Teléfono */}
          <Field label="Número de celular">
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                suppressHydrationWarning
                className="bg-white border border-slate-300 rounded-xl px-2 py-2.5 text-[13px] text-slate-900 focus:outline-none focus:border-[#1e3a5f]/60 transition-colors shrink-0"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="099 000 000"
                suppressHydrationWarning
                className={`${inputCls} flex-1`}
              />
            </div>
          </Field>

          {/* Comentario */}
          <Field label="Comentario">
            <textarea
              rows={3}
              placeholder="¿Tenés alguna consulta o preferencia sobre el vehículo?"
              suppressHydrationWarning
              className={`${inputCls} resize-none`}
            />
          </Field>

          {/* reCAPTCHA (visual) */}
          <div
            className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 cursor-pointer select-none"
            onClick={() => setCaptchaDone((p) => !p)}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              captchaDone
                ? 'bg-emerald-500 border-emerald-500'
                : 'border-slate-300 bg-white'
            }`}>
              {captchaDone && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-[13px] text-slate-600 flex-1">No soy un robot</span>
            <div className="flex flex-col items-center gap-0.5">
              <ShieldCheck size={22} className="text-slate-300" />
              <span className="text-[8px] text-slate-300 font-medium tracking-wide">reCAPTCHA</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            suppressHydrationWarning
            disabled={!captchaDone}
            className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#162d4a] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[14px] font-semibold py-3.5 rounded-xl transition-all duration-200"
          >
            Enviar consulta
          </button>

          <p className="text-[11px] text-slate-400 text-center">
            Tus datos son confidenciales y no serán compartidos con terceros.
          </p>
        </form>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls =
  'w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1e3a5f]/60 focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all'

function Field({
  label, required = false, children,
}: {
  label: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-[0.15em] text-slate-600 uppercase">
        {label}{required && <span className="text-crimson ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}
