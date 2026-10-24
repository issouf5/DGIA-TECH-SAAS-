import test from 'node:test'
import assert from 'node:assert/strict'
import {
  WIFI_PRO, isWifiProLicenseActive, wifiProEffectiveExpiry, formatWifiProPrice
} from '../lib/wifi-pro-catalog.ts'

const now = new Date('2026-10-24T12:00:00.000Z')
const valid = {
  product_name: WIFI_PRO.productName,
  module_code: WIFI_PRO.moduleCode,
  status: 'active',
  activated_at: '2026-01-01T00:00:00.000Z',
  expires_at: '2027-01-01T00:00:00.000Z'
}

test('produit validé, tarif fixe et commercialisation désactivée', () => {
  assert.equal(WIFI_PRO.priceXof, 18000)
  assert.equal(WIFI_PRO.durationMonths, 12)
  assert.equal(WIFI_PRO.saleEnabled, false)
  assert.match(formatWifiProPrice(), /18\s?000 FCFA/)
})

test('licence active pour le bon logiciel et les bonnes dates', () => {
  assert.equal(isWifiProLicenseActive(valid, now), true)
})

test('licence expirée ou révoquée refusée', () => {
  assert.equal(isWifiProLicenseActive({ ...valid, expires_at: '2026-10-24T11:59:59Z' }, now), false)
  assert.equal(isWifiProLicenseActive({ ...valid, status: 'revoked' }, now), false)
})

test('autre logiciel ou module refusé', () => {
  assert.equal(isWifiProLicenseActive({ ...valid, product_name: 'DGIA MikroTik Assistant Pro' }, now), false)
  assert.equal(isWifiProLicenseActive({ ...valid, module_code: 'ai_tools' }, now), false)
})

test('activation future ou dates manquantes refusées', () => {
  assert.equal(isWifiProLicenseActive({ ...valid, activated_at: '2026-12-01T00:00:00Z', expires_at: '2027-12-01T00:00:00Z' }, now), false)
  assert.equal(isWifiProLicenseActive({ ...valid, activated_at: null }, now), false)
  assert.equal(isWifiProLicenseActive({ ...valid, expires_at: null }, now), false)
})

test('plafond annuel respecté même si la date stockée est plus longue', () => {
  const extended = { ...valid, expires_at: '2030-01-01T00:00:00Z' }
  assert.equal(wifiProEffectiveExpiry(extended)?.toISOString(), '2027-01-01T00:00:00.000Z')
  assert.equal(isWifiProLicenseActive(extended, new Date('2027-01-01T00:00:00Z')), false)
})

test('dates invalides refusées', () => {
  assert.equal(isWifiProLicenseActive({ ...valid, expires_at: 'date invalide' }, now), false)
  assert.equal(isWifiProLicenseActive({ ...valid, expires_at: '2025-01-01T00:00:00Z' }, now), false)
})
