import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Taller from '@/components/sections/Taller'

export const metadata: Metadata = {
  title: 'Taller | Videsol',
  description: 'Servicio mecánico certificado en Videsol. Más de 45 años de trayectoria con técnicos especializados en BYD, Nissan, Peugeot, Renault, Citroën, Subaru y Riddara.',
}

export default function TallerPage() {
  return (
    <>
      <Navbar />
      <main>
        <Taller />
      </main>
      <Footer />
    </>
  )
}
