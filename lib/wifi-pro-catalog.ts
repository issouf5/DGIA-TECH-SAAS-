/**
 * Catalogue de préparation. Le tarif est validé, la vente reste désactivée.
 * Cette définition n'autorise ni paiement ni activation de licence.
 */
export const WIFI_PRO = {
  code: 'wifi_diagnostic_pro',
  productName: 'DGIA Wi-Fi Diagnostic Pro',
  moduleCode: 'it_solutions',
  priceXof: 18000,
  durationMonths: 12,
  saleEnabled: false,
  features: [
    'Rapport professionnel structuré',
    'Export PDF du rapport',
    'Historique des diagnostics Pro',
    'Suivi des incidents et de leur résolution'
  ]
} as const

export type WifiProLicenseRow = {
  product_name: string
  module_code: string | null
  status: string
  activated_at: string | null
  expires_at: string | null
}

/**
 * La licence est valable uniquement pour ce produit, ce module et la période
 * effectivement attribuée. Un expires_at trop lointain ne dépasse jamais
 * douze mois après activated_at.
 */
export function wifiProEffectiveExpiry(license: WifiProLicenseRow): Date | null {
  if (license.product_name !== WIFI_PRO.productName ||
      license.module_code !== WIFI_PRO.moduleCode ||
      license.status !== 'active' ||
      !license.activated_at || !license.expires_at) return null

  const start = new Date(license.activated_at)
  const end = new Date(license.expires_at)
  if (!Number.isFinite(start.getTime()) ||
      !Number.isFinite(end.getTime()) ||
      end.getTime() <= start.getTime()) return null

  const annualEnd = new Date(start)
  annualEnd.setUTCMonth(annualEnd.getUTCMonth() + WIFI_PRO.durationMonths)
  return new Date(Math.min(end.getTime(), annualEnd.getTime()))
}

export function isWifiProLicenseActive(
  license: WifiProLicenseRow,
  now: Date = new Date()
): boolean {
  const expiry = wifiProEffectiveExpiry(license)
  const start = license.activated_at ? new Date(license.activated_at) : null
  return Boolean(expiry && start &&
    Number.isFinite(now.getTime()) &&
    now.getTime() >= start.getTime() &&
    now.getTime() < expiry.getTime())
}

export function formatWifiProPrice() {
  return new Intl.NumberFormat('fr-FR').format(WIFI_PRO.priceXof) + ' FCFA'
}
