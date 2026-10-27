# GAIA phase 2 — IA réelle avec Cloudflare Workers AI

GAIA sur GitHub Pages reste un site statique. Un **Cloudflare Worker** distinct héberge l'API et appelle le modèle via une liaison Workers AI, sans clé secrète dans le navigateur. Un quota gratuit peut être proposé par Cloudflare ; vérifiez les conditions et les limites actuelles dans votre compte. Le modèle et son nom peuvent changer.

## Déployer le Worker (une seule fois)
1. Créer/ouvrir un compte Cloudflare et accéder à **Workers & Pages**.
2. Créer un Worker nommé `gaia-ai` et le déployer.
3. Dans le tableau de bord du Worker, éditer son code en remplaçant le contenu par **`worker/src/index.js`** de ce dépôt, puis déployer.
4. Dans les **Settings > Bindings** du Worker, ajouter une liaison **Workers AI** nommée exactement **`AI`**, puis redéployer si nécessaire. Cette étape est indispensable.
5. Copier l'adresse publique du Worker en `https://...workers.dev`. Ne pas mettre de clé API dans GAIA ni dans GitHub.

Alternative développeur avec Wrangler : depuis le dossier `worker`, lancer `npx wrangler login` puis `npx wrangler deploy` (la liaison AI est définie dans `wrangler.toml`).

## Connecter GAIA
1. Ouvrir GAIA sur Android, onglet **Paramètres**.
2. Coller l'adresse HTTPS du Worker (sans chemin additionnel) dans **URL du serveur IA**.
3. Enregistrer, puis tester une question dans **Assistant**.
4. Si le navigateur affiche une ancienne version, fermer puis rouvrir GAIA, éventuellement effacer les données du site.

## Sécurité et limites
- **Pas de secret dans GitHub Pages** : l'IA est appelée depuis le Worker avec la liaison Cloudflare.
- L'API n'est **pas authentifiée** : le contrôle d'origine CORS limite les appels des navigateurs, mais ne bloque pas des clients non navigateurs. Un tiers peut consommer le quota. Pour une exposition durable, ajouter une authentification serveur, un quota par utilisateur et une limitation de débit côté Cloudflare.
- Les huit agents sont des **profils de prompt**, pas des agents autonomes.
- Les conversations ne sont pas stockées par ce Worker, mais sont transmises au service de modèle Cloudflare ; ne pas envoyer de données sensibles.
- Les fonctionnalités de recherche web, génération vidéo, contrôle PC, revenus et auto-amélioration ne sont pas implémentées.
