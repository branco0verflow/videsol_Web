import type { Metadata } from 'next'
import LeadsDashboard from '@/components/sections/LeadsDashboard'

export const metadata: Metadata = {
  title: 'Admin — Leads | Videsol',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <LeadsDashboard />
}
