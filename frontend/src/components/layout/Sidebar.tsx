import { Link, NavLink } from "react-router-dom";
import { FlaskConical, FolderOpen, Headset, House, Package, User } from "lucide-react";
import { USER } from "../../data/mock";

const NAV = [
  { label: "Accueil", to: "/", icon: House },
  { label: "Mes projets", to: "/projets", icon: FolderOpen },
  { label: "Échantillons", to: "/echantillons", icon: FlaskConical },
  { label: "Commandes", to: "/commandes", icon: Package },
  { label: "Profil", to: "/profil", icon: User },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">Givaudan</div>

      <nav className="sidebar__nav">
        {NAV.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `nav-item ${isActive ? "nav-item--active" : ""}`}
          >
            <Icon size={18} strokeWidth={1.6} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__bottom">
        <Link to="/assistant" className="help">
          <Headset size={18} strokeWidth={1.6} />
          <span>
            <strong>Besoin d’aide ?</strong>
            <small>Discuter avec l’assistant</small>
          </span>
        </Link>

        <div className="account">
          <span className="avatar">{USER.companyInitials}</span>
          <span>
            <strong>{USER.company}</strong>
            <small>Compte client</small>
          </span>
        </div>
      </div>
    </aside>
  );
}
