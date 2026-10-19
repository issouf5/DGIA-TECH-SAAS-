'use client'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginClient() {
  const params = useSearchParams()
  const router = useRouter()
  const [mode,setMode] = useState<'login'|'signup'>(params.get('mode') === 'signup' ? 'signup' : 'login')
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [visible,setVisible] = useState(false)
  const [busy,setBusy] = useState(false)
  const [message,setMessage] = useState(params.get('error') ? 'Confirmation impossible. Réessayez ou contactez le support.' : '')
  const [isError,setIsError] = useState(Boolean(params.get('error')))

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true); setMessage(''); setIsError(false)
    const supabase = createClient()
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name.trim() }, emailRedirectTo: window.location.origin + '/auth/callback' }
        })
        if (error) throw error
        if (data.session) { router.replace('/dashboard'); router.refresh(); return }
        setMessage('Inscription enregistrée. Vérifiez votre boîte e-mail pour confirmer votre compte, si demandé.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.replace('/dashboard'); router.refresh()
      }
    } catch (err) {
      setIsError(true)
      setMessage(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally { setBusy(false) }
  }
  return <main className="auth-page">
    <aside className="auth-side">
      <Link href="/" className="brand"><span className="brand-mark">D✦</span><span className="brand-word"><strong>DGIA <em>TECH</em></strong><small>SAAS PLATFORM</small></span></Link>
      <div className="auth-side-body"><span className="eyebrow">VOTRE ESPACE NUMÉRIQUE</span><h1>Une plateforme.<br />De nouvelles <em>possibilités.</em></h1><p>Assistance IT, outils d’intelligence appliquée et automatisation dans un espace sécurisé.</p></div>
      <p className="auth-side-footer"><ShieldCheck size={18} /> Données protégées par Supabase Auth.</p>
    </aside>
    <section className="auth-main"><div className="auth-panel">
      <Link href="/" className="back-link">← Retour à l’accueil</Link>
      <div className="auth-heading"><span className="auth-lock"><LockKeyhole size={24}/></span><h2>{mode === 'signup' ? 'Créez votre compte' : 'Bon retour parmi nous'}</h2><p>{mode === 'signup' ? 'Commencez gratuitement.' : 'Connectez-vous à votre espace DGIA.'}</p></div>
      <div className="auth-tabs"><button className={mode==='login'?'active':''} type="button" onClick={()=>{setMode('login');setMessage('')}}>Connexion</button><button className={mode==='signup'?'active':''} type="button" onClick={()=>{setMode('signup');setMessage('')}}>Inscription</button></div>
      <form onSubmit={submit} className="auth-form">
        {mode==='signup' && <label>Nom complet<input required maxLength={120} autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Votre nom"/></label>}
        <label>Adresse e-mail<div className="input-icon"><Mail size={18}/><input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="vous@exemple.com"/></div></label>
        <label>Mot de passe<div className="input-icon"><LockKeyhole size={18}/><input required minLength={8} type={visible?'text':'password'} autoComplete={mode==='signup'?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="8 caractères minimum"/><button type="button" className="password-toggle" aria-label="Afficher ou masquer le mot de passe" onClick={()=>setVisible(!visible)}>{visible?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
        {message && <p className={isError?'form-message error':'form-message success'} role="status">{message}</p>}
        <button type="submit" disabled={busy} className="button button-gold button-wide">{busy?'Veuillez patienter…':mode==='signup'?'Créer mon compte':'Se connecter'} <ArrowRight size={18}/></button>
      </form>
      <p className="auth-small">La formule gratuite est disponible dès l’ouverture du compte.</p>
    </div></section>
  </main>
}
