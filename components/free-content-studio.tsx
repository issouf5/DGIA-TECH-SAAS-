'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, FileText, Save, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { friendlyError } from '@/lib/data'

type Format = 'social' | 'product' | 'prospection' | 'whatsapp' | 'plan'
type Tone = 'professionnel' | 'chaleureux' | 'dynamique' | 'concis'
type Draft = { title: string; body: string; format: Format }

const formats: { value: Format; label: string }[] = [
  { value: 'social', label: 'Publication réseaux sociaux' },
  { value: 'product', label: 'Description de produit ou service' },
  { value: 'prospection', label: 'Message de prospection' },
  { value: 'whatsapp', label: 'Annonce WhatsApp' },
  { value: 'plan', label: 'Plan d’action simple' }
]
const tones: { value: Tone; label: string }[] = [
  { value: 'professionnel', label: 'Professionnel' },
  { value: 'chaleureux', label: 'Chaleureux' },
  { value: 'dynamique', label: 'Dynamique' },
  { value: 'concis', label: 'Concis' }
]

function prepareText(data: {
  format: Format; tone: Tone; brand: string; offer: string;
  audience: string; benefit: string; action: string; contact: string
}): Draft {
  const brand = data.brand.trim()
  const offer = data.offer.trim()
  const audience = data.audience.trim()
  const benefit = data.benefit.trim()
  const action = data.action.trim() || 'Contactez-nous pour en savoir plus.'
  const contact = data.contact.trim()
  const contactLine = contact ? '\nContact : ' + contact : ''
  const title = (formats.find(item => item.value === data.format)?.label || 'Texte') +
    ' — ' + offer.slice(0, 65)
  const introduction = data.tone === 'dynamique'
    ? '✨ Une nouvelle occasion à découvrir !'
    : data.tone === 'chaleureux'
      ? 'Bonjour et bienvenue !'
      : data.tone === 'concis'
        ? 'À découvrir :'
        : 'Découvrez notre proposition :'

  let body = ''
  switch (data.format) {
    case 'social':
      body = introduction + '\n\n' + brand + ' vous présente : ' + offer +
        '\n\nPour : ' + audience + '\nNotre atout : ' + benefit +
        '\n\n' + action + contactLine
      break
    case 'product':
      body = offer + '\n\n' + brand + ' propose cette offre à : ' + audience +
        '\n\nCe qui la distingue : ' + benefit +
        '\n\n' + action + contactLine
      break
    case 'prospection':
      body = 'Bonjour,\n\nJe vous écris au nom de ' + brand +
        ' pour vous présenter notre offre : ' + offer +
        '.\n\nElle s’adresse à ' + audience +
        '. Son principal avantage : ' + benefit +
        '.\n\n' + action + contactLine +
        '\n\nCordialement,\n' + brand
      break
    case 'whatsapp':
      body = 'Bonjour 👋\n\n' + brand + ' vous propose : ' + offer +
        '\n\n👥 Public : ' + audience +
        '\n⭐ Avantage : ' + benefit +
        '\n\n' + action + contactLine
      break
    case 'plan':
      body = 'PLAN D’ACTION — ' + offer + '\n\nOrganisation : ' + brand +
        '\nPublic cible : ' + audience +
        '\nObjectif : ' + benefit +
        '\n\n1. Identifier les besoins précis du public cible.' +
        '\n2. Préparer les ressources et les informations nécessaires.' +
        '\n3. Présenter l’offre et recueillir les premiers retours.' +
        '\n4. Ajuster la démarche selon les retours reçus.' +
        '\n5. Faire un bilan et définir les prochaines actions.' +
        '\n\nProchaine étape : ' + action + contactLine
      break
  }
  return { title: title.slice(0, 120), body: body.slice(0, 5000), format: data.format }
}

