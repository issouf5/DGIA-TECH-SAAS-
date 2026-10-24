import { createClient } from '@/lib/supabase/server'
import {
  WIFI_PRO, isWifiProLicenseActive, wifiProEffectiveExpiry,
  type WifiProLicenseRow
} from '@/lib/wifi-pro-catalog'

export type WifiProAccess =
  | { state: 'active'; expiresAt: string }
  | { state: 'inactive'; expiresAt: null }
  | { state: 'unavailable'; expiresAt: null }

/**
 * Lecture côté serveur uniquement. La licence ne peut pas être créée depuis
 * cette page et les politiques RLS Supabase restent applicables.
 */
export async function getWifiProAccess(): Promise<WifiProAccess> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { state: 'unavailable', expiresAt: null }

  const { data, error } = await supabase
    .from('licenses')
    .select('product_name,module_code,status,activated_at,expires_at')
    .eq('user_id', user.id)
    .eq('module_code', WIFI_PRO.moduleCode)
    .eq('product_name', WIFI_PRO.productName)
    .eq('status', 'active')

  if (error) return { state: 'unavailable', expiresAt: null }

  const license = (data as WifiProLicenseRow[] | null)?.find(row => isWifiProLicenseActive(row))
  const expiry = license && wifiProEffectiveExpiry(license)
  return license && expiry
    ? { state: 'active', expiresAt: expiry.toISOString() }
    : { state: 'inactive', expiresAt: null }
}
