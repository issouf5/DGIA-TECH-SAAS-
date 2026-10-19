import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: { default: 'DGIA TECH SAAS | Solutions numériques', template: '%s | DGIA TECH SAAS' },
  description: 'Assistance IT, outils IA et automatisation pour les professionnels.'
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>
}
