'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import ToastListo from '../0km/ToastListo'
import type { StockItem } from './page'

// ─── Constants ────────────────────────────────────────────────────────────────

const COMBUSTIBLES  = ['Nafta', 'Diésel', 'Nafta/GNC', 'Híbrido', 'Eléctrico']
const TRANSMISIONES = ['Manual', 'Automática', 'CVT', 'Automatizada']
const DIRECCIONES   = ['Eléctrica', 'Mecánica', 'Hidráulica', 'Electrohidráulica', 'Eléctrica progresiva']
const TIPOS         = ['Sedán', 'Hatchback', 'SUV', 'Pickup', 'Coupé', 'Convertible', 'Minivan', 'Furgón', 'Otro']
const PUERTAS_OPT   = [2, 3, 4, 5]

import { API_BASE } from '@/lib/config'

// ─── Características ──────────────────────────────────────────────────────────

type CaracTab = 'seguridad' | 'confort' | 'multimedia'
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

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImagenLocal {
  file?:       File
  previewUrl:  string
  uploadedUrl: string | null
  esPrincipal: boolean
}

interface FormState {
  tipo:           string
  cilindrada:     string
  potencia:       string
  combustible:    string
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
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

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-700 font-medium">
        {value}
      </div>
    </div>
  )
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
              checked ? 'bg-violet-600 border-violet-600' : 'border-slate-300 group-hover:border-slate-400'
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

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  vehiculo:  StockItem
  onCancel:  () => void
  onSuccess: () => void
}

