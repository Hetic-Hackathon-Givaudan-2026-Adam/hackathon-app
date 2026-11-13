# Givaudan — Frontend

React + TypeScript + Vite + React Router, avec un assistant IA (voix et écrit).

## Lancer

```bash
npm install
cp .env.example .env        # puis mettre votre ANTHROPIC_API_KEY
npm run server              # terminal 1 : API de l'assistant (Node 20.6+), port 3001
npm run dev                 # terminal 2 : http://localhost:5173
```

Sans clé API, toutes les pages fonctionnent, sauf les réponses de l'assistant.
La voix utilise la Web Speech API : à tester sur Chrome ou Edge (micro autorisé).

## Routes

| URL | Page |
|---|---|
| `/` | Accueil |
| `/projets` | Mes projets |
| `/projets/nouveau` | Créer un projet |
| `/projets/nouveau/assistant` | Assistant (voix / écrit) |
| `/echantillons` | Mes échantillons (suivi) |
| `/commandes` | Mes commandes (onglets) |
| `/profil` | Profil de l'entreprise |