export function FreeContentStudio({ quotaAvailable }: { quotaAvailable: boolean }) {
  const router = useRouter()
  const [format, setFormat] = useState<Format>('social')
  const [tone, setTone] = useState<Tone>('professionnel')
  const [brand, setBrand] = useState('')
  const [offer, setOffer] = useState('')
  const [audience, setAudience] = useState('')
  const [benefit, setBenefit] = useState('')
  const [action, setAction] = useState('')
  const [contact, setContact] = useState('')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [isError, setIsError] = useState(false)

  function preview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = prepareText({ format, tone, brand, offer, audience, benefit, action, contact })
    setDraft(next)
    setNotice('Texte préparé gratuitement. Vous pouvez le modifier, le copier ou l’enregistrer.')
    setIsError(false)
  }

  async function copy() {
    if (!draft) return
    try {
      await navigator.clipboard.writeText(draft.body)
      setNotice('Texte copié. Vous pouvez le coller dans WhatsApp, un document ou un réseau social.')
      setIsError(false)
    } catch {
      setNotice('La copie n’est pas disponible. Sélectionnez le texte pour le copier.')
      setIsError(true)
    }
  }

  async function save() {
    if (!draft || !quotaAvailable || saving) return
    const title = draft.title.trim()
    const body = draft.body.trim()
    if (title.length < 3 || title.length > 120 || body.length < 10 || body.length > 5000) {
      setNotice('Le titre doit contenir 3 à 120 caractères et le texte 10 à 5 000 caractères.')
      setIsError(true)
      return
    }
    setSaving(true)
    setNotice('')
    try {
      const { error } = await createClient().from('content_drafts')
        .insert({ title, body, format: draft.format })
      if (error) throw new Error(friendlyError(error.message))
      setNotice('Texte enregistré dans votre espace personnel.')
      setIsError(false)
      router.refresh()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Impossible d’enregistrer le texte.')
      setIsError(true)
    } finally {
      setSaving(false)
    }
  }

  return <div className="workspace-card free-studio">
    <div className="workspace-card-heading">
      <div>
        <h2>Studio de rédaction gratuit</h2>
        <p>Créez des textes à partir de modèles, sans crédits OpenAI.</p>
      </div>
      <FileText size={23}/>
    </div>
    <div className="free-studio-notice"><ShieldCheck size={17}/>
      Modèles de rédaction, sans intelligence artificielle. La préparation et la copie ne consomment aucun quota.
    </div>
    <form className="workspace-form" onSubmit={preview}>
      <div className="form-row">
        <label>Type de texte
          <select value={format} onChange={event => setFormat(event.target.value as Format)}>
            {formats.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
        <label>Ton souhaité
          <select value={tone} onChange={event => setTone(event.target.value as Tone)}>
            {tones.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
      </div>
      <label>Nom de votre activité ou organisation
        <input required minLength={2} maxLength={120} value={brand} onChange={event => setBrand(event.target.value)}
          placeholder="Ex. : DGIA TECH"/>
      </label>
      <label>Produit, service ou sujet
        <input required minLength={3} maxLength={180} value={offer} onChange={event => setOffer(event.target.value)}
          placeholder="Ex. : Assistance informatique et Wi-Fi"/>
      </label>
      <div className="form-row">
        <label>Public cible
          <input required minLength={3} maxLength={140} value={audience} onChange={event => setAudience(event.target.value)}
            placeholder="Ex. : Petites entreprises"/>
        </label>
        <label>Principal avantage
          <input required minLength={5} maxLength={240} value={benefit} onChange={event => setBenefit(event.target.value)}
            placeholder="Ex. : Un accompagnement adapté à vos besoins"/>
        </label>
      </div>
      <div className="form-row">
        <label>Appel à l’action (facultatif)
          <input maxLength={140} value={action} onChange={event => setAction(event.target.value)}
            placeholder="Ex. : Écrivez-nous pour un devis"/>
        </label>
        <label>Contact à afficher (facultatif)
          <input maxLength={120} value={contact} onChange={event => setContact(event.target.value)}
            placeholder="Ex. : Votre numéro WhatsApp"/>
        </label>
      </div>
      <button type="submit" className="button button-gold"><FileText size={17}/> Préparer mon texte gratuitement</button>
    </form>
    {draft && <div className="free-studio-result">
      <h3>Votre texte — modifiable avant enregistrement</h3>
      <label>Titre du texte
        <input required minLength={3} maxLength={120} value={draft.title}
          onChange={event => setDraft(previous => previous ? { ...previous, title: event.target.value } : previous)}/>
      </label>
      <label>Contenu
        <textarea rows={10} maxLength={5000} value={draft.body}
          onChange={event => setDraft(previous => previous ? { ...previous, body: event.target.value } : previous)}/>
      </label>
      <div className="free-studio-actions">
        <button type="button" className="record-action" onClick={() => void copy()}><Copy size={16}/> Copier le texte</button>
        <button type="button" className="record-action record-action-primary"
          disabled={saving || !quotaAvailable} onClick={() => void save()}>
          <Save size={16}/>{saving ? 'Enregistrement…' : 'Enregistrer dans mon compte'}
        </button>
      </div>
      <p className="field-note">L’enregistrement utilise une opération du quota AI Tools ; la préparation et la copie restent gratuites et illimitées.</p>
      {!quotaAvailable && <p className="field-note">Quota d’enregistrement atteint. Vous pouvez toujours préparer et copier vos textes.</p>}
    </div>}
    {notice && <p role="status" className={'form-message ' + (isError ? 'error' : 'success')}>{notice}</p>}
  </div>
}
