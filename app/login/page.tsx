import { Suspense } from 'react'
import LoginClient from '@/components/login-client'
export default function LoginPage() {
  return <Suspense fallback={<main className="auth-page">Chargement…</main>}><LoginClient /></Suspense>
}
