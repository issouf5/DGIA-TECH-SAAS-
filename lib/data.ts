export type Quota = { module_code: string; consumed_count: number; window_ends_at: string }
export type Limit = { module_code: string; quota_per_24h: number }
export function getQuota(code: string, limits: Limit[] | null, windows: Quota[] | null) {
  const limit = limits?.find(x => x.module_code === code)?.quota_per_24h ?? 0
  const active = windows?.filter(x => x.module_code === code && new Date(x.window_ends_at).getTime() > Date.now())
    .sort((a,b) => new Date(b.window_ends_at).getTime() - new Date(a.window_ends_at).getTime())[0]
  return { limit, used: active?.consumed_count ?? 0, endsAt: active?.window_ends_at ?? null }
}
export function friendlyError(message: string) {
  if (message.includes('QUOTA_EXCEEDED')) return 'Quota épuisé pour ce module. Revenez après le renouvellement de 24 heures.'
  if (message.includes('MODULE_UNAVAILABLE')) return 'Ce module n’est pas disponible avec votre forfait.'
  if (message.includes('INVALID_MODULE')) return 'Type de demande non pris en charge.'
  if (message.includes('AUTH_REQUIRED') || message.includes('JWT')) return 'Session expirée : veuillez vous reconnecter.'
  return message
}
