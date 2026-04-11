import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import VehicleDetail from '@/components/sections/VehicleDetail'
import vehiculos from '../../../../db/vehiculos'

const ALL_VEHICLES = [...vehiculos.okm, ...vehiculos.usados]

interface Props {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return ALL_VEHICLES.map((v) => ({ id: v.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const vehicle = ALL_VEHICLES.find((v) => v.id === id)
  if (!vehicle) return { title: 'Vehículo no encontrado | Videsol' }
  return {
    title: `${vehicle.marca} ${vehicle.modelo} ${vehicle.version} | Videsol`,
    description: vehicle.descripcion,
  }
}

export default async function VehiclePage({ params }: Props) {
  const { id } = await params
  const vehicle = ALL_VEHICLES.find((v) => v.id === id)
  if (!vehicle) notFound()

  return (
    <>
      <Navbar />
      <main>
        <VehicleDetail vehicle={vehicle} />
      </main>
      <Footer />
    </>
  )
}
