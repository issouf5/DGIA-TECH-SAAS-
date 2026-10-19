import { NextResponse } from 'next/server'
import { createClient as adminClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 30

const formats = ['Message professionnel', 'Publication réseaux sociaux', 'Description de produit', 'Plan d’action']
const tones = ['Professionnel', 'Pédagogique', 'Convaincant', 'Concis', 'Créatif']
const model = 'gpt-4.1-mini'
type Output = {
  output_text?: string
  output?: Array<{ content?: Array<{ type?: string; text?: string }> }>
  usage?: { input_tokens?: number; output_tokens?: number }
}
function respond(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return respond('Requête non autorisée.', 403)
  if (!request.headers.get('content-type')?.includes('application/json')) return respond('Format invalide.', 415)
  if (Number(request.headers.get('content-length') || 0) > 8000) return respond('Demande trop longue.', 413)

  const client = await createClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) return respond('Veuillez vous connecter.', 401)
  const apiKey = process.env.OPENAI_API_KEY
  const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!apiKey || !serverKey) return respond('Générateur en cours de configuration. Aucun quota décompté.', 503)

  let data: unknown
  try { data = await request.json() } catch { return respond('JSON invalide.', 400) }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return respond('Données invalides.', 400)
  const fields = data as Record<string, unknown>
  if (typeof fields.title !== 'string' || typeof fields.objective !== 'string' ||
      typeof fields.format !== 'string' || typeof fields.tone !== 'string') return respond('Champs invalides.', 400)
  const title = fields.title.trim()
  const objective = fields.objective.trim()
  if (title.length < 3 || title.length > 120 || objective.length < 10 || objective.length > 2000 ||
      !formats.includes(fields.format) || !tones.includes(fields.tone)) return respond('Vérifiez les champs.', 400)

  const { data: row, error } = await client.from('ai_generations')
    .insert({ title, prompt: objective }).select('id').single()
  if (!row || error) {
    const message = error?.message || ''
    if (message.includes('QUOTA_EXCEEDED')) return respond('Quota AI Tools épuisé pour 24 h.', 429)
    if (message.includes('AI_GLOBAL_LIMIT')) return respond('Budget quotidien du générateur atteint.', 429)
    if (message.includes('AI_ATTEMPT_LIMIT')) return respond('Trop de tentatives en 24 h.', 429)
    return respond('Impossible de réserver une génération.', 400)
  }

  const generationId = row.id
  const admin = adminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serverKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
  async function finalize(success: boolean, text: string | null, usage?: Output['usage']) {
    const { data: done, error: finalizeError } = await admin.rpc('finish_ai_generation', {
      p_id: generationId, p_succeeded: success, p_output: text,
      p_model: success ? model : null,
      p_input_tokens: usage?.input_tokens || 0,
      p_output_tokens: usage?.output_tokens || 0
    })
    return !finalizeError && done === true
  }

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
      body: JSON.stringify({
        model, store: false, max_output_tokens: 650,
        instructions: 'Tu es DGIA AI Tools. Rédige un texte original, utile, professionnel et clair en français. Signale les informations incertaines.',
        input: 'Type : ' + fields.format + '\nTon : ' + fields.tone + '\nDemande : ' + objective
      }),
      signal: AbortSignal.timeout(20000),
      cache: 'no-store'
    })
    if (!response.ok) throw new Error('SERVICE_ERROR')
    const payload = await response.json() as Output
    const text = (payload.output_text || payload.output?.flatMap(item => item.content || [])
      .filter(item => item.type === 'output_text').map(item => item.text || '').join('\n') || '').trim().slice(0, 8000)
    if (!text) throw new Error('EMPTY_OUTPUT')
    const saved = await finalize(true, text, payload.usage)
    return NextResponse.json({ text, warning: saved ? null : 'Enregistrement non confirmé.' },
      { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    const refunded = await finalize(false, null)
    return respond(refunded ? 'Service indisponible. Votre quota a été rétabli.' :
      'Service indisponible. Vérifiez votre quota avant de réessayer.', 502)
  }
}
