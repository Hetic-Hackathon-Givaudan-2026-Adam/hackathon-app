# ADR 001 — Choix de la pile technique

## 1. Statut

Proposé — à valider collectivement par l'équipe Tech.

## 2. Contexte

Dans le cadre du Hackathon HETIC Givaudan 2026, notre équipe développe une plateforme intelligente de commande destinée aux clients de Givaudan.

L'objectif est de faciliter la recherche de références et les demandes d'échantillons grâce à un assistant intelligent.

La plateforme doit permettre à un utilisateur de :

- Décrire son besoin en langage naturel.
- Répondre aux questions posées par un assistant intelligent.
- Recevoir une sélection de références adaptées à son projet.
- Préparer une demande d'échantillons.
- Générer un résumé de son besoin destiné au commercial.

Pour réaliser ce prototype, nous devons choisir une pile technique simple, adaptée à notre niveau et permettant de développer rapidement une application fonctionnelle.

## 3. Technologies proposées

### 3.1 Frontend

- **React.js** : bibliothèque JavaScript pour construire l'interface utilisateur.
- **TypeScript** : permet de mieux organiser le code et de détecter certaines erreurs.
- **CSS** : pour la mise en forme de l'interface.

Rôle :
- Créer les pages de l'application.
- Afficher l'interface de discussion.
- Afficher les questions et les réponses.
- Présenter les références recommandées.
- Permettre à l'utilisateur de préparer sa demande d'échantillons.

### 3.2 Backend

- **Node.js** : environnement d'exécution JavaScript.
- **Express.js** : framework pour développer le serveur et les API REST.

Rôle :
- Gérer les requêtes du frontend.
- Traiter les réponses de l'utilisateur.
- Gérer la logique métier.
- Communiquer avec la base de données.
- Préparer les demandes d'échantillons.
- Communiquer avec le service d'intelligence artificielle.

### 3.3 Base de données

- **MongoDB** : base de données NoSQL.

Rôle :
- Stocker les informations nécessaires aux utilisateurs.
- Enregistrer les conversations si nécessaire.
- Stocker les références du catalogue.
- Conserver les demandes d'échantillons.

### 3.4 Intelligence artificielle

- **Ollama** : solution envisagée pour exécuter un modèle de langage (LLM) en local.
- **Modèle open source** : modèle à sélectionner après des tests.

Rôle :
- Comprendre les besoins exprimés par l'utilisateur.
- Poser des questions complémentaires.
- Aider à identifier les références adaptées.
- Générer un résumé du projet et de la demande d'échantillons.

L'intégration d'Ollama et le choix du modèle restent à tester et à valider.

### 3.5 Communication

- **API REST** : communication entre le frontend et le backend.
- **JSON** : format d'échange des données.

## 4. Décisions proposées

L'équipe propose d'utiliser la pile technique suivante :

| Composant | Technologie |
|---|---|
| Frontend | React.js + TypeScript |
| Backend | Node.js + Express.js |
| Base de données | MongoDB |
| Intelligence artificielle | Ollama + modèle open source |
| Communication | API REST / JSON |
| Gestion du code | Git / GitHub |

Ces choix doivent permettre de développer un prototype modulaire et évolutif.

## 5. Architecture envisagée

L'application sera organisée autour de trois parties principales :

1. Frontend : interface utilisateur développée avec React.
2. Backend : serveur Express qui gère les API et la logique métier.
3. Services : MongoDB pour les données et un modèle IA pour l'assistant intelligent.

Le frontend communiquera avec le backend via des API REST.

Le backend communiquera avec MongoDB et le service IA selon les besoins.

## 6. Conséquences

### Points positifs

- Utilisation de JavaScript et TypeScript sur le frontend et le backend.
- Technologies adaptées au développement d'une application web.
- Architecture modulaire facilitant le travail en équipe.
- Possibilité d'intégrer un modèle IA local.
- Technologies disposant d'une documentation accessible.

### Points à surveiller

- Tester les performances du modèle IA.
- Vérifier les ressources nécessaires pour exécuter Ollama.
- Garantir la qualité des recommandations.
- Organiser et nettoyer les données du catalogue.
- Tester les échanges entre le frontend, le backend et le service IA.

## 7. Décisions restant à valider

- Validation définitive de la stack par l'équipe.
- Choix du modèle de langage.
- Validation de l'intégration d'Ollama.
- Structure des données MongoDB.
- Organisation des API REST.
- Méthode de recherche et de recommandation des références.
- Gestion des conversations et des demandes d'échantillons.

## 8. Conclusion

Cette proposition technique constitue une première base pour développer notre plateforme de commande intelligente.

Les choix pourront être ajustés en fonction des tests techniques, des données disponibles et des contraintes du hackathon.
