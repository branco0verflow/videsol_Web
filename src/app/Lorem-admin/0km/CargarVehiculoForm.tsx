'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { PrecioItem } from './page'

// ─── Types ────────────────────────────────────────────────────────────────────

type ColorForm = {
  nombre:       string
  files:        File[]
  urls:         string[]
  principalIdx: number   // índice de la imagen principal dentro de urls[]
  uploading:    boolean
  error:        boolean
}

type FormData = {
  marcaRef:       string
  precioRef:      number
  tipo:           string
  anio:           number
  cilindrada:     string   // solo número; se formatea a "X cc" en el body
  potencia:       string   // solo número; se formatea a "X hp/kw" en el body
  potenciaUnit:   'hp' | 'kw'
  combustible:    string
  puertas:        number
  direccion:      string
  transmision:    string
  garantia:       boolean
  financiacion:   boolean
  descripcion:    string
  catalogoPdfUrl: string
}

type CaracTab = 'seguridad' | 'confort' | 'multimedia'

type CaracForm = Record<CaracTab, string[]>

interface Props {
  vehiculo:  PrecioItem
  onCancel:  () => void
  onSuccess: () => void
}

// ─── Constantes ───────────────────────────────────────────────────────────────


const MAX_IMAGES   = 7

const TIPOS         = ['Auto', 'SUV', 'Pick-Up', 'Hatchback', 'Sedán', 'Furgón', 'Crossover', 'Utilitario', 'Clásico']
const COMBUSTIBLES  = ['Nafta', 'Diesel', 'Híbrido', 'Eléctrico']
const TRANSMISIONES = ['Manual', 'Automática', 'CVT', 'Automatizada']
const DIRECCIONES   = ['Eléctrica', 'Mecánica', 'Hidráulica', 'Electrohidráulica', 'Eléctrica progresiva']

const PRESETS: Record<CaracTab, string[]> = {
  seguridad: [
    'Airbag conductor y acompañante',
    'Airbags laterales delanteros',
    'Airbags de cortina',
    'Airbag de rodilla del conductor',
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
    'Climatizador',
    'Aire acondicionado automático bizona',
    'Dirección asistida eléctrica (EPS)',
    'Levantavidrios eléctricos en las 4 puertas',
    'Espejos exteriores con regulación eléctrica',
    'Espejos exteriores rebatibles eléctricamente',
    'Cierre centralizado con comando a distancia',
    'Tapizados de cuero ecológico',
    'Asiento del conductor con regulación de altura',
    'Volante regulable en altura y profundidad',
    'Volante forrado en cuero',
    'Computadora de a bordo',
    'Llave con apertura sin contacto (Smart Key)',
    'Botón de arranque (Start/Stop)',
    'Climatizador automático trizona',
  ],
  multimedia: [
    'Radio AM/FM con USB',
    'Pantalla táctil multimedia de 7"',
    'Pantalla táctil multimedia de 9"',
    'Pantalla táctil multimedia de 10" o superior',
    'Conectividad Apple CarPlay (cable)',
    'Conectividad Android Auto (cable)',
    'Apple CarPlay y Android Auto inalámbricos',
    'Bluetooth para llamadas y audio',
    'Sistema de audio con 4 parlantes',
    'Sistema de audio con 6 parlantes',
    'Sistema de audio premium con subwoofer',
    'Puertos USB delanteros',
    'Puertos USB delanteros y traseros',
    'Cargador inalámbrico de smartphone',
    'Comando de audio en el volante',
  ],
}

