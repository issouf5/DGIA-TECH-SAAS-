import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, CalendarDays, ClipboardCheck,
  FileText, LockKeyhole, ShieldCheck, Wifi
} from 'lucide-react'
import { getWifiProAccess } from '@/lib/wifi-pro-access'
import { WIFI_PRO, formatWifiProPrice } from '@/lib/wifi-pro-catalog'
import './wifi-pro.css'

export default async function WifiProPage() {
  const access = await getWifiProAccess()
  const expiration = access.state === 'active'
    ? new Date(access.expiresAt).toLocaleDateString('fr-FR')
    : null

  return <div className="wifi-pro-page">
    <Link href="/dashboard/it" className="wifi-pro-back"><ArrowLeft size={16}/> Retour à DGIA IT Solutions</Link>

    <div className="wifi-pro-hero">
      <div className="wifi-pro-hero-icon"><Wifi size={27}/></div>
      <div className="wifi-pro-hero-body">
        <span className="page-eyebrow">LOGICIEL 01 · LICENCE ANNUELLE</span>
        <h1>{WIFI_PRO.productName}</h1>
        <p>Une version professionnelle du diagnostic Wi-Fi DGIA, conçue pour la production de rapports et le suivi des incidents. Développement en préparation.</p>
        <div className="wifi-pro-pricing">
          <strong>{formatWifiProPrice()}</strong>
          <span>pour 12 mois à compter de l’activation</span>
        </div>
        <span className="wifi-pro-state"><LockKeyhole size={15}/> Offre non commercialisée · Aucun paiement activé</span>
      </div>
    </div>

    <div className="workspace-card">
      <h2>État de votre licence</h2>
      {access.state === 'active' ? <p><ShieldCheck size={17} className="wifi-pro-inline"/> Une licence valide est enregistrée jusqu’au {expiration}. Les fonctionnalités Pro ne sont pas encore disponibles.</p>
        : access.state === 'unavailable' ? <p>La vérification des licences est temporairement indisponible. Aucun accès Pro n’est accordé.</p>
        : <p>Aucune licence annuelle active pour ce logiciel. Le diagnostic Wi-Fi gratuit reste accessible sans licence.</p>}
      <p className="field-note">Cette page ne permet ni achat, ni activation, ni renouvellement. Une licence Pro ne débloque pas automatiquement les autres modules DGIA.</p>
      <Link href="/dashboard/licences" className="record-action">Consulter mes licences <ArrowRight size={16}/></Link>
    </div>

    <div className="workspace-card">
      <h2>Fonctionnalités professionnelles prévues</h2>
      <div className="wifi-pro-features">
        {WIFI_PRO.features.map((feature, index) =>
          <div key={feature}>
            {index === 0 ? <FileText size={19}/> : index === 1 ? <ClipboardCheck size={19}/> : <CalendarDays size={19}/>}
            <span>{feature}</span>
            <small>À développer</small>
          </div>)}
      </div>
      <p className="field-note">Le diagnostic existant est indicatif et repose sur les réponses de l’utilisateur ; il n’analyse pas directement le routeur ni le réseau.</p>
    </div>

    <div className="workspace-card">
      <div className="wifi-pro-report-heading">
        <div><span className="page-eyebrow">MAQUETTE DE RAPPORT</span><h2>Aperçu du futur rapport Pro</h2></div>
        <span className="wifi-pro-demo-tag">Données fictives</span>
      </div>
      <div className="wifi-pro-sample" aria-label="Exemple fictif de rapport professionnel">
        <div className="wifi-pro-sample-top">
          <strong>DGIA TECH SAAS · IT SOLUTIONS</strong>
          <span>EXEMPLE · NON OFFICIEL</span>
        </div>
        <h3>Rapport de diagnostic Wi-Fi</h3>
        <p className="wifi-pro-sample-subtitle">Démonstration de présentation — aucune mesure réelle</p>
        <dl>
          <div><dt>Référence</dt><dd>DEMO-WIFI-001</dd></div>
          <div><dt>Situation déclarée</dt><dd>Plusieurs appareils connectés sans Internet</dd></div>
          <div><dt>Localisation du problème</dt><dd>Même près du routeur</dd></div>
          <div><dt>Hypothèse indicative</dt><dd>Accès Internet ou liaison du routeur à vérifier</dd></div>
        </dl>
        <h4>Vérifications recommandées</h4>
        <ol>
          <li>Tester plusieurs sites depuis deux appareils autorisés.</li>
          <li>Observer les voyants Internet du modem et du routeur.</li>
          <li>Contacter le gestionnaire du réseau si la panne persiste.</li>
        </ol>
        <p className="wifi-pro-sample-foot">Exemple pédagogique uniquement. L’export PDF et l’historique Pro ne sont pas encore implémentés.</p>
      </div>
    </div>

    <div className="wifi-pro-free-link">
      <div><strong>Le diagnostic Wi-Fi gratuit reste disponible</strong><p>Conservez les conseils, la copie des rapports et les quotas actuels.</p></div>
      <Link href="/dashboard/it" className="button button-gold">Utiliser la version gratuite <ArrowRight size={16}/></Link>
    </div>
  </div>
}
