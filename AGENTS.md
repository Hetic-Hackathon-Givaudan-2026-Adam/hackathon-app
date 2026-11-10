# AGENTS.md

Projet : HETIC Hackathon Givaudan 2026.

Ce dépôt contient le projet d'équipe d'une plateforme intelligente de commande. Présentation : `README.md`.

## 1. Lancer

- Consulte `README.md` avant toute tentative de démarrage.
- Aucune commande de démarrage n'est actuellement documentée dans `README.md`.
- N'invente pas de commande de démarrage : demande les informations manquantes à l'équipe.

## 2. Règles

- Respecte le workflow Git défini dans `README.md` : `main`, `develop`, `feature/*` et `hotfix/*`.
- Travaille sur une branche dédiée à chaque tâche.
- Les modifications doivent être proposées par Pull Request.
- La documentation technique est stockée dans `docs/`.
- Respecte la casse des chemins : le dossier des décisions est `docs/ADR/`.
- Ne crée pas de fonctionnalités, routes API ou interfaces sans spécification validée par l'équipe.
- Ne considère pas une technologie comme définitivement choisie si son ADR est encore au statut « Proposé ».

## 3. Décisions

- Lis les fichiers `docs/ADR/` avant de proposer un changement technique.
- Consulte `docs/ADR/001-choix-technologies.md` pour connaître les technologies identifiées.
- Node.js et Express.js sont identifiés pour le Backend, sous réserve de validation de l'ADR.
- Ollama est envisagé pour le LLM, mais son intégration reste à valider.
- Le Frontend et la base de données restent à définir.
- Ne contredis pas une décision validée. Si un changement est nécessaire, propose un nouvel ADR et attends la validation de l'équipe avant de modifier le code.

## 4. À ne pas faire

- Ne pas inventer de fonctionnalités, d'API, de modèles de données ou de décisions d'architecture.
- Ne pas considérer Ollama comme définitivement adopté.
- Ne pas choisir une technologie Frontend ou une base de données sans validation.
- Ne pas modifier directement `main` ou `develop`.
- Ne pas contourner les contrôles Git ou les revues de Pull Request.
- Ne pas modifier des fichiers sans rapport avec la tâche demandée.
