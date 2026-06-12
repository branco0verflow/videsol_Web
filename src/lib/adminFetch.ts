import { API } from '@/lib/config'

/**
 * Fetch para endpoints /api/admin/*.
 * Envía la cookie admin_token automáticamente y redirige al login
 * si la sesión expiró o no es válida (401/403).
 */
export async function adminFetch(path: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData

  const res = await fetch(`${API}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  })

  if (res.status === 401 || res.status === 403) {
    if (typeof window !== 'undefined') {
      window.location.href = '/Lorem-admin/login'
    }
    throw new Error('Sesión expirada')
  }

  return res
}