export default function CargarUsadoForm({ vehiculo, onCancel, onSuccess }: Props) {
  const [form, setForm] = useState<FormState>({
    tipo:           '',
    cilindrada:     '',
    potencia:       '',
    combustible:    vehiculo.combustible || 'Nafta',
    puertas:        '4',
    direccion:      '',
    transmision:    'Manual',
    garantia:       false,
    financiacion:   false,
    unicoDueno:     false,
    patenteMensual: '',
    patenteAnual:   '',
    descripcion:    '',
  })

  const [carac,       setCarac]       = useState<CaracForm>({ seguridad: [], confort: [], multimedia: [] })
  const [caracTab,    setCaracTab]    = useState<CaracTab>('seguridad')
  const [customInput, setCustomInput] = useState('')

  const [imagenes,    setImagenes]    = useState<ImagenLocal[]>([])
  const [uploading,   setUploading]   = useState(false)
  const [submitting,  setSubmitting]  = useState(false)
  const [showListo,   setShowListo]   = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const set = (key: keyof FormState, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }))

  const numOnly = (val: string) => val.replace(/[^0-9.]/g, '')

  // ── Características helpers ───────────────────────────────────────────────

  const togglePreset = (item: string) =>
    setCarac((prev) => {
      const arr = prev[caracTab]
      return { ...prev, [caracTab]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item] }
    })

  const addCustom = () => {
    const v = customInput.trim()
    if (!v || carac[caracTab].includes(v)) return
    setCarac((prev) => ({ ...prev, [caracTab]: [...prev[caracTab], v] }))
    setCustomInput('')
  }

  const removeItem = (item: string) =>
    setCarac((prev) => ({ ...prev, [caracTab]: prev[caracTab].filter((i) => i !== item) }))

  const presetSet   = new Set(PRESETS[caracTab])
  const customItems = carac[caracTab].filter((i) => !presetSet.has(i))

  // ── Image upload ──────────────────────────────────────────────────────────

  const handleImagenesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    if (imagenes.length + files.length > 10) {
      alert('Máximo 10 fotos por vehículo.')
      return
    }

    const placeholders: ImagenLocal[] = files.map((f, i) => ({
      file:        f,
      previewUrl:  URL.createObjectURL(f),
      uploadedUrl: null,
      esPrincipal: imagenes.length === 0 && i === 0,
    }))

    setImagenes((prev) => [...prev, ...placeholders])
    setUploading(true)

    try {
      const fd = new FormData()
      files.forEach((f) => fd.append('files', f))
      const res = await fetch(`${API_BASE}/api/admin/imagenes/upload?carpeta=usados`, {
        method: 'POST',
        body:   fd,
      })
      if (!res.ok) throw new Error()
      const { urls }: { urls: string[] } = await res.json()

      setImagenes((prev) => {
        const updated = [...prev]
        let urlIdx = 0
        for (let i = 0; i < updated.length; i++) {
          if (updated[i].uploadedUrl === null && updated[i].file) {
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

  const setPrincipal = (idx: number) =>
    setImagenes((prev) => prev.map((img, i) => ({ ...img, esPrincipal: i === idx })))

  const removeImagen = (idx: number) =>
    setImagenes((prev) => {
      const next = prev.filter((_, i) => i !== idx)
      if (prev[idx].esPrincipal && next.length > 0) next[0] = { ...next[0], esPrincipal: true }
      return next
    })

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)

    if (uploading) { setSubmitError('Esperá a que terminen de subirse las imágenes.'); return }
    if (imagenes.some((i) => i.uploadedUrl === null)) {
      setSubmitError('Algunas imágenes no terminaron de subirse.')
      return
    }

    const body = {
      pilotId:        vehiculo.pilotId,
      activo:         true,
      marca:          vehiculo.marca,
      modelo:         vehiculo.modelo,
      version:        vehiculo.version,
      anio:           parseInt(vehiculo.anio) || 0,
      km:             parseInt(vehiculo.km) || 0,
      combustible:    form.combustible,
      color:          vehiculo.color,
      tipo:           form.tipo || null,
      cilindrada:     form.cilindrada ? `${form.cilindrada} cc` : null,
      potencia:       form.potencia ? `${form.potencia} hp` : null,
      puertas:        parseInt(form.puertas) || 4,
      direccion:      form.direccion || null,
      transmision:    form.transmision,
      garantia:       form.garantia,
      financiacion:   form.financiacion,
      unicoDueno:     form.unicoDueno,
      patenteMensual: form.patenteMensual ? parseFloat(form.patenteMensual) : null,
      patenteAnual:   form.patenteAnual ? parseFloat(form.patenteAnual) : null,
      descripcion:    form.descripcion.trim(),
      precioRef:      vehiculo.precio,
      caracteristicas: {
        seguridad:  carac.seguridad,
        confort:    carac.confort,
        multimedia: carac.multimedia,
      },
      imagenes:       imagenes.map((img, i) => ({
        url:         img.uploadedUrl!,
        esPrincipal: img.esPrincipal,
        orden:       i + 1,
      })),
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/admin/usados`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      setShowListo(true)
      setTimeout(() => { setShowListo(false); onSuccess() }, 1200)
    } catch {
      setSubmitError('No se pudo publicar el vehículo. Revisá los datos e intentá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <ToastListo visible={showListo} />

      <form onSubmit={handleSubmit}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* Breadcrumb */}
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-[12px] text-slate-600 hover:text-[#1e3a5f] font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Volver al stock
          </button>

          <h1 className="text-[22px] font-semibold text-slate-800 -mt-2">
            Cargar vehículo usado
          </h1>

          {/* ── Datos de Pilot (solo lectura) ── */}
          <Section title="Datos recibidos de Pilot">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <ReadonlyField label="Marca"    value={vehiculo.marca}   />
              <ReadonlyField label="Modelo"   value={vehiculo.modelo}  />
              <ReadonlyField label="Versión"  value={vehiculo.version} />
              <ReadonlyField label="Año"      value={vehiculo.anio}    />
              <ReadonlyField label="KM"       value={`${Number(vehiculo.km).toLocaleString('en-US')} km`} />
              <ReadonlyField label="Color"    value={vehiculo.color}   />
              <ReadonlyField label="Combustible" value={vehiculo.combustible} />
            </div>

            {/* Precio de referencia */}
            <div className="mt-1">
              <Label>Precio de referencia (Pilot)</Label>
              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-50 border border-violet-200 rounded-xl">
                <span className="text-[18px] font-bold text-violet-800">
                  ${Number(vehiculo.precio).toLocaleString('en-US')}
                </span>
                <span className="text-[11px] text-violet-500 font-semibold">USD</span>
              </div>
            </div>

            {/* Pilot ID */}
            <p className="text-[11px] text-slate-400 font-mono mt-1">
              Pilot ID: {vehiculo.pilotId}
            </p>
          </Section>

          {/* ── Datos técnicos ── */}
          <Section title="Datos técnicos">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

              {/* Tipo */}
              <div>
                <Label>Tipo de carrocería</Label>
                <select
                  value={form.tipo}
                  onChange={(e) => set('tipo', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-[13px] text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15 transition-all bg-white"
                >
                  <option value="">— Seleccionar —</option>
                  {TIPOS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Combustible (editable — podría diferir) */}
              <div>
                <Label>Combustible</Label>
                <select
                  value={form.combustible}
                  onChange={(e) => set('combustible', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-[13px] text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15 transition-all bg-white"
                >
                  {COMBUSTIBLES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Transmisión */}
              <div>
                <Label>Transmisión</Label>
                <select
                  value={form.transmision}
                  onChange={(e) => set('transmision', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-[13px] text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15 transition-all bg-white"
                >
                  {TRANSMISIONES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Dirección */}
              <div>
                <Label>Dirección</Label>
                <select
                  value={form.direccion}
                  onChange={(e) => set('direccion', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-[13px] text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15 transition-all bg-white"
                >
                  <option value="">— Seleccionar —</option>
                  {DIRECCIONES.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>

              {/* Puertas */}
              <div>
                <Label>Puertas</Label>
                <select
                  value={form.puertas}
                  onChange={(e) => set('puertas', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-[13px] text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15 transition-all bg-white"
                >
                  {PUERTAS_OPT.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Cilindrada */}
              <div>
                <Label>Cilindrada</Label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1800"
                    value={form.cilindrada}
                    onChange={(e) => set('cilindrada', e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 pr-10 text-[13px] text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15 transition-all placeholder:text-slate-300"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 pointer-events-none">cc</span>
                </div>
              </div>

              {/* Potencia */}
              <div>
                <Label>Potencia</Label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="140"
                    value={form.potencia}
                    onChange={(e) => set('potencia', e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 pr-10 text-[13px] text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15 transition-all placeholder:text-slate-300"
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
                    type="text"
                    inputMode="decimal"
                    placeholder="45.00"
                    value={form.patenteMensual}
                    onChange={(e) => set('patenteMensual', numOnly(e.target.value))}
                    className="w-full pl-7 pr-12 py-2.5 text-[13px] text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15 transition-all placeholder:text-slate-300"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">USD</span>
                </div>
              </div>
              <div>
                <Label>Patente anual</Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-slate-400 pointer-events-none">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="540.00"
                    value={form.patenteAnual}
                    onChange={(e) => set('patenteAnual', numOnly(e.target.value))}
                    className="w-full pl-7 pr-12 py-2.5 text-[13px] text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15 transition-all placeholder:text-slate-300"
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
              placeholder="Describí el estado del vehículo, historial de service, accesorios incluidos, etc."
              value={form.descripcion}
              onChange={(e) => set('descripcion', e.target.value)}
              className="w-full px-3.5 py-2.5 text-[13px] text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15 transition-all resize-none placeholder:text-slate-300"
            />
          </Section>

          {/* ── Características ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Características</h2>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              {CARAC_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setCaracTab(tab.id); setCustomInput('') }}
                  className={`flex-1 py-3 text-[12px] font-semibold transition-all border-b-2 ${
                    caracTab === tab.id
                      ? 'border-violet-600 text-violet-700'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                  {carac[tab.id].length > 0 && (
                    <span className="ml-1.5 text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-bold">
                      {carac[tab.id].length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Presets */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Opciones predefinidas</p>
                <ChecklistPreset
                  presets={PRESETS[caracTab]}
                  selected={carac[caracTab]}
                  onToggle={togglePreset}
                />
              </div>

              {/* Custom */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Agregar personalizado</p>
                <div className="flex gap-2">
                  <input
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }}
                    placeholder="Escribí un ítem y presioná Enter…"
                    className="flex-1 px-3.5 py-2.5 text-[13px] text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15 transition-all placeholder:text-slate-300"
                  />
                  <button
                    type="button"
                    onClick={addCustom}
                    disabled={!customInput.trim()}
                    className="px-3.5 py-2.5 bg-violet-600 text-white text-[13px] font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    +
                  </button>
                </div>
                {customItems.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {customItems.map((item) => (
                      <li key={item} className="flex items-center justify-between gap-2 px-3.5 py-2 bg-slate-50 rounded-xl">
                        <span className="text-[13px] text-slate-700 flex-1">{item}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(item)}
                          className="text-slate-400 hover:text-red-500 transition-colors text-lg leading-none shrink-0"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* ── Fotos ── */}
          <Section title="Fotos">
            <p className="text-[12px] text-slate-500 -mt-2">
              Subí hasta 10 fotos. Hacé clic en una imagen para marcarla como principal.
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={imagenes.length >= 10 || uploading}
              className="w-full border-2 border-dashed border-slate-200 hover:border-violet-300 rounded-xl py-8 flex flex-col items-center gap-2 text-slate-400 hover:text-violet-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <svg className="w-7 h-7 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span className="text-[13px] font-medium">Subiendo imágenes…</span>
                </>
              ) : (
                <>
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="text-[13px] font-medium">
                    {imagenes.length === 0 ? 'Seleccioná las fotos' : `Agregar más (${imagenes.length}/10)`}
                  </span>
                  <span className="text-[11px]">JPG, PNG, WebP</span>
                </>
              )}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImagenesChange} />

            {imagenes.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-1">
                {imagenes.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPrincipal(idx)}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      img.esPrincipal ? 'border-violet-500 shadow-md' : 'border-transparent hover:border-slate-300'
                    }`}
                    style={{ aspectRatio: '4/3' }}
                  >
                    <Image src={img.previewUrl} alt={`foto ${idx + 1}`} fill className="object-cover" sizes="25vw" />

                    {img.uploadedUrl === null && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      </div>
                    )}

                    {img.esPrincipal && (
                      <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-violet-600 text-white px-1.5 py-0.5 rounded-md">
                        Principal
                      </span>
                    )}

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
              </div>
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
              onClick={onCancel}
              className="px-5 py-2.5 text-[13px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-8 py-2.5 text-[13px] font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Publicando…
                </>
              ) : 'Publicar vehículo →'}
            </button>
          </div>

        </div>
      </form>
    </>
  )
}
