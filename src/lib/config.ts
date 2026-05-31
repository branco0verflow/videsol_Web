/**
 * API_BASE  → origen del backend  (ej. "http://localhost:8080")
 * API       → origen + /api       (ej. "http://localhost:8080/api")
 *
 * En desarrollo usa NEXT_PUBLIC_API_URL de .env.local (localhost:8080).
 * En producción lee la variable del entorno de despliegue (Vercel / Render).
 */
const origin = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080').replace(/\/$/, '')

export const API_BASE = origin
export const API      = `${origin}/api`
