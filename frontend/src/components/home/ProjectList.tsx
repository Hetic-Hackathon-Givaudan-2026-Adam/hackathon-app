import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Badge from "../ui/Badge";
import { PROJECTS } from "../../data/mock";
import type { ViewState } from "../../types";

export default function ProjectList({ state }: { state: ViewState }) {
  if (state === "loading") {
    return (
      <div className="card">
        {[0, 1, 2].map((i) => (
          <div key={i} className="row row--skeleton">
            <div className="skeleton skeleton--icon" />
            <div className="skeleton-lines">
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line skeleton--short" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div className="card card--message">
        <p>Vous n’avez pas encore de projet.</p>
        <button className="btn btn--primary">Créer un projet</button>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="card card--message">
        <p>Impossible de charger vos projets. Vérifiez votre connexion puis réessayez.</p>
        <button className="btn btn--secondary">Réessayer</button>
      </div>
    );
  }

  return (
    <div className="card">
      {PROJECTS.map(({ id, title, category, modified, status, tone, icon: Icon }) => (
        <Link key={id} to={`/projets#${id}`} className="row">
          <span className="row__icon">
            <Icon size={20} strokeWidth={1.6} />
          </span>
          <span className="row__text">
            <strong>{title}</strong>
            <small>{category} · {modified}</small>
          </span>
          <Badge tone={tone}>{status}</Badge>
          <ChevronRight size={18} />
        </Link>
      ))}
    </div>
  );
}
