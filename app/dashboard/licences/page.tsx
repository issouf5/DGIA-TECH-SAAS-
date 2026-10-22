import Link from 'next/link'
import { KeyRound, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

type LicenseRow = {
  id: string
  product_name: string
  status: string
  activated_at: string | null
  expires_at: string | null
}

function formatDate(value: string | null) {
  if (!value) return 'Non définie'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'À vérifier' : date.toLocaleDateString('fr-FR')
}

function statusLabel(license: LicenseRow) {
  if (license.status === 'revoked') return 'Révoquée'
  if (license.status === 'expired') return 'Expirée'
  if (license.status !== 'active') return 'Non activée'
  if (!license.expires_at) return 'Date de fin à vérifier'
  const expiry = new Date(license.expires_at).getTime()
  if (!Number.isFinite(expiry)) return 'Date de fin à vérifier'
  return expiry > Date.now() ? 'Active' : 'Expirée'
}

export default async function LicensesPage() {
  const supabase = await createClient()
  const { data: licenses } = await supabase
    .from('licenses')
    .select('id,product_name,status,activated_at,expires_at')
    .order('created_at', { ascending: false })
  const rows = (licenses || []) as LicenseRow[]

  return <>
    <div className="module-page-head">
      <div className="module-page-icon violet"><KeyRound size={25}/></div>
      <div><div className="page-eyebrow">MES PRODUITS</div><h1>Mes licences</h1><p>Licences logicielles distinctes des abonnements mensuels.</p></div>
    </div>

    <div className="workspace-card">
      <h2>Licences annuelles par logiciel — en préparation</h2>
      <p>Le modèle retenu prévoit une licence de 12 mois à partir de son activation pour chaque logiciel DGIA concerné. Chaque licence sera attribuée à un produit précis ; elle ne donnera pas automatiquement accès à tous les services de DGIA TECH SAAS.</p>
      <p>Les licences à vie ne sont pas proposées dans cette première étape. Les tarifs, les modalités de renouvellement et les droits d’utilisation de chaque logiciel devront être validés avant toute commercialisation.</p>
      <p className="muted-note">Aucun achat, paiement ou renouvellement automatique de licence n’est activé actuellement.</p>
      <Link href="/dashboard/abonnements" className="record-action">Voir les abonnements mensuels →</Link>
    </div>

    <div className="workspace-card">
      <h2>Licences enregistrées</h2>
      {rows.length ? <div className="record-list">
        {rows.map(license => <div className="record-item" key={license.id}>
          <div>
            <strong>{license.product_name}</strong>
            <p>Activation : {formatDate(license.activated_at)} · Expiration : {formatDate(license.expires_at)}</p>
          </div>
          <span className="record-status">{statusLabel(license)}</span>
        </div>)}
      </div> : <div className="empty-licenses">
        <KeyRound size={39}/>
        <h3>Aucune licence pour le moment</h3>
        <p>Les licences attribuées à votre compte apparaîtront ici lorsque ce service sera disponible.</p>
        <span><ShieldCheck size={16}/> Aucun achat nécessaire actuellement</span>
      </div>}
    </div>
  </>
}
