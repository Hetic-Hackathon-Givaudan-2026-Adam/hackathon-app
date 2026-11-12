import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Bell, Check, Languages, User } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { USER } from "../data/mock";
import type { Lang, LayoutCtx } from "../types";

const LANGS: { key: Lang; name: string; hint: string }[] = [
  { key: "fr", name: "Français", hint: "Langue actuelle" },
  { key: "en", name: "English", hint: "English interface" },
];

const NOTIFS = [
  { key: "samples", label: "M’avertir du suivi de mes échantillons" },
  { key: "orders", label: "M’avertir du suivi de mes commandes" },
  { key: "news", label: "Recevoir les conseils et nouveautés Givaudan" },
];

export default function ProfilePage() {
  const { lang, setLang } = useOutletContext<LayoutCtx>();
  const [form, setForm] = useState({ company: USER.company, contact: USER.fullName, email: USER.email, phone: USER.phone });
  const [notifs, setNotifs] = useState<Record<string, boolean>>({ samples: true, orders: true, news: false });
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [k]: e.target.value });
    setSaved(false);
  };

  return (
    <div className="narrow narrow--wide">
      <PageHeader title="Profil de l’entreprise" subtitle="Gérez les informations de votre compte et vos préférences." />

      <div className="stack">
        <section className="card section-card">
          <span className="row__icon"><User size={20} strokeWidth={1.6} /></span>
          <div>
            <h3>{form.company}</h3>
            <div className="form-grid">
              <label className="field"><span>Nom de l’entreprise</span><input value={form.company} onChange={set("company")} /></label>
              <label className="field"><span>Contact principal</span><input value={form.contact} onChange={set("contact")} /></label>
              <label className="field"><span>E-mail</span><input type="email" value={form.email} onChange={set("email")} /></label>
              <label className="field"><span>Téléphone</span><input type="tel" value={form.phone} onChange={set("phone")} /></label>
            </div>
            <button className="btn btn--primary" onClick={() => setSaved(true)}>Enregistrer les modifications</button>
            {saved && <small role="status" className="saved">Modifications enregistrées.</small>}
          </div>
        </section>

        <section className="card section-card">
          <span className="row__icon"><Languages size={20} strokeWidth={1.6} /></span>
          <div>
            <h3>Langue de l’interface</h3>
            <small>Cette préférence s’applique à tous vos échanges avec l’assistant.</small>
            <div className="choice-grid choice-grid--2">
              {LANGS.map((l) => (
                <button key={l.key} className={`choice choice--lang ${lang === l.key ? "choice--active" : ""}`} onClick={() => setLang(l.key)}>
                  <span className="lang-tag">{l.key.toUpperCase()}</span>
                  <span><strong>{l.name}</strong><small>{l.hint}</small></span>
                  {lang === l.key && <Check size={16} className="choice__check" />}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="card section-card">
          <span className="row__icon"><Bell size={20} strokeWidth={1.6} /></span>
          <div>
            <h3>Notifications</h3>
            <ul className="toggles">
              {NOTIFS.map((n) => (
                <li key={n.key}>
                  <span>{n.label}</span>
                  <button
                    role="switch"
                    aria-checked={notifs[n.key]}
                    aria-label={n.label}
                    className={`switch ${notifs[n.key] ? "switch--on" : ""}`}
                    onClick={() => setNotifs({ ...notifs, [n.key]: !notifs[n.key] })}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
