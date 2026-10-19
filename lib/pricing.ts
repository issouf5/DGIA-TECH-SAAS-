export type PlanRow = {code:string;label:string;price_xof:number|null;enabled:boolean}
export type PlanLimitRow = {plan_code:string;module_code:string;quota_per_24h:number}
export type CatalogPlan = {
  code:'free'|'premium'|'professional';label:string;priceLabel:string;description:string;
  benefits:string[];quotaLabel:string;available:boolean
}
const definitions=[
  {code:'free' as const,label:'Gratuit',description:'Pour découvrir les outils DGIA TECH SAAS.',benefits:['Accès aux trois modules','Espace personnel sécurisé','Historique des demandes et projets']},
  {code:'premium' as const,label:'Premium',description:'Pour les indépendants et les petites structures.',benefits:['Assistance prioritaire (en préparation)','Outils IA avancés (en préparation)','Fonctionnalités de productivité à venir']},
  {code:'professional' as const,label:'Professionnel',description:'Pour les PME et les besoins professionnels.',benefits:['Automatisations étendues (en préparation)','Accompagnement professionnel (en préparation)','Options de licences à venir']}
]
const moduleCodes=['it_solutions','ai_tools','automation']
export function buildPlanCatalog(plans:PlanRow[]|null,limits:PlanLimitRow[]|null):CatalogPlan[]{
  return definitions.map(def=>{
    const row=plans?.find(p=>p.code===def.code)
    const moduleLimits=moduleCodes.map(code=>limits?.find(x=>x.plan_code===def.code&&x.module_code===code)?.quota_per_24h)
    const sameLimit=moduleLimits.every(value=>typeof value==='number'&&value===moduleLimits[0])
    const quotaLabel=sameLimit
      ? `${moduleLimits[0]} opérations par module / 24 h${row?.enabled?'':' (prévues)'}`
      : 'Quotas en préparation'
    const priceLabel=row&&row.price_xof!==null
      ? `${new Intl.NumberFormat('fr-FR').format(row.price_xof)} FCFA${def.code==='free'?'':' / mois'}`
      : 'Tarif indisponible'
    return {code:def.code,label:row?.label||def.label,priceLabel,description:def.description,benefits:def.benefits,quotaLabel,available:row?.enabled===true}
  })
}
