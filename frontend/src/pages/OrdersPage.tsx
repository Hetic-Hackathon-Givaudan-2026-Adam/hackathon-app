import { useState } from "react";
import { ChevronRight } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import { ORDERS, SAMPLES, STEP_LABELS } from "../data/mock";

type Tab = "echantillons" | "produits";

interface Row {
  id: string;
  reference: string;
  project: string;
  date: string;
  status: string;
  success: boolean;
}

export default function OrdersPage() {
  const [tab, setTab] = useState<Tab>("produits");

  const sampleRows: Row[] = SAMPLES.map((s) => ({
    id: s.id,
    reference: s.ref,
    project: s.project,
    date: s.orderedOn,
    status: STEP_LABELS[s.step - 1],
    success: s.step === 3,
  }));
  const productRows: Row[] = ORDERS.map((o) => ({
    id: o.id,
    reference: o.reference,
    project: o.project,
    date: o.date,
    status: o.status,
    success: o.tone === "success",
  }));
  const rows = tab === "produits" ? productRows : sampleRows;

  return (
    <>
      <PageHeader
        eyebrow="HISTORIQUE"
        title="Mes commandes"
        subtitle="Retrouvez vos commandes d’échantillons et de produits."
      />

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === "echantillons"} className={`tab ${tab === "echantillons" ? "tab--active" : ""}`} onClick={() => setTab("echantillons")}>
          Échantillons <span className="tab__count">{sampleRows.length}</span>
        </button>
        <button role="tab" aria-selected={tab === "produits"} className={`tab ${tab === "produits" ? "tab--active" : ""}`} onClick={() => setTab("produits")}>
          Produits <span className="tab__count">{productRows.length}</span>
        </button>
      </div>

      <div className="card table">
        <div className="table__row table__head">
          <span>RÉFÉRENCE</span><span>PROJET</span><span>DATE</span><span>STATUT</span><span />
        </div>
        {rows.map((r) => (
          <div key={r.id} className="table__row">
            <strong>{r.reference}</strong>
            <span>{r.project}</span>
            <span>{r.date}</span>
            <span><Badge tone={r.success ? "success" : "warning"}>{r.status}</Badge></span>
            <button className="link-btn">Voir le détail <ChevronRight size={14} /></button>
          </div>
        ))}
      </div>
    </>
  );
}
