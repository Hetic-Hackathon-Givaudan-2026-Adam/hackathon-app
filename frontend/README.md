# Givaudan — Frontend

React + TypeScript + Vite + React Router.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

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
│   └── NotFoundPage.tsx     *
├── components/
│   ├── layout/              Layout, Sidebar, Topbar
│   ├── home/                ProjectList, SummaryCard
│   └── ui/                  Badge, PageHeader
├── data/mock.ts             données de démo (à remplacer par l'API)
├── types/index.ts
└── styles/                  global.css, layout.css, components.css
```
