import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import { SAMPLES } from "../data/mock";

export default function SamplesPage() {
  return (
    <>
      <PageHeader title="Échantillons" subtitle="Suivez vos échantillons et leurs livraisons." />

      <div className="card page-list">
        {SAMPLES.map(({ id, name, delivery, status, tone }) => (
          <div key={id} className="row">
            <span className="row__text">
              <strong>{name}</strong>
              <small>{delivery}</small>
            </span>
            <Badge tone={tone}>{status}</Badge>
          </div>
        ))}
      </div>
    </>
  );
}
