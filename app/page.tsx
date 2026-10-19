import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Bot, Check, ChevronRight, Cpu, Globe2, LockKeyhole, Network, ShieldCheck, Sparkles, Workflow, Zap } from 'lucide-react'
const modules=[
  {number:'01',icon:Network,title:'DGIA IT Solutions',subtitle:'Assistance & Infrastructure',description:'Centralisez vos demandes d’assistance informatique, réseau, Wi-Fi et MikroTik.',tags:['Support IT','Wi-Fi & Réseau','MikroTik'],color:'blue'},
  {number:'02',icon:Bot,title:'DGIA AI Tools',subtitle:'Intelligence appliquée',description:'Construisez des prompts structurés pour gagner du temps dans votre travail.',tags:['Prompts','Contenu','Productivité'],color:'violet'},
  {number:'03',icon:Workflow,title:'DGIA Automation',subtitle:'Organisation & Processus',description:'Préparez vos projets d’automatisation et organisez vos processus professionnels.',tags:['Processus','Projets','Organisation'],color:'green'}
]
export default function HomePage() {
  return <main className="landing">
    <header className="site-header"><div className="site-header-inner">
      <Link href="/" className="brand"><span className="brand-mark">D✦</span><span className="brand-word"><strong>DGIA <em>TECH</em></strong><small>SAAS PLATFORM</small></span></Link>
      <nav className="site-nav" aria-label="Navigation"><a href="#solutions">Solutions</a><a href="#tarifs">Tarifs</a><a href="#apropos">À propos</a></nav>
      <div className="header-actions"><Link href="/login" className="header-login">Connexion</Link><Link href="/login?mode=signup" className="button button-gold button-small">Commencer <ArrowUpRight size={17}/></Link></div>
    </div></header>
    <section className="hero"><div className="hero-glow"/><div className="hero-inner">
      <div className="hero-copy"><div className="eyebrow"><span className="pulse-dot"/> LA TECHNOLOGIE AU SERVICE DE VOTRE RÉUSSITE</div>
        <h1>Vos défis numériques.<br/><em>Nos solutions</em><br/>intelligentes.</h1>
        <p>Un seul espace pour organiser votre assistance informatique, préparer vos contenus IA et structurer vos projets d’automatisation.</p>
        <div className="hero-actions"><Link href="/login?mode=signup" className="button button-gold">Créer un compte gratuit <ArrowRight size={19}/></Link><a href="#solutions" className="button button-outline">Découvrir nos solutions <ChevronRight size={18}/></a></div>
        <div className="hero-trust"><span><ShieldCheck size={18}/> Compte sécurisé</span><span><Zap size={18}/> 3 modules</span><span><Globe2 size={18}/> Accessible en ligne</span></div>
      </div>
      <div className="hero-visual" aria-label="Présentation des trois solutions DGIA"><div className="visual-grid"/>
        <div className="visual-main"><div className="visual-top"><span className="visual-dot"/><span className="visual-dot"/><span className="visual-dot"/><small>DGIA / WORKSPACE</small></div><div className="visual-content"><div className="visual-welcome">CENTRE DE CONTRÔLE</div><h2>Votre espace de travail</h2><p>Tout ce dont vous avez besoin, au même endroit.</p><div className="visual-tiles"><div><Network size={24}/><strong>IT Solutions</strong><small>Assistance</small></div><div><Bot size={24}/><strong>AI Tools</strong><small>Prompts</small></div><div><Workflow size={24}/><strong>Automation</strong><small>Projets</small></div></div><div className="visual-status"><span className="pulse-dot"/> Espace sécurisé et connecté</div></div></div>
        <div className="visual-float"><Sparkles size={18}/> L’innovation devient accessible</div>
      </div>
    </div></section>
    <div className="trust-ribbon"><div><span><Cpu size={20}/> TECHNOLOGIE</span><span><LockKeyhole size={20}/> SÉCURITÉ</span><span><Zap size={20}/> PRODUCTIVITÉ</span><span><Globe2 size={20}/> ACCESSIBILITÉ</span></div></div>
    <section className="section" id="solutions"><div className="section-heading"><div><div className="eyebrow dark"><span className="eyebrow-line"/> NOTRE ÉCOSYSTÈME</div><h2>Trois solutions.<br/><em>Un seul objectif.</em></h2></div><p>Des outils numériques concrets pour accompagner votre activité au quotidien.</p></div>
      <div className="solution-grid">{modules.map(m=>{const Icon=m.icon;return <article className="solution-card" key={m.number}><div className="solution-top"><span className={'solution-icon '+m.color}><Icon size={27}/></span><span className="solution-number">/ {m.number}</span></div><div className="solution-subtitle">{m.subtitle}</div><h3>{m.title}</h3><p>{m.description}</p><div className="tag-row">{m.tags.map(t=><span key={t}>{t}</span>)}</div><Link href="/login?mode=signup">Découvrir le module <ArrowUpRight size={18}/></Link></article>})}</div>
    </section>
    <section className="why-section" id="apropos"><div className="why-inner"><div><div className="eyebrow">POURQUOI DGIA TECH SAAS ?</div><h2>La technologie doit<br/><em>simplifier votre quotidien.</em></h2><p>DGIA — Développement Global & Intelligence Appliquée — conçoit un environnement numérique accessible aux entrepreneurs et professionnels.</p><Link href="/login?mode=signup" className="button button-gold">Démarrer gratuitement <ArrowRight size={18}/></Link></div><div className="why-list"><div><ShieldCheck size={24}/><div><strong>Un espace personnel sécurisé</strong><p>Vos projets et demandes restent liés à votre compte.</p></div></div><div><Sparkles size={24}/><div><strong>Des outils qui évoluent</strong><p>Une première version pratique, avec de nouvelles fonctionnalités à venir.</p></div></div><div><Globe2 size={24}/><div><strong>Un service accessible en ligne</strong><p>Depuis votre ordinateur ou votre téléphone.</p></div></div></div></div></section>
    <section className="section pricing-section" id="tarifs"><div className="section-heading centered"><div className="eyebrow dark">DES FORMULES POUR ÉVOLUER</div><h2>Commencez gratuitement.<br/><em>Grandissez à votre rythme.</em></h2><p>Les formules payantes seront proposées lors d’une prochaine étape.</p></div><div className="pricing-grid">
      {[
        {name:'Gratuit',price:'0 FCFA',desc:'Pour découvrir les fonctionnalités de la plateforme.',items:['Accès aux 3 modules','Quota de test par module','Espace personnel sécurisé'],ready:true},
        {name:'Premium',price:'Bientôt',desc:'Pour aller plus loin dans votre productivité.',items:['Quotas plus élevés','Fonctionnalités avancées','Outils professionnels'],ready:false},
        {name:'Professionnel',price:'Bientôt',desc:'Pour les entreprises et besoins spécialisés.',items:['Prestations adaptées','Gestion professionnelle','Licences et options'],ready:false}
      ].map(p=><article className={'price-card'+(p.ready?' featured':'')} key={p.name}><span className="price-tier">{p.ready?'DISPONIBLE':'PROCHAINEMENT'}</span><h3>{p.name}</h3><strong>{p.price}</strong><p>{p.desc}</p><div className="price-features">{p.items.map(x=><div key={x}><Check size={18}/>{x}</div>)}</div>{p.ready?<Link href="/login?mode=signup" className="button button-gold button-wide">Créer mon compte <ArrowRight size={18}/></Link>:<span className="button button-muted button-wide">À venir</span>}</article>)}
    </div></section>
    <footer className="site-footer"><div><Link href="/" className="brand"><span className="brand-mark">D✦</span><span className="brand-word"><strong>DGIA <em>TECH</em></strong><small>SAAS PLATFORM</small></span></Link><p>Développement Global & Intelligence Appliquée</p></div><span>© {new Date().getFullYear()} DGIA TECH SAAS. Tous droits réservés.</span></footer>
  </main>
}
