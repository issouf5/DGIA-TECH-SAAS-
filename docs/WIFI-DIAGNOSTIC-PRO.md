# DGIA Wi-Fi Diagnostic Pro — spécification de préparation

**Statut :** tarif validé, produit non commercialisé, développement en cours.
**Prix :** 18 000 FCFA / licence annuelle de 12 mois à compter de l'activation.
**Module parent :** DGIA IT Solutions.
**Produit unique concerné :** DGIA Wi-Fi Diagnostic Pro.
**Autres licences :** aucune validée à ce stade.
**Paiement et renouvellement :** désactivés ; pas de prélèvement automatique.

## Objectif

Proposer un logiciel de diagnostic Wi-Fi professionnel basé sur les réponses de l'utilisateur, avec un rapport exploitable, un export PDF, un historique et un suivi des incidents. Le logiciel n'effectue pas de mesure du réseau et ne doit pas prétendre le faire.

## Ce qui est réalisé sur la branche de préparation

- Fiche produit et prix annuel dans le catalogue applicatif (vente désactivée).
- Page de présentation avec maquette de rapport explicitement fictive.
- Lien depuis DGIA IT Solutions et depuis Mes licences.
- Vérification de lecture **côté serveur** des licences associées à l'utilisateur connecté et au produit exact.
- Validation de l'état actif, des dates d'activation et d'expiration ; plafonnement à 12 mois après activation.
- Tests unitaires des règles de validité.
- Aucune écriture dans la base, aucun changement RLS, aucun paiement ni activation de licence.

## Étapes de développement suivantes

1. Créer un rapport professionnel réel à partir des réponses déjà recueillies par l'assistant Wi-Fi (V1.7.4), avec symptômes, hypothèses, vérifications et réserves.
2. Permettre l'export en PDF sans exposer de secrets ni transmettre de données à un service payant.
3. Concevoir un historique privé des rapports Pro et le suivi de l'état des incidents, en respectant la politique de quotas et les règles RLS.
4. Vérifier **côté serveur** l'autorisation Pro sur chaque route et action sensibles, pas seulement sur l'interface.
5. Mettre en place un processus d'attribution administrateur contrôlé, uniquement après validation du processus commercial et de paiement.
6. Tester sur mobile, l'export PDF, l'historique, la révocation, l'expiration et le renouvellement avant toute vente.

## Conditions de sécurité et compatibilité

- La table existante \`licenses\` est consultée en lecture seule.
- Identification stricte : \`module_code = 'it_solutions'\` ET \`product_name = 'DGIA Wi-Fi Diagnostic Pro'\`.
- Vérification : \`user_id\` de l'utilisateur authentifié, \`status = 'active'\`, \`activated_at <= now < min(expires_at, activated_at + 12 mois)\`.
- La RLS Supabase autorise actuellement la lecture des licences du propriétaire, sans insertion depuis le compte client. Ne pas élargir ces permissions pour la vente.
- L'état de licence affiché sur la page est **informatif** : aucune fonctionnalité Pro payante n'est encore disponible ni déverrouillée.
- Les fonctionnalités gratuites (diagnostic, copie, quotas et historique existant) restent inchangées.
- Aucun accès à l'administration du routeur, aucune collecte de mot de passe Wi-Fi, aucune API payante.

## Critères de validation avant publication commerciale

- [ ] Fonctionnalités Pro opérationnelles et protégées côté serveur.
- [ ] Rapports PDF vérifiés sur Android et ordinateur.
- [ ] Historique et suivi des incidents testés avec deux comptes distincts.
- [ ] Licences expirées, révoquées, futures et d'un autre produit refusées.
- [ ] Modalités d'assistance, de mises à jour et de renouvellement approuvées.
- [ ] Paiement manuel (Orange Money, Moov Money, Wave) défini et validé explicitement.
- [ ] Publication commerciale expressément autorisée.

**Aucun des éléments ci-dessus ne doit être activé automatiquement par la présence de la fiche produit.**
