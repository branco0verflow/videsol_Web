import { notFound } from 'next/navigation'
import type { VehicleUsadoDetailAPI } from '@/types/vehicle'
import EditarUsadoForm from '../EditarUsadoForm'
import { API } from '@/lib/config'

interface Props {
  params: Promise<{ id: string }>
}

async function fetchVehicle(id: string): Promise<VehicleUsadoDetailAPI | null> {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value

    const res = await fetch(`${API}/admin/usados/${id}`, {
      cache: 'no-store',
      headers: token ? { Cookie: `admin_token=${token}` } : {},
    })
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
