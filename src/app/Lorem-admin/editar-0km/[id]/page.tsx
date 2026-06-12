import { notFound } from 'next/navigation'
import type { VehicleDetailAPI } from '@/types/vehicle'
import EditarVehiculoForm from '../EditarVehiculoForm'
import { API } from '@/lib/config'

interface Props {
  params: Promise<{ id: string }>
}

async function fetchVehicle(id: string): Promise<VehicleDetailAPI | null> {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value

    const res = await fetch(`${API}/admin/okm/${id}`, {
      cache: 'no-store',
      headers: token ? { Cookie: `admin_token=${token}` } : {},
    })
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
