import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUp, AudioLines, Keyboard, Mic, MicOff, Square, Volume2, X } from "lucide-react";
import Mascotte from "../components/assistant/Mascotte";
import MessageContenu from "../components/assistant/MessageContenu";
import { useAssistant, type MessageChat } from "../hooks/useAssistant";
import { useVoix } from "../hooks/useVoix";

type Mode = "accueil" | "oral" | "ecrit";

const majuscule = (t: string) => (t ? t[0].toUpperCase() + t.slice(1) : t);

function Ingredients({ message }: { message: MessageChat }) {
  if (!message.ingredients || message.ingredients.length === 0) return null;
  return (
    <div className="discussion__ingredients">
      {message.ingredients.map((i) => (
        <span key={i.id} className="discussion__ingredient">{i.nom} · {i.id}</span>
      ))}
    </div>
  );
}

/** Page « Discussion audio » avec l'assistant (ouverte par « Besoin d'aide ? »). */
export default function AssistantPage() {
  const navigate = useNavigate();
  // /assistant?session=<id> reprend un projet ; /assistant?nouveau=1 en commence un nouveau.
  const [parametres] = useSearchParams();
  const { messages, suggestions, brief, enCours, envoyer } = useAssistant({
    sessionDemandee: parametres.get("session"),
    nouveau: parametres.has("nouveau"),
  });
  // Une fois le nouveau projet ouvert, on retire « ?nouveau » : recharger la page ne recommence pas tout.
  useEffect(() => {
    if (parametres.has("nouveau")) navigate("/assistant", { replace: true });
  }, [parametres, navigate]);
  // Un projet repris depuis « Mes projets » s'ouvre à l'écrit, pour relire l'historique.
  const [mode, setMode] = useState<Mode>(() => (parametres.get("session") ? "ecrit" : "accueil"));
  const [muet, setMuet] = useState(false);
  const [saisie, setSaisie] = useState("");
  const finRef = useRef<HTMLDivElement>(null);
  const dernierLu = useRef<number | null>(null);

  const {
    supporte, etat, transcription, erreur, ecouter, arreter, annuler, parler,
    options: voix, cleChoisie, choisirVoix,
  } = useVoix(envoyer);
  const groupes = [...new Set(voix.map((v) => v.groupe))];
  const [reglagesOuverts, setReglagesOuverts] = useState(false);
  const EXEMPLE_VOIX = "Bonjour, je suis l'assistant Givaudan. Parlez-moi de votre projet de parfum.";

  const dernierAssistant = [...messages].reverse().find((m) => m.role !== "user");
  const dernierClient = [...messages].reverse().find((m) => m.role === "user");
  const projet = majuscule(brief?.projet || brief?.produit || "") || "Nouveau projet";

  // En mode oral, chaque nouvelle réponse est lue à voix haute, puis l'assistant écoute à nouveau.
  const lireEtEcouter = useCallback((message: MessageChat) => {
    dernierLu.current = message.id;
    if (muet) return;
    parler(message.texte, () => ecouter());
  }, [muet, parler, ecouter]);

  useEffect(() => {
    if (mode !== "oral" || enCours || !dernierAssistant || dernierAssistant.role === "erreur") return;
    if (dernierLu.current !== dernierAssistant.id) lireEtEcouter(dernierAssistant);
  }, [mode, enCours, dernierAssistant, lireEtEcouter]);

  useEffect(() => {
    if (mode === "ecrit") finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mode, messages, enCours, suggestions]);

  function commencer() {
    if (!supporte) {
      setMode("ecrit");
      return;
    }
    setMode("oral");
    dernierLu.current = null; // relit le dernier message de l'assistant
  }

  function basculerMuet() {
    if (!muet) {
      annuler();
      setMuet(true);
    } else {
      setMuet(false);
      if (mode === "oral" && !enCours) ecouter();
    }
  }

  function passerAEcrit() {
    annuler();
    setMode("ecrit");
  }

  function passerAOral() {
    if (!supporte) return;
    setMode("oral");
    if (dernierAssistant) dernierLu.current = dernierAssistant.id;
    if (!muet && !enCours) ecouter();
  }

  function terminer() {
    annuler();
    navigate("/");
  }

  function envoyerSuggestion(texte: string) {
    annuler();
    envoyer(texte);
  }

  function soumettre(e?: FormEvent) {
    e?.preventDefault();
    if (!saisie.trim() || enCours) return;
    envoyer(saisie);
    setSaisie("");
  }

  // Bouton central en mode oral : parler / envoyer / interrompre.
  let boutonCentral = { texte: "Parler", action: ecouter, icone: <Mic size={20} />, desactive: muet };
  if (enCours) boutonCentral = { texte: "Réflexion…", action: () => undefined, icone: <AudioLines size={20} />, desactive: true };
  else if (etat === "ecoute") boutonCentral = { texte: "J'ai terminé", action: arreter, icone: <Square size={16} />, desactive: false };
  else if (etat === "parle") boutonCentral = { texte: "Interrompre et répondre", action: ecouter, icone: <Mic size={20} />, desactive: false };

  const statut = enCours ? "réfléchit" : etat === "ecoute" ? "vous écoute" : etat === "parle" ? "parle" : "";

  return (
    <div className="discussion">
      <header className="discussion__barre">
        <button className="discussion__fermer" onClick={terminer} aria-label="Fermer la discussion">
          <X size={22} />
        </button>
        <div className="discussion__fil">
          <span className="discussion__projet">{projet}</span>
          <span className="discussion__titre">{mode === "ecrit" ? "Discussion écrite" : "Discussion audio"}</span>
        </div>
        <div className="discussion__droite">
          {voix.length > 0 && (
            <div className="discussion__reglages">
              <button
                className="discussion__voix"
                onClick={() => setReglagesOuverts((o) => !o)}
                aria-expanded={reglagesOuverts}
              >
                <Volume2 size={18} />
                Voix
              </button>
              {reglagesOuverts && (
                <div className="discussion__popover" role="dialog" aria-label="Choisir la voix">
                  <label htmlFor="choix-voix">Voix de l’assistant</label>
                  <select
                    id="choix-voix"
                    value={cleChoisie ?? ""}
                    onChange={(e) => {
                      choisirVoix(e.target.value);
                      annuler();
                    }}
                  >
                    {groupes.map((g) => (
                      <optgroup key={g} label={g}>
                        {voix.filter((v) => v.groupe === g).map((v) => (
                          <option key={v.cle} value={v.cle}>{v.nom}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <button className="discussion__ecouter" onClick={() => parler(EXEMPLE_VOIX)}>
                    <Volume2 size={16} />
                    Écouter un exemple
                  </button>
                  <p>
                    Les voix Piper sont générées sur votre ordinateur, sans Internet.
                    {!voix.some((v) => v.nom.includes("naturelle")) &&
                      " Dans Microsoft Edge, des voix « naturelles » encore plus humaines sont aussi proposées."}
                  </p>
                </div>
              )}
            </div>
          )}
          <button className="discussion__terminer" onClick={terminer}>Terminer</button>
        </div>
      </header>

      <main className={`discussion__centre discussion__centre--${mode}`}>
        <div className={`discussion__avatar discussion__avatar--${enCours ? "reflechit" : etat}`}>
          <Mascotte parle={etat === "parle"} />
        </div>
        <p className="discussion__etiquette">
          Assistant Givaudan{statut && <span> · {statut}</span>}
        </p>

        {mode === "accueil" && (
          <>
            <h1 className="discussion__accroche">Décrivez-moi ce que vous imaginez, avec vos propres mots.</h1>
            <p className="discussion__sous-titre">Je vous poserai quelques questions pour préciser votre idée.</p>
            {!supporte && (
              <p className="discussion__alerte">
                La discussion à la voix n'est pas disponible dans ce navigateur (utilisez Chrome ou Edge) :
                la conversation se fera à l'écrit.
              </p>
            )}
          </>
        )}

        {mode === "oral" && (
          <section className="discussion__oral" aria-live="polite">
            {dernierClient && <p className="discussion__client">« {dernierClient.texte} »</p>}
            {dernierAssistant && !enCours && (
              <div className={`discussion__reponse ${dernierAssistant.role === "erreur" ? "discussion__reponse--erreur" : ""}`}>
                <MessageContenu texte={dernierAssistant.texte} recapitulatif={dernierAssistant.recapitulatif} />
                <Ingredients message={dernierAssistant} />
              </div>
            )}
            {transcription && <p className="discussion__transcription">{transcription}…</p>}
            {erreur && <p className="discussion__alerte">{erreur}</p>}
            {muet && <p className="discussion__alerte">Micro et voix coupés : cliquez sur « Réactiver » pour reprendre.</p>}
          </section>
        )}

        {mode === "ecrit" && (
          <section className="discussion__historique" aria-live="polite">
            {messages.map((m) => (
              <div key={m.id} className={`bulle-ecrit bulle-ecrit--${m.role}`}>
                <MessageContenu texte={m.texte} recapitulatif={m.recapitulatif} />
                <Ingredients message={m} />
              </div>
            ))}
            {enCours && (
              <div className="bulle-ecrit bulle-ecrit--assistant bulle-ecrit--attente">
                <span /><span /><span />
              </div>
            )}
            <div ref={finRef} />
          </section>
        )}

        {mode !== "accueil" && !enCours && suggestions.length > 0 && (
          <div className="discussion__suggestions">
            {suggestions.map((s) => (
              <button key={s} className="discussion__suggestion" onClick={() => envoyerSuggestion(s)}>{s}</button>
            ))}
          </div>
        )}
      </main>

      <footer className="discussion__commandes">
        {mode === "ecrit" ? (
          <form className="discussion__saisie" onSubmit={soumettre}>
            <input
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
              placeholder="Écrivez votre message…"
              aria-label="Votre message"
              autoFocus
            />
            <button className="discussion__envoyer" disabled={enCours || !saisie.trim()} aria-label="Envoyer">
              <ArrowUp size={20} />
            </button>
            {supporte && (
              <button type="button" className="discussion__rond" onClick={passerAOral} aria-label="Passer à l'oral" title="Passer à l'oral">
                <Mic size={20} />
              </button>
            )}
          </form>
        ) : (
          <div className="discussion__boutons">
            <div className="discussion__option">
              <button className="discussion__rond" onClick={basculerMuet} aria-pressed={muet} aria-label={muet ? "Réactiver" : "Couper"}>
                {muet ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <span>{muet ? "Réactiver" : "Couper"}</span>
            </div>

            {mode === "accueil" ? (
              <button className="discussion__principal" onClick={commencer}>
                <Mic size={20} />
                Commencer la discussion
              </button>
            ) : (
              <button
                className={`discussion__principal ${etat === "ecoute" ? "discussion__principal--ecoute" : ""}`}
                onClick={boutonCentral.action}
                disabled={boutonCentral.desactive}
              >
                {boutonCentral.icone}
                {boutonCentral.texte}
              </button>
            )}

            <div className="discussion__option">
              <button className="discussion__rond" onClick={passerAEcrit} aria-label="Passer à l'écrit">
                <Keyboard size={20} />
              </button>
              <span>Passer à l’écrit</span>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