const CARAC_TABS: { id: CaracTab; label: string }[] = [
  { id: 'seguridad',  label: 'Seguridad'  },
  { id: 'confort',    label: 'Confort'    },
  { id: 'multimedia', label: 'Multimedia' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

/** Si `value` no está dentro de `options`, lo agrega para no perder datos legacy. */
function withValue(options: string[], value: string): string[] {
  if (value && !options.includes(value)) return [value, ...options]
  return options
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
      {children}
    </p>
  )
}

function SelectField({
  value, onChange, options, placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-[13px] text-slate-800 border border-slate-200 rounded-lg outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all bg-white"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function InputText({
  value, onChange, placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-[13px] text-slate-800 border border-slate-200 rounded-lg outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all placeholder:text-slate-300"
    />
  )
}

function InputNumber({
  value, onChange, suffix, min,
}: {
  value: string
  onChange: (v: string) => void
  suffix: string
  min?: number
}) {
  return (
    <div className="flex">
      <input
        type="number"
        value={value}
        min={min ?? 0}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 text-[13px] text-slate-800 border border-slate-200 rounded-l-lg outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      <span className="px-3 py-2 bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg text-[12px] text-slate-500 font-medium select-none">
        {suffix}
      </span>
    </div>
  )
}

/** Input numérico con dropdown de unidad a la derecha (potencia hp/kw). */
function InputNumberUnit({
  value, onChange, unit, onUnitChange, units, min, placeholder,
}: {
  value: string
  onChange: (v: string) => void
  unit: string
  onUnitChange: (u: string) => void
  units: string[]
  min?: number
  placeholder?: string
}) {
  return (
    <div className="flex">
      <input
        type="number"
        value={value}
        min={min ?? 0}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-w-0 px-3 py-2 text-[13px] text-slate-800 border border-slate-200 rounded-l-lg outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none placeholder:text-slate-300"
      />
      <select
        value={unit}
        onChange={(e) => onUnitChange(e.target.value)}
        className="px-2.5 py-2 bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg text-[12px] text-slate-600 font-semibold outline-none focus:border-[#1e3a5f] transition-all cursor-pointer"
      >
        {units.map((u) => <option key={u} value={u}>{u}</option>)}
      </select>
    </div>
  )
}

function Toggle({
  value, onChange, labelTrue, labelFalse,
}: {
  value: boolean
  onChange: (v: boolean) => void
  labelTrue: string
  labelFalse: string
}) {
  return (
    <div className="flex rounded-lg border border-slate-200 overflow-hidden text-[12px] font-semibold">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex-1 py-2 transition-colors ${
          value ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        {labelTrue}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 py-2 border-l border-slate-200 transition-colors ${
          !value ? 'bg-slate-100 text-slate-700' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        {labelFalse}
      </button>
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
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                checked ? 'bg-[#1e3a5f] border-[#1e3a5f]' : 'border-slate-300 group-hover:border-slate-400'
              }`}
            >
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

/**
 * Galería de imágenes de un color: subir, marcar principal y eliminar.
 * Compartida (misma UX) entre Cargar y Editar.
 */
function ColorImages({
  color, idx, fileRef, onFilesChange, onUpload, onSetPrincipal, onRemoveUrl,
}: {
  color:          ColorForm
  idx:            number
  fileRef:        (el: HTMLInputElement | null) => void
  onFilesChange:  (fileList: FileList | null) => void
  onUpload:       () => void
  onSetPrincipal: (imageIdx: number) => void
  onRemoveUrl:    (urlIdx: number) => void
}) {
  const remaining = MAX_IMAGES - color.urls.length
  return (
    <>
      <div>
        <Label>
          Imágenes *
          {color.urls.length > 0 && (
            <span className="ml-1.5 font-normal text-slate-400 normal-case tracking-normal">
              ({color.urls.length}/{MAX_IMAGES} subidas
              {remaining > 0 ? ` · podés agregar ${remaining} más` : ' · límite alcanzado'})
            </span>
          )}
        </Label>
        {remaining > 0 && (
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => onFilesChange(e.target.files)}
                className="block w-full text-[12px] text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[12px] file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 transition-all cursor-pointer"
              />
              {color.files.length > 0 && (
                <p className="text-[11px] text-amber-700 font-medium mt-1">
                  {color.files.length} archivo{color.files.length > 1 ? 's' : ''} seleccionado{color.files.length > 1 ? 's' : ''} — pendiente de subir
                </p>
              )}
              {color.error && (
                <p className="text-[11px] text-red-600 font-medium mt-1">Error al subir. Intentá de nuevo.</p>
              )}
            </div>
            <button
              type="button"
              onClick={onUpload}
              disabled={!color.files.length || color.uploading}
              className="px-4 py-2 text-[12px] font-semibold bg-[#1e3a5f] hover:bg-[#162d4a] text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              {color.uploading ? 'Subiendo…' : 'Subir'}
            </button>
          </div>
        )}
      </div>

      {color.urls.length > 0 && (
        <div>
          <p className="text-[10px] text-slate-400 mb-2">
            Clic para marcar como <strong className="text-slate-600">principal</strong> · ✕ para eliminar.
          </p>
          <div className="flex gap-2 flex-wrap">
            {color.urls.map((url, i) => {
              const isPrincipal = i === color.principalIdx
              return (
                <div key={`${url}-${i}`} className="relative shrink-0">
                  <button
                    type="button"
                    title={isPrincipal ? 'Imagen principal' : 'Marcar como principal'}
                    onClick={() => onSetPrincipal(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all block ${
                      isPrincipal
                        ? 'border-[#1e3a5f] shadow-md scale-105'
                        : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`imagen ${i + 1}`} className="w-full h-full object-cover" />
                    {isPrincipal && (
                      <span className="absolute bottom-0 left-0 right-0 text-center text-[8px] font-bold bg-[#1e3a5f]/85 text-white py-0.5">
                        Principal
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    title="Eliminar imagen"
                    onClick={() => onRemoveUrl(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow transition-colors z-10"
                  >
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CargarVehiculoForm({ vehiculo, onCancel, onSuccess }: Props) {
  const [form, setForm] = useState<FormData>({
    marcaRef:       capitalize(vehiculo.marca),
    precioRef:      vehiculo.precio,
    tipo:           '',
    anio:           new Date().getFullYear(),
    cilindrada:     '',
    potencia:       '',
    potenciaUnit:   'hp',
    combustible:    '',
    puertas:        5,
    direccion:      '',
    transmision:    '',
    garantia:       true,
    financiacion:   true,
    descripcion:    '',
    catalogoPdfUrl: '',
  })

  const [colores, setColores] = useState<ColorForm[]>([
    { nombre: '', files: [], urls: [], principalIdx: 0, uploading: false, error: false },
  ])

  const [carac, setCarac] = useState<CaracForm>({
    seguridad:  [],
    confort:    [],
    multimedia: [],
  })

  const [caracTab,    setCaracTab]    = useState<CaracTab>('seguridad')
  const [customInput, setCustomInput] = useState('')
  const [submitting,  setSubmitting]  = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const fileRefs = useRef<(HTMLInputElement | null)[]>([])

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  // ── Características helpers ───────────────────────────────────────────────

  const togglePreset = (item: string) => {
    setCarac((prev) => {
      const arr = prev[caracTab]
      return {
        ...prev,
        [caracTab]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item],
      }
    })
  }

  const addCustom = () => {
    const v = customInput.trim()
    if (!v || carac[caracTab].includes(v)) return
    setCarac((prev) => ({ ...prev, [caracTab]: [...prev[caracTab], v] }))
    setCustomInput('')
  }

  const removeItem = (item: string) =>
    setCarac((prev) => ({ ...prev, [caracTab]: prev[caracTab].filter((i) => i !== item) }))

  // custom = items NOT in presets
  const presetSet    = new Set(PRESETS[caracTab])
  const customItems  = carac[caracTab].filter((i) => !presetSet.has(i))

  // ── Color helpers ─────────────────────────────────────────────────────────

  const addColor = () =>
    setColores((prev) => [...prev, { nombre: '', files: [], urls: [], principalIdx: 0, uploading: false, error: false }])

  const removeColor = (idx: number) =>
    setColores((prev) => prev.filter((_, i) => i !== idx))

  const updateNombre = (idx: number, nombre: string) =>
    setColores((prev) => prev.map((c, i) => (i === idx ? { ...c, nombre } : c)))

  const setPrincipal = (colorIdx: number, imageIdx: number) =>
    setColores((prev) => prev.map((c, i) => (i === colorIdx ? { ...c, principalIdx: imageIdx } : c)))

  const removeUrl = (colorIdx: number, urlIdx: number) =>
    setColores((prev) => prev.map((c, i) => {
      if (i !== colorIdx) return c
      const urls = c.urls.filter((_, j) => j !== urlIdx)
      let principalIdx = c.principalIdx
      if (urlIdx < principalIdx)       principalIdx -= 1
      else if (urlIdx === principalIdx) principalIdx = 0
      return { ...c, urls, principalIdx: Math.max(0, principalIdx) }
    }))

  const onFilesChange = (idx: number, fileList: FileList | null) => {
    if (!fileList) return
    const remaining = MAX_IMAGES - colores[idx].urls.length
    if (remaining <= 0) return
    const files = Array.from(fileList).slice(0, remaining)
    setColores((prev) => prev.map((c, i) => (i === idx ? { ...c, files } : c)))
  }

  const uploadColor = async (idx: number) => {
    const color = colores[idx]
    if (!color.files.length) return
    setColores((prev) => prev.map((c, i) => (i === idx ? { ...c, uploading: true, error: false } : c)))
    try {
      const fd = new FormData()
      color.files.forEach((f) => fd.append('files', f))
      const res = await fetch('/api/admin/imagenes/upload?carpeta=okm', {
        method: 'POST',
        body:   fd,
      })
      if (!res.ok) throw new Error()
      const { urls: newUrls }: { urls: string[] } = await res.json()
      if (fileRefs.current[idx]) fileRefs.current[idx]!.value = ''
      setColores((prev) => prev.map((c, i) =>
        i === idx ? { ...c, urls: [...c.urls, ...newUrls], files: [], uploading: false } : c
      ))
    } catch {
      setColores((prev) => prev.map((c, i) => (i === idx ? { ...c, uploading: false, error: true } : c)))
    }
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!form.tipo)               return setSubmitError('El tipo de vehículo es requerido.')
    if (!form.combustible)        return setSubmitError('El combustible es requerido.')
    if (!form.transmision)        return setSubmitError('La transmisión es requerida.')
    if (!form.descripcion.trim()) return setSubmitError('La descripción es requerida.')
    if (colores.length === 0)     return setSubmitError('Agregá al menos un color.')
    if (colores.some((c) => !c.nombre.trim()))    return setSubmitError('Todos los colores deben tener nombre.')
    if (colores.some((c) => c.urls.length === 0)) return setSubmitError('Todos los colores deben tener imágenes subidas.')

    setSubmitError(null)
    setSubmitting(true)

    const body = {
      code:           vehiculo.code,
      activo:         true,
      marcaRef:       form.marcaRef,
      precioRef:      form.precioRef,
      tipo:           form.tipo,
      anio:           form.anio,
      cilindrada:     form.cilindrada ? `${form.cilindrada} cc` : null,
      potencia:       form.potencia   ? `${form.potencia} ${form.potenciaUnit}` : null,
      combustible:    form.combustible,
      puertas:        form.puertas,
      direccion:      form.direccion  || null,
      transmision:    form.transmision,
      garantia:       form.garantia,
      financiacion:   form.financiacion,
      descripcion:    form.descripcion,
      catalogoPdfUrl: form.catalogoPdfUrl || null,
      colores: colores.map((c, idx) => ({
        nombre:             c.nombre,
        swatchUrl:          c.urls[c.principalIdx] ?? c.urls[0],
        imagenPrincipalUrl: c.urls[c.principalIdx] ?? c.urls[0],
        orden:              idx + 1,
        imagenes:           c.urls.map((url, i) => ({ url, orden: i + 1 })),
      })),
      caracteristicas: {
        seguridad:  carac.seguridad,
        confort:    carac.confort,
        multimedia: carac.multimedia,
      },
    }

    try {
      const res = await fetch('/api/admin/okm', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      onSuccess()
    } catch {
      setSubmitError('Error al publicar el vehículo. Verificá la conexión con el servidor.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Top bar */}
      <header className="bg-[#1e3a5f] text-white px-6 py-3 flex items-center gap-4">
        <Image src="/images/logo22.png" alt="Videsol" width={100} height={34} className="h-8 w-auto object-contain" />
        <div className="w-px h-6 bg-white/20" />
        <div>
          <p className="text-[11px] text-white/50 font-medium tracking-widest uppercase leading-none">
            Panel de administración
          </p>
          <p className="text-[15px] font-semibold leading-tight">Cargar vehículo</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 text-[12px] text-slate-600 hover:text-[#1e3a5f] font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a resultados
          </button>
          <span className="text-slate-300">/</span>
          <Link
            href="/Lorem-admin"
            className="flex items-center gap-1.5 text-[12px] text-slate-600 hover:text-[#1e3a5f] font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
        </div>

        {/* ── Datos de Pilot (readonly) ── */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50">
            <h2 className="text-[11px] font-bold text-slate-600 tracking-widest uppercase">Datos desde Pilot</h2>
          </div>
          <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Código',  value: vehiculo.code        },
              { label: 'Marca',   value: vehiculo.marca       },
              { label: 'Modelo',  value: vehiculo.modelo      },
              { label: 'Versión', value: vehiculo.version     },
              { label: 'Precio',  value: `$${vehiculo.precio.toLocaleString('en-US')} USD` },
              { label: 'Tipo',    value: vehiculo.tipoNegocio },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{f.label}</p>
                <p className="text-[13px] font-semibold text-slate-800">{f.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Ficha técnica ── */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50">
            <h2 className="text-[11px] font-bold text-slate-600 tracking-widest uppercase">Ficha técnica</h2>
          </div>
          <div className="px-6 py-5 space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Marca (ref. filtros)</Label>
                <InputText value={form.marcaRef} onChange={(v) => set('marcaRef', v)} placeholder="Citroën" />
              </div>
              <div>
                <Label>Precio ref. (USD)</Label>
                <InputNumber value={String(form.precioRef)} onChange={(v) => set('precioRef', Number(v))} suffix="USD" min={0} />
              </div>
              <div>
                <Label>Tipo *</Label>
                <SelectField value={form.tipo} onChange={(v) => set('tipo', v)} options={TIPOS} placeholder="Seleccionar…" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Año *</Label>
                <InputNumber value={String(form.anio)} onChange={(v) => set('anio', Number(v))} suffix="año" min={1990} />
              </div>
              <div>
                <Label>Cilindrada</Label>
                <InputNumber value={form.cilindrada} onChange={(v) => set('cilindrada', v)} suffix="cc" min={0} />
              </div>
              <div>
                <Label>Potencia</Label>
                <InputNumberUnit
                  value={form.potencia}
                  onChange={(v) => set('potencia', v)}
                  unit={form.potenciaUnit}
                  onUnitChange={(u) => set('potenciaUnit', u as 'hp' | 'kw')}
                  units={['hp', 'kw']}
                  min={0}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Combustible *</Label>
                <SelectField value={form.combustible} onChange={(v) => set('combustible', v)} options={COMBUSTIBLES} placeholder="Seleccionar…" />
              </div>
              <div>
                <Label>Puertas</Label>
                <SelectField
                  value={String(form.puertas)}
                  onChange={(v) => set('puertas', Number(v))}
                  options={['2', '3', '4', '5']}
                />
              </div>
              <div>
                <Label>Dirección</Label>
                <SelectField value={form.direccion} onChange={(v) => set('direccion', v)} options={DIRECCIONES} placeholder="Seleccionar…" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Label>Transmisión *</Label>
                <SelectField value={form.transmision} onChange={(v) => set('transmision', v)} options={TRANSMISIONES} placeholder="Seleccionar…" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Garantía</Label>
                <Toggle value={form.garantia} onChange={(v) => set('garantia', v)} labelTrue="Con garantía" labelFalse="Sin garantía" />
              </div>
              <div>
                <Label>Financiación</Label>
                <Toggle value={form.financiacion} onChange={(v) => set('financiacion', v)} labelTrue="Disponible" labelFalse="No disponible" />
              </div>
            </div>

            <div>
              <Label>Descripción *</Label>
              <textarea
                value={form.descripcion}
                onChange={(e) => set('descripcion', e.target.value)}
                rows={4}
                placeholder="Descripción del vehículo…"
                className="w-full px-3 py-2 text-[13px] text-slate-800 border border-slate-200 rounded-lg outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all resize-none placeholder:text-slate-300"
              />
            </div>

            <div>
              <Label>URL catálogo PDF (opcional)</Label>
              <InputText value={form.catalogoPdfUrl} onChange={(v) => set('catalogoPdfUrl', v)} placeholder="https://…" />
            </div>

          </div>
        </section>

        {/* ── Colores e imágenes ── */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="text-[11px] font-bold text-slate-600 tracking-widest uppercase">Colores e imágenes</h2>
            <button type="button" onClick={addColor} className="text-[12px] font-semibold text-[#1e3a5f] hover:underline">
              + Agregar color
            </button>
          </div>

          <div className="px-6 py-5 space-y-5">
            {colores.map((color, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Color {idx + 1}</p>
                  {colores.length > 1 && (
                    <button type="button" onClick={() => removeColor(idx)} className="text-[12px] text-red-500 hover:text-red-700 font-medium transition-colors">
                      Eliminar
                    </button>
                  )}
                </div>

                <div>
                  <Label>Nombre del color *</Label>
                  <InputText value={color.nombre} onChange={(v) => updateNombre(idx, v)} placeholder="Blanco, Rojo, Azul/Negro…" />
                </div>

                <ColorImages
                  color={color}
                  idx={idx}
                  fileRef={(el) => { fileRefs.current[idx] = el }}
                  onFilesChange={(fl) => onFilesChange(idx, fl)}
                  onUpload={() => uploadColor(idx)}
                  onSetPrincipal={(i) => setPrincipal(idx, i)}
                  onRemoveUrl={(i) => removeUrl(idx, i)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Características ── */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50">
            <h2 className="text-[11px] font-bold text-slate-600 tracking-widest uppercase">Características</h2>
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
                    ? 'border-[#1e3a5f] text-[#1e3a5f]'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
                {carac[tab.id].length > 0 && (
                  <span className="ml-1.5 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-bold">
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
                  className="flex-1 px-3 py-2 text-[13px] text-slate-800 border border-slate-200 rounded-lg outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={addCustom}
                  disabled={!customInput.trim()}
                  className="px-3 py-2 bg-[#1e3a5f] text-white text-[13px] font-medium rounded-lg hover:bg-[#162d4a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
              {customItems.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {customItems.map((item) => (
                    <li key={item} className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 rounded-lg">
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
        </section>

        {/* Error */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 font-medium text-[13px] px-5 py-3.5 rounded-xl">
            {submitError}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pb-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-[13px] font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
    </div>
  )
}
