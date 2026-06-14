'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { adminFetch } from '@/lib/adminFetch'
import ToastListo from '../0km/ToastListo'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Administrador {
  id:          number
  nombreAdmin: string
  email:       string
  rolSuper:    boolean
  activo:      boolean
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdministradoresPage() {
  const router = useRouter()

  const [checked, setChecked] = useState(false)

  const [admins,  setAdmins]  = useState<Administrador[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  const [formOpen,       setFormOpen]       = useState(false)
  const [editing,        setEditing]        = useState<Administrador | null>(null)
  const [passwordTarget, setPasswordTarget] = useState<Administrador | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [deletingId,     setDeletingId]     = useState<number | null>(null)
  const [showListo,      setShowListo]      = useState(false)

  // ── Guard: solo super admins ──────────────────────────────────────────────
  useEffect(() => {
    const esSuper = localStorage.getItem('adminRolSuper') === 'true'
    if (!esSuper) {
      router.replace('/Lorem-admin')
      return
    }
    setChecked(true)
  }, [router])

  // ── Listar administradores ────────────────────────────────────────────────
  const fetchAdmins = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await adminFetch('/admin/administradores')
      if (!res.ok) throw new Error()
      const data: Administrador[] = await res.json()
      setAdmins(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (checked) fetchAdmins()
  }, [checked])

  const handleSaved = () => {
    setFormOpen(false)
    setEditing(null)
    setShowListo(true)
    setTimeout(() => setShowListo(false), 750)
    fetchAdmins()
  }

  const handlePasswordSaved = () => {
    setPasswordTarget(null)
    setShowListo(true)
    setTimeout(() => setShowListo(false), 750)
  }

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      const res = await adminFetch(`/admin/administradores/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setAdmins((prev) => prev.filter((a) => a.id !== id))
    } catch {
      // TODO: show inline error
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  if (!checked) return null

  return (
    <div className="min-h-screen bg-slate-100">

      <ToastListo visible={showListo} />

      {/* Top bar */}
      <header className="bg-[#1e3a5f] text-white px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image src="/images/logo22.png" alt="Videsol" width={100} height={34} className="h-8 w-auto object-contain" />
          <div className="w-px h-6 bg-white/20" />
          <div>
            <p className="text-[11px] text-white/50 font-medium tracking-widest uppercase leading-none">
              Panel de administración
            </p>
            <p className="text-[15px] font-semibold leading-tight">Gestión de administradores</p>
          </div>
        </div>
        <Link
          href="/Lorem-admin"
          className="flex items-center gap-2 text-[12px] font-semibold text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al panel
        </Link>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-semibold text-slate-800 leading-tight">Administradores</h1>
            <p className="text-[14px] text-slate-500 mt-1">Creá, editá o eliminá cuentas de administrador.</p>
          </div>
          <button
            onClick={() => { setEditing(null); setFormOpen(true) }}
            className="shrink-0 px-5 py-2.5 text-[13px] font-semibold text-white bg-[#1e3a5f] hover:bg-[#162d4a] rounded-xl transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo administrador
          </button>
        </div>

        {/* ── Listado ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {loading && (
            <div className="p-10 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-300 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          )}

          {!loading && error && (
            <div className="p-6">
              <p className="text-[13px] font-medium text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                No se pudo conectar con el servidor. Intentá de nuevo.
              </p>
            </div>
          )}

          {!loading && !error && admins.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-[13px] text-slate-400">No hay administradores cargados.</p>
            </div>
          )}

          {!loading && !error && admins.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nombre</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rol</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td className="px-5 py-4 text-[13px] font-semibold text-slate-800">{admin.nombreAdmin}</td>
                      <td className="px-5 py-4 text-[13px] text-slate-500">{admin.email}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          admin.rolSuper
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>
                          {admin.rolSuper ? 'SUPER ADMIN' : 'ADMIN'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          admin.activo
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {admin.activo ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { setEditing(admin); setFormOpen(true) }}
                            className="px-3 py-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setPasswordTarget(admin)}
                            className="px-3 py-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            Contraseña
                          </button>
                          {confirmDeleteId === admin.id ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleDelete(admin.id)}
                                disabled={deletingId === admin.id}
                                className="px-3 py-1.5 text-[11px] font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50 transition-colors"
                              >
                                {deletingId === admin.id ? 'Eliminando…' : 'Confirmar'}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(admin.id)}
                              className="px-3 py-1.5 text-[11px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {formOpen && (
        <AdminFormModal
          admin={editing}
          onClose={() => { setFormOpen(false); setEditing(null) }}
          onSaved={handleSaved}
        />
      )}

      {passwordTarget && (
        <PasswordModal
          admin={passwordTarget}
          onClose={() => setPasswordTarget(null)}
          onSaved={handlePasswordSaved}
        />
      )}
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

function CheckboxRow({
  checked, onChange, label,
}: {
  checked: boolean; onChange: (v: boolean) => void; label: string
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
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

function ModalShell({
  title, onClose, children,
}: {
  title: string; onClose: () => void; children: React.ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.currentTarget === e.target) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="h-1 w-full bg-[#1e3a5f]" />
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <h2 className="text-[17px] font-bold text-slate-900 leading-tight">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors shrink-0 ml-4 mt-0.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Crear / Editar ──────────────────────────────────────────────────────────

function AdminFormModal({
  admin, onClose, onSaved,
}: {
  admin:   Administrador | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = admin != null

  const [nombreAdmin, setNombreAdmin] = useState(admin?.nombreAdmin ?? '')
  const [email,       setEmail]       = useState(admin?.email ?? '')
  const [password,    setPassword]    = useState('')
  const [rolSuper,    setRolSuper]    = useState(admin?.rolSuper ?? false)
  const [activo,      setActivo]      = useState(admin?.activo ?? false)

  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!nombreAdmin.trim()) return setError('El nombre es requerido.')
    if (!email.trim())       return setError('El email es requerido.')
    if (!isEdit && !password.trim()) return setError('La contraseña es requerida.')

    setSubmitting(true)
    try {
      const body = isEdit
        ? { nombreAdmin: nombreAdmin.trim(), email: email.trim(), rolSuper: rolSuper, activo }
        : { nombreAdmin: nombreAdmin.trim(), email: email.trim(), password: password, rolSuper: rolSuper, activo }

      const res = await adminFetch(
        isEdit ? `/admin/administradores/${admin.id}` : '/admin/administradores',
        { method: isEdit ? 'PUT' : 'POST', body: JSON.stringify(body) }
      )

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error ?? 'No se pudo guardar el administrador.')
      }

      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el administrador.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ModalShell title={isEdit ? 'Editar administrador' : 'Nuevo administrador'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

        <Field label="Nombre" required>
          <input
            type="text"
            value={nombreAdmin}
            onChange={(e) => setNombreAdmin(e.target.value)}
            placeholder="florencia"
            className={inputCls}
          />
        </Field>

        <Field label="Email" required>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@videsol.com"
            className={inputCls}
          />
        </Field>

        {!isEdit && (
          <Field label="Contraseña" required>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
            />
          </Field>
        )}

        <div className="flex flex-col gap-2.5 py-1">
          <CheckboxRow checked={rolSuper} onChange={setRolSuper} label="Super administrador (gestiona otros administradores)" />
        </div>

        {error && (
          <p className="text-[12px] text-red-600 font-medium -mt-1">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#162d4a] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14px] font-semibold py-3.5 rounded-xl transition-all duration-200"
        >
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Guardando…
            </>
          ) : (
            isEdit ? 'Guardar cambios' : 'Crear administrador'
          )}
        </button>
      </form>
    </ModalShell>
  )
}

// ── Cambiar contraseña ───────────────────────────────────────────────────────

function PasswordModal({
  admin, onClose, onSaved,
}: {
  admin:   Administrador
  onClose: () => void
  onSaved: () => void
}) {
  const [passwordNueva,        setPasswordNueva]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!passwordNueva.trim())              return setError('La contraseña es requerida.')
    if (passwordNueva.length < 6)            return setError('La contraseña debe tener al menos 6 caracteres.')
    if (passwordNueva !== confirmPassword)  return setError('Las contraseñas no coinciden.')

    setSubmitting(true)
    try {
      const res = await adminFetch(`/admin/administradores/${admin.id}/password`, {
        method: 'PATCH',
        body: JSON.stringify({ passwordNueva }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error ?? 'No se pudo actualizar la contraseña.')
      }

      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la contraseña.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ModalShell title={`Cambiar contraseña — ${admin.nombreAdmin}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

        <Field label="Nueva contraseña" required>
          <input
            type="password"
            value={passwordNueva}
            onChange={(e) => setPasswordNueva(e.target.value)}
            placeholder="••••••••"
            className={inputCls}
          />
        </Field>

        <Field label="Confirmar contraseña" required>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className={inputCls}
          />
        </Field>

        {error && (
          <p className="text-[12px] text-red-600 font-medium -mt-1">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#162d4a] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14px] font-semibold py-3.5 rounded-xl transition-all duration-200"
        >
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Guardando…
            </>
          ) : (
            'Actualizar contraseña'
          )}
        </button>
      </form>
    </ModalShell>
  )
}
