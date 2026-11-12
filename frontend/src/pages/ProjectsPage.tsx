import { Plus } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import { PROJECTS } from "../data/mock";

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="Mes projets"
        subtitle="Tous vos projets, du brief à la validation."
        action={
          <button className="btn btn--primary">
            <Plus size={18} />
            Nouveau projet
          </button>
        }
      />

      <div className="card page-list">
        {PROJECTS.map(({ id, title, category, modified, status, tone, icon: Icon }) => (
          <div key={id} id={id} className="row">
            <span className="row__icon">
              <Icon size={20} strokeWidth={1.6} />
            </span>
            <span className="row__text">
              <strong>{title}</strong>
              <small>{category} · {modified}</small>
            </span>
            <Badge tone={tone}>{status}</Badge>
          </div>
        ))}
      </div>
    </>
  );
}
