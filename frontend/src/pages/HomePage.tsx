import { useState } from "react";
import { Link } from "react-router-dom";
import { FlaskConical, Package, Plus } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import ProjectList from "../components/home/ProjectList";
import SummaryCard from "../components/home/SummaryCard";
import { ORDERS, SAMPLES, STEP_LABELS, USER } from "../data/mock";
import type { ViewState } from "../types";

const VIEW_STATES: { key: ViewState; label: string }[] = [
  { key: "list", label: "Listée" },
  { key: "empty", label: "Vide" },
  { key: "loading", label: "Chargement" },
  { key: "error", label: "Erreur" },
];

export default function HomePage() {
  const [view, setView] = useState<ViewState>("list");
  const sample = SAMPLES[1];
  const order = ORDERS[0];

  return (
    <>
      <PageHeader
        eyebrow="MAISON LENOIR"
        title={`Bonjour, ${USER.firstName}`}
        subtitle="Retrouvez vos projets et les prochaines étapes en un coup d’œil."
        action={
          <Link to="/projets/nouveau" className="btn btn--primary">
            <Plus size={18} />
            Nouveau projet
          </Link>
        }
      />

      <div className="section-head">
        <h2>Projets récents</h2>
        {/* Sélecteur d'état : utile pendant le développement */}
        <div className="segmented" role="tablist">
          {VIEW_STATES.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={view === key}
              className={`segmented__btn ${view === key ? "segmented__btn--active" : ""}`}
              onClick={() => setView(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ProjectList state={view} />

      <div className="summaries">
        <SummaryCard
          icon={FlaskConical}
          title="Échantillons en cours"
          to="/echantillons"
          name={`${sample.project} — V${sample.version}`}
          detail={`Commandé le ${sample.orderedOn}`}
          status={STEP_LABELS[sample.step - 1]}
          tone="warning"
        />
        <SummaryCard
          icon={Package}
          title="Dernière commande"
          to="/commandes"
          name={order.reference}
          detail={`${order.project} · ${order.date}`}
          status={order.status}
          tone={order.tone}
        />
      </div>
    </>
  );
}
