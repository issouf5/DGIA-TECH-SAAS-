'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ClipboardCheck, Copy, Save, ShieldCheck, Wrench } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { friendlyError } from '@/lib/data'

type Category = 'wifi' | 'computer' | 'printer' | 'mikrotik'
type Scope = 'one' | 'several' | 'unknown'
type Symptom = { id: string; label: string; steps: string[] }
type Report = { title: string; body: string }
type Clarification = 'none' | 'disappears'

// Une incohérence probable doit être clarifiée, pas interprétée comme un diagnostic.
function mentionsInterruptions(text: string) {
  return /coupur|d[eé]connex|instab|intermittent|perte[s]? de connexion/i.test(text)
}
function mentionsMissingNetwork(text: string) {
  return /dispar|n['’]appar|invisible|introuvable|absent/i.test(text)
}

const guides: Record<Category, { label: string; symptoms: Symptom[] }> = {
  wifi: {
    label: 'Wi-Fi et connexion Internet',
    symptoms: [
      { id: 'invisible', label: 'Le réseau Wi-Fi ne s’affiche pas', steps: [
        'Vérifiez que le Wi-Fi est activé et que le mode avion est désactivé.',
        'Rapprochez-vous du point d’accès et vérifiez si le réseau apparaît sur un autre appareil.',
        'Vérifiez les voyants du routeur. Si vous êtes autorisé à le faire, redémarrez-le normalement.',
        'Si aucun appareil ne voit le réseau, contactez la personne qui gère le réseau.'
      ] },
      { id: 'offline', label: 'Connecté au Wi-Fi, mais sans Internet', steps: [
        'Essayez d’ouvrir un autre site pour écarter une panne du site consulté.',
        'Testez la connexion depuis un second appareil, si possible.',
        'Vérifiez les voyants Internet du modem ou du routeur.',
        'Renseignez-vous sur une éventuelle panne de l’opérateur avant toute modification du réseau.'
      ] },
      { id: 'unstable', label: 'La connexion est lente ou se coupe', steps: [
        'Testez la connexion à proximité du routeur.',
        'Vérifiez si plusieurs appareils rencontrent la même difficulté.',
        'Réduisez temporairement les téléchargements ou usages intensifs.',
        'Notez les heures des coupures et demandez un contrôle du réseau si le problème persiste.'
      ] }
    ]
  },
  computer: {
    label: 'Ordinateur',
    symptoms: [
      { id: 'slow', label: 'L’ordinateur est très lent', steps: [
        'Enregistrez votre travail puis redémarrez normalement l’ordinateur.',
        'Fermez les applications inutilisées et vérifiez l’espace de stockage disponible.',
        'Vérifiez les mises à jour du système et utilisez son outil de sécurité intégré.',
        'Si la lenteur persiste, notez les logiciels concernés pour une vérification technique.'
      ] },
      { id: 'startup', label: 'L’ordinateur ne démarre pas', steps: [
        'Vérifiez que la prise, le câble et l’alimentation externe sont correctement branchés.',
        'Essayez une autre prise fonctionnelle, sans ouvrir l’appareil.',
        'Notez les voyants et les éventuels messages affichés à l’écran.',
        'Si le problème persiste, faites vérifier l’appareil par un technicien ; n’ouvrez pas le bloc d’alimentation.'
      ] },
      { id: 'application', label: 'Une application ne fonctionne pas', steps: [
        'Notez le message d’erreur exact et le nom de l’application.',
        'Fermez puis relancez l’application et, si nécessaire, redémarrez l’ordinateur.',
        'Vérifiez les mises à jour depuis la source officielle du logiciel.',
        'Sauvegardez vos données avant toute réinstallation et sollicitez de l’aide si nécessaire.'
      ] }
    ]
  },
  printer: {
    label: 'Imprimante',
    symptoms: [
      { id: 'offline', label: 'L’imprimante apparaît hors connexion', steps: [
        'Vérifiez l’alimentation et l’absence de message d’erreur sur l’imprimante.',
        'Vérifiez le câble ou la connexion Wi-Fi, selon votre installation.',
        'Assurez-vous que la bonne imprimante est sélectionnée et examinez la file d’attente.',
        'Redémarrez normalement l’imprimante si cela est autorisé, puis réessayez.'
      ] },
      { id: 'blank', label: 'Les pages sortent blanches', steps: [
        'Vérifiez les niveaux d’encre ou de toner indiqués par l’appareil.',
        'Contrôlez les paramètres d’impression et lancez une page de test.',
        'Utilisez uniquement la fonction d’entretien prévue dans le menu de l’imprimante.',
        'Si le problème continue, consultez le manuel ou un technicien.'
      ] },
      { id: 'paper', label: 'Bourrage papier ou alimentation difficile', steps: [
        'Interrompez l’impression et suivez les consignes du manuel du fabricant.',
        'Éteignez l’appareil si le manuel le demande avant toute manipulation.',
        'N’utilisez pas d’outil pointu et ne forcez pas les pièces internes.',
        'Vérifiez le chargement du papier ; faites intervenir un technicien si le blocage persiste.'
      ] }
    ]
  },
  mikrotik: {
    label: 'Routeur et réseau MikroTik',
    symptoms: [
      { id: 'internet', label: 'Le réseau local fonctionne, mais pas Internet', steps: [
        'Vérifiez si la panne touche plusieurs appareils.',
        'Observez les voyants du modem et du routeur sans modifier leurs paramètres.',
        'Demandez à l’administrateur de vérifier l’accès opérateur et la liaison entre les équipements.',
        'Ne réinitialisez pas le routeur : une remise à zéro peut effacer la configuration.'
      ] },
      { id: 'wifi', label: 'Le Wi-Fi MikroTik est instable', steps: [
        'Repérez les endroits et les moments où les coupures se produisent.',
        'Comparez le fonctionnement de plusieurs appareils et, si disponible, d’une connexion câblée.',
        'Vérifiez la position et l’alimentation du point d’accès.',
        'Transmettez vos observations à l’administrateur avant toute modification de configuration.'
      ] },
      { id: 'guest', label: 'Le réseau invité ne fonctionne pas', steps: [
        'Vérifiez auprès de l’administrateur que le réseau invité est bien prévu et activé.',
        'Notez si le nom du réseau apparaît et à quelle étape la connexion échoue.',
        'Essayez un autre appareil autorisé pour comparer les résultats.',
        'Ne désactivez pas les protections du réseau et ne partagez pas les mots de passe.'
      ] }
    ]
  }
}

const scopeLabels: Record<Scope, string> = {
  one: 'Un seul appareil',
  several: 'Plusieurs appareils',
  unknown: 'Je ne sais pas encore'
}

const scopeGuidance: Record<Scope, string> = {
  one: 'Un seul appareil semble concerné : commencez par ses réglages et son état.',
  several: 'Plusieurs appareils sont concernés : examinez en priorité la connexion ou l’équipement commun.',
  unknown: 'Le périmètre de la panne reste à confirmer : comparez avec un autre appareil si possible.'
}

export function GuidedItDiagnosis({ quotaAvailable }: { quotaAvailable: boolean }) {
  const router = useRouter()
  const [category, setCategory] = useState<Category>('wifi')
  const [symptomId, setSymptomId] = useState(guides.wifi.symptoms[0].id)
  const [scope, setScope] = useState<Scope>('unknown')
  const [notes, setNotes] = useState('')
  const [clarification, setClarification] = useState<Clarification>('none')
  const needsClarification = category === 'wifi' && symptomId === 'invisible' &&
    mentionsInterruptions(notes) && !mentionsMissingNetwork(notes) && clarification === 'none'
  const [report, setReport] = useState<Report | null>(null)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const [notice, setNotice] = useState<{ message: string; error: boolean } | null>(null)

  function resetResult() {
    setReport(null)
    setSaved(false)
    setNotice(null)
  }

  function diagnose(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const guide = guides[category]
    const symptom = guide.symptoms.find(item => item.id === symptomId)
    if (!symptom) return
    if (needsClarification) {
      setReport(null)
      setNotice({
        message: 'Précisez si le nom du Wi-Fi disparaît ou si la connexion se coupe alors que le réseau reste visible.',
        error: true
      })
      return
    }
    const title = ('Diagnostic guidé — ' + guide.label + ' : ' + symptom.label).slice(0, 160)
    const firstCheck: Record<Scope, string> = {
      one: 'Vérifiez d’abord si un deuxième appareil peut utiliser le même équipement ou réseau.',
      several: 'Puisque plusieurs appareils sont touchés, vérifiez en priorité le routeur, le point d’accès ou la liaison commune.',
      unknown: 'Commencez par tester un autre appareil pour déterminer si le problème est isolé ou général.'
    }
    const interpretation = category === 'wifi' && symptomId === 'invisible' && clarification === 'disappears'
      ? 'Vous avez confirmé que le nom du réseau disparaît de la liste. Vérifiez sa visibilité et l’état du point d’accès.'
      : category === 'wifi' && symptomId === 'unstable'
        ? 'Le réseau semble accessible, mais la connexion est instable. Il faut distinguer une coupure Wi-Fi d’une panne Internet.'
        : 'Ces conseils correspondent au symptôme choisi. Ils ne permettent pas encore de confirmer la cause.'
    const body = [
      'ORIENTATION TECHNIQUE — DGIA IT SOLUTIONS',
      'Catégorie : ' + guide.label,
      'Problème déclaré : ' + symptom.label,
      'Étendue : ' + scopeLabels[scope],
      notes.trim() ? 'Précisions : ' + notes.trim() : '',
      clarification === 'disappears' ? 'Clarification : le nom du Wi-Fi disparaît de la liste.' : '',
      '',
      'Interprétation indicative : ' + interpretation,
      'Étendue du problème : ' + scopeGuidance[scope],
      '',
      'Première vérification prioritaire : ' + firstCheck[scope],
      '',
      'Autres vérifications conseillées :',
      ...symptom.steps.map((step, index) => (index + 1) + '. ' + step),
      '',
      'Si le problème persiste après ces vérifications, transmettez ce rapport à un technicien.',
      '',
      'Ce rapport repose sur vos réponses. Il ne remplace pas un diagnostic technique réel.',
      'Ne transmettez jamais vos mots de passe ou codes d’accès.'
    ].filter((line, index, array) => line !== '' || array[index - 1] !== '').join('\n')
    setReport({ title, body: body.slice(0, 5000) })
    setSaved(false)
    setNotice({ message: 'Orientation préparée gratuitement, sans appel à une API.', error: false })
  }

  async function copy() {
    if (!report) return
    try {
      await navigator.clipboard.writeText(report.body)
      setNotice({ message: 'Rapport copié dans le presse-papiers.', error: false })
    } catch {
      setNotice({ message: 'Copie indisponible : sélectionnez le texte pour le copier.', error: true })
    }
  }

  async function save() {
    if (!report || busy || saved || !quotaAvailable) return
    setBusy(true)
    setNotice(null)
    try {
      const { error } = await createClient().from('service_requests').insert({
        module_code: 'it_solutions',
        title: report.title,
        details: report.body
      })
      if (error) throw new Error(friendlyError(error.message))
      setSaved(true)
      setNotice({ message: 'Demande enregistrée dans votre historique. Aucun traitement technique automatique n’a été lancé.', error: false })
      router.refresh()
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Impossible d’enregistrer la demande.', error: true })
    } finally {
      setBusy(false)
    }
  }

  return <section className="workspace-card guided-diagnosis">
    <div className="workspace-card-heading">
      <div>
        <h2>Diagnostic informatique guidé</h2>
        <p>Obtenez des premières vérifications adaptées à votre problème, sans API payante.</p>
      </div>
      <Wrench size={23}/>
    </div>
    <div className="free-studio-notice">
      <ShieldCheck size={17}/>
      Cet outil utilise des règles prédéfinies. Il ne se connecte pas à vos appareils et ne modifie aucun réseau.
    </div>
    <form className="workspace-form" onSubmit={diagnose}>
      <label>Quel équipement est concerné ?
        <select value={category} onChange={event => {
          const next = event.target.value as Category
          setCategory(next)
          setSymptomId(guides[next].symptoms[0].id)
          setClarification('none')
          resetResult()
        }}>
          {Object.entries(guides).map(([key, value]) =>
            <option key={key} value={key}>{value.label}</option>)}
        </select>
      </label>
      <label>Quel problème rencontrez-vous ?
        <select value={symptomId} onChange={event => { setSymptomId(event.target.value); setClarification('none'); resetResult() }}>
          {guides[category].symptoms.map(item =>
            <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
      </label>
      <label>Combien d’appareils sont concernés ?
        <select value={scope} onChange={event => { setScope(event.target.value as Scope); resetResult() }}>
          {Object.entries(scopeLabels).map(([key, label]) =>
            <option key={key} value={key}>{label}</option>)}
        </select>
      </label>
      <label>Précisions utiles (facultatif)
        <textarea rows={3} maxLength={350} value={notes}
          onChange={event => { setNotes(event.target.value); setClarification('none'); resetResult() }}
          placeholder="Ex. : Les coupures se produisent depuis ce matin, sur deux ordinateurs."/>
      </label>
      {needsClarification && <div className="diagnosis-clarification" role="group" aria-label="Clarification du problème Wi-Fi">
        <strong>Précisons le problème avant de continuer</strong>
        <p>Vous avez indiqué « Le réseau Wi-Fi ne s’affiche pas », mais vos précisions parlent de coupures. Que se passe-t-il exactement ?</p>
        <div className="diagnosis-clarification-actions">
          <button type="button" className="record-action" onClick={() => {
            setClarification('disappears')
            resetResult()
          }}>Le nom du Wi-Fi disparaît de la liste</button>
          <button type="button" className="record-action" onClick={() => {
            setSymptomId('unstable')
            setClarification('none')
            resetResult()
          }}>Le Wi-Fi reste visible, mais la connexion coupe</button>
        </div>
      </div>}
      {clarification === 'disappears' && <p className="field-note" role="status">Précision prise en compte : le nom du réseau disparaît. Vous pouvez préparer le rapport.</p>}
      <p className="field-note">Ne saisissez aucun mot de passe, code Wi-Fi ou autre information secrète.</p>
      <button type="submit" className="button button-gold">
        <ClipboardCheck size={17}/> Obtenir mes conseils gratuitement
      </button>
    </form>
    {report && <div className="diagnosis-result">
      <h3>Votre orientation technique</h3>
      <div className="diagnosis-report" aria-label="Rapport de diagnostic indicatif">{report.body}</div>
      <div className="free-studio-actions">
        <button type="button" className="record-action" onClick={() => void copy()}>
          <Copy size={16}/> Copier le rapport
        </button>
        <button type="button" className="record-action record-action-primary"
          disabled={busy || saved || !quotaAvailable} onClick={() => void save()}>
          <Save size={16}/> {saved ? 'Demande enregistrée' : busy ? 'Enregistrement…' : 'Enregistrer une demande'}
        </button>
      </div>
      <p className="field-note">Les conseils et la copie sont gratuits et illimités. Seul l’enregistrement d’une demande consomme une opération du quota IT Solutions.</p>
      {!quotaAvailable && <p className="field-note">Quota atteint : vous pouvez toujours consulter et copier les conseils.</p>}
    </div>}
    {notice && <p role="status" className={'form-message ' + (notice.error ? 'error' : 'success')}>{notice.message}</p>}
  </section>
}
