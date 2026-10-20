export type WifiAnswers = {
  issue: string
  scope: string
  status: string
  visible: string
  comparison: string
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
  if (a.scope === 'one' &&
    (a.issue === 'missing' || (a.status === 'lost' && a.visible === 'missing'))) {
    steps.push('comparison')
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
  } else if (invisible && a.scope === 'one' && a.comparison === 'other_sees') {
    hypothesis = far
      ? 'Réception Wi-Fi limitée sur l’appareil concerné'
      : 'Problème possible de détection Wi-Fi sur cet appareil'
    explanation = 'Un autre appareil détecte le même réseau au même endroit. Cela oriente vers les paramètres, la compatibilité ou la réception Wi-Fi de l’appareil concerné, sans confirmer une panne.'
    actions = [
      'Vérifiez que le mode avion est désactivé et que le Wi-Fi est activé sur l’appareil concerné.',
      'Désactivez puis réactivez le Wi-Fi sur cet appareil, puis recherchez à nouveau le réseau.',
      'Si le routeur propose deux noms de réseau distincts, vérifiez si l’appareil détecte la bande 2,4 GHz ou 5 GHz.',
      'Si le réseau reste invisible, demandez un contrôle des paramètres ou de l’adaptateur Wi-Fi de cet appareil.'
    ]
  } else if (invisible && a.scope === 'one' && a.comparison === 'other_missing') {
    hypothesis = far
      ? 'Couverture Wi-Fi possiblement insuffisante pour plusieurs appareils'
      : 'Réseau Wi-Fi potentiellement indisponible pour plusieurs appareils'
    explanation = 'Un deuxième appareil ne détecte pas non plus le réseau. La difficulté n’est donc pas nécessairement limitée au premier appareil. La portée et la diffusion du point d’accès restent à vérifier.'
    actions = [
      'Vérifiez si les deux appareils détectent le réseau en vous rapprochant du routeur.',
      'Observez les voyants Wi-Fi du routeur ou du point d’accès pendant la panne.',
      'Si le réseau réapparaît près du routeur, faites vérifier la couverture et les obstacles.',
      'Si plusieurs appareils ne détectent toujours pas le réseau à proximité, demandez une vérification du point d’accès.'
    ]
  } else if (invisible && a.scope === 'one') {
    hypothesis = far
      ? 'Réception Wi-Fi insuffisante ou problème propre à l’appareil, à confirmer'
      : 'Réseau invisible sur un appareil : cause non déterminée'
    explanation = 'Sans test sur un deuxième appareil, il est impossible de distinguer une difficulté propre au premier appareil d’un problème de diffusion du réseau.'
    actions = [
      'Recherchez le même réseau sur un deuxième appareil au même endroit.',
      'Si le deuxième appareil le détecte, vérifiez les paramètres Wi-Fi du premier.',
      'Si aucun appareil ne le détecte, vérifiez la diffusion du point d’accès avec son gestionnaire.',
      'Comparez la visibilité du réseau à proximité du routeur.'
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
  if (a.scope === 'one' && !offline && !invisible) actions.unshift('Vérifiez d’abord un autre appareil au même endroit.')
  if (a.scope === 'unknown' && !offline && !invisible) actions.unshift('Testez un autre appareil pour connaître l’étendue de la panne.')
  const issues: Record<string, string> = {
    drops: 'Déconnexions Wi-Fi', offline: 'Wi-Fi sans Internet',
    missing: 'Réseau invisible', slow: 'Connexion lente'
  }
  const body = [
    'ORIENTATION TECHNIQUE — DGIA IT SOLUTIONS',
    'Diagnostic interactif V1.7.3',
    '',
    'Symptôme : ' + (issues[a.issue] || 'Non précisé'),
    'Appareils : ' + (a.comparison === 'other_missing'
      ? 'Plusieurs semblent concernés (test comparatif)'
      : a.scope === 'several' ? 'Plusieurs'
        : a.scope === 'one' ? 'Un seul déclaré' : 'Non déterminé'),
    a.status ? 'Type de coupure : ' + (a.status === 'lost' ? 'Déconnexion Wi-Fi' : a.status === 'internet' ? 'Wi-Fi connecté sans Internet' : 'Non déterminé') : '',
    a.visible ? 'Nom du réseau : ' + (a.visible === 'visible' ? 'Reste visible' : a.visible === 'missing' ? 'Disparaît' : 'Non vérifié') : '',
    a.comparison ? 'Test sur un deuxième appareil : ' +
      (a.comparison === 'other_sees' ? 'Le réseau est visible'
        : a.comparison === 'other_missing' ? 'Le réseau est également invisible' : 'Non réalisé') : '',
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
