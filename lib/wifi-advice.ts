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
  if (offline && a.scope === 'one') {
    hypothesis = 'Accès Internet potentiellement perturbé sur un seul appareil'
    explanation = 'Le Wi-Fi semble connecté, mais cet appareil n’accède pas à Internet. Si un autre appareil navigue normalement sur le même réseau, vérifiez en priorité les réglages de l’appareil concerné plutôt que le fournisseur d’accès.'
    actions = [
      'Vérifiez si un autre appareil accède normalement à Internet sur le même réseau Wi-Fi.',
      'Sur l’appareil concerné, essayez plusieurs sites pour écarter une panne limitée à un service.',
      'Désactivez puis réactivez le Wi-Fi sur cet appareil et reconnectez-vous au réseau habituel.',
      'Si un VPN ou un proxy est configuré, demandez à son responsable de vérifier qu’il ne bloque pas la connexion.',
      'Si les autres appareils fonctionnent mais que le problème persiste, faites contrôler les paramètres réseau de cet appareil.'
    ]
  } else if (offline && a.scope === 'several') {
    hypothesis = 'Interruption possible de la liaison Internet ou du routeur'
    explanation = 'Plusieurs appareils restent connectés au Wi-Fi sans accéder à Internet. La liaison commune, le modem ou le routeur sont à vérifier en priorité.'
    actions = [
      'Confirmez que plusieurs appareils connectés au même Wi-Fi ne peuvent ouvrir aucun site.',
      'Observez les voyants Internet du modem ou du routeur pendant la panne.',
      'Essayez plusieurs sites pour écarter un problème limité à un service.',
      'Si la panne est générale et persiste, contactez le gestionnaire du réseau ou le fournisseur d’accès.'
    ]
  } else if (offline) {
    hypothesis = 'Perte d’accès Internet dont l’étendue reste à déterminer'
    explanation = 'Il faut d’abord savoir si un seul appareil est concerné ou si plusieurs appareils partagent la panne.'
    actions = [
      'Testez Internet sur un deuxième appareil connecté au même réseau Wi-Fi.',
      'Si seul le premier appareil est concerné, vérifiez ses paramètres Wi-Fi et ses éventuels réglages VPN ou proxy.',
      'Si plusieurs appareils sont concernés, observez les voyants Internet du modem ou du routeur.',
      'Contactez le gestionnaire du réseau si une panne générale est confirmée et persiste.'
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
  if (a.scope === 'one' && !offline) actions.unshift('Vérifiez d’abord un autre appareil au même endroit.')
  if (a.scope === 'unknown' && !offline) actions.unshift('Testez un autre appareil pour connaître l’étendue de la panne.')
  const issues: Record<string, string> = {
    drops: 'Déconnexions Wi-Fi', offline: 'Wi-Fi sans Internet',
    missing: 'Réseau invisible', slow: 'Connexion lente'
  }
  const body = [
    'ORIENTATION TECHNIQUE — DGIA IT SOLUTIONS',
    'Diagnostic interactif V1.7.2',
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
