import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LogOut, ShieldCheck, ArrowUpRight } from 'lucide-react'
import { DashboardNavigation } from '@/components/dashboard-navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from './actions'
export default async function DashboardLayout({children}:{children:React.ReactNode}) {
  const supabase = await createClient()
  const { data:{ user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')
  const {data:profile}=await supabase.from('profiles').select('full_name').eq('id',user.id).maybeSingle()
  const name=profile?.full_name || user.email?.split('@')[0] || 'Utilisateur'
  return <div className="app-shell">
    <aside className="sidebar">
      <Link href="/" className="brand"><span className="brand-mark">D✦</span><span className="brand-word"><strong>DGIA <em>TECH</em></strong><small>SAAS PLATFORM</small></span></Link>
      <div className="sidebar-label">ESPACE DE TRAVAIL</div>
      <DashboardNavigation/>
      <div className="sidebar-bottom"><div className="sidebar-upgrade"><ArrowUpRight size={20}/><strong>Envie d’aller plus loin ?</strong><p>Les offres avancées arrivent prochainement.</p><Link href="/dashboard/abonnements">Voir les offres →</Link></div><p className="sidebar-secure"><ShieldCheck size={15}/> Espace sécurisé</p></div>
    </aside>
    <div className="app-content">
      <header className="app-topbar"><div><span className="app-topbar-overline">DGIA TECH SAAS / ESPACE CLIENT</span><strong>Bienvenue, {name}</strong></div><div className="app-topbar-actions"><span className="user-avatar">{name.slice(0,1).toUpperCase()}</span><form action={signOut}><button type="submit" className="signout-button"><LogOut size={18}/><span>Déconnexion</span></button></form></div></header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">© {new Date().getFullYear()} DGIA TECH SAAS · Version alpha</footer>
    </div>
  </div>
}
