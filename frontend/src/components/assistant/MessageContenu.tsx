import { Fragment, type ReactNode } from "react";
import type { Recapitulatif } from "../../services/assistantApi";

// Met en valeur les identifiants d'ingrédients (FR026) et les numéros de demande (ECH-DEMO-001).
function enrichir(texte: string): ReactNode[] {
  return texte.split(/(FR\d{3}|(?:ECH|EXP)-DEMO-\d{3})/g).map((morceau, i) =>
    /^(FR\d{3}|(?:ECH|EXP)-DEMO-\d{3})$/.test(morceau) ? <strong key={i}>{morceau}</strong> : morceau
  );
}

function Lignes({ texte }: { texte: string }) {
  const lignes = texte.split("\n");
  return (
    <>
      {lignes.map((ligne, i) => (
        <Fragment key={i}>
          {enrichir(ligne)}
          {i < lignes.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}

/** Texte d'une réponse ; un récapitulatif est affiché en vrai tableau. */
export default function MessageContenu({ texte, recapitulatif }: { texte: string; recapitulatif?: Recapitulatif | null }) {
  if (!recapitulatif) return <Lignes texte={texte} />;

  const paragraphes = texte.split(/\n\n/);
  const intro = paragraphes
    .slice(0, -1)
    .join("\n\n")
    .split("\n")
    .filter((l) => !l.startsWith("- "))
    .join("\n");
  return (
    <>
      <Lignes texte={intro} />
      <table className="recap">
        <tbody>
          {recapitulatif.lignes.map((l) => (
            <tr key={l.information}>
              <th scope="row">{l.information}</th>
              <td>{enrichir(l.detail)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Lignes texte={paragraphes[paragraphes.length - 1]} />
    </>
  );
}
