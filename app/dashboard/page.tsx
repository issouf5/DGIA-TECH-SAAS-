import Link from 'next/link'
import { ArrowRight, Bot, Network, Workflow, Clock3, ShieldCheck, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getQuota, type Limit, type Quota } from '@/lib/data'
export default async function Dashboard() {
  const supabase = await createClient()
  const [{data:limits},{data:windows},{count:requests},{count:projects},{count:prompts}] = await Promise.all([
    supabase.from('plan_module_limits').select('module_code,quota_per_24h').eq('plan_code','free'),
    supabase.from('usage_windows').select('module_code,consumed_count,window_ends_at'),
    supabase.from('service_requests').select('id',{count:'exact',head:true}),
    supabase.from('automation_projects').select('id',{count:'exact',head:true}),
    supabase.from('ai_prompts').select('id',{count:'exact',head:true})
  ])
  const cards=[
    {code:'it_solutions',name:'DGIA IT Solutions',desc:'Assistance et diagnostic informatique',icon:Network,href:'/dashboard/it',color:'blue',count:requests??0,unit:'demandes'},
    {code:'ai_tools',name:'DGIA AI Tools',desc:'Atelier de prompts professionnels',icon:Bot,href:'/dashboard/ai',color:'violet',count:prompts??0,unit:'prompts'},
    {code:'automation',name:'DGIA Automation',desc:'Projets de productivité',icon:Workflow,href:'/dashboard/automation',color:'green',count:projects??0,unit:'projets'}
  ]
  return <>
    <div className="page-title-row"><div><div className="page-eyebrow"><Sparkles size={15}/> VOTRE CENTRE DE CONTRÔLE</div><h1>Tableau de bord</h1><p>Gérez vos services et suivez votre activité en un seul endroit.</p></div><span className="plan-badge">FORFAIT GRATUIT</span></div>
    <div className="welcome-banner"><span>BIENVENUE SUR DGIA TECH SAAS</span><h2>Les bons outils pour<br/><em>passer à l’action.</em></h2><p>Découvrez vos trois modules et commencez dès aujourd’hui.</p></div>
    <div className="stats-grid"><div className="stat-card"><Network size={22}/><div><span>Demandes IT</span><strong>{requests??0}</strong></div></div><div className="stat-card"><Bot size={22}/><div><span>Prompts enregistrés</span><strong>{prompts??0}</strong></div></div><div className="stat-card"><Workflow size={22}/><div><span>Projets automation</span><strong>{projects??0}</strong></div></div></div>
    <div className="subheading"><div><h2>Mes solutions</h2><p>Choisissez un module pour commencer</p></div></div>
    <div className="dash-module-grid">{cards.map(card=>{const Icon=card.icon;const quota=getQuota(card.code,limits as Limit[]|null,windows as Quota[]|null);return <Link href={card.href} key={card.code} className="dash-module"><div className={'dash-module-icon '+card.color}><Icon size={25}/></div><h3>{card.name}</h3><p>{card.desc}</p><div className="dash-module-count"><Clock3 size={15}/>{Math.max(0,quota.limit-quota.used)} / {quota.limit} opérations restantes</div><div className="dash-module-footer"><span>{card.count} {card.unit}</span><ArrowRight size={19}/></div></Link>})}</div>
    <div className="notice-strip"><ShieldCheck size={20}/><div><strong>Votre espace est privé.</strong><span>Vos demandes, projets et prompts sont accessibles uniquement depuis votre compte.</span></div></div>
  </>
}
