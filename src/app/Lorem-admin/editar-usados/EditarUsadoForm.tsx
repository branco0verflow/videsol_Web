'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { VehicleUsadoDetailAPI } from '@/types/vehicle'
import ToastListo from '../0km/ToastListo'

// ─── Constants ────────────────────────────────────────────────────────────────

const COMBUSTIBLES  = ['Nafta', 'Diésel', 'Híbrido', 'Eléctrico']
const TRANSMISIONES = ['Manual', 'Automática', 'CVT', 'Automatizada']
const DIRECCIONES   = ['Eléctrica', 'Mecánica', 'Hidráulica', 'Electrohidráulica', 'Eléctrica progresiva']
const TIPOS         = ['Sedán', 'Hatchback', 'SUV', 'Pickup', 'Coupé', 'Convertible', 'Minivan', 'Furgón', 'Otro']
const PUERTAS_OPT   = [2, 3, 4, 5]

import { adminFetch } from '@/lib/adminFetch'

// ─── Características ──────────────────────────────────────────────────────────

type CaracTab  = 'seguridad' | 'confort' | 'multimedia'
type CaracForm = Record<CaracTab, string[]>

const CARAC_TABS: { id: CaracTab; label: string }[] = [
  { id: 'seguridad',  label: 'Seguridad'  },
  { id: 'confort',    label: 'Confort'    },
  { id: 'multimedia', label: 'Multimedia' },
]

const PRESETS: Record<CaracTab, string[]> = {
  seguridad: [
    'Airbag conductor y acompañante',
    'Airbags laterales delanteros',
    'Airbags de cortina',
    'Frenos ABS con EBD',
    'Control de estabilidad (ESP)',
    'Control de tracción (TCS)',
    'Asistente de arranque en pendiente (HSA)',
    'Asistente de frenado de emergencia (BAS)',
    'Sistema de monitoreo de presión de neumáticos (TPMS)',
    'Cámara de retroceso',
    'Sensores de estacionamiento traseros',
    'Sensores de estacionamiento delanteros y traseros',
    'Anclajes ISOFIX para sillas infantiles',
    'Alarma antirrobo con inmovilizador',
  ],
  confort: [
    'Aire acondicionado manual',
    'Climatizador automático',
    'Aire acondicionado automático bizona',
    'Dirección asistida eléctrica (EPS)',
    'Levantavidrios eléctricos en las 4 puertas',
    'Espejos exteriores con regulación eléctrica',
    'Espejos exteriores rebatibles eléctricamente',
    'Cierre centralizado con comando a distancia',
    'Tapizados de cuero',
    'Asiento del conductor con regulación de altura',
    'Volante regulable en altura y profundidad',
    'Computadora de a bordo',
    'Llave con apertura sin contacto (Smart Key)',
    'Botón de arranque (Start/Stop)',
    'Control crucero',
  ],
  multimedia: [
    'Radio AM/FM con USB',
    'Pantalla táctil multimedia de 7"',
    'Pantalla táctil multimedia de 9"',
    'Pantalla táctil multimedia de 10" o superior',
    'Conectividad Apple CarPlay',
    'Conectividad Android Auto',
    'Apple CarPlay y Android Auto inalámbricos',
    'Bluetooth para llamadas y audio',
    'Sistema de audio con 4 parlantes',
    'Sistema de audio con 6 parlantes',
    'Puertos USB delanteros',
    'Puertos USB delanteros y traseros',
    'Cargador inalámbrico de smartphone',
    'Mandos al volante',
  ],
}

