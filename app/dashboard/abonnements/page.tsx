import Link from 'next/link'
import { Check, CreditCard, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { buildPlanCatalog, type PlanRow, type PlanLimitRow } from '@/lib/pricing'

export default async function SubscriptionsPage() {
  const supabase = await createClient()
  const [{ data: subscriptions }, { data: plans }, { data: limits }] = await Promise.all([
    supabase.from('subscriptions').select('plan_code,status,expires_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('plans').select('code,label,price_xof,enabled'),
    supabase.from('plan_module_limits').select('plan_code,module_code,quota_per_24h')
  ])
  const catalog = buildPlanCatalog(plans as PlanRow[] | null, limits as PlanLimitRow[] | null)
  const active = subscriptions?.find(s => s.status === 'active' && s.expires_at && new Date(s.expires_at) > new Date())
  const activePlan = catalog.find(p => p.code === active?.plan_code) || catalog[0]

  return <>
    <div className="module-page-head">
      <div className="module-page-icon blue"><CreditCard size={25}/></div>
      <div><div className="page-eyebrow">GESTION DU COMPTE</div><h1>Mes abonnements</h1><p>Formules mensuelles DGIA TECH SAAS.</p></div>
    </div>

    <div className="workspace-card">
      <div className="current-plan">
        <div>
          <span>VOTRE OFFRE ACTUELLE</span>
          <h2>{activePlan.label}</h2>
          <p>{active
            ? 'Votre formule est active jusqu’à sa date d’expiration.'
            : 'Vous utilisez actuellement l’offre gratuite, avec des quotas renouvelés toutes les 24 heures.'}</p>
        </div>
        <ShieldCheck size={35}/>
      </div>
    </div>

    <div className="account-plan-grid">
      {catalog.map(p => <div className="account-plan" key={p.code}>
        <span>FORMULE DGIA {p.available ? '· DISPONIBLE' : '· EN PRÉPARATION'}</span>
        <h2>{p.label}</h2>
        <strong>{p.priceLabel}</strong>
        <p>{p.description}</p>
        <div><Check size={17}/>{p.quotaLabel}</div>
        {p.benefits.map(item => <div key={item}><Check size={17}/>{item}</div>)}
        <span className={'plan-state' + (p.available ? ' active' : '')}>
          {p.available ? 'Disponible' : 'Souscription prochainement'}
        </span>
      </div>)}
    </div>

    <div className="workspace-card">
      <h2>Abonnement mensuel ou licence annuelle ?</h2>
      <p><strong>Abonnement mensuel :</strong> accès aux services de la plateforme selon la formule choisie. Les offres payantes restent en préparation.</p>
      <p><strong>Licence annuelle par logiciel :</strong> droit d’utiliser un logiciel DGIA déterminé pendant 12 mois à compter de son activation, selon les conditions de ce logiciel. Cette offre est distincte des abonnements.</p>
      <p className="muted-note">Les licences annuelles ne sont pas encore commercialisées. Aucun paiement ni renouvellement automatique n’est activé.</p>
      <Link href="/dashboard/licences" className="record-action">Consulter mes licences →</Link>
    </div>

    <p className="muted-note">Les tarifs mensuels affichés sont ceux enregistrés dans le catalogue actuel. Premium et Professionnel ne peuvent pas encore être souscrits. Aucun paiement n’est demandé ni encaissé sur la plateforme.</p>
  </>
}
