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
  params: Promise<{ catalogo: Catalogo; id: string }>
}

async function fetchOkm(id: string): Promise<VehicleDetailAPI | null> {
  try {
    const res = await fetch(`${API}/okm/${id}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json() as Promise<VehicleDetailAPI>
  } catch {
    return null
  }
}

async function fetchUsado(id: string): Promise<VehicleUsadoDetailAPI | null> {
  try {
    const res = await fetch(`${API}/usados/${id}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json() as Promise<VehicleUsadoDetailAPI>
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { catalogo, id } = await params

  if (catalogo === 'okm') {
    const v = await fetchOkm(id)
    if (!v) return { title: 'Vehículo no encontrado | Videsol' }
    return {
      title: `${v.marca} ${v.modelo} ${v.version} | Videsol`,
      description: v.descripcion,
    }
  }

  const v = await fetchUsado(id)
  if (!v) return { title: 'Vehículo no encontrado | Videsol' }
  return {
    title: `${v.marca} ${v.modelo} ${v.version} | Videsol`,
    description: v.descripcion,
  }
}

export default async function VehiclePage({ params }: Props) {
  const { catalogo, id } = await params

  if (catalogo !== 'okm' && catalogo !== 'usados') notFound()

  if (catalogo === 'okm') {
    const vehicle = await fetchOkm(id)
    if (!vehicle) notFound()
    return (
      <>
        <Navbar />
        <main><VehicleDetail vehicle={vehicle} /></main>
        <Footer />
      </>
    )
  }

  const vehicle = await fetchUsado(id)
  if (!vehicle) notFound()
  return (
    <>
      <Navbar />
      <main><VehicleDetailUsado vehicle={vehicle} /></main>
      <Footer />
    </>
  )
}
