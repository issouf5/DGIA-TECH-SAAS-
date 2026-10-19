'use client'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Copy, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { friendlyError } from '@/lib/data'
const tones=['Professionnel','Pédagogique','Convaincant','Concis','Créatif']
export function AiForm({disabled}:{disabled:boolean}) {
  const router=useRouter()
  const [title,setTitle]=useState('')
  const [objective,setObjective]=useState('')
  const [audience,setAudience]=useState('')
  const [tone,setTone]=useState('Professionnel')
  const [result,setResult]=useState('')
  const [busy,setBusy]=useState(false)
  const [message,setMessage]=useState('')
  const [success,setSuccess]=useState(false)
  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();setBusy(true);setMessage('');setSuccess(false)
    const prompt = [
      'Agis comme un expert du domaine concerné.',
      'Objectif : '+objective.trim(),
      'Public cible : '+audience.trim(),
      'Ton : '+tone.toLowerCase(),
      'Consignes : propose une réponse claire, structurée et directement exploitable. Adapte le vocabulaire au public cible. Donne des exemples concrets. Signale les informations manquantes sans inventer de faits. Termine par des recommandations pratiques.'
    ].join('\n\n')
    const {error}=await createClient().from('ai_prompts').insert({title:title.trim(),prompt})
    setBusy(false)
    if(error){setMessage(friendlyError(error.message));return}
    setResult(prompt);setMessage('Votre prompt a été créé et enregistré.');setSuccess(true);router.refresh()
  }
  return <>
    <form onSubmit={submit} className="workspace-form">
      <label>Nom du prompt<input required minLength={3} maxLength={160} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ex. : Prospection commerciale"/></label>
      <label>Résultat souhaité<textarea required minLength={8} maxLength={2000} rows={3} value={objective} onChange={e=>setObjective(e.target.value)} placeholder="Ex. : Présenter mes services informatiques"/></label>
      <div className="form-row"><label>Public cible<input required maxLength={250} value={audience} onChange={e=>setAudience(e.target.value)} placeholder="Ex. : Petites entreprises"/></label><label>Ton souhaité<select value={tone} onChange={e=>setTone(e.target.value)}>{tones.map(t=><option key={t}>{t}</option>)}</select></label></div>
      {message&&<p role="status" className={success?'form-message success':'form-message error'}>{message}</p>}
      <button type="submit" className="button button-gold" disabled={busy||disabled}>{busy?'Création…':<>Créer et enregistrer <ArrowRight size={17}/></>}</button>
      {disabled&&<p className="field-note">Quota atteint : revenez après le renouvellement.</p>}
    </form>
    {result&&<div className="generated-output"><div className="generated-head"><strong><Sparkles size={16}/> Votre prompt prêt à utiliser</strong><button type="button" onClick={()=>navigator.clipboard.writeText(result)}><Copy size={16}/> Copier</button></div><pre>{result}</pre></div>}
  </>
}
