import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import VehicleDetail from '@/components/sections/VehicleDetail'
import VehicleDetailUsado from '@/components/sections/VehicleDetailUsado'
import type { VehicleDetailAPI, VehicleUsadoDetailAPI } from '@/types/vehicle'
import { API } from '@/lib/config'

type Catalogo = 'okm' | 'usados'

interface Props {
  params: Promise<{ catalogo: Catalogo; slug: string }>
}

async function fetchOkm(slug: string): Promise<VehicleDetailAPI | null> {
  try {
    const res = await fetch(`${API}/okm/slug/${slug}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json() as Promise<VehicleDetailAPI>
  } catch {
    return null
  }
}

async function fetchUsado(slug: string): Promise<VehicleUsadoDetailAPI | null> {
  try {
    const res = await fetch(`${API}/usados/slug/${slug}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json() as Promise<VehicleUsadoDetailAPI>
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { catalogo, slug } = await params

  if (catalogo === 'okm') {
    const v = await fetchOkm(slug)
    if (!v) return { title: 'Vehículo no encontrado | Videsol' }
    return {
      title: `${v.marca} ${v.modelo} ${v.version} | Videsol`,
      description: v.descripcion,
    }
  }

  const v = await fetchUsado(slug)
  if (!v) return { title: 'Vehículo no encontrado | Videsol' }
  return {
    title: `${v.marca} ${v.modelo} ${v.version} | Videsol`,
    description: v.descripcion,
  }
}

export default async function VehiclePage({ params }: Props) {
  const { catalogo, slug } = await params

  if (catalogo !== 'okm' && catalogo !== 'usados') notFound()

  if (catalogo === 'okm') {
    const vehicle = await fetchOkm(slug)
    if (!vehicle) notFound()
    return (
      <>
        <Navbar />
        <main><VehicleDetail vehicle={vehicle} /></main>
        <Footer />
      </>
    )
  }

  const vehicle = await fetchUsado(slug)
  if (!vehicle) notFound()
  return (
    <>
      <Navbar />
      <main><VehicleDetailUsado vehicle={vehicle} /></main>
      <Footer />
    </>
  )
}
