# ADR 001 — Choix de la pile technique

## 1. Statut
Proposé — à valider par l'équipe.

## 2. Contexte

Dans le cadre du Hackathon HETIC Givaudan 2026, notre équipe doit développer une plateforme intelligente de commande.

Le projet comprend notamment :
- Un Backend pour gérer la logique métier et les API.
- Un chat intelligent.
- Un questionnaire intelligent.
- Une intégration avec un modèle de langage (LLM).

Nous devons identifier les technologies nécessaires pour construire ces différentes briques.

## 3. Technologies identifiées

### Backend
- Node.js : environnement d'exécution JavaScript.
- Express.js : framework pour développer le serveur Backend et les API REST.

### Intelligence artificielle
- Ollama : solution envisagée pour intégrer et exécuter un modèle de langage (LLM).

L'intégration d'Ollama reste à étudier et à valider.

### Frontend
À définir avec l'équipe.

### Base de données
À définir avec l'équipe.

## 4. Décisions

Node.js et Express.js sont les technologies identifiées pour le développement du Backend.

Les choix concernant le Frontend, la base de données et l'intégration définitive du LLM restent à valider collectivement.

## 5. Conséquences

- Le Backend sera développé avec Node.js et Express.js.
- Les API REST seront conçues en fonction des besoins du produit.
- L'intégration du LLM nécessitera des recherches et des tests.
- L'architecture globale sera complétée lorsque les choix techniques seront validés.

## 6. Éléments à définir

- Technologie Frontend.
- Base de données.
- Architecture des API.
- Modèle de langage à utiliser.
- Communication entre le Backend et le LLM.
- Architecture du questionnaire intelligent.
