# Architecture — DGIA TECH SAAS V1

## Modules
- IT Solutions : table `service_requests`, formulaire et historique.
- AI Tools : table `ai_prompts`, constructeur de prompts et historique. Aucun modèle IA appelé.
- Automation : table `automation_projects`, création et historique. Aucun workflow exécuté.

## Sécurité
- Supabase Auth avec sessions côté serveur.
- RLS sur les tables exposées, séparation des données par utilisateur.
- Triggers de quota transactionnels dans `app_private`, 5 créations par module sur 24 h en formule gratuite.
- Ne jamais exposer de clé `service_role` ou de clé `sb_secret_`.

## Limitations
- V1 alpha, non testée en production.
- Premium, Professionnel, paiements et licences : en préparation.
- Configuration du domaine Vercel et des redirections Supabase à effectuer après déploiement.
