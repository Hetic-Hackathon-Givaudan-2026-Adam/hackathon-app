import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import { ORDERS } from "../data/mock";

export default function OrdersPage() {
  return (
    <>
      <PageHeader title="Commandes" subtitle="L’historique de vos commandes." />

      <div className="card page-list">
        {ORDERS.map(({ id, reference, product, quantity, status, tone }) => (
          <div key={id} className="row">
            <span className="row__text">
              <strong>{reference}</strong>
              <small>{product} · {quantity}</small>
            </span>
            <Badge tone={tone}>{status}</Badge>
          </div>
        ))}
      </div>
    </>
  );
}
