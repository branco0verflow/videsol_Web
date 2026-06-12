'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { API } from '@/lib/config'

export default function AdminLoginPage() {
  const router = useRouter()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API}/auth/login`, {
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

      router.push('/Lorem-admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="flex flex-col items-center mb-8">
          <Image src="/images/logo.png" alt="Videsol" width={140} height={48} className="h-10 w-auto object-contain mb-4" />
          <p className="text-[11px] text-slate-400 font-medium tracking-widest uppercase">
            Panel de administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 flex flex-col gap-4">
          <div>
            <h1 className="text-[18px] font-bold text-slate-800 leading-tight">Iniciar sesión</h1>
            <p className="text-[13px] text-slate-400 mt-1">Ingresá tus credenciales para continuar.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[12px] font-semibold text-slate-600">
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
              className="px-4 py-2.5 text-[13px] border border-slate-200 rounded-lg outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all placeholder:text-slate-300"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[12px] font-semibold text-slate-600">
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
              className="px-4 py-2.5 text-[13px] border border-slate-200 rounded-lg outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all placeholder:text-slate-300"
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
            className="mt-2 px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-[13px] font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
