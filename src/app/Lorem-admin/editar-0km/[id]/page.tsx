import { notFound } from 'next/navigation'
import type { VehicleDetailAPI } from '@/types/vehicle'
import EditarVehiculoForm from '../EditarVehiculoForm'
import { API } from '@/lib/config'

interface Props {
  params: Promise<{ id: string }>
}

async function fetchVehicle(id: string): Promise<VehicleDetailAPI | null> {
  try {
    const res = await fetch(`${API}/okm/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json() as Promise<VehicleDetailAPI>
  } catch {
    return null
  }
}

export default async function EditarVehiculoPage({ params }: Props) {
  const { id } = await params
  const vehicle = await fetchVehicle(id)
  if (!vehicle) notFound()
  return <EditarVehiculoForm vehicle={vehicle} />
}
