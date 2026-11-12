import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";

export default function NotFoundPage() {
  return (
    <PageHeader
      title="Page introuvable"
      subtitle="Cette adresse n’existe pas ou a été déplacée."
      action={
        <Link to="/" className="btn btn--secondary">
          Retour à l’accueil
        </Link>
      }
    />
  );
}
