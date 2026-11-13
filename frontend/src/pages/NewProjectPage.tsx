import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Droplet, Keyboard, Leaf, Mic, Wind, type LucideIcon } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import type { ProjectKind } from "../types";

const KINDS: { key: ProjectKind; icon: LucideIcon }[] = [
  { key: "Goût", icon: Droplet },
  { key: "Saveur", icon: Leaf },
  { key: "Senteur", icon: Wind },
];

export default function NewProjectPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<ProjectKind>("Goût");

  const start = (mode: "voix" | "texte") => {
    const q = new URLSearchParams({ mode, name: name.trim(), type: kind });
    navigate(`/projets/nouveau/assistant?${q.toString()}`);
  };

  return (
    <div className="narrow">
      <PageHeader
        eyebrow="NOUVEAU PROJET"
        title="Créer un nouveau projet"
        subtitle="Donnez-lui un nom, puis choisissez comment commencer."
      />

      <div className="card form-card">
        <label className="field">
          <span>Nom du projet</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Limonade gingembre-yuzu" />
        </label>

        <div className="field">
          <span>Que souhaitez-vous créer ?</span>
          <div className="choice-grid">
            {KINDS.map(({ key, icon: Icon }) => (
              <button
                key={key}
                type="button"
                className={`choice ${kind === key ? "choice--active" : ""}`}
                onClick={() => setKind(key)}
              >
                <Icon size={18} strokeWidth={1.6} />
                {key}
                {kind === key && <Check size={16} className="choice__check" />}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <span>Comment souhaitez-vous échanger ?</span>
          <button className="mode mode--recommended" disabled={!name.trim()} onClick={() => start("voix")}>
            <span className="mode__badge">RECOMMANDÉ</span>
            <span className="row__icon"><Mic size={20} strokeWidth={1.6} /></span>
            <span className="row__text">
              <strong>Parler à l’assistant</strong>
              <small>Expliquez votre idée naturellement, comme lors d’une conversation.</small>
            </span>
            <ArrowRight size={18} />
          </button>
          <button className="mode" disabled={!name.trim()} onClick={() => start("texte")}>
            <span className="row__icon"><Keyboard size={20} strokeWidth={1.6} /></span>
            <span className="row__text">
              <strong>Écrire à l’assistant</strong>
              <small>Décrivez votre besoin par messages, à votre rythme.</small>
            </span>
            <ArrowRight size={18} />
          </button>
          {!name.trim() && <small>Saisissez un nom de projet pour continuer.</small>}
        </div>
      </div>
    </div>
  );
}
