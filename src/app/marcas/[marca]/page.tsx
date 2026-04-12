import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BRAND_MAP } from '@/lib/brands'
import vehiculos from '../../../../db/vehiculos'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BrandPage from '@/components/sections/BrandPage'

type Props = { params: Promise<{ marca: string }> }

export function generateStaticParams() {
  return Object.keys(BRAND_MAP).map((marca) => ({ marca }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { marca } = await params
  const brand = BRAND_MAP[marca]
  if (!brand) return { title: 'Marca no encontrada | Videsol' }
  return {
    title: `${brand.name} | Videsol`,
    description: `Vehículos ${brand.name} disponibles en Videsol. 0 km y usados con garantía oficial.`,
  }
}

export default async function MarcaPage({ params }: Props) {
  const { marca } = await params
  const brand = BRAND_MAP[marca]
  if (!brand) notFound()

  const ALL = [...vehiculos.okm, ...vehiculos.usados]
  const vehicles = ALL.filter(
    (v) => v.marca.toLowerCase() === brand.name.toLowerCase()
  )

  return (
    <>
      <Navbar />
      <main>
        <BrandPage brand={brand} vehicles={vehicles} />
      </main>
      <Footer />
    </>
  )
}
