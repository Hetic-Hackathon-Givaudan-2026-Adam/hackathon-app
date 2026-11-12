# Givaudan — Frontend

React + TypeScript + Vite + React Router.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

Sous Windows PowerShell, si `npm` est bloqué (« l'exécution de scripts est désactivée »), utiliser `npm.cmd`
à la place : `npm.cmd install`, `npm.cmd run dev`.

## Assistant IA (bouton « Besoin d'aide ? »)

Le bouton **« Besoin d'aide ? »** du menu ouvre la page plein écran **`/assistant`** « Discussion audio »,
d'après la maquette Figma : la mascotte au centre, « Décrivez-moi ce que vous imaginez, avec vos propres
mots. », et en bas « Couper », « Commencer la discussion » et « Passer à l'écrit ». En haut : fermer,
le nom du projet (tiré de la fiche brief) et « Terminer ».

- **Discussion à la voix** : l'assistant lit ses réponses à voix haute, puis écoute le client et envoie
  sa phrase. Le bouton central devient « Parler », « J'ai terminé » ou « Interrompre et répondre ».
  Un anneau autour de la mascotte indique si elle écoute, réfléchit ou parle, et sa bouche bouge quand
  elle parle. « Couper » arrête le micro et la voix.
- **Passer à l'écrit** : conversation classique avec un champ de saisie (et un bouton micro pour revenir
  à l'oral).
- **Bouton « Voix »** (en haut à droite) : choix de la voix et « Écouter un exemple », mémorisé.
  - **Voix locales (Piper)** : Siwis (féminine) et Tom (masculine), générées par l'API sur l'ordinateur,
    sans Internet (`POST /tts`). Voix par défaut dans Chrome. Les longues réponses sont lues morceau par
    morceau pour commencer à parler tout de suite. Si l'API ne répond pas, la voix du navigateur prend le relais.
  - **Voix du navigateur** : dans Microsoft Edge, des voix « naturelles » (Denise, Henri…) très humaines,
    choisies par défaut quand elles existent ; ailleurs, Google et les voix de Windows.
- Le micro utilise la reconnaissance vocale du navigateur : **Chrome ou Edge**, micro autorisé. Elle
  **passe par les serveurs de Google ou de Microsoft** (elle n'est pas locale). Sans elle, la page bascule
  à l'écrit.
- La mascotte est un dessin provisoire (`components/assistant/Mascotte.tsx`) à remplacer par l'export
  de la maquette si besoin.

La page appelle l'API du dépôt `rag-api` (FastAPI + Ollama) :

| Action | Route de l'API |
|---|---|
| Première ouverture de la page | `POST /sessions` (message d'accueil) |
| Message du client / clic sur une suggestion | `POST /ask` |
| Liste des voix locales / lecture à voix haute | `GET /tts/voix`, `POST /tts` |

La page affiche les réponses, les ingrédients cités, les **suggestions en boutons** et le
**récapitulatif en tableau** (demande d'échantillon ou contact expert). La conversation est conservée
pendant la session du navigateur : on la retrouve en revenant sur la page (« Terminer » ou la croix
ramènent à l'accueil).

Pour le lancer :
1. Démarrer l'API (dépôt `rag-api`) avec Ollama allumé : `uvicorn main:app --port 8000`.
2. Optionnel : copier `.env.example` en `.env.local` pour changer l'adresse de l'API
   (par défaut `http://localhost:8000`, ou l'adresse ngrok si l'API tourne sur un autre PC).
3. `npm run dev`, ouvrir http://localhost:5173 et cliquer sur « Besoin d'aide ? »
   (ou ouvrir directement http://localhost:5173/assistant).

Une réponse avec des propositions d'ingrédients peut prendre jusqu'à environ une minute (modèle local).
Si la page devient blanche après une mise à jour du code, relancer le serveur en vidant son cache :
`npm run dev -- --force`.

Fichiers : `pages/AssistantPage.tsx` (la page), `components/assistant/Mascotte.tsx` (la mascotte),
`components/assistant/MessageContenu.tsx` (texte et tableau), `hooks/useAssistant.ts` (conversation),
`hooks/useVoix.ts` (micro et voix), `services/assistantApi.ts` (appels à l'API), `styles/assistant.css`.

## Mes projets (`/projets`)

La page liste les vraies conversations enregistrées dans la base de l'API (`GET /projets`), les plus
récentes d'abord : titre du projet, entreprise, produit, date et statut.

| Étape (API) | Statut affiché |
|---|---|
| `decouverte` | En discussion |
| `propositions` | Propositions reçues |
| `recapitulatif` | À confirmer |
| `terminee` | Demande envoyée |

- **Clic sur un projet** : ouvre `/assistant?session=<id>`, qui recharge l'historique (`GET /sessions/{id}`)
  à l'écrit ; la conversation peut continuer.
- **« Nouveau projet »** : ouvre `/assistant?nouveau=1`, qui démarre une nouvelle conversation.
- États chargement, vide (« Créer un projet ») et erreur (« Réessayer ») gérés.

Les autres pages (Accueil, Échantillons, Commandes, Profil) affichent encore les données fictives de
`data/mock.ts`.

## Structure

```
src/
├── main.tsx                 point d'entrée (BrowserRouter + CSS)
├── App.tsx                  routes
├── pages/                   une page par route
│   ├── HomePage.tsx         /
│   ├── ProjectsPage.tsx     /projets
│   ├── SamplesPage.tsx      /echantillons
│   ├── OrdersPage.tsx       /commandes
│   ├── ProfilePage.tsx      /profil
│   ├── AssistantPage.tsx    /assistant (plein écran, sans menu)
│   └── NotFoundPage.tsx     *
├── components/
│   ├── layout/              Layout, Sidebar, Topbar
│   ├── assistant/           Mascotte, MessageContenu
│   ├── home/                ProjectList, SummaryCard
│   └── ui/                  Badge, PageHeader
├── hooks/                   useAssistant (conversation), useVoix (micro et voix)
├── services/assistantApi.ts appels à l'API de l'assistant
├── data/mock.ts             données de démo (à remplacer par l'API)
├── types/index.ts
└── styles/                  global.css, layout.css, components.css, assistant.css
```
