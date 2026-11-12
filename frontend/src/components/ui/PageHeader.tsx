import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({ eyebrow, title, subtitle, action }: Props) {
  return (
    <div className="hero">
      <div>
        {eyebrow && <p className="hero__eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {subtitle && <p className="hero__sub">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
