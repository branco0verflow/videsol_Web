'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { X } from 'lucide-react'
import { API } from '@/lib/config'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactModalProps {
  open:          boolean
  onClose:       () => void
  vehiculo?:     string
  vehiculoId?:   number
  vehiculoTipo?: 'okm' | 'usado'
}

interface LeadResponse {
  exitoso: boolean
  mensaje: string
  leadId:  string | null
}

type Status = 'idle' | 'submitting' | 'done'

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContactModal({
  open, onClose, vehiculo, vehiculoId, vehiculoTipo = 'okm',
}: ContactModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const panelRef    = useRef<HTMLDivElement>(null)

  const [nombre,    setNombre]    = useState('')
  const [apellido,  setApellido]  = useState('')
  const [email,     setEmail]     = useState('')
  const [telefono,  setTelefono]  = useState('')
  const [comentario, setComentario] = useState('')
  const [aceptaNotificaciones, setAceptaNotificaciones] = useState(true)
  const [aceptaPublicidad,     setAceptaPublicidad]     = useState(false)

  const [status,    setStatus]    = useState<Status>('idle')
  const [result,    setResult]    = useState<LeadResponse | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)

  // ── Animate in/out ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!backdropRef.current || !panelRef.current) return
    if (open) {
      document.body.style.overflow = 'hidden'
      gsap.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' }
      )
      gsap.fromTo(panelRef.current,
        { opacity: 0, y: 28, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power3.out' }
      )
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // ── Auto-close after result shown ───────────────────────────────────────────
  useEffect(() => {
    if (status !== 'done') return
    const t = setTimeout(() => handleClose(), 2800)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const handleClose = () => {
    if (!backdropRef.current || !panelRef.current) { onClose(); return }
    gsap.to(panelRef.current,    { opacity: 0, y: 16, scale: 0.97, duration: 0.2, ease: 'power2.in' })
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => {
      onClose()
      // reset after close
      setTimeout(() => {
        setStatus('idle'); setResult(null); setFieldError(null)
        setNombre(''); setApellido(''); setEmail(''); setTelefono('')
        setComentario(''); setAceptaNotificaciones(true); setAceptaPublicidad(false)
      }, 300)
    }})
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFieldError(null)
    if (!nombre.trim())   return setFieldError('El nombre es requerido.')
    if (!apellido.trim()) return setFieldError('El apellido es requerido.')
    if (!email.trim())    return setFieldError('El email es requerido.')

    setStatus('submitting')
    try {
      const res = await fetch(`${API}/leads`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:               nombre.trim(),
          apellido:             apellido.trim(),
          email:                email.trim(),
          telefono:             telefono.trim() || '',
          comentario:           comentario.trim(),
          vehiculoTipo,
          vehiculoId:           vehiculoId ?? 0,
          aceptaNotificaciones,
          aceptaPublicidad,
        }),
      })
      const data: LeadResponse = await res.json()
      setResult(data)
    } catch {
      setResult({ exitoso: false, mensaje: 'No pudimos enviar tu consulta. Intentá de nuevo más tarde.', leadId: null })
    } finally {
      setStatus('done')
    }
  }

  if (!open) return null

  const isSuccess = result?.exitoso === true

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === backdropRef.current) handleClose() }}
    >
      <div
        ref={panelRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Accent bar */}
        <div className={`h-1 w-full transition-colors duration-500 ${
          status === 'done'
            ? isSuccess ? 'bg-emerald-500' : 'bg-red-400'
            : 'bg-[#c0392b]'
        }`} />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-[17px] font-bold text-slate-900 leading-tight">
              {status === 'done'
                ? isSuccess ? '¡Consulta enviada!' : 'Algo salió mal'
                : 'Me interesa este vehículo'
              }
            </h2>
            {status !== 'done' && vehiculo && (
              <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[280px] font-medium tracking-wide">
                {vehiculo}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            suppressHydrationWarning
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors shrink-0 ml-4 mt-0.5"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Done state ──────────────────────────────────────────────────── */}
        {status === 'done' && (
          <div className="px-6 py-10 flex flex-col items-center text-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isSuccess ? 'bg-emerald-50' : 'bg-red-50'
            }`}>
              {isSuccess ? (
                <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              )}
            </div>
            <div>
              <p className={`text-[15px] font-semibold mb-1 ${isSuccess ? 'text-slate-800' : 'text-slate-700'}`}>
                {isSuccess ? 'Consulta registrada' : 'No pudimos procesar tu consulta'}
              </p>
              <p className="text-[13px] text-slate-500 leading-relaxed max-w-75">
                {result?.mensaje}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="mt-2 px-6 py-2.5 text-[13px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* ── Form ────────────────────────────────────────────────────────── */}
        {status !== 'done' && (
          <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

            {/* Nombre + Apellido */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre" required>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Juan"
                  suppressHydrationWarning
                  className={inputCls}
                />
              </Field>
              <Field label="Apellido" required>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@email.com"
                suppressHydrationWarning
                className={inputCls}
              />
            </Field>

            {/* Teléfono */}
            <Field label="Teléfono">
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="099 000 000"
                suppressHydrationWarning
                className={inputCls}
              />
            </Field>

            {/* Comentario */}
            <Field label="Mensaje">
              <textarea
                rows={3}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="¿Tenés alguna consulta sobre el vehículo?"
                suppressHydrationWarning
                className={`${inputCls} resize-none`}
              />
            </Field>

            {/* Consentimientos */}
            <div className="flex flex-col gap-2.5 py-1">
              <ConsentRow
                checked={aceptaNotificaciones}
                onChange={setAceptaNotificaciones}
                label="Acepto recibir notificaciones sobre mi consulta"
              />
              <ConsentRow
                checked={aceptaPublicidad}
                onChange={setAceptaPublicidad}
                label="Acepto recibir novedades y ofertas de Videsol"
              />
            </div>

            {/* Error de validación */}
            {fieldError && (
              <p className="text-[12px] text-red-600 font-medium -mt-1">{fieldError}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              suppressHydrationWarning
              disabled={status === 'submitting'}
              className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#162d4a] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14px] font-semibold py-3.5 rounded-xl transition-all duration-200"
            >
              {status === 'submitting' ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Enviando…
                </>
              ) : (
                <>
                  Enviar consulta
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Tus datos son confidenciales y no serán compartidos con terceros.
            </p>

          </form>
        )}
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const inputCls =
  'w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1e3a5f]/60 focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all'

function Field({
  label, required = false, children,
}: {
  label: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
        {label}{required && <span className="text-[#c0392b] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function ConsentRow({
  checked, onChange, label,
}: {
  checked: boolean; onChange: (v: boolean) => void; label: string
}) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
          checked
            ? 'bg-[#1e3a5f] border-[#1e3a5f]'
            : 'border-slate-300 group-hover:border-slate-400 bg-white'
        }`}
      >
        {checked && (
          <svg viewBox="0 0 8 6" className="w-2 h-1.5">
            <polyline points="1,3 3,5 7,1" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-[12px] text-slate-600 leading-snug">{label}</span>
    </label>
  )
}
