import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import { Mic, Send, Square } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import type { ChatMessage, LayoutCtx } from "../types";

type Mode = "voix" | "texte";
type Status = "idle" | "listening" | "thinking" | "speaking";

// Web Speech API : fonctionne surtout sur Chrome / Edge / Safari
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const STATUS_TEXT: Record<Status, string> = {
  idle: "Appuyez sur le micro pour parler",
  listening: "Je vous écoute…",
  thinking: "L’assistant réfléchit…",
  speaking: "L’assistant répond…",
};

export default function AssistantPage() {
  const { lang } = useOutletContext<LayoutCtx>();
  const [params] = useSearchParams();
  const name = params.get("name") || "Nouveau projet";
  const kind = params.get("type") || "Goût";
  const speechLang = lang === "fr" ? "fr-FR" : "en-US";

  const greeting: ChatMessage = {
    role: "assistant",
    content:
      lang === "fr"
        ? `Bonjour ! Parlons de votre projet « ${name} ». Quelle ambiance ou quel profil imaginez-vous ?`
        : `Hello! Let’s talk about your project “${name}”. What mood or profile do you have in mind?`,
  };

  const [mode, setMode] = useState<Mode>(params.get("mode") === "texte" || !SR ? "texte" : "voix");
  const [messages, setMessages] = useState<ChatMessage[]>([greeting]);
  const [status, setStatus] = useState<Status>("idle");
  const [interim, setInterim] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  // Refs pour que les callbacks de la reconnaissance vocale lisent toujours les valeurs à jour
  const messagesRef = useRef(messages);
  const modeRef = useRef(mode);
  const handsFree = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recogRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);
  messagesRef.current = messages;
  modeRef.current = mode;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, interim, status]);

  useEffect(() => () => stopAll(), []);

  function stopAll() {
    handsFree.current = false;
    recogRef.current?.abort?.();
    window.speechSynthesis?.cancel();
    setStatus("idle");
    setInterim("");
  }

  function speak(text: string, done?: () => void) {
    if (!("speechSynthesis" in window)) return done?.();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = speechLang;
    u.onstart = () => setStatus("speaking");
    const end = () => {
      setStatus("idle");
      done?.();
    };
    u.onend = end;
    u.onerror = end;
    window.speechSynthesis.speak(u);
  }

  function listen() {
    if (!SR) return;
    window.speechSynthesis?.cancel();
    recogRef.current?.abort?.();
    const r = new SR();
    r.lang = speechLang;
    r.interimResults = true;
    r.continuous = false;
    let finalText = "";
    r.onstart = () => {
      setStatus("listening");
      setInterim("");
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      let t = "";
      for (const res of e.results) t += res[0].transcript;
      setInterim(t);
      if (e.results[e.results.length - 1].isFinal) finalText = t;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onerror = (e: any) => {
      if (e.error === "not-allowed") setError("Autorisez l’accès au micro dans votre navigateur.");
      if (e.error !== "no-speech" && e.error !== "aborted") handsFree.current = false;
    };
    r.onend = () => {
      setInterim("");
      if (finalText.trim()) send(finalText.trim());
      else if (handsFree.current && modeRef.current === "voix") listen();
      else setStatus("idle");
    };
    recogRef.current = r;
    r.start();
  }

  async function send(text: string) {
    const next: ChatMessage[] = [...messagesRef.current, { role: "user", content: text }];
    setMessages(next);
    setStatus("thinking");
    setError("");
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, project: { name, kind }, lang }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const { reply } = (await res.json()) as { reply: string };
      setMessages([...next, { role: "assistant", content: reply }]);
      if (modeRef.current === "voix") speak(reply, () => handsFree.current && listen());
      else setStatus("idle");
    } catch {
      setError("L’assistant est indisponible. Vérifiez que le serveur est lancé (npm run server).");
      handsFree.current = false;
      setStatus("idle");
    }
  }

  function toggleMic() {
    if (status !== "idle") return stopAll();
    handsFree.current = true;
    listen();
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const t = input.trim();
    if (!t || status === "thinking") return;
    setInput("");
    send(t);
  }

  function changeMode(m: Mode) {
    stopAll();
    setMode(m);
  }

  return (
    <div className="narrow narrow--wide">
      <PageHeader
        eyebrow={`ASSISTANT · ${kind.toUpperCase()}`}
        title={name}
        subtitle="Décrivez votre idée : l’assistant prépare votre brief avec vous."
        action={
          <div className="segmented">
            <button className={`segmented__btn ${mode === "voix" ? "segmented__btn--active" : ""}`} disabled={!SR} onClick={() => changeMode("voix")}>Voix</button>
            <button className={`segmented__btn ${mode === "texte" ? "segmented__btn--active" : ""}`} onClick={() => changeMode("texte")}>Écrit</button>
          </div>
        }
      />

      <div className="card assistant">
        <div className="chat" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`bubble bubble--${m.role}`}>{m.content}</div>
          ))}
          {interim && <div className="bubble bubble--user bubble--interim">{interim}</div>}
          {status === "thinking" && <div className="bubble bubble--assistant bubble--interim">…</div>}
          <div ref={endRef} />
        </div>

        {error && <p className="assistant__error" role="alert">{error}</p>}

        {mode === "voix" ? (
          <div className="voice">
            <button
              className={`mic ${status === "listening" ? "mic--listening" : ""}`}
              onClick={toggleMic}
              aria-label={status === "idle" ? "Démarrer la conversation vocale" : "Arrêter"}
            >
              {status === "idle" ? <Mic size={28} /> : <Square size={22} />}
            </button>
            <p>{STATUS_TEXT[status]}</p>
            {!SR && <small>La reconnaissance vocale n’est pas disponible sur ce navigateur. Utilisez Chrome ou Edge.</small>}
          </div>
        ) : (
          <form className="composer" onSubmit={submit}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Décrivez votre besoin…" />
            <button className="btn btn--primary" disabled={!input.trim() || status === "thinking"}>
              <Send size={16} /> Envoyer
            </button>
          </form>
        )}
      </div>

      <div className="assistant__footer">
        <Link to="/projets" className="btn btn--secondary" onClick={stopAll}>Terminer</Link>
      </div>
    </div>
  );
}
