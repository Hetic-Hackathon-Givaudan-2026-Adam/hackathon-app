import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import ProjectList from "../components/home/ProjectList";

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="PROJETS"
        title="Mes projets"
        subtitle="Tous vos projets, du brief à la validation."
        action={
          <Link to="/projets/nouveau" className="btn btn--primary">
            <Plus size={18} />
            Nouveau projet
          </Link>
        }
      />
      <ProjectList state="list" />
    </>
  );
}
