# Givaudan — Backend (API)

Express + TypeScript. Même organisation que le frontend : routes → contrôleurs → données/services.

```bash
npm install
cp .env.example .env
npm run dev        # http://localhost:3001/api
```

## Endpoints

| Méthode | URL | Rôle |
|---|---|---|
| GET | `/api/health` | Vérifier que l'API tourne |
| GET | `/api/projects` | Liste des projets |
| GET | `/api/projects/:id` | Un projet |
| POST | `/api/projects` | Créer `{ name, kind, brief? }` (`kind` : Goût, Saveur, Senteur) |
| GET | `/api/samples` | Échantillons (`step` 1 à 3) |
| GET | `/api/samples/:id` | Un échantillon |
| GET | `/api/orders` | Commandes de produits |
| GET | `/api/orders/:id` | Une commande |
| GET | `/api/profile` | Profil de l'entreprise |
| PUT | `/api/profile` | Modifier le profil (champs partiels) |
| POST | `/api/assistant` | `{ messages, project: { name, kind }, lang }` → `{ reply, demo }` |

Les données sont en mémoire (`src/data/mock.ts`) : elles repartent à zéro au redémarrage.
