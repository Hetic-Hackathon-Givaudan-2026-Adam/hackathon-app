import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { USER } from "../../data/mock";
import type { Lang } from "../../types";

const LABELS: Record<string, string> = {
  projets: "Mes projets",
  echantillons: "Échantillons",
  commandes: "Commandes",
  profil: "Profil",
};

interface Props {
  lang: Lang;
  onLang: (lang: Lang) => void;
}

export default function Topbar({ lang, onLang }: Props) {
  const { pathname } = useLocation();
  const section = pathname.split("/")[1];

  return (
    <header className="topbar">
      <nav className="breadcrumb" aria-label="Fil d’Ariane">
        {section && LABELS[section] && (
          <>
            <Link to="/">Accueil</Link>
            <span>/</span>
            <span>{LABELS[section]}</span>
          </>
        )}
      </nav>
      <div className="topbar__right">
        <div className="lang">
          {(["fr", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              className={`lang__btn ${lang === l ? "lang__btn--active" : ""}`}
              onClick={() => onLang(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <Link to="/profil" className="user">
          <span className="avatar">{USER.initials}</span>
          {USER.fullName}
          <ChevronRight size={16} />
        </Link>
      </div>
    </header>
  );
}
