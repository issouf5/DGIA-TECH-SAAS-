'use client'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Copy, Eye, Pencil, Save, Trash2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { friendlyError } from '@/lib/data'

type Kind = 'it' | 'ai' | 'automation' | 'draft'
export type ManagedRecord = {
  id: string
  title: string
  body: string
  createdAt: string
  status?: string
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  in_progress: 'En cours',
  resolved: 'Résolu',
  closed: 'Clôturé'
}

export function RecordManager({ kind, records }: { kind: Kind; records: ManagedRecord[] }) {
  const router = useRouter()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftBody, setDraftBody] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null)
  const table = kind === 'it' ? 'service_requests' : kind === 'ai' ? 'ai_prompts' : kind === 'draft' ? 'content_drafts' : 'automation_projects'

  function beginEdit(record: ManagedRecord) {
    setEditingId(record.id)
    setExpandedId(null)
    setDraftTitle(record.title)
    setDraftBody(record.body)
    setNotice(null)
  }

  async function save(record: ManagedRecord, event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busyId) return
    const title = draftTitle.trim()
    const body = draftBody.trim()
    const minTitle = kind === 'automation' ? 1 : 3
    const minBody = kind === 'automation' ? 0 : 10
    const maxBody = kind === 'ai' ? 10000 : 5000
    if (title.length < minTitle || title.length > (kind === 'draft' ? 120 : 160) || body.length < minBody || body.length > maxBody) {
      setNotice({ text: 'Vérifiez la longueur des champs avant d’enregistrer.', error: true })
      return
    }
    setBusyId(record.id)
    setNotice(null)
    try {
      const changes = kind === 'it' ? { title, details: body } : kind === 'ai' ? { title, prompt: body } : kind === 'draft' ? { title, body } : { name: title, description: body }
      const { data, error } = await createClient().from(table).update(changes).eq('id', record.id).select('id')
      if (error) throw new Error(friendlyError(error.message))
      if (!data?.length) throw new Error('Modification impossible : vérifiez vos droits ou le statut de cet élément.')
      setEditingId(null)
      setNotice({ text: 'Modification enregistrée avec succès.', error: false })
      router.refresh()
    } catch (error) {
      setNotice({ text: error instanceof Error ? error.message : 'Impossible de modifier cet élément.', error: true })
    } finally {
      setBusyId(null)
    }
  }

  async function remove(record: ManagedRecord) {
    if (busyId || !window.confirm('Supprimer définitivement « ' + record.title + ' » ? Cette action est irréversible.')) return
    setBusyId(record.id)
    setNotice(null)
    try {
      const { data, error } = await createClient().from(table).delete().eq('id', record.id).select('id')
      if (error) throw new Error(friendlyError(error.message))
      if (!data?.length) throw new Error('Suppression impossible : cet élément ne peut plus être supprimé.')
      setEditingId(null)
      setExpandedId(null)
      setNotice({ text: 'Élément supprimé. Le quota consommé reste inchangé.', error: false })
      router.refresh()
    } catch (error) {
      setNotice({ text: error instanceof Error ? error.message : 'Impossible de supprimer cet élément.', error: true })
    } finally {
      setBusyId(null)
    }
  }

  async function copy(body: string) {
    try {
      await navigator.clipboard.writeText(body)
      setNotice({ text: 'Texte copié dans le presse-papiers.', error: false })
    } catch {
      setNotice({ text: 'Copie indisponible. Utilisez « Voir » pour sélectionner le texte.', error: true })
    }
  }

  return <div className="record-list">
    {notice && <p role="status" className={'form-message ' + (notice.error ? 'error' : 'success')}>{notice.text}</p>}
    {records.length === 0 ? <p className="empty-state">Aucun élément enregistré pour le moment.</p> : records.map(record => {
      const canManage = kind !== 'it' || record.status === 'pending'
      const date = new Date(record.createdAt)
      const dateText = Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('fr-FR')
      const isEditing = editingId === record.id
      const isExpanded = expandedId === record.id
      return <article className="record-entry" key={record.id}>
        <div className="record-entry-header">
          <strong>{record.title}</strong>
          {kind === 'it' && <span className="record-status">{statusLabels[record.status || ''] || 'À suivre'}</span>}
        </div>
        <div className="record-entry-meta">{dateText && <small>Créé le {dateText}</small>}</div>
        {!isEditing && <p className="record-entry-body-preview">{record.body.length > 150 ? record.body.slice(0, 150) + '…' : (record.body || 'Aucune description')}</p>}
        {!isEditing && <div className="record-entry-actions">
          <button type="button" className="record-action" aria-expanded={isExpanded} onClick={() => setExpandedId(isExpanded ? null : record.id)}>
            <Eye size={15}/> {isExpanded ? 'Réduire' : 'Voir'}
          </button>
          {(kind === 'ai' || kind === 'draft') && <button type="button" className="record-action" onClick={() => void copy(record.body)}><Copy size={15}/> Copier</button>}
          {canManage && <button type="button" className="record-action" disabled={busyId !== null} onClick={() => beginEdit(record)}><Pencil size={15}/> Modifier</button>}
          {canManage && <button type="button" className="record-action record-action-danger" disabled={busyId !== null} onClick={() => void remove(record)}><Trash2 size={15}/> Supprimer</button>}
        </div>}
        {isExpanded && !isEditing && <div className="record-entry-detail">{record.body || 'Aucune description'}</div>}
        {isEditing && <form className="record-edit-form" onSubmit={event => void save(record, event)}>
          <label>{kind === 'automation' ? 'Nom du projet' : kind === 'it' ? 'Objet de la demande' : kind === 'draft' ? 'Titre du texte' : 'Nom du prompt'}
            <input required minLength={kind === 'automation' ? 1 : 3} maxLength={kind === 'draft' ? 120 : 160} value={draftTitle} onChange={event => setDraftTitle(event.target.value)}/>
          </label>
          <label>{kind === 'automation' ? 'Processus à automatiser' : kind === 'it' ? 'Description du problème' : kind === 'draft' ? 'Texte enregistré' : 'Contenu du prompt'}
            <textarea required={kind !== 'automation'} minLength={kind === 'automation' ? undefined : 10} maxLength={kind === 'ai' ? 10000 : 5000} rows={6} value={draftBody} onChange={event => setDraftBody(event.target.value)}/>
          </label>
          <div className="record-entry-actions">
            <button type="submit" className="record-action record-action-primary" disabled={busyId !== null}><Save size={15}/> {busyId === record.id ? 'Enregistrement…' : 'Enregistrer'}</button>
            <button type="button" className="record-action" disabled={busyId !== null} onClick={() => setEditingId(null)}><X size={15}/> Annuler</button>
          </div>
        </form>}
        {kind === 'it' && !canManage && <p className="field-note">Cette demande est en traitement ou terminée ; son contenu est protégé.</p>}
      </article>
    })}
    {records.length > 0 && <p className="field-note">La suppression d’un élément ne restitue pas les opérations déjà utilisées dans votre quota.</p>}
  </div>
}
