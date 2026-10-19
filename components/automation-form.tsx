'use client'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { friendlyError } from '@/lib/data'
export function AutomationForm({disabled}:{disabled:boolean}) {
  const router=useRouter()
  const [name,setName]=useState('')
  const [description,setDescription]=useState('')
  const [busy,setBusy]=useState(false)
  const [message,setMessage]=useState('')
  const [success,setSuccess]=useState(false)
  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();setBusy(true);setMessage('');setSuccess(false)
    const {error}=await createClient().from('automation_projects').insert({name:name.trim(),description:description.trim()})
    setBusy(false)
    if(error){setMessage(friendlyError(error.message));return}
    setName('');setDescription('');setMessage('Projet enregistré avec succès.');setSuccess(true);router.refresh()
  }
  return <form onSubmit={submit} className="workspace-form">
    <label>Nom du projet<input required maxLength={160} value={name} onChange={e=>setName(e.target.value)} placeholder="Ex. : Répondre aux demandes clients"/></label>
    <label>Processus à automatiser<textarea rows={5} maxLength={5000} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Décrivez la tâche répétitive et le résultat attendu…"/></label>
    {message&&<p role="status" className={success?'form-message success':'form-message error'}>{message}</p>}
    <button type="submit" className="button button-gold" disabled={busy||disabled}>{busy?'Enregistrement…':<>Créer le projet <ArrowRight size={17}/></>}</button>
    {disabled&&<p className="field-note">Quota atteint : revenez après le renouvellement.</p>}
  </form>
}
