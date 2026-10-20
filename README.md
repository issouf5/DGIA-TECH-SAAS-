# DGIA TECH SAAS — V1 alpha

Plateforme SaaS de DGIA (Développement Global & Intelligence Appliquée).

## Modules
- DGIA IT Solutions : demandes d'assistance informatique, réseau et MikroTik
- DGIA AI Tools : atelier de prompts IA (sans génération par un modèle pour le moment)
- DGIA Automation : organisation de projets d'automatisation (sans exécution automatique)

## Technologies
Next.js 16, React 19, TypeScript, Tailwind CSS 4, Supabase Auth et PostgreSQL. Déploiement prévu sur Vercel.

## Démarrage
1. Installer Node.js 20.9 ou plus récent.
2. Exécuter `npm install`, puis conserver le `package-lock.json` généré.
3. Copier `.env.example` vers `.env.local`.
4. Lancer `npm run dev`.
5. Vérifier `npm run lint:types` et `npm run build`.

## Vercel
Importer ce dépôt sur Vercel avec le framework Next.js. Configurer les variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (clé publique uniquement). Dans Supabase Authentication → URL Configuration, ajouter `https://VOTRE-DOMAINE/auth/callback` aux URL de redirection autorisées.

**Sécurité :** ne jamais publier de clé `service_role` ou `sb_secret_`, ni de fichier `.env.local`.

**Statut :** V1 alpha à tester. Quotas gratuits provisoires : 5 créations par module et par période de 24 h. Premium, Professionnel, licences et paiements ne sont pas encore activés. Les diagnostics et automatisations réels ne sont pas encore implémentés.


## V1.4 — Studio de rédaction gratuit (sans API OpenAI)

Dans `/dashboard/ai`, le studio prépare des textes à partir de modèles
prédéfinis : publication, description de produit/service, prospection,
annonce WhatsApp et plan d'action. Il ne s'agit **pas** d'une IA générative :
les textes sont assemblés localement à partir des informations de l'utilisateur.
La préparation, la modification avant sauvegarde et la copie n'appellent
aucun fournisseur externe et ne consomment aucun quota.

La sauvegarde cloud utilise la table `public.content_drafts`, avec RLS
propriétaire et le quota habituel `ai_tools` (5 créations/24h en Free).
La modification et la suppression ne recréditent pas le quota.

**Protection contre les dépenses :** la route `/api/ai/generate` est
désactivée par défaut, même si `OPENAI_API_KEY` est déjà configurée.
Il faut définir explicitement `DGIA_AI_API_ENABLED=true` côté serveur
pour autoriser les appels à OpenAI, uniquement après validation du budget
et du moyen de paiement. Tant que cette variable est absente ou différente
de `true`, aucune génération facturable n'est lancée.

La clé API ne doit jamais être transmise au navigateur ni publiée dans GitHub.


## V1.5 — Améliorations après test mobile (20/10/2026)

- Studio de rédaction : phrases plus naturelles, traitement des appels à l'action courts
  comme « Devis », et correction simple de « Petit entreprise » en « les petites entreprises ».
  La sortie reste un **modèle déterministe** modifiable, sans IA générative.
- Liste des textes : lorsqu'on ouvre un élément avec « Voir », le texte complet
  remplace l'aperçu au lieu de l'afficher deux fois.
- **DGIA IT Solutions : diagnostic guidé** (Wi-Fi, ordinateur, imprimante,
  réseau MikroTik). Les conseils sont déterministes et calculés dans le navigateur ;
  aucun scan, accès aux appareils, modification réseau ou appel API.
  L'utilisateur peut copier gratuitement un rapport, ou l'enregistrer
  comme demande d'assistance dans `service_requests` avec le quota IT habituel.
  Le diagnostic est indicatif, et le traitement humain des demandes n'est pas encore actif.

Aucune nouvelle table ou clé API n'est nécessaire pour cette version.


## V1.6 — clarification des symptômes Wi-Fi

Si le symptôme choisi est « réseau Wi-Fi invisible » mais que les précisions
mentionnent seulement des coupures, le diagnostic demande de choisir entre
un nom de réseau qui disparaît et une connexion instable. Il ne génère pas
de rapport ambigu avant la clarification. Les rapports précisent aussi la
première vérification selon le nombre d'appareils touchés. Tout reste local
au navigateur, sans API payante ni accès au matériel.


## V1.7 — diagnostic Wi-Fi interactif fondé sur des sources techniques

Dans DGIA IT Solutions, la catégorie Wi-Fi propose maintenant un questionnaire
progressif : type de problème, nombre d'appareils, perte Wi-Fi ou Internet,
visibilité du nom du réseau, distance du routeur et précisions facultatives.
Les questions inutiles sont ignorées selon les réponses. Le rapport fournit
une hypothèse non confirmée et un plan de vérification ciblé, avec des liens
vers les guides officiels Microsoft sur le dépannage et la couverture Wi-Fi.

Le calcul s'effectue dans le navigateur, sans mesure réseau ni API payante.
Copier reste gratuit et illimité. Enregistrer une demande utilise le quota IT
habituel. Les autres catégories (ordinateur, imprimante, MikroTik) conservent
le diagnostic guidé existant. Aucun changement de schéma Supabase.

## V1.7.1 — priorité à la portée du signal

Lorsque le nom du Wi-Fi disparaît **surtout loin du routeur**, le rapport
privilégie une hypothèse de couverture insuffisante (ou de réception faible
sur un seul appareil) plutôt qu’une panne du point d’accès. Les étapes
proposent un test de proximité, un second appareil, une inspection des
obstacles et une escalade si le réseau disparaît aussi près du routeur.
Cette orientation reste indicative et gratuite.
