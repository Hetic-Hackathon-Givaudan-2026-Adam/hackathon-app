import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Droplet, Plus } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import { listerProjets, type ProjetResume } from "../services/assistantApi";
import type { Tone, ViewState } from "../types";

// Étape de la conversation (API) -> statut affiché.
const STATUTS: Record<ProjetResume["etape"], { texte: string; tone: Tone }> = {
  decouverte: { texte: "En discussion", tone: "warning" },
  propositions: { texte: "Propositions reçues", tone: "warning" },
  recapitulatif: { texte: "À confirmer", tone: "warning" },
  terminee: { texte: "Demande envoyée", tone: "success" },
};

function dateModifiee(iso: string) {
  const date = new Date(iso);
  const aujourdhui = new Date();
  if (date.toDateString() === aujourdhui.toDateString()) {
    return `Modifié aujourd’hui à ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return `Modifié le ${date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`;
}

function sousTitre(p: ProjetResume) {
  return [p.entreprise, p.produit && p.produit !== p.titre.toLowerCase() ? p.produit : "", dateModifiee(p.modifie_le)]
    .filter(Boolean)
    .join(" · ");
}

export default function ProjectsPage() {
  const [etat, setEtat] = useState<ViewState>("loading");
  const [projets, setProjets] = useState<ProjetResume[]>([]);

  const charger = useCallback(() => {
    setEtat("loading");
    listerProjets()
      .then((liste) => {
        setProjets(liste);
        setEtat(liste.length ? "list" : "empty");
      })
      .catch(() => setEtat("error"));
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  return (
    <>
      <PageHeader
        title="Mes projets"
        subtitle="Tous vos projets, du brief à la validation."
        action={
          <Link to="/assistant?nouveau=1" className="btn btn--primary">
            <Plus size={18} />
            Nouveau projet
          </Link>
        }
      />

      {etat === "loading" && (
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
      )}

      {etat === "empty" && (
        <div className="card card--message">
          <p>Vous n’avez pas encore de projet. Décrivez votre idée à l’assistant pour commencer.</p>
          <Link to="/assistant?nouveau=1" className="btn btn--primary">Créer un projet</Link>
        </div>
      )}

      {etat === "error" && (
        <div className="card card--message">
          <p>Impossible de charger vos projets. Vérifiez que l’API est lancée, puis réessayez.</p>
          <button className="btn btn--secondary" onClick={charger}>Réessayer</button>
        </div>
      )}

      {etat === "list" && (
        <div className="card page-list">
          {projets.map((p) => {
            const statut = STATUTS[p.etape] ?? STATUTS.decouverte;
            return (
              <Link key={p.session_id} to={`/assistant?session=${p.session_id}`} className="row">
                <span className="row__icon">
                  <Droplet size={20} strokeWidth={1.6} />
                </span>
                <span className="row__text">
                  <strong>{p.titre}</strong>
                  <small>{sousTitre(p)}</small>
                </span>
                <Badge tone={statut.tone}>{statut.texte}</Badge>
                <ChevronRight size={18} />
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