function ChecklistPreset({
  presets, selected, onToggle,
}: {
  presets:  string[]
  selected: string[]
  onToggle: (item: string) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-52 overflow-y-auto pr-1">
      {presets.map((item) => {
        const checked = selected.includes(item)
        return (
          <label
            key={item}
            onClick={() => onToggle(item)}
            className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-50 cursor-pointer group"
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
              checked ? 'bg-fuchsia-600 border-fuchsia-600' : 'border-slate-300 group-hover:border-slate-400'
            }`}>
              {checked && (
                <svg viewBox="0 0 8 6" className="w-2 h-1.5">
                  <polyline points="1,3 3,5 7,1" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className={`text-[12px] leading-snug ${checked ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>
              {item}
            </span>
          </label>
        )
      })}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseUnit(val: string | null | undefined, unit: string): string {
  if (!val) return ''
  return val.replace(new RegExp(`\\s*${unit}\\s*$`, 'i'), '').trim()
}

// ─── Types ────────────────────────────────────────────────────────────────────

// Represents any image shown in the editor (existing or newly uploaded)
interface ImagenEdit {
  id?:         number        // only existing images have an id
  url:         string        // S3 url (existing) or preview ObjectURL (new, pending)
  uploadedUrl: string | null // null = upload in progress; filled once done
  esPrincipal: boolean
  isNew:       boolean
}

interface FormState {
  marca:          string
  modelo:         string
  version:        string
  anio:           string
  km:             string
  tipo:           string
  cilindrada:     string
  potencia:       string
  combustible:    string
  color:          string
  puertas:        string
  direccion:      string
  transmision:    string
  garantia:       boolean
  financiacion:   boolean
  unicoDueno:     boolean
  patenteMensual: string
  patenteAnual:   string
  descripcion:    string
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-semibold transition-all select-none ${
        value
          ? 'bg-emerald-800 border-emerald-800 text-white shadow-sm'
          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
      }`}
    >
      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
        value ? 'border-white bg-white/20' : 'border-slate-300'
      }`}>
        {value && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      {label}
    </button>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">{children}</label>
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100">
        {title}
      </h2>
      {children}
    </div>
  )
}

const inputCls =
  'w-full px-3.5 py-2.5 text-[13px] text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/15 transition-all placeholder:text-slate-300'

const selectCls =
  'w-full px-3.5 py-2.5 text-[13px] text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/15 transition-all bg-white'

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  vehicle: VehicleUsadoDetailAPI
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EditarUsadoForm({ vehicle }: Props) {
  const router = useRouter()

  // Build initial imagenes from existing vehicle data
  const buildInitialImagenes = (): ImagenEdit[] =>
    vehicle.imagenes.map((img) => ({
      id:          img.id,
      url:         img.url,
      uploadedUrl: img.url,   // already uploaded
      esPrincipal: img.esPrincipal,
      isNew:       false,
    }))

  const [form, setForm] = useState<FormState>({
    marca:          vehicle.marca,
    modelo:         vehicle.modelo,
    version:        vehicle.version,
    anio:           String(vehicle.anio),
    km:             String(vehicle.km),
    tipo:           vehicle.tipo ?? '',
    cilindrada:     parseUnit(vehicle.cilindrada, 'cc'),
    potencia:       parseUnit(vehicle.potencia, 'hp'),
    combustible:    vehicle.combustible,
    color:          vehicle.color ?? '',
    puertas:        String(vehicle.puertas),
    direccion:      vehicle.direccion ?? '',
    transmision:    vehicle.transmision,
    garantia:       vehicle.garantia,
    financiacion:   vehicle.financiacion,
    unicoDueno:     vehicle.unicoDueno ?? false,
    patenteMensual: vehicle.patenteMensual != null ? String(vehicle.patenteMensual) : '',
    patenteAnual:   vehicle.patenteAnual  != null ? String(vehicle.patenteAnual)  : '',
    descripcion:    vehicle.descripcion,
  })

  const [imagenes,      setImagenes]      = useState<ImagenEdit[]>(buildInitialImagenes)
  const [removedUrls,   setRemovedUrls]   = useState<string[]>([])   // S3 urls to delete on submit
  const [uploading,     setUploading]     = useState(false)
  const [submitting,    setSubmitting]    = useState(false)
  const [showListo,     setShowListo]     = useState(false)
  const [submitError,   setSubmitError]   = useState<string | null>(null)

  const [carac, setCarac] = useState<CaracForm>({
    seguridad:  vehicle.caracteristicas?.seguridad  ?? [],
    confort:    vehicle.caracteristicas?.confort    ?? [],
    multimedia: vehicle.caracteristicas?.multimedia ?? [],
  })
  const [caracTab,    setCaracTab]    = useState<CaracTab>('seguridad')
  const [customInput, setCustomInput] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Helpers ───────────────────────────────────────────────────────────────

  const set = (key: keyof FormState, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }))

  const numOnly = (val: string) => val.replace(/\D/g, '')

  // ── Características helpers ───────────────────────────────────────────────

  const togglePreset = (tab: CaracTab, item: string) =>
    setCarac((prev) => ({
      ...prev,
      [tab]: prev[tab].includes(item)
        ? prev[tab].filter((x) => x !== item)
        : [...prev[tab], item],
    }))

  const addCustom = () => {
    const val = customInput.trim()
    if (!val || carac[caracTab].includes(val)) return
    setCarac((prev) => ({ ...prev, [caracTab]: [...prev[caracTab], val] }))
    setCustomInput('')
  }

  const removeItem = (tab: CaracTab, item: string) =>
    setCarac((prev) => ({ ...prev, [tab]: prev[tab].filter((x) => x !== item) }))

  const presetSet  = new Set(PRESETS[caracTab])
  const customItems = carac[caracTab].filter((x) => !presetSet.has(x))

  // ── Image: mark principal ─────────────────────────────────────────────────

  const setPrincipal = (idx: number) =>
    setImagenes((prev) => prev.map((img, i) => ({ ...img, esPrincipal: i === idx })))

  // ── Image: remove ─────────────────────────────────────────────────────────

  const removeImagen = (idx: number) => {
    const img = imagenes[idx]
    // Queue S3 deletion for existing (already-uploaded) images
    if (!img.isNew && img.uploadedUrl) {
      setRemovedUrls((prev) => [...prev, img.uploadedUrl!])
    }
    setImagenes((prev) => {
      const next = prev.filter((_, i) => i !== idx)
      // If removed was principal, promote first remaining to principal
      if (img.esPrincipal && next.length > 0) next[0] = { ...next[0], esPrincipal: true }
      return next
    })
  }

  // ── Image: upload new ─────────────────────────────────────────────────────

  const handleImagenesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    if (imagenes.length + files.length > 10) {
      alert('Máximo 10 fotos por vehículo.')
      return
    }

    const placeholders: ImagenEdit[] = files.map((f, i) => ({
      url:         URL.createObjectURL(f),
      uploadedUrl: null,
      esPrincipal: imagenes.length === 0 && i === 0,
      isNew:       true,
    }))
    setImagenes((prev) => [...prev, ...placeholders])
    setUploading(true)

    try {
      const fd = new FormData()
      files.forEach((f) => fd.append('files', f))
      const res = await adminFetch('/admin/imagenes/upload?carpeta=usados', {
        method: 'POST',
        body:   fd,
      })
      if (!res.ok) throw new Error()
      const { urls }: { urls: string[] } = await res.json()

      setImagenes((prev) => {
        const updated = [...prev]
        let urlIdx = 0
        for (let i = 0; i < updated.length; i++) {
          if (updated[i].uploadedUrl === null && updated[i].isNew) {
            updated[i] = { ...updated[i], uploadedUrl: urls[urlIdx++] }
          }
        }
        return updated
      })
    } catch {
      setSubmitError('No se pudieron subir algunas imágenes.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)

    if (uploading) { setSubmitError('Esperá a que terminen de subirse las imágenes.'); return }
    if (imagenes.some((img) => img.uploadedUrl === null)) {
      setSubmitError('Algunas imágenes no terminaron de subirse.')
      return
    }

    setSubmitting(true)
    try {
      // 1. Delete removed images from S3
      if (removedUrls.length > 0) {
        await Promise.allSettled(
          removedUrls.map((url) =>
            adminFetch(`/admin/imagenes?url=${encodeURIComponent(url)}`, { method: 'DELETE' })
          )
        )
      }

      // 2. Build PUT body
      const body = {
        ...(vehicle.pilotId ? { pilotId: vehicle.pilotId } : {}),
        activo:         vehicle.activo,
        marca:          form.marca.trim(),
        modelo:         form.modelo.trim(),
        version:        form.version.trim(),
        anio:           parseInt(form.anio) || 0,
        km:             parseInt(numOnly(form.km)) || 0,
        combustible:    form.combustible,
        color:          form.color.trim() || null,
        tipo:           form.tipo || null,
        cilindrada:     form.cilindrada ? `${form.cilindrada} cc` : null,
        potencia:       form.potencia   ? `${form.potencia} hp`   : null,
        puertas:        parseInt(form.puertas) || 4,
        direccion:      form.direccion  || null,
        transmision:    form.transmision,
        garantia:       form.garantia,
        financiacion:   form.financiacion,
        unicoDueno:     form.unicoDueno,
        patenteMensual: form.patenteMensual ? parseFloat(form.patenteMensual) : null,
        patenteAnual:   form.patenteAnual   ? parseFloat(form.patenteAnual)   : null,
        descripcion:    form.descripcion.trim(),
        ...(vehicle.precioRef ? { precioRef: vehicle.precioRef } : {}),
        caracteristicas: {
          seguridad:  carac.seguridad,
          confort:    carac.confort,
          multimedia: carac.multimedia,
        },
        imagenes: imagenes.map((img, i) => ({
          ...(img.id != null ? { id: img.id } : {}),
          url:         img.uploadedUrl!,
          esPrincipal: img.esPrincipal,
          orden:       i + 1,
        })),
      }

      // 3. PUT
      const res = await adminFetch(`/admin/usados/${vehicle.id}`, {
        method: 'PUT',
        body:   JSON.stringify(body),
      })
      if (!res.ok) throw new Error()

      setShowListo(true)
      setTimeout(() => router.push('/Lorem-admin/editar-usados'), 1000)
    } catch {
      setSubmitError('No se pudo guardar el vehículo. Revisá los datos e intentá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

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
          <p className="text-[15px] font-semibold leading-tight">Editar usado</p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* Breadcrumb */}
          <button
            type="button"
            onClick={() => router.push('/Lorem-admin/editar-usados')}
            className="inline-flex items-center gap-1.5 text-[12px] text-slate-600 hover:text-[#1e3a5f] font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Volver al listado
          </button>

          <div className="flex items-center justify-between -mt-2">
            <h1 className="text-[22px] font-semibold text-slate-800">
              {vehicle.marca} {vehicle.modelo}
            </h1>
            <span className="text-[11px] font-mono text-slate-400">ID {vehicle.id}</span>
          </div>

          {/* ── Identificación ── */}
          <Section title="Identificación">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <Label>Marca</Label>
                <input required type="text" value={form.marca} onChange={(e) => set('marca', e.target.value)} className={inputCls} />
              </div>

              <div>
                <Label>Modelo</Label>
                <input required type="text" value={form.modelo} onChange={(e) => set('modelo', e.target.value)} className={inputCls} />
              </div>

              <div className="sm:col-span-2">
                <Label>Versión</Label>
                <input required type="text" value={form.version} onChange={(e) => set('version', e.target.value)} className={inputCls} />
              </div>

              <div>
                <Label>Tipo de carrocería</Label>
                <select value={form.tipo} onChange={(e) => set('tipo', e.target.value)} className={selectCls}>
                  <option value="">— Seleccionar —</option>
                  {TIPOS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <Label>Color</Label>
                <input type="text" placeholder="Ej: Rojo Fuego" value={form.color} onChange={(e) => set('color', e.target.value)} className={inputCls} />
              </div>

            </div>
          </Section>

          {/* ── Datos clave ── */}
          <Section title="Datos clave">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

              <div>
                <Label>Año</Label>
                <input
                  required type="text" inputMode="numeric"
                  value={form.anio}
                  onChange={(e) => set('anio', numOnly(e.target.value).slice(0, 4))}
                  className={inputCls}
                />
              </div>

              <div>
                <Label>Kilometraje</Label>
                <div className="relative">
                  <input
                    required type="text" inputMode="numeric"
                    value={form.km}
                    onChange={(e) => set('km', numOnly(e.target.value))}
                    className={`${inputCls} pr-10`}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 pointer-events-none">km</span>
                </div>
              </div>

            </div>
          </Section>

          {/* ── Datos técnicos ── */}
          <Section title="Datos técnicos">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

              <div>
                <Label>Combustible</Label>
                <select value={form.combustible} onChange={(e) => set('combustible', e.target.value)} className={selectCls}>
                  {COMBUSTIBLES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <Label>Transmisión</Label>
                <select value={form.transmision} onChange={(e) => set('transmision', e.target.value)} className={selectCls}>
                  {TRANSMISIONES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <Label>Dirección</Label>
                <select value={form.direccion} onChange={(e) => set('direccion', e.target.value)} className={selectCls}>
                  <option value="">— Seleccionar —</option>
                  {DIRECCIONES.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <Label>Puertas</Label>
                <select value={form.puertas} onChange={(e) => set('puertas', e.target.value)} className={selectCls}>
                  {PUERTAS_OPT.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <Label>Cilindrada</Label>
                <div className="relative">
                  <input
                    type="text" inputMode="numeric" placeholder="1800"
                    value={form.cilindrada}
                    onChange={(e) => set('cilindrada', numOnly(e.target.value))}
                    className={`${inputCls} pr-10`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 pointer-events-none">cc</span>
                </div>
              </div>

              <div>
                <Label>Potencia</Label>
                <div className="relative">
                  <input
                    type="text" inputMode="numeric" placeholder="140"
                    value={form.potencia}
                    onChange={(e) => set('potencia', numOnly(e.target.value))}
                    className={`${inputCls} pr-10`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 pointer-events-none">hp</span>
                </div>
              </div>

            </div>

            {/* Toggles */}
            <div className="flex gap-3 pt-1 flex-wrap">
              <Toggle label="Garantía"     value={form.garantia}    onChange={(v) => set('garantia', v)} />
              <Toggle label="Financiación" value={form.financiacion} onChange={(v) => set('financiacion', v)} />
              <Toggle label="Único dueño"  value={form.unicoDueno}  onChange={(v) => set('unicoDueno', v)} />
            </div>
          </Section>

          {/* ── Patente ── */}
          <Section title="Patente">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Patente mensual</Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-slate-400 pointer-events-none">$</span>
                  <input
                    type="text" inputMode="decimal" placeholder="45.00"
                    value={form.patenteMensual}
                    onChange={(e) => set('patenteMensual', e.target.value.replace(/[^0-9.]/g, ''))}
                    className={`${inputCls} pl-7 pr-12`}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">USD</span>
                </div>
              </div>
              <div>
                <Label>Patente anual</Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-slate-400 pointer-events-none">$</span>
                  <input
                    type="text" inputMode="decimal" placeholder="540.00"
                    value={form.patenteAnual}
                    onChange={(e) => set('patenteAnual', e.target.value.replace(/[^0-9.]/g, ''))}
                    className={`${inputCls} pl-7 pr-12`}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">USD</span>
                </div>
              </div>
            </div>
          </Section>

          {/* ── Descripción ── */}
          <Section title="Descripción">
            <Label>Descripción del vehículo</Label>
            <textarea
              rows={4}
              value={form.descripcion}
              onChange={(e) => set('descripcion', e.target.value)}
              className={`${inputCls} resize-none`}
            />
          </Section>

          {/* ── Características ── */}
          <Section title="Características">

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
              {CARAC_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCaracTab(tab.id)}
                  className={`px-4 py-1.5 text-[12px] font-semibold rounded-lg transition-all ${
                    caracTab === tab.id
                      ? 'bg-white text-fuchsia-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                  {carac[tab.id].length > 0 && (
                    <span className="ml-1.5 text-[10px] bg-fuchsia-100 text-fuchsia-600 px-1.5 py-0.5 rounded-full font-bold">
                      {carac[tab.id].length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Preset checklist */}
            <ChecklistPreset
              presets={PRESETS[caracTab]}
              selected={carac[caracTab]}
              onToggle={(item) => togglePreset(caracTab, item)}
            />

            {/* Custom items */}
            {customItems.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {customItems.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 text-[11px] bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 px-2.5 py-1 rounded-full font-medium"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeItem(caracTab, item)}
                      className="text-fuchsia-400 hover:text-fuchsia-700 transition-colors leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Custom input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder={`Agregar característica de ${CARAC_TABS.find(t => t.id === caracTab)?.label.toLowerCase()}…`}
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }}
                className={`${inputCls} flex-1`}
              />
              <button
                type="button"
                onClick={addCustom}
                disabled={!customInput.trim()}
                className="px-4 py-2.5 text-[12px] font-semibold bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                Agregar
              </button>
            </div>

          </Section>

          {/* ── Fotos ── */}
          <Section title="Fotos">
            <p className="text-[12px] text-slate-500 -mt-2">
              Hacé clic en una imagen para marcarla como <strong>principal</strong>.
              Las imágenes eliminadas se borrarán de S3 al guardar.
            </p>

            {/* Grid */}
            {imagenes.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {imagenes.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPrincipal(idx)}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      img.esPrincipal ? 'border-fuchsia-500 shadow-md' : 'border-transparent hover:border-slate-300'
                    }`}
                    style={{ aspectRatio: '4/3' }}
                  >
                    <Image
                      src={img.isNew ? img.url : img.uploadedUrl ?? img.url}
                      alt={`foto ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                      unoptimized={img.isNew}
                    />

                    {/* Upload pending overlay */}
                    {img.uploadedUrl === null && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      </div>
                    )}

                    {/* Principal badge */}
                    {img.esPrincipal && (
                      <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-fuchsia-600 text-white px-1.5 py-0.5 rounded-md">
                        Principal
                      </span>
                    )}

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImagen(idx) }}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-red-600 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Add more slot */}
                {imagenes.length < 10 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="rounded-xl border-2 border-dashed border-slate-200 hover:border-fuchsia-300 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-fuchsia-500 transition-all disabled:opacity-40"
                    style={{ aspectRatio: '4/3' }}
                  >
                    {uploading ? (
                      <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-[11px] font-medium">Agregar</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Empty state */}
            {imagenes.length === 0 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-slate-200 hover:border-fuchsia-300 rounded-xl py-8 flex flex-col items-center gap-2 text-slate-400 hover:text-fuchsia-500 transition-all disabled:opacity-40"
              >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-[13px] font-medium">Subir fotos</span>
              </button>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImagenesChange} />

            {removedUrls.length > 0 && (
              <p className="text-[11px] text-slate-400">
                {removedUrls.length} imagen{removedUrls.length > 1 ? 'es' : ''} se eliminar{removedUrls.length > 1 ? 'án' : 'á'} de S3 al guardar.
              </p>
            )}
          </Section>

          {/* ── Error ── */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-[13px] font-medium">
              {submitError}
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex items-center justify-between gap-4 pb-8">
            <button
              type="button"
              onClick={() => router.push('/Lorem-admin/editar-usados')}
              className="px-5 py-2.5 text-[13px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-8 py-2.5 text-[13px] font-bold text-white bg-fuchsia-600 hover:bg-fuchsia-700 rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Guardando…
                </>
              ) : 'Guardar cambios →'}
            </button>
          </div>

        </div>
      </form>
    </div>
  )
}
