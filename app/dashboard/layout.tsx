import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Bot, CreditCard, LayoutDashboard, LogOut, Network, ShieldCheck, Workflow, KeyRound, ArrowUpRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { signOut } from './actions'
const nav = [
  { href:'/dashboard', label:'Vue d’ensemble', icon:LayoutDashboard },
  { href:'/dashboard/it', label:'IT Solutions', icon:Network },
  { href:'/dashboard/ai', label:'AI Tools', icon:Bot },
  { href:'/dashboard/automation', label:'Automation', icon:Workflow },
  { href:'/dashboard/abonnements', label:'Abonnements', icon:CreditCard },
  { href:'/dashboard/licences', label:'Mes licences', icon:KeyRound }
]
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
      <nav className="side-nav" aria-label="Menu du tableau de bord">{nav.map(({href,label,icon:Icon})=><Link href={href} key={href}><Icon size={19}/>{label}</Link>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-upgrade"><ArrowUpRight size={20}/><strong>Envie d’aller plus loin ?</strong><p>Les offres avancées arrivent prochainement.</p><Link href="/dashboard/abonnements">Voir les offres →</Link></div><p className="sidebar-secure"><ShieldCheck size={15}/> Espace sécurisé</p></div>
    </aside>
    <div className="app-content">
      <header className="app-topbar"><div><span className="app-topbar-overline">DGIA TECH SAAS / ESPACE CLIENT</span><strong>Bienvenue, {name}</strong></div><div className="app-topbar-actions"><span className="user-avatar">{name.slice(0,1).toUpperCase()}</span><form action={signOut}><button type="submit" className="signout-button"><LogOut size={18}/><span>Déconnexion</span></button></form></div></header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">© {new Date().getFullYear()} DGIA TECH SAAS · Version alpha</footer>
    </div>
  </div>
}
