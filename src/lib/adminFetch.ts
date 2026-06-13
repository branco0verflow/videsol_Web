/**
 * Fetch para endpoints /api/admin/*.
 * Usa una ruta relativa (proxeada por next.config.ts hacia el backend) para
 * que la cookie admin_token quede asociada al dominio del frontend.
 * Envía la cookie admin_token automáticamente y redirige al login
 * si la sesión expiró o no es válida (401/403).
 */
export async function adminFetch(path: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData

  const res = await fetch(`/api${path}`, {
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
