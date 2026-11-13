import { Check, FlaskConical } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import { SAMPLES, STEP_LABELS } from "../data/mock";

export default function SamplesPage() {
  return (
    <>
      <PageHeader
        eyebrow="SUIVI"
        title="Mes échantillons"
        subtitle="Suivez vos envois et partagez votre retour après chaque test."
      />

      <div className="stack">
        {SAMPLES.map((s) => (
          <article key={s.id} className="card sample">
            <div className="sample__info">
              <span className="row__icon sample__icon">
                <FlaskConical size={22} strokeWidth={1.6} />
                <em>V{s.version}</em>
              </span>
              <div>
                <small>{s.ref}</small>
                <strong>{s.project}</strong>
                <small>Commandé le {s.orderedOn}</small>
              </div>
            </div>

            <div className="sample__progress">
              <Badge tone={s.step === 3 ? "success" : "warning"}>{STEP_LABELS[s.step - 1]}</Badge>
              <ol className="stepper">
                {STEP_LABELS.map((label, i) => {
                  const n = i + 1;
                  const state = n < s.step ? "done" : n === s.step ? "current" : "todo";
                  return (
                    <li key={label} className={`step step--${state} ${s.step === 3 && n === 3 ? "step--done-last" : ""}`}>
                      <span className="step__dot">{state === "done" ? <Check size={11} /> : n}</span>
                      <span className="step__label">{label}</span>
                    </li>
                  );
                })}
              </ol>
            </div>

            {s.step === 3 ? (
              <button className="btn btn--primary">Tester l’échantillon</button>
            ) : (
              <button className="link-btn">Voir le suivi</button>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
