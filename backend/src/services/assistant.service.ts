import type { ChatMessage, Lang } from "../types";

interface ProjectInfo { name?: string; kind?: string }

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

const systemPrompt = ({ name, kind }: ProjectInfo, lang: Lang) => `Tu es l'assistant de Givaudan, expert en création de goûts, saveurs et senteurs.
Tu aides un client à rédiger le brief de son projet « ${name} » (type : ${kind}).
Réponds en ${lang === "en" ? "anglais" : "français"}, à l'oral : 1 à 3 phrases courtes, sans markdown, sans listes.
Pose UNE seule question à la fois (public cible, ambiance, ingrédients, intensité, contraintes, budget...).
Quand tu as assez d'informations, résume le brief en quelques phrases et propose de passer aux échantillons.`;

const DEMO: Record<Lang, string[]> = {
  fr: [
    "Très belle direction. Pour qui ce produit est-il pensé : grand public, restauration, ou un marché plus premium ?",
    "Noté. Quelles notes ou quels ingrédients souhaitez-vous mettre en avant ?",
    "Parfait. Côté intensité, plutôt subtil et frais, ou franc et marqué ?",
    "Dernière question : avez-vous des contraintes, comme un produit naturel, sans sucre ajouté ou un budget à respecter ?",
  ],
  en: [
    "Great direction. Who is this product for: mass market, foodservice, or a more premium segment?",
    "Noted. Which notes or ingredients would you like to highlight?",
    "Perfect. As for intensity, subtle and fresh, or bold and pronounced?",
    "Last question: do you have any constraints, such as natural ingredients, no added sugar, or a budget?",
  ],
};

function demoReply(messages: ChatMessage[], { name = "", kind = "" }: ProjectInfo, lang: Lang): string {
  const userMsgs = messages.filter((m) => m.role === "user").map((m) => m.content);
  const n = userMsgs.length;
  if (n <= DEMO[lang].length) return DEMO[lang][Math.max(n - 1, 0)];
  const recap = userMsgs.map((t) => (t.length > 70 ? t.slice(0, 70) + "…" : t)).join(" ; ");
  return lang === "en"
    ? `Here is your brief for “${name}” (${kind}): ${recap}. I can prepare a first sample version from this. Would you like to add anything?`
    : `Voici votre brief pour « ${name} » (${kind}) : ${recap}. Je peux préparer une première version d'échantillon à partir de cela. Souhaitez-vous ajouter quelque chose ?`;
}

async function askClaude(messages: ChatMessage[], project: ProjectInfo, lang: Lang): Promise<string> {
  const firstUser = messages.findIndex((m) => m.role === "user");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY as string,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      system: systemPrompt(project, lang),
      messages: messages.slice(firstUser), // l'API exige de commencer par "user"
    }),
  });
  const data = (await r.json()) as { content?: { text?: string }[]; error?: { message?: string } };
  if (!r.ok) throw new Error(data?.error?.message || "Erreur API");
  return (data.content ?? []).map((b) => b.text ?? "").join("").trim();
}

/** Répond via Claude, ou en mode démo (pas de clé, DEMO=1, ou erreur API). */
export async function getReply(messages: ChatMessage[], project: ProjectInfo, lang: Lang) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.DEMO === "1") {
    return { reply: demoReply(messages, project, lang), demo: true };
  }
  try {
    return { reply: await askClaude(messages, project, lang), demo: false };
  } catch (e) {
    console.warn(`[demo] API Anthropic indisponible (${(e as Error).message}) → réponse de démonstration`);
    return { reply: demoReply(messages, project, lang), demo: true };
  }
}
