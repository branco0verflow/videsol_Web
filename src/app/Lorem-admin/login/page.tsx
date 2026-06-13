'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()

  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error ?? 'No se pudo iniciar sesión')
      }

      if (data?.nombreAdmin) {
        localStorage.setItem('adminNombre', data.nombreAdmin)
      }

      setRedirecting(true)
      router.push('/Lorem-admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-slate-100 to-slate-200 flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#1e3a5f]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#1e3a5f]/5 blur-3xl" />

      <div className="w-full max-w-sm relative z-10">

        <div className="flex flex-col items-center mb-8">
          <Image src="/images/logo.png" alt="Videsol" width={150} height={52} className="h-11 w-auto object-contain mb-4" />
          <p className="text-[11px] text-slate-500 font-semibold tracking-[0.25em] uppercase">
            Panel de administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 p-8 flex flex-col gap-5">
          <div>
            <h1 className="text-[22px] font-bold text-slate-900 leading-tight">Iniciar sesión</h1>
            <p className="text-[13.5px] text-slate-500 mt-1.5">Ingresá tus credenciales para continuar.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[12px] font-semibold text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@videsol.com"
              className="px-4 py-3 text-[14px] text-slate-800 border border-slate-300 rounded-lg outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/15 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[12px] font-semibold text-slate-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="px-4 py-3 text-[14px] text-slate-800 border border-slate-300 rounded-lg outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/15 transition-all placeholder:text-slate-400"
            />
          </div>

          {error && (
            <p className="text-[13px] font-medium text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="mt-2 px-6 py-3 bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-[14px] font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner />
                Ingresando…
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>
      </div>

      {/* Overlay de redirección */}
      {redirecting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-[#0f1f33]/90 backdrop-blur-sm">
          <Spinner large />
          <div className="flex flex-col items-center gap-1">
            <p className="text-white text-[15px] font-semibold tracking-wide">
              Iniciando sesión…
            </p>
            <p className="text-slate-300 text-[12.5px]">
              Redirigiendo al panel de administración
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Spinner({ large }: { large?: boolean }) {
  const size = large ? 'w-9 h-9' : 'w-4 h-4'
  return (
    <span
      className={`${size} border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0`}
      aria-hidden="true"
    />
  )
}
