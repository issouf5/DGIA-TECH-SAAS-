# DGIA TECH SAAS — modèle des abonnements et licences

Décision fonctionnelle validée le 22 octobre 2026. Document de préparation ; **aucune commercialisation ou activation automatique**.

## Deux modèles distincts

### Abonnement mensuel à la plateforme
- Gratuit : 0 FCFA, quotas existants renouvelés par période de 24 heures.
- Premium : 3 900 FCFA / mois dans le catalogue actuel, offre désactivée.
- Professionnel : 9 900 FCFA / mois dans le catalogue actuel, offre désactivée.
- L'abonnement concerne les services hébergés de DGIA TECH SAAS.
- Les règles de paiement et de renouvellement ne sont pas encore implémentées. Aucun prélèvement automatique.

### Licence annuelle par logiciel
- Une licence est associée à **un logiciel/produit DGIA précis**, pas à l'ensemble des modules ou à la plateforme.
- Durée prévue : **12 mois à compter de l'activation**. Le renouvellement devra être explicitement défini avant la vente.
- Premier produit validé : **DGIA Wi-Fi Diagnostic Pro — 18 000 FCFA pour 12 mois**. Aucun autre logiciel ni tarif de licence n'est validé ; aucune licence en vente.
- Voir la [spécification Wi-Fi Diagnostic Pro](WIFI-DIAGNOSTIC-PRO.md).
- Une licence ne donne pas automatiquement droit aux API payantes, aux frais d'hébergement ou aux services cloud.
- Les licences à vie sont reportées à une phase ultérieure.

## État technique existant

- La table subscriptions contient notamment user_id, plan_code, status, started_at, expires_at.
- La table licenses contient notamment user_id, product_name, module_code facultatif, status, activated_at, expires_at.
- Ces champs permettent d'afficher les dates et états ; **ils ne constituent pas un système de facturation ni de contrôle d'accès aux logiciels**.
- Le statut visuel d'une licence ne remplace pas une vérification d'autorisation côté serveur.
- Aucun changement de schéma, quota, RLS, service payant ou fournisseur de paiement n'est apporté par cette préparation.

## Avant toute mise en vente

1. Définir la liste des logiciels éligibles et les droits de chaque licence.
2. Valider les tarifs, les conditions de renouvellement et les modalités d'assistance/mises à jour.
3. Implémenter un contrôle d'accès côté serveur : propriétaire, logiciel concerné, statut actif, date d'activation et date d'expiration.
4. Prévoir une attribution sécurisée par un administrateur après vérification d'un paiement autorisé, sans permettre l'auto-attribution depuis le navigateur.
5. Tester les expirations, annulations, doubles activations et cas de renouvellement.
6. Obtenir l'accord explicite avant toute publication commerciale ou activation de paiement.

## Statut de cette branche

Préparation de l'interface client et de la documentation **uniquement**. Ne pas fusionner dans main ni activer de vente sans validation.
