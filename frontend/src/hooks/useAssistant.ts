import { useCallback, useEffect, useRef, useState } from "react";
import {
  API_URL,
  chargerSession,
  creerSession,
  envoyerMessage,
  supprimerSession,
  type Brief,
  type IngredientPropose,
  type Recapitulatif,
} from "../services/assistantApi";

export interface MessageChat {
  id: number;
  role: "user" | "assistant" | "erreur";
  texte: string;
  ingredients?: IngredientPropose[];
  recapitulatif?: Recapitulatif | null;
  numero?: string | null;
}

interface Etat {
  sessionId: string | null;
  messages: MessageChat[];
  suggestions: string[];
  brief: Brief | null;
}

// La conversation est gardée pour l'onglet en cours : on la retrouve en revenant sur la page.
const CLE = "givaudan-assistant";

function lire(): Etat | null {
  try {
    const brut = sessionStorage.getItem(CLE);
    return brut ? (JSON.parse(brut) as Etat) : null;
  } catch {
    return null;
  }
}

function ecrire(etat: Etat) {
  try {
    sessionStorage.setItem(CLE, JSON.stringify(etat));
  } catch {
    /* stockage indisponible : la conversation reste en mémoire */
  }
}

let compteur = Date.now();
const nouvelId = () => ++compteur;

/** Ce que la page demande à l'ouverture : reprendre un projet enregistré, ou en commencer un nouveau. */
export interface OuvertureAssistant {
  sessionDemandee?: string | null;
  nouveau?: boolean;
}

export function useAssistant({ sessionDemandee = null, nouveau = false }: OuvertureAssistant = {}) {
  const initial = useRef(lire());
  const [sessionId, setSessionId] = useState<string | null>(initial.current?.sessionId ?? null);
  const [messages, setMessages] = useState<MessageChat[]>(initial.current?.messages ?? []);
  const [suggestions, setSuggestions] = useState<string[]>(initial.current?.suggestions ?? []);
  const [brief, setBrief] = useState<Brief | null>(initial.current?.brief ?? null);
  const [enCours, setEnCours] = useState(false);

  useEffect(() => {
    ecrire({ sessionId, messages, suggestions, brief });
  }, [sessionId, messages, suggestions, brief]);

  const demarrer = useCallback(async () => {
    setMessages([]);
    setSuggestions([]);
    setBrief(null);
    setEnCours(true);
    try {
      const s = await creerSession();
      setSessionId(s.session_id);
      setMessages([{ id: nouvelId(), role: "assistant", texte: s.message_accueil }]);
    } catch {
      setSessionId(null);
      setMessages([{
        id: nouvelId(),
        role: "erreur",
        texte: `Impossible de joindre l'assistant (${API_URL}). Vérifiez que l'API et Ollama sont lancés.`,
      }]);
    } finally {
      setEnCours(false);
    }
  }, []);

  /** Reprend une conversation enregistrée dans la base (depuis « Mes projets »). */
  const reprendre = useCallback(async (id: string) => {
    setEnCours(true);
    setSuggestions([]);
    try {
      const s = await chargerSession(id);
      setSessionId(s.session_id);
      setBrief(s.brief);
      setMessages(s.messages.map((m) => ({ id: nouvelId(), role: m.role, texte: m.content })));
      // Une demande attendait une confirmation : on repropose les boutons.
      if (s.recapitulatif_en_attente) setSuggestions(["Oui, je confirme", "Annuler"]);
    } catch {
      setMessages([{ id: nouvelId(), role: "erreur", texte: "Ce projet est introuvable (il a peut-être été supprimé)." }]);
    } finally {
      setEnCours(false);
    }
  }, []);

  // À l'ouverture : projet demandé, nouveau projet, ou conversation en cours de l'onglet.
  // `ouvert` évite de tout refaire deux fois (mode développement de React, retrait de « ?nouveau » de l'adresse).
  const ouvert = useRef<string | null>(null);
  useEffect(() => {
    const cle = sessionDemandee ? `session:${sessionDemandee}` : nouveau ? "nouveau" : "defaut";
    if (ouvert.current === cle || (cle === "defaut" && ouvert.current)) return;
    ouvert.current = cle;
    if (sessionDemandee) reprendre(sessionDemandee);
    else if (nouveau || !initial.current?.sessionId) demarrer();
  }, [sessionDemandee, nouveau, reprendre, demarrer]);

  const envoyer = useCallback(async (question: string) => {
    const texte = question.trim();
    if (!texte || enCours) return;
    setSuggestions([]);
    setMessages((m) => [...m, { id: nouvelId(), role: "user", texte }]);
    setEnCours(true);
    try {
      const r = await envoyerMessage(sessionId, texte);
      setSessionId(r.session_id);
      setMessages((m) => [...m, {
        id: nouvelId(),
        role: "assistant",
        texte: r.reponse,
        ingredients: r.ingredients_proposes,
        recapitulatif: r.recapitulatif,
        numero: r.numero_demande,
      }]);
      setSuggestions(r.suggestions);
      setBrief(r.brief);
    } catch (e) {
      setMessages((m) => [...m, {
        id: nouvelId(),
        role: "erreur",
        texte: e instanceof Error ? e.message : "Une erreur est survenue.",
      }]);
    } finally {
      setEnCours(false);
    }
  }, [enCours, sessionId]);

  const recommencer = useCallback(async () => {
    if (sessionId) supprimerSession(sessionId).catch(() => undefined);
    await demarrer();
  }, [sessionId, demarrer]);

  return { messages, suggestions, brief, enCours, envoyer, recommencer };
}
