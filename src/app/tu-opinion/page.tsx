import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Calificanos from '@/components/sections/Calificanos'

export const metadata: Metadata = {
  title: 'Tu opinión | Videsol',
  description: 'Contanos cómo fue tu experiencia en Videsol. Tu opinión nos ayuda a mejorar cada entrega.',
}

export default function TuOpinionPage() {
  return (
    <>
      <Navbar />
      <main>
        <Calificanos />
      </main>
      <Footer />
    </>
  )
}
