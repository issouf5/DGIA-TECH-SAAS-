import { Check, CreditCard, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
export default async function SubscriptionsPage() {
  const supabase=await createClient()
  const {data:subscriptions}=await supabase.from('subscriptions').select('plan_code,status,expires_at').order('created_at',{ascending:false}).limit(5)
  const active=subscriptions?.find(s=>s.status==='active' && s.expires_at && new Date(s.expires_at)>new Date())
  return <>
    <div className="module-page-head"><div className="module-page-icon blue"><CreditCard size={25}/></div><div><div className="page-eyebrow">GESTION DU COMPTE</div><h1>Mes abonnements</h1><p>Découvrez les formules DGIA TECH SAAS.</p></div></div>
    <div className="workspace-card"><div className="current-plan"><div><span>VOTRE OFFRE ACTUELLE</span><h2>{active?active.plan_code:'Gratuit'}</h2><p>Les quotas gratuits sont renouvelés par période de 24 heures.</p></div><ShieldCheck size={35}/></div></div>
    <div className="account-plan-grid">
      {[
        {name:'Gratuit',price:'0 FCFA',desc:'Accès aux 3 modules',available:true},
        {name:'Premium',price:'Tarif à venir',desc:'Quotas et fonctionnalités avancés',available:false},
        {name:'Professionnel',price:'Tarif à venir',desc:'Prestations et licences professionnelles',available:false}
      ].map(p=><div className="account-plan" key={p.name}><span>FORMULE DGIA</span><h2>{p.name}</h2><strong>{p.price}</strong><p>{p.desc}</p><div><Check size={17}/> Espace client sécurisé</div><span className={'plan-state'+(p.available?' active':'')}>{p.available?'Disponible':'Prochainement'}</span></div>)}
    </div><p className="muted-note">Les paiements et les souscriptions payantes ne sont pas encore activés.</p>
  </>
}
