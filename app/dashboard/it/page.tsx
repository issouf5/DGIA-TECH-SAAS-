import { Network, Router, Wifi, MonitorCog, ClipboardList } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getQuota, type Limit, type Quota } from '@/lib/data'
import { QuotaBar } from '@/components/quota-bar'
import { ItForm } from '@/components/it-form'
export default async function ITPage() {
  const supabase=await createClient()
  const [{data:limits},{data:windows},{data:requests}]=await Promise.all([
    supabase.from('plan_module_limits').select('module_code,quota_per_24h').eq('plan_code','free'),
    supabase.from('usage_windows').select('module_code,consumed_count,window_ends_at').eq('module_code','it_solutions'),
    supabase.from('service_requests').select('id,title,details,status,created_at').order('created_at',{ascending:false}).limit(20)
  ])
  const quota=getQuota('it_solutions',limits as Limit[]|null,windows as Quota[]|null)
  return <>
    <div className="module-page-head"><div className="module-page-icon blue"><Network size={26}/></div><div><div className="page-eyebrow">MODULE 01 / INFRASTRUCTURE</div><h1>DGIA IT Solutions</h1><p>Signalez un problème et organisez vos demandes d’assistance informatique.</p></div></div>
    <div className="workspace-layout"><div className="workspace-main">
      <div className="workspace-card"><div className="workspace-card-heading"><div><h2>Nouvelle demande d’assistance</h2><p>Le traitement par DGIA sera activé prochainement.</p></div><ClipboardList size={21}/></div><ItForm disabled={quota.used>=quota.limit}/></div>
      <div className="workspace-card"><h2>Historique des demandes</h2><div className="record-list">{requests?.length?requests.map(r=><div className="record-item" key={r.id}><div><strong>{r.title}</strong><p>{r.details}</p><small>{new Date(r.created_at).toLocaleDateString('fr-FR')}</small></div><span className="record-status">{r.status==='pending'?'En attente':r.status==='in_progress'?'En cours':r.status==='resolved'?'Résolu':'Clôturé'}</span></div>):<p className="empty-state">Aucune demande. Votre première demande apparaîtra ici.</p>}</div></div>
    </div><aside className="workspace-side"><QuotaBar {...quota}/><div className="tips-card"><h3>Domaines d’intervention</h3><div><Wifi size={18}/> Wi-Fi et connectivité</div><div><Router size={18}/> Réseaux et MikroTik</div><div><MonitorCog size={18}/> Assistance informatique</div><p>Le diagnostic automatisé sera ajouté ultérieurement.</p></div></aside></div>
  </>
}
