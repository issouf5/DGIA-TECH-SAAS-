'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, ClipboardCheck, RotateCcw } from 'lucide-react'
import { wifiReport, wifiStages, type WifiAnswers, type WifiReport } from '@/lib/wifi-advice'

const empty: WifiAnswers = {
  issue: '', scope: '', status: '', visible: '', distance: '', notes: ''
}
const questions: Record<string, { title: string; options: { id: string; label: string }[] }> = {
  issue: { title: 'Quel problème rencontrez-vous ?', options: [
    { id: 'drops', label: 'Le Wi-Fi se déconnecte régulièrement' },
    { id: 'offline', label: 'Connecté au Wi-Fi, mais sans Internet' },
    { id: 'missing', label: 'Le nom du réseau Wi-Fi ne s’affiche pas' },
    { id: 'slow', label: 'La connexion est lente' }
  ] },
  scope: { title: 'Combien d’appareils sont concernés ?', options: [
    { id: 'one', label: 'Un seul appareil' },
    { id: 'several', label: 'Plusieurs appareils' },
    { id: 'unknown', label: 'Je ne sais pas' }
  ] },
  status: { title: 'Pendant les coupures, que se passe-t-il ?', options: [
    { id: 'lost', label: 'Les appareils perdent complètement le Wi-Fi' },
    { id: 'internet', label: 'Le Wi-Fi reste connecté, mais Internet ne fonctionne plus' },
    { id: 'unknown', label: 'Je ne sais pas' }
  ] },
  visible: { title: 'Le nom du réseau Wi-Fi reste-t-il visible ?', options: [
    { id: 'visible', label: 'Oui, il reste visible' },
    { id: 'missing', label: 'Non, il disparaît de la liste' },
    { id: 'unknown', label: 'Je ne sais pas' }
  ] },
  distance: { title: 'Où les difficultés se produisent-elles surtout ?', options: [
    { id: 'far', label: 'Loin du routeur' },
    { id: 'near', label: 'Même près du routeur' },
    { id: 'all', label: 'Partout' },
    { id: 'unknown', label: 'Je ne sais pas' }
  ] }
}

export function WifiDiagnosticWizard({ onReport }: { onReport: (report: WifiReport | null) => void }) {
  const [answers, setAnswers] = useState<WifiAnswers>(empty)
  const [index, setIndex] = useState(0)
  const [complete, setComplete] = useState(false)
  const flow = wifiStages(answers)
  const stage = flow[Math.min(index, flow.length - 1)]
  const question = stage === 'notes' ? null : questions[stage]
  const value = stage === 'notes' ? '' : answers[stage as keyof WifiAnswers]
  const ready = stage === 'notes' || Boolean(value)

  function reset() {
    setAnswers(empty)
    setIndex(0)
    setComplete(false)
    onReport(null)
  }
  function choose(value: string) {
    setAnswers(previous => {
      const next = { ...previous, [stage]: value }
      if (stage === 'issue') {
        next.status = ''
        next.visible = ''
        next.distance = ''
      }
      if (stage === 'status') next.visible = ''
      return next
    })
    setComplete(false)
    onReport(null)
  }
  function next() {
    if (!ready) return
    if (index < flow.length - 1) setIndex(index + 1)
    else {
      onReport(wifiReport(answers))
      setComplete(true)
    }
  }
  return <div className="wifi-wizard">
    <div className="wifi-wizard-top">
      <strong>Assistant Wi-Fi interactif — V1.7</strong>
      <button type="button" className="record-action" onClick={reset}>
        <RotateCcw size={15}/> Recommencer
      </button>
    </div>
    {complete ? <div className="wifi-complete">
      <ClipboardCheck size={20}/>
      <p>Rapport personnalisé préparé ci-dessous. Vous pouvez le copier ou l’enregistrer.</p>
      <button type="button" className="record-action" onClick={() => {
        setComplete(false)
        setIndex(0)
        onReport(null)
      }}>Modifier mes réponses</button>
    </div> : <>
      <p className="wifi-step">Étape {index + 1} sur {flow.length}</p>
      <div className="wifi-progress"><span style={{
        width: String(Math.round(100 * (index + 1) / flow.length)) + '%'
      }}/></div>
      <h3>{question ? question.title : 'Précisions supplémentaires (facultatif)'}</h3>
      {question ? <div className="wifi-options" role="radiogroup" aria-label={question.title}>
        {question.options.map(option => <label key={option.id}
          className={'wifi-option' + (value === option.id ? ' selected' : '')}>
          <input type="radio" name={'wifi-' + stage} checked={value === option.id}
            onChange={() => choose(option.id)}/>
          <span>{option.label}</span>
        </label>)}
      </div> : <textarea rows={3} maxLength={350} value={answers.notes}
        onChange={event => setAnswers(previous => ({ ...previous, notes: event.target.value }))}
        placeholder="Ex. : plusieurs téléphones se déconnectent dans les pièces éloignées."/>}
      <div className="wifi-actions">
        <button type="button" className="record-action" disabled={index === 0}
          onClick={() => setIndex(previous => Math.max(0, previous - 1))}>
          <ArrowLeft size={16}/> Précédent
        </button>
        <button type="button" className="button button-gold" disabled={!ready} onClick={next}>
          {index === flow.length - 1 ? <ClipboardCheck size={16}/> : <ArrowRight size={16}/>}
          {index === flow.length - 1 ? 'Générer mon rapport' : 'Continuer'}
        </button>
      </div>
      <p className="field-note">Conseils calculés localement, sans API payante ni accès aux appareils. Ne saisissez aucun mot de passe ou code d’accès.</p>
    </>}
  </div>
}
