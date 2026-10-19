import { Clock3 } from 'lucide-react'
export function QuotaBar({used,limit,endsAt}:{used:number;limit:number;endsAt:string|null}) {
  const remaining = Math.max(0,limit-used)
  return <div className="quota-widget">
    <div className="quota-head"><div><span className="quota-label">Quota gratuit du module</span><strong>{remaining} <small>/ {limit} disponibles</small></strong></div><Clock3 size={20}/></div>
    <div className="progress"><span style={{width: String(limit>0?Math.min(100,100*used/limit):0)+'%'}} /></div>
    <p>{endsAt?'Renouvellement : '+new Intl.DateTimeFormat('fr-FR',{dateStyle:'short',timeStyle:'short',timeZone:'UTC'}).format(new Date(endsAt))+' UTC':'La période de 24 h commence à la première utilisation.'}</p>
  </div>
}
