'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Bot, CreditCard, KeyRound, LayoutDashboard, Menu, Network, Workflow, X } from 'lucide-react'

const links = [
  { href: '/dashboard', label: 'Vue d’ensemble', icon: LayoutDashboard },
  { href: '/dashboard/it', label: 'IT Solutions', icon: Network },
  { href: '/dashboard/ai', label: 'AI Tools', icon: Bot },
  { href: '/dashboard/automation', label: 'Automation', icon: Workflow },
  { href: '/dashboard/abonnements', label: 'Abonnements', icon: CreditCard },
  { href: '/dashboard/licences', label: 'Mes licences', icon: KeyRound }
]

export function DashboardNavigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  return <>
    <button type="button" className="mobile-nav-trigger" aria-expanded={open}
      aria-controls="dashboard-navigation" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
      onClick={() => setOpen(value => !value)}>
      {open ? <X size={22}/> : <Menu size={22}/>} <span>{open ? 'Fermer' : 'Menu'}</span>
    </button>
    {open && <button type="button" className="mobile-nav-backdrop" aria-label="Fermer le menu de navigation" onClick={() => setOpen(false)}/>}
    <nav id="dashboard-navigation" className={'side-nav' + (open ? ' is-open' : '')} aria-label="Menu du tableau de bord">
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
        return <Link href={href} key={href} aria-current={active ? 'page' : undefined} onClick={() => setOpen(false)}>
          <Icon size={19}/><span>{label}</span>
        </Link>
      })}
    </nav>
  </>
}
