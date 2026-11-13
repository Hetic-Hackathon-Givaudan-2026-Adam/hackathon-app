import { useCallback, useEffect, useRef, useState } from "react";
import { listerVoixLocales, syntheseVocale } from "../services/assistantApi";

// Voix de l'assistant :
// - écouter le client : reconnaissance vocale du navigateur (Chrome, Edge) ;
// - lire les réponses : voix locale Piper (servie par l'API, plus humaine, sans Internet)
//   ou voix du navigateur (« naturelles » dans Edge, Google, Windows).

interface Resultat { isFinal: boolean; 0: { transcript: string } }
interface EvenementResultat { resultIndex: number; results: { length: number; [i: number]: Resultat } }
interface Reconnaissance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: EvenementResultat) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type ConstructeurReconnaissance = new () => Reconnaissance;

export type EtatVoix = "inactif" | "ecoute" | "parle";

/** Une voix proposée dans le menu « Voix ». La clé est « piper:<id> » ou « web:<nom> ». */
export interface OptionVoix {
  cle: string;
  nom: string;
  groupe: "Voix locales (Piper)" | "Voix du navigateur";
}

function constructeur(): ConstructeurReconnaissance | null {
  const w = window as unknown as { SpeechRecognition?: ConstructeurReconnaissance; webkitSpeechRecognition?: ConstructeurReconnaissance };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Texte lisible à l'oral : sans identifiants (FR026), symboles ni listes. */
function pourLaVoix(texte: string) {
  return texte
    .replace(/\s*[—-]\s*FR\d{3}/g, "")
    .replace(/\(FR\d{3}\)/g, "")
    .replace(/™/g, "")
    .replace(/^- /gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Découpe en morceaux de quelques phrases : la voix Piper commence à parler sans attendre la fin. */
function morceaux(texte: string) {
  const phrases = pourLaVoix(texte).match(/[^.!?…:]+[.!?…:]*\s*/g) ?? [texte];
  const resultat: string[] = [];
  let courant = "";
  for (const p of phrases) {
    if (courant && (courant + p).length > 220) {
      resultat.push(courant.trim());
      courant = "";
    }
    courant += p;
  }
  if (courant.trim()) resultat.push(courant.trim());
  return resultat;
}

// ---------- Voix du navigateur ----------

/** Les voix « Natural » / « Neural » (Edge) sont les plus humaines, puis les voix en ligne, puis Windows. */
function noteVoix(v: SpeechSynthesisVoice) {
  const nom = v.name.toLowerCase();
  let note = 0;
  if (/natural|neural/.test(nom)) note += 4;
  else if (/online/.test(nom)) note += 3;
  else if (/google/.test(nom)) note += 2;
  if (v.lang.toLowerCase() === "fr-fr") note += 0.5;
  return note;
}

function voixNavigateur(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith("fr"))
    .sort((a, b) => noteVoix(b) - noteVoix(a) || a.name.localeCompare(b.name));
}

/** « Microsoft Denise Online (Natural) - French (France) » -> « Denise · naturelle (FR) ». */
function nomVoixNavigateur(v: SpeechSynthesisVoice) {
  const naturelle = /natural|neural/i.test(v.name) ? " · naturelle" : "";
  const court = v.name.replace(/^(Microsoft|Google)\s*/i, "").replace(/\s*Online/i, "")
    .replace(/\s*\((Natural|Neural)\)/i, "").replace(/\s*-\s*French.*$/i, "").trim();
  const pays = v.lang.split("-")[1] ?? "";
  return `${court || v.name}${naturelle}${pays ? ` (${pays})` : ""}`;
}

// ---------- Mémorisation du choix ----------

const CLE_VOIX = "givaudan-voix";

function lireVoixMemorisee() {
  try {
    return localStorage.getItem(CLE_VOIX);
  } catch {
    return null;
  }
}

function memoriserVoix(cle: string) {
  try {
    localStorage.setItem(CLE_VOIX, cle);
  } catch {
    /* stockage indisponible : le choix vaut pour cette visite */
  }
}

export function useVoix(onPhrase: (texte: string) => void) {
  const Reco = constructeur();
  const supporte = Reco !== null;
  const [etat, setEtat] = useState<EtatVoix>("inactif");
  const [transcription, setTranscription] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const recoRef = useRef<Reconnaissance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abandonRef = useRef<AbortController | null>(null);
  const jetonRef = useRef(0); // ignore la fin d'une lecture interrompue
  const onPhraseRef = useRef(onPhrase);
  onPhraseRef.current = onPhrase;

  // Voix disponibles : Piper (si l'API en propose) puis celles du navigateur.
  const [voixWeb, setVoixWeb] = useState<SpeechSynthesisVoice[]>(() => voixNavigateur());
  const [voixPiper, setVoixPiper] = useState<{ id: string; nom: string }[]>([]);
  const [cleChoisie, setCleChoisie] = useState<string | null>(() => lireVoixMemorisee());

  useEffect(() => {
    listerVoixLocales()
      .then((r) => setVoixPiper(r.disponible ? r.voix : []))
      .catch(() => setVoixPiper([]));
    if (!("speechSynthesis" in window)) return;
    const maj = () => setVoixWeb(voixNavigateur());
    maj();
    window.speechSynthesis.addEventListener("voiceschanged", maj);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", maj);
  }, []);

  const options: OptionVoix[] = [
    ...voixPiper.map((v) => ({ cle: `piper:${v.id}`, nom: v.nom, groupe: "Voix locales (Piper)" as const })),
    ...voixWeb.map((v) => ({ cle: `web:${v.name}`, nom: nomVoixNavigateur(v), groupe: "Voix du navigateur" as const })),
  ];
  // Voix utilisée : celle choisie, sinon une voix naturelle d'Edge, sinon Piper, sinon la meilleure du navigateur.
  const naturelle = voixWeb.find((v) => /natural|neural/i.test(v.name));
  const parDefaut = naturelle ? `web:${naturelle.name}` : options[0]?.cle ?? null;
  const cle = options.some((o) => o.cle === cleChoisie) ? cleChoisie : parDefaut;

  const annuler = useCallback(() => {
    jetonRef.current++;
    if (recoRef.current) {
      recoRef.current.onend = null;
      recoRef.current.abort();
      recoRef.current = null;
    }
    abandonRef.current?.abort();
    abandonRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setTranscription("");
    setEtat("inactif");
  }, []);

  const ecouter = useCallback(() => {
    if (!Reco) return;
    annuler();
    setErreur(null);
    const reco = new Reco();
    reco.lang = "fr-FR";
    reco.interimResults = true;
    reco.continuous = false;
    let final = "";
    reco.onresult = (e) => {
      let provisoire = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript;
        else provisoire += r[0].transcript;
      }
      setTranscription((final + " " + provisoire).trim());
    };
    reco.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setErreur("Le micro n'est pas autorisé. Autorisez-le dans le navigateur ou passez à l'écrit.");
      } else if (e.error !== "no-speech" && e.error !== "aborted") {
        setErreur("Je n'ai pas réussi à vous entendre. Réessayez ou passez à l'écrit.");
      }
    };
    reco.onend = () => {
      recoRef.current = null;
      setEtat("inactif");
      setTranscription("");
      const texte = final.trim();
      if (texte) onPhraseRef.current(texte);
    };
    recoRef.current = reco;
    setTranscription("");
    setEtat("ecoute");
    reco.start();
  }, [Reco, annuler]);

  /** Fin de la prise de parole : la phrase entendue est envoyée. */
  const arreter = useCallback(() => recoRef.current?.stop(), []);

  /** Lecture avec la voix du navigateur. */
  const parlerNavigateur = useCallback((texte: string, nom: string | null, jeton: number, apres?: () => void) => {
    if (!("speechSynthesis" in window)) return apres?.();
    const v = voixWeb.find((x) => x.name === nom) ?? voixWeb[0];
    const phrase = new SpeechSynthesisUtterance(pourLaVoix(texte));
    phrase.lang = v?.lang ?? "fr-FR";
    if (v) phrase.voice = v;
    phrase.rate = v && /natural|neural/i.test(v.name) ? 1 : 1.05;
    phrase.onend = () => {
      if (jeton !== jetonRef.current) return;
      setEtat("inactif");
      apres?.();
    };
    phrase.onerror = () => {
      if (jeton === jetonRef.current) setEtat("inactif");
    };
    setEtat("parle");
    window.speechSynthesis.speak(phrase);
  }, [voixWeb]);

  /** Lecture avec une voix Piper : morceau par morceau, le suivant est préparé pendant la lecture. */
  const parlerPiper = useCallback(async (texte: string, id: string, jeton: number, apres?: () => void) => {
    const parties = morceaux(texte);
    const abandon = new AbortController();
    abandonRef.current = abandon;
    const preparer = (i: number) => (i < parties.length ? syntheseVocale(parties[i], id, abandon.signal) : null);
    try {
      let prochain = preparer(0);
      for (let i = 0; i < parties.length && prochain; i++) {
        const son = await prochain;
        if (jeton !== jetonRef.current) return;
        prochain = preparer(i + 1);
        const url = URL.createObjectURL(son);
        const audio = new Audio(url);
        audioRef.current = audio;
        setEtat("parle");
        await new Promise<void>((fin, echec) => {
          audio.onended = () => fin();
          audio.onerror = () => echec(new Error("lecture impossible"));
          audio.play().catch(echec);
        });
        URL.revokeObjectURL(url);
        if (jeton !== jetonRef.current) return;
      }
      audioRef.current = null;
      setEtat("inactif");
      apres?.();
    } catch {
      if (jeton !== jetonRef.current) return;
      // Piper indisponible (API arrêtée...) : on bascule sur la voix du navigateur.
      parlerNavigateur(texte, null, jeton, apres);
    }
  }, [parlerNavigateur]);

  const parler = useCallback((texte: string, apres?: () => void) => {
    annuler();
    const jeton = jetonRef.current;
    if (cle?.startsWith("piper:")) parlerPiper(texte, cle.slice(6), jeton, apres);
    else parlerNavigateur(texte, cle?.startsWith("web:") ? cle.slice(4) : null, jeton, apres);
  }, [annuler, cle, parlerPiper, parlerNavigateur]);

  const choisirVoix = useCallback((nouvelle: string) => {
    setCleChoisie(nouvelle);
    memoriserVoix(nouvelle);
  }, []);

  // On coupe tout en quittant la page.
  useEffect(() => annuler, [annuler]);

  return {
    supporte, etat, transcription, erreur, ecouter, arreter, annuler, parler,
    options, cleChoisie: cle, choisirVoix,
  };
}
