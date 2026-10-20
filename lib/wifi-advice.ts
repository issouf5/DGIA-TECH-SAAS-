export type WifiAnswers = {
  issue: string
  scope: string
  status: string
  visible: string
  distance: string
  notes: string
}
export type WifiReport = { title: string; body: string; hypothesis: string }
export const wifiSources = [
  'https://support.microsoft.com/fr-fr/windows/experience/connectivity-networking/fix-wi-fi-connection-issues-in-windows',
  'https://support.microsoft.com/fr-fr/windows/experience/connectivity-networking/wi-fi-and-your-home-layout'
]
export function wifiStages(a: WifiAnswers) {
  const steps = ['issue', 'scope']
  if (a.issue === 'drops' || a.issue === 'slow') {
    steps.push('status')
    if (a.status === 'lost') steps.push('visible')
  }
  steps.push('distance', 'notes')
  return steps
}
export function wifiReport(a: WifiAnswers): WifiReport {
  const offline = a.issue === 'offline' || a.status === 'internet'
  const invisible = a.issue === 'missing' || (a.status === 'lost' && a.visible === 'missing')
  const far = a.distance === 'far'
  let hypothesis = ''
  let explanation = ''
  let actions: string[] = []
  if (offline) {
    hypothesis = 'Interruption de l’accès Internet sans perte confirmée du Wi-Fi'
    explanation = 'Le Wi-Fi peut fonctionner alors que la liaison Internet est interrompue.'
    actions = [
      'Comparez la navigation Internet sur deux appareils.',
      'Observez les voyants du modem ou du routeur pendant la coupure.',
      'Essayez un autre site pour écarter une panne limitée à un service.',
      'Si tous les appareils sont touchés, contactez le gestionnaire du réseau ou le fournisseur.'
    ]
  } else if (invisible && far) {
    hypothesis = a.scope === 'one'
      ? 'Signal Wi-Fi faible ou difficulté de réception propre à cet appareil'
      : 'Couverture Wi-Fi insuffisante dans les zones éloignées'
    explanation = 'Le nom du réseau disparaît principalement loin du point d’accès. La portée, les obstacles ou les interférences sont des causes plausibles. Une panne du point d’accès reste possible si le réseau disparaît aussi à proximité.'
    actions = [
      'Sur le même appareil, vérifiez si le nom du réseau réapparaît en vous rapprochant du routeur.',
      'Testez un autre appareil dans la même zone éloignée pour comparer la réception.',
      'Repérez les murs épais, les structures métalliques et les obstacles entre le routeur et les appareils.',
      'Si possible, placez le point d’accès dans une zone plus centrale, en hauteur et dégagée.',
      'Si le nom du réseau disparaît aussi près du routeur, faites vérifier le point d’accès par son gestionnaire.'
    ]
  } else if (invisible) {
    hypothesis = 'Réseau Wi-Fi non détecté ou diffusion intermittente'
    explanation = 'Le réseau disparaît de la liste ou n’est pas détecté. La portée ou le point d’accès peuvent être concernés.'
    actions = [
      'Recherchez le nom du réseau sur un deuxième appareil.',
      'Rapprochez-vous du point d’accès pour voir si le réseau réapparaît.',
      'Observez les voyants du routeur pendant les coupures.',
      'Si aucun appareil ne voit le réseau, faites vérifier le point d’accès.'
    ]
  } else if (far) {
    hypothesis = a.scope === 'one'
      ? 'Signal faible ou difficulté propre à un appareil'
      : 'Couverture Wi-Fi insuffisante ou interférences possibles'
    explanation = 'La distance et les obstacles peuvent réduire la fiabilité du signal.'
    actions = [
      'Comparez le même appareil près du routeur et dans la zone éloignée.',
      'Si possible, placez le point d’accès en hauteur, au centre et sans obstacle.',
      'Si deux réseaux distincts existent, essayez le 2,4 GHz dans la zone éloignée.',
      'Faites vérifier la couverture avant d’envisager un équipement supplémentaire.'
    ]
  } else if (a.status === 'lost') {
    hypothesis = 'Instabilité de la liaison Wi-Fi ou du point d’accès'
    explanation = 'Le réseau est visible, mais la connexion des appareils est instable.'
    actions = [
      'Comparez avec un deuxième appareil au même endroit.',
      'Observez les voyants du point d’accès pendant une coupure.',
      'Notez les horaires et la fréquence des interruptions.',
      'Faites contrôler le point d’accès si les coupures persistent.'
    ]
  } else {
    hypothesis = 'Cause encore indéterminée'
    explanation = 'Les informations ne suffisent pas à isoler une cause unique.'
    actions = [
      'Comparez la connexion près et loin du routeur.',
      'Vérifiez si un deuxième appareil présente le même problème.',
      'Notez si le Wi-Fi reste connecté pendant la panne.',
      'Transmettez ces observations à un technicien si nécessaire.'
    ]
  }
  if (a.scope === 'one') actions.unshift('Vérifiez d’abord un autre appareil au même endroit.')
  if (a.scope === 'unknown') actions.unshift('Testez un autre appareil pour connaître l’étendue de la panne.')
  const issues: Record<string, string> = {
    drops: 'Déconnexions Wi-Fi', offline: 'Wi-Fi sans Internet',
    missing: 'Réseau invisible', slow: 'Connexion lente'
  }
  const body = [
    'ORIENTATION TECHNIQUE — DGIA IT SOLUTIONS',
    'Diagnostic interactif V1.7.1',
    '',
    'Symptôme : ' + (issues[a.issue] || 'Non précisé'),
    'Appareils : ' + (a.scope === 'several' ? 'Plusieurs' : a.scope === 'one' ? 'Un seul' : 'Non déterminé'),
    a.status ? 'Type de coupure : ' + (a.status === 'lost' ? 'Déconnexion Wi-Fi' : a.status === 'internet' ? 'Wi-Fi connecté sans Internet' : 'Non déterminé') : '',
    a.visible ? 'Nom du réseau : ' + (a.visible === 'visible' ? 'Reste visible' : a.visible === 'missing' ? 'Disparaît' : 'Non vérifié') : '',
    'Distance : ' + (a.distance === 'far' ? 'Loin du routeur' : a.distance === 'near' ? 'Près du routeur' : a.distance === 'all' ? 'Partout' : 'Non vérifiée'),
    a.notes.trim() ? 'Précisions : ' + a.notes.trim() : '',
    '',
    'HYPOTHÈSE À CONFIRMER : ' + hypothesis,
    explanation,
    '',
    'VÉRIFICATIONS PRIORITAIRES',
    ...Array.from(new Set(actions)).map((item, i) => (i + 1) + '. ' + item),
    '',
    'Rapport indicatif fondé sur vos réponses, sans mesure du réseau.',
    'Ne partagez pas vos mots de passe ni vos codes d’accès.',
    '',
    'Références :',
    ...wifiSources
  ].filter((item, i, all) => item !== '' || all[i - 1] !== '').join('\n')
  return { title: ('Diagnostic Wi-Fi — ' + (issues[a.issue] || 'Orientation')).slice(0, 160),
    hypothesis, body: body.slice(0, 5000) }
}
