import './wifi-wizard.css'
import Link from 'next/link'
import { WIFI_PRO, formatWifiProPrice } from '@/lib/wifi-pro-catalog'
import { Network, Router, Wifi, MonitorCog, ClipboardList } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getQuota, type Limit, type Quota } from '@/lib/data'
import { QuotaBar } from '@/components/quota-bar'
import { RecordManager } from '@/components/record-manager'
import { ItForm } from '@/components/it-form'
import { GuidedItDiagnosis } from '@/components/guided-it-diagnosis'
export default async function ITPage() {
  const supabase=await createClient()
  const [{data:limits},{data:windows},{data:requests}]=await Promise.all([
    supabase.from('plan_module_limits').select('module_code,quota_per_24h').eq('plan_code','free'),
    supabase.from('usage_windows').select('module_code,consumed_count,window_ends_at').eq('module_code','it_solutions'),
    supabase.from('service_requests').select('id,title,details,status,created_at').order('created_at',{ascending:false}).limit(20)
  ])
  const quota=getQuota('it_solutions',limits as Limit[]|null,windows as Quota[]|null)
  return <>
    <div className="module-page-head"><div className="module-page-icon blue"><Network size={26}/></div><div><div className="page-eyebrow">MODULE 01 / INFRASTRUCTURE</div><h1>DGIA IT Solutions</h1><p>Identifiez les premières vérifications à faire, puis organisez vos demandes d’assistance informatique.</p></div></div>
    <div className="workspace-card"><div className="workspace-card-heading"><div><div className="page-eyebrow">LOGICIEL PROFESSIONNEL · EN PRÉPARATION</div><h2>{WIFI_PRO.productName}</h2><p>Licence annuelle : {formatWifiProPrice()} pour 12 mois. Rapports professionnels, PDF, historique et suivi des incidents sont prévus. Aucun paiement activé.</p></div><Wifi size={22}/></div><Link href="/dashboard/it/wifi-pro" className="record-action">Découvrir la maquette Pro →</Link></div>
    <div className="workspace-layout"><div className="workspace-main">
      <GuidedItDiagnosis quotaAvailable={quota.used < quota.limit}/>
      <div className="workspace-card"><div className="workspace-card-heading"><div><h2>Nouvelle demande d’assistance</h2><p>Le traitement par DGIA sera activé prochainement.</p></div><ClipboardList size={21}/></div><ItForm disabled={quota.used>=quota.limit}/></div>
      <div className="workspace-card"><h2>Historique des demandes ({requests?.length??0})</h2><p className="field-note">Les demandes en attente peuvent être modifiées ou supprimées.</p><RecordManager kind="it" records={(requests??[]).map(r=>({id:r.id,title:r.title,body:r.details,createdAt:r.created_at,status:r.status}))}/></div>
    </div><aside className="workspace-side"><QuotaBar {...quota}/><div className="tips-card"><h3>Domaines d’intervention</h3><div><Wifi size={18}/> Wi-Fi et connectivité</div><div><Router size={18}/> Réseaux et MikroTik</div><div><MonitorCog size={18}/> Assistance informatique</div><p>L’assistant Wi-Fi pose plusieurs questions et propose une orientation fondée sur vos réponses, sans analyse réelle du matériel.</p></div></aside></div>
  </>
}
