import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import Badge from "../ui/Badge";
import type { Tone } from "../../types";

interface Props {
  icon: LucideIcon;
  title: string;
  to: string;
  name: string;
  detail: string;
  status: string;
  tone: Tone;
}

export default function SummaryCard({ icon: Icon, title, to, name, detail, status, tone }: Props) {
  return (
    <section className="card summary">
      <header className="summary__head">
        <h3>
          <Icon size={18} strokeWidth={1.6} />
          {title}
        </h3>
        <Link to={to}>Tout voir</Link>
      </header>
      <div className="summary__body">
        <div>
          <strong>{name}</strong>
          <small>{detail}</small>
        </div>
        <Badge tone={tone}>{status}</Badge>
      </div>
    </section>
  );
}
