import PageHeader from "../components/ui/PageHeader";
import { USER } from "../data/mock";

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Profil" subtitle="Vos informations de compte." />

      <div className="card page-list">
        <div className="row">
          <span className="avatar">{USER.initials}</span>
          <span className="row__text">
            <strong>{USER.fullName}</strong>
            <small>{USER.company}</small>
          </span>
        </div>
      </div>
    </>
  );
}
