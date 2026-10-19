import { KeyRound, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
export default async function LicensesPage() {
  const supabase=await createClient()
  const {data:licenses}=await supabase.from('licenses').select('id,product_name,status,expires_at').order('created_at',{ascending:false})
  return <>
    <div className="module-page-head"><div className="module-page-icon violet"><KeyRound size={25}/></div><div><div className="page-eyebrow">MES PRODUITS</div><h1>Mes licences</h1><p>Consultez les licences associées à votre compte.</p></div></div>
    <div className="workspace-card"><h2>Licences enregistrées</h2>{licenses?.length?<div className="record-list">{licenses.map(l=><div className="record-item" key={l.id}><div><strong>{l.product_name}</strong><p>{l.expires_at?'Expiration : '+new Date(l.expires_at).toLocaleDateString('fr-FR'):'Date de fin non définie'}</p></div><span className="record-status">{l.status}</span></div>)}</div>:<div className="empty-licenses"><KeyRound size={39}/><h3>Aucune licence pour le moment</h3><p>Les licences apparaîtront ici lorsqu’elles seront proposées et attribuées à votre compte.</p><span><ShieldCheck size={16}/> Aucun achat nécessaire actuellement</span></div>}</div>
  </>
}
