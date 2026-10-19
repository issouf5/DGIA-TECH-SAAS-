'use client'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { friendlyError } from '@/lib/data'
export function ItForm({disabled}:{disabled:boolean}) {
  const router=useRouter()
  const [title,setTitle]=useState('')
  const [details,setDetails]=useState('')
  const [busy,setBusy]=useState(false)
  const [message,setMessage]=useState('')
  const [success,setSuccess]=useState(false)
  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();setBusy(true);setMessage('');setSuccess(false)
    const {error}=await createClient().from('service_requests').insert({module_code:'it_solutions',title:title.trim(),details:details.trim()})
    setBusy(false)
    if(error){setMessage(friendlyError(error.message));return}
    setTitle('');setDetails('');setSuccess(true);setMessage('Votre demande a été enregistrée.');router.refresh()
  }
  return <form onSubmit={submit} className="workspace-form">
    <label>Objet de la demande<input required minLength={3} maxLength={160} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ex. : Mon Wi-Fi est instable"/></label>
    <label>Décrivez le problème<textarea required minLength={10} maxLength={5000} rows={5} value={details} onChange={e=>setDetails(e.target.value)} placeholder="Contexte, équipements concernés et symptômes…"/></label>
    {message&&<p role="status" className={success?'form-message success':'form-message error'}>{message}</p>}
    <button type="submit" className="button button-gold" disabled={busy||disabled}>{busy?'Envoi…':<>Envoyer ma demande <ArrowRight size={17}/></>}</button>
    {disabled&&<p className="field-note">Quota atteint : revenez après le renouvellement.</p>}
  </form>
}
