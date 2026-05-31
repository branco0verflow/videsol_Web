import { notFound } from 'next/navigation'
import type { VehicleUsadoDetailAPI } from '@/types/vehicle'
import EditarUsadoForm from '../EditarUsadoForm'
import { API } from '@/lib/config'

interface Props {
  params: Promise<{ id: string }>
}

async function fetchVehicle(id: string): Promise<VehicleUsadoDetailAPI | null> {
  try {
    const res = await fetch(`${API}/usados/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json() as Promise<VehicleUsadoDetailAPI>
  } catch {
    return null
  }
}

export default async function EditarUsadoPage({ params }: Props) {
  const { id } = await params
  const vehicle = await fetchVehicle(id)
  if (!vehicle) notFound()
  return <EditarUsadoForm vehicle={vehicle} />
}
