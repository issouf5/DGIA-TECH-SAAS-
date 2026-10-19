import { Check, CreditCard, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { buildPlanCatalog, type PlanRow, type PlanLimitRow } from '@/lib/pricing'
export default async function SubscriptionsPage() {
  const supabase=await createClient()
  const [{ data: subscriptions }, { data: plans }, { data: limits }] = await Promise.all([
    supabase.from('subscriptions').select('plan_code,status,expires_at').order('created_at',{ascending:false}).limit(5),
    supabase.from('plans').select('code,label,price_xof,enabled'),
    supabase.from('plan_module_limits').select('plan_code,module_code,quota_per_24h')
  ])
  const catalog = buildPlanCatalog(plans as PlanRow[] | null, limits as PlanLimitRow[] | null)
  const active = subscriptions?.find(s => s.status === 'active' && s.expires_at && new Date(s.expires_at) > new Date())
  const activePlan = catalog.find(p => p.code === active?.plan_code) || catalog[0]
  return <>
    <div className="module-page-head"><div className="module-page-icon blue"><CreditCard size={25}/></div><div><div className="page-eyebrow">GESTION DU COMPTE</div><h1>Mes abonnements</h1><p>Découvrez les formules DGIA TECH SAAS.</p></div></div>
    <div className="workspace-card"><div className="current-plan"><div><span>VOTRE OFFRE ACTUELLE</span><h2>{activePlan.label}</h2><p>{active ? 'Votre formule est active jusqu’à la date d’expiration indiquée dans votre abonnement.' : 'Les quotas gratuits sont renouvelés par période de 24 heures.'}</p></div><ShieldCheck size={35}/></div></div>
    <div className="account-plan-grid">
      {catalog.map(p=><div className="account-plan" key={p.code}>
        <span>FORMULE DGIA {p.available ? '· DISPONIBLE' : '· EN PRÉPARATION'}</span>
        <h2>{p.label}</h2><strong>{p.priceLabel}</strong><p>{p.description}</p>
        <div><Check size={17}/>{p.quotaLabel}</div>
        {p.benefits.map(item=><div key={item}><Check size={17}/>{item}</div>)}
        <span className={'plan-state'+(p.available?' active':'')}>{p.available?'Disponible':'Souscription prochainement'}</span>
      </div>)}
    </div><p className="muted-note">Tarifs de lancement validés. Les offres Premium et Professionnel ne peuvent pas encore être souscrites. Aucun paiement n’est actuellement demandé ni encaissé sur cette plateforme.</p>
  </>
}
