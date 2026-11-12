import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { USER } from "../../data/mock";
import type { Lang } from "../../types";

interface Props {
  lang: Lang;
  onLang: (lang: Lang) => void;
}

export default function Topbar({ lang, onLang }: Props) {
  return (
    <header className="topbar">
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
    </header>
  );
}
