// Appels à l'API de l'assistant de brief (FastAPI + Ollama, dépôt rag-api).
// L'adresse se règle dans frontend/.env.local : VITE_API_URL=http://localhost:8000

export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/+$/, "");

export type Etape = "decouverte" | "propositions" | "recapitulatif" | "terminee" | "recentrage" | "redirection";

export interface Brief {
  entreprise: string;
  projet: string;
  produit: string;
  odeur: string;
  odeur_precise: boolean;
  cible: string;
  contraintes: string;
  pays: string;
}

export interface IngredientPropose {
  id: string;
  nom: string;
  famille_olfactive: string;
  notes: string;
  score: number;
}

export interface Recapitulatif {
  type: "echantillon" | "expert";
  lignes: { information: string; detail: string }[];
}

export interface ReponseAssistant {
  session_id: string;
  reponse: string;
  etape: Etape;
  brief: Brief;
  ingredients_proposes: IngredientPropose[];
  recapitulatif: Recapitulatif | null;
  suggestions: string[];
  numero_demande: string | null;
}

async function appel<T>(methode: string, chemin: string, corps?: unknown): Promise<T> {
  const reponse = await fetch(API_URL + chemin, {
    method: methode,
    headers: {
      "Content-Type": "application/json",
      // Évite la page d'avertissement quand l'API est partagée avec ngrok.
      "ngrok-skip-browser-warning": "true",
    },
    body: corps === undefined ? undefined : JSON.stringify(corps),
  });
  const donnees = await reponse.json().catch(() => ({}));
  if (!reponse.ok) {
    throw new Error((donnees as { detail?: string }).detail || `Erreur ${reponse.status}`);
  }
  return donnees as T;
}

export function creerSession() {
  return appel<{ session_id: string; message_accueil: string }>("POST", "/sessions");
}

export function envoyerMessage(sessionId: string | null, question: string) {
  return appel<ReponseAssistant>("POST", "/ask", { session_id: sessionId, question });
}

export interface ProjetResume {
  session_id: string;
  titre: string;
  entreprise: string;
  produit: string;
  odeur: string;
  etape: "decouverte" | "propositions" | "recapitulatif" | "terminee";
  nb_messages: number;
  cree_le: string;
  modifie_le: string;
}

export interface SessionDetail {
  session_id: string;
  etape: ProjetResume["etape"];
  brief: Brief;
  messages: { role: "user" | "assistant"; content: string }[];
  recapitulatif_en_attente: Recapitulatif | null;
}

/** Mes projets : conversations enregistrées dans la base de l'API, les plus récentes d'abord. */
export function listerProjets() {
  return appel<ProjetResume[]>("GET", "/projets");
}

/** Historique complet d'une conversation enregistrée. */
export function chargerSession(sessionId: string) {
  return appel<SessionDetail>("GET", `/sessions/${sessionId}`);
}

/** Voix de synthèse locales (Piper) installées côté API. */
export function listerVoixLocales() {
  return appel<{ disponible: boolean; voix: { id: string; nom: string }[] }>("GET", "/tts/voix");
}

/** Son (WAV) d'un texte lu par une voix locale Piper. */
export async function syntheseVocale(texte: string, voix: string, signal?: AbortSignal): Promise<Blob> {
  const reponse = await fetch(API_URL + "/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
    body: JSON.stringify({ texte, voix }),
    signal,
  });
  if (!reponse.ok) throw new Error(`Synthèse vocale indisponible (${reponse.status})`);
  return reponse.blob();
}

export function supprimerSession(sessionId: string) {
  return appel<{ supprimee: boolean }>("DELETE", `/sessions/${sessionId}`);
}
