import { Workflow, Layers3, GitBranch, ClipboardCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getQuota, type Limit, type Quota } from '@/lib/data'
import { QuotaBar } from '@/components/quota-bar'
import { AutomationForm } from '@/components/automation-form'
export default async function AutomationPage() {
  const supabase=await createClient()
  const [{data:limits},{data:windows},{data:projects}]=await Promise.all([
    supabase.from('plan_module_limits').select('module_code,quota_per_24h').eq('plan_code','free'),
    supabase.from('usage_windows').select('module_code,consumed_count,window_ends_at').eq('module_code','automation'),
    supabase.from('automation_projects').select('id,name,description,created_at').order('created_at',{ascending:false}).limit(20)
  ])
  const quota=getQuota('automation',limits as Limit[]|null,windows as Quota[]|null)
  return <>
    <div className="module-page-head"><div className="module-page-icon green"><Workflow size={26}/></div><div><div className="page-eyebrow">MODULE 03 / PRODUCTIVITÉ</div><h1>DGIA Automation</h1><p>Organisez les processus que vous souhaitez automatiser.</p></div></div>
    <div className="workspace-layout"><div className="workspace-main">
      <div className="workspace-card"><div className="workspace-card-heading"><div><h2>Nouveau projet d’automatisation</h2><p>Centralisez vos idées et préparez les étapes de mise en œuvre.</p></div><GitBranch size={21}/></div><AutomationForm disabled={quota.used>=quota.limit}/></div>
      <div className="workspace-card"><h2>Mes projets</h2><div className="record-list">{projects?.length?projects.map(p=><div className="record-item" key={p.id}><div><strong>{p.name}</strong><p>{p.description||'Aucune description'}</p><small>{new Date(p.created_at).toLocaleDateString('fr-FR')}</small></div><ClipboardCheck size={17}/></div>):<p className="empty-state">Aucun projet créé.</p>}</div></div>
    </div><aside className="workspace-side"><QuotaBar {...quota}/><div className="tips-card"><h3>Cas d’usage possibles</h3><div><Layers3 size={18}/> Suivi des demandes clients</div><div><GitBranch size={18}/> Processus commerciaux</div><div><ClipboardCheck size={18}/> Rappels et tâches</div><p>L’exécution automatique sera développée ultérieurement.</p></div></aside></div>
  </>
}
