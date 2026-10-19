import { Bot, Sparkles, NotebookPen } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getQuota, type Limit, type Quota } from '@/lib/data'
import { QuotaBar } from '@/components/quota-bar'
import { RecordManager } from '@/components/record-manager'
import { AiForm } from '@/components/ai-form'
export default async function AIPage() {
  const supabase=await createClient()
  const [{data:limits},{data:windows},{data:prompts}]=await Promise.all([
    supabase.from('plan_module_limits').select('module_code,quota_per_24h').eq('plan_code','free'),
    supabase.from('usage_windows').select('module_code,consumed_count,window_ends_at').eq('module_code','ai_tools'),
    supabase.from('ai_prompts').select('id,title,prompt,created_at').order('created_at',{ascending:false}).limit(20)
  ])
  const quota=getQuota('ai_tools',limits as Limit[]|null,windows as Quota[]|null)
  return <>
    <div className="module-page-head"><div className="module-page-icon violet"><Bot size={26}/></div><div><div className="page-eyebrow">MODULE 02 / INTELLIGENCE APPLIQUÉE</div><h1>DGIA AI Tools</h1><p>Créez et sauvegardez des prompts structurés pour vos outils IA.</p></div></div>
    <div className="workspace-layout"><div className="workspace-main">
      <div className="workspace-card"><div className="workspace-card-heading"><div><h2>Atelier de prompts</h2><p>Transformez votre besoin en une instruction claire et réutilisable.</p></div><Sparkles size={21}/></div><AiForm disabled={quota.used>=quota.limit}/></div>
      <div className="workspace-card"><h2>Mes prompts enregistrés ({prompts?.length??0})</h2><p className="field-note">Retrouvez, copiez et gérez vos prompts.</p><RecordManager kind="ai" records={(prompts??[]).map(r=>({id:r.id,title:r.title,body:r.prompt,createdAt:r.created_at}))}/></div>
    </div><aside className="workspace-side"><QuotaBar {...quota}/><div className="tips-card"><h3>À savoir</h3><p>Cet atelier construit et sauvegarde des prompts. Il ne contacte pas encore de modèle d’intelligence artificielle.</p><div><Sparkles size={18}/> Structurer vos demandes</div><div><NotebookPen size={18}/> Conserver vos prompts</div></div></aside></div>
  </>
}
