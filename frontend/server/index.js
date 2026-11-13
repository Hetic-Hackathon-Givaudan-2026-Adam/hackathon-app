// Petit serveur proxy : garde la clé API côté serveur (jamais dans le navigateur).
// Lancer : npm run server   (Node 20.6+ ; réglages dans le fichier .env)
//
// MODE DÉMO : si la clé est absente, si DEMO=1, ou si l'API Anthropic échoue
// (ex. crédits épuisés), l'assistant répond avec une conversation scénarisée.
import http from "node:http";

const PORT = process.env.PORT || 3001;
const KEY = process.env.ANTHROPIC_API_KEY;
const FORCE_DEMO = process.env.DEMO === "1";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

const systemPrompt = ({ name, kind }, lang) => `Tu es l'assistant de Givaudan, expert en création de goûts, saveurs et senteurs.
Tu aides un client à rédiger le brief de son projet « ${name} » (type : ${kind}).
Réponds en ${lang === "en" ? "anglais" : "français"}, à l'oral : 1 à 3 phrases courtes, sans markdown, sans listes.
Pose UNE seule question à la fois (public cible, ambiance, ingrédients, intensité, contraintes, budget...).
Quand tu as assez d'informations, résume le brief en quelques phrases et propose de passer aux échantillons.`;

// ---------- Mode démo ----------
const DEMO = {
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

function demoReply(messages, { name = "", kind = "" }, lang) {
  const l = lang === "en" ? "en" : "fr";
  const userMsgs = messages.filter((m) => m.role === "user").map((m) => m.content);
  const n = userMsgs.length;
  if (n <= DEMO[l].length) return DEMO[l][Math.max(n - 1, 0)];
  const recap = userMsgs.map((t) => (t.length > 70 ? t.slice(0, 70) + "…" : t)).join(" ; ");
  return l === "en"
    ? `Here is your brief for “${name}” (${kind}): ${recap}. I can prepare a first sample version from this. Would you like to add anything?`
    : `Voici votre brief pour « ${name} » (${kind}) : ${recap}. Je peux préparer une première version d'échantillon à partir de cela. Souhaitez-vous ajouter quelque chose ?`;
}

// ---------- HTTP ----------
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try { resolve(JSON.parse(data || "{}")); } catch (e) { reject(e); }
    });
  });
}

const send = (res, code, obj) => {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
};

async function askClaude(messages, project, lang) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      system: systemPrompt(project, lang),
      // L'API exige que la conversation commence par un message "user"
      messages: messages.slice(messages.findIndex((m) => m.role === "user")),
    }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message || "Erreur API");
  return data.content?.map((b) => b.text || "").join("").trim();
}

http
  .createServer(async (req, res) => {
    if (req.method !== "POST" || req.url !== "/api/assistant") return send(res, 404, { error: "Not found" });
    try {
      const { messages = [], project = {}, lang = "fr" } = await readBody(req);

      if (!KEY || FORCE_DEMO) return send(res, 200, { reply: demoReply(messages, project, lang), demo: true });

      try {
        return send(res, 200, { reply: await askClaude(messages, project, lang) });
      } catch (e) {
        console.warn(`[demo] API Anthropic indisponible (${e.message}) → réponse de démonstration`);
        return send(res, 200, { reply: demoReply(messages, project, lang), demo: true });
      }
    } catch (e) {
      send(res, 500, { error: String(e.message || e) });
    }
  })
  .listen(PORT, () => {
    console.log(`Assistant API sur http://localhost:${PORT}`);
    console.log(!KEY || FORCE_DEMO ? "Mode : DÉMO (réponses scénarisées)" : `Mode : Claude (${MODEL}), repli démo si erreur`);
  });
