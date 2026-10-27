# GAIA v1

Application web mobile expérimentale : supernova animée, huit profils d'agents, chat texte, dictée et synthèse vocale selon navigateur, paramètres locaux.

## Publication
Dans Settings > Pages, choisir **GitHub Actions**. Le workflow `.github/workflows/pages.yml` publie le site après chaque push sur main.

## Installer sur Android
Ouvrir l'URL GitHub Pages avec Chrome, menu ⋮ puis Ajouter à l'écran d'accueil.

## IA réelle
Un serveur HTTPS distinct doit accepter POST JSON `{"message":"...","agent":"..."}` et retourner `{"reply":"..."}`. Configurer CORS, authentification et limites côté serveur. Ne jamais mettre de clé API dans ce dépôt public. Les agents sont des profils, pas des processus autonomes. Contrôle PC, paiements, amélioration automatique et génération multimédia non implémentés.
