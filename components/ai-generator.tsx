'use client'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Bot, Copy, Sparkles, WandSparkles } from 'lucide-react'

type Generation = { id: string; title: string; output: string; created_at: string }
const formats = ['Message professionnel', 'Publication réseaux sociaux', 'Description de produit', 'Plan d’action']
const tones = ['Professionnel', 'Pédagogique', 'Convaincant', 'Concis', 'Créatif']

export function AiGenerator({ configured, quotaAvailable, history }: {
  configured: boolean; quotaAvailable: boolean; history: Generation[]
}) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [objective, setObjective] = useState('')
  const [format, setFormat] = useState(formats[0])
  const [tone, setTone] = useState(tones[0])
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState('')
  const [warning, setWarning] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  async function copy(value: string, id: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(id)
    } catch {
      setError('Copie indisponible. Sélectionnez le texte pour le copier.')
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!configured || !quotaAvailable || busy) return
    setBusy(true)
    setResult('')
    setError('')
    setWarning('')
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, objective, format, tone }),
        cache: 'no-store'
      })
      const data = await response.json() as { text?: string; error?: string; warning?: string }
      if (!response.ok) throw new Error(data.error || 'Génération impossible pour le moment.')
      if (!data.text) throw new Error('Le service IA n’a retourné aucun texte.')
      setResult(data.text)
      setWarning(data.warning || '')
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Une erreur est survenue.')
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  if (!configured) return <div className="workspace-card ai-provider-paused">
    <div className="workspace-card-heading"><div>
      <h2>Générateur par IA externe — en pause</h2>
      <p>La génération OpenAI est volontairement désactivée pour éviter toute dépense.</p>
    </div><Bot size={22}/></div>
    <p className="field-note">Utilisez le studio de rédaction gratuit ci-dessus. Votre clé API reste enregistrée de manière sécurisée ; aucun appel payant n’est envoyé.</p>
  </div>

  return <>
    <div className="workspace-card">
      <div className="workspace-card-heading"><div><h2>Générateur de contenus IA</h2><p>Préparez des messages, publications et descriptions avec une IA.</p></div><WandSparkles size={22}/></div>
      <form className="workspace-form" onSubmit={event => void submit(event)}>
        <label>Nom de votre création
          <input required minLength={3} maxLength={120} value={title} onChange={event => setTitle(event.target.value)} placeholder="Ex. : Présentation des services DGIA"/>
        </label>
        <label>Décrivez le contenu souhaité
          <textarea required minLength={10} maxLength={2000} rows={4} value={objective} onChange={event => setObjective(event.target.value)} placeholder="Ex. : Rédiger un message pour présenter mes services informatiques à une petite entreprise au Burkina Faso."/>
        </label>
        <div className="form-row">
          <label>Type de contenu
            <select value={format} onChange={event => setFormat(event.target.value)}>{formats.map(item => <option key={item}>{item}</option>)}</select>
          </label>
          <label>Ton souhaité
            <select value={tone} onChange={event => setTone(event.target.value)}>{tones.map(item => <option key={item}>{item}</option>)}</select>
          </label>
        </div>
        <p className="field-note">Une génération utilise une opération de votre quota AI Tools, partagé avec l’atelier de prompts. La longueur de la réponse est limitée.</p>
        {error && <p role="alert" className="form-message error">{error}</p>}
        {warning && <p role="status" className="form-message error">{warning}</p>}
        {!configured && <p className="field-note">La connexion au fournisseur d’IA n’est pas encore activée. Aucun appel payant n’est possible.</p>}
        {configured && !quotaAvailable && <p className="field-note">Quota AI Tools atteint. Revenez après le renouvellement.</p>}
        <button className="button button-gold" type="submit" disabled={!configured || !quotaAvailable || busy}>
          <Sparkles size={18}/>{busy ? 'Génération en cours…' : 'Générer mon contenu'}
        </button>
      </form>
      {result && <div className="generated-output" aria-live="polite">
        <div className="generated-head"><strong><Bot size={17}/> Contenu généré</strong>
          <button type="button" onClick={() => void copy(result, 'new')}><Copy size={16}/>{copied === 'new' ? 'Copié' : 'Copier'}</button>
        </div><pre>{result}</pre>
      </div>}
    </div>
    <div className="workspace-card">
      <h2>Historique des générations ({history.length})</h2>
      <p className="field-note">Vos derniers textes générés sont conservés dans votre espace personnel.</p>
      {history.length === 0 ? <p className="empty-state">Aucune génération enregistrée pour le moment.</p> : <div className="ai-history">
        {history.map(item => <article key={item.id} className="ai-history-entry">
          <div className="ai-history-title"><strong>{item.title}</strong>
            <button type="button" className="record-action" onClick={() => void copy(item.output, item.id)}>
              <Copy size={15}/>{copied === item.id ? 'Copié' : 'Copier'}
            </button>
          </div>
          <small>{new Date(item.created_at).toLocaleDateString('fr-FR')}</small>
          <details><summary>Afficher le texte</summary><div className="record-entry-detail">{item.output}</div></details>
        </article>)}
      </div>}
    </div>
  </>
}
