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
