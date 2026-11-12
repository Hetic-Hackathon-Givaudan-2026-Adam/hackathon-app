/** Mascotte de l'assistant (goutte avec une feuille, t-shirt Givaudan).
 *  Dessin provisoire : à remplacer par l'export de la maquette Figma si besoin.
 *  La bouche s'anime quand l'assistant parle. */
export default function Mascotte({ parle }: { parle: boolean }) {
  return (
    <svg className={`mascotte ${parle ? "mascotte--parle" : ""}`} viewBox="0 0 140 220" role="img" aria-label="Mascotte de l'assistant Givaudan">
      <defs>
        <linearGradient id="mascotte-peau" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#f8c09d" />
          <stop offset="1" stopColor="#ee9264" />
        </linearGradient>
      </defs>

      {/* ombre au sol */}
      <ellipse cx="70" cy="210" rx="36" ry="5" fill="rgba(0,0,0,0.07)" />

      {/* jambes et chaussures */}
      <rect x="53" y="160" width="12" height="40" rx="3" fill="#232325" />
      <rect x="75" y="160" width="12" height="40" rx="3" fill="#232325" />
      <ellipse cx="57" cy="203" rx="11" ry="5" fill="#fff" stroke="#dcdcda" />
      <ellipse cx="83" cy="203" rx="11" ry="5" fill="#fff" stroke="#dcdcda" />

      {/* mains */}
      <circle cx="35" cy="150" r="6" fill="url(#mascotte-peau)" />
      <circle cx="105" cy="150" r="6" fill="url(#mascotte-peau)" />

      {/* t-shirt */}
      <path d="M46 112 h48 l14 8 v22 h-12 v26 h-52 v-26 h-12 v-22 z" fill="#1d1d1f" />
      <path d="M66 116 l4 4 l4 -4" stroke="#3a3a3d" strokeWidth="1.5" fill="none" />
      <text x="70" y="146" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">
        Givaudan
      </text>

      {/* tête en forme de goutte */}
      <path d="M70 20 C58 42 36 58 36 82 C36 102 51 117 70 117 C89 117 104 102 104 82 C104 58 82 42 70 20 Z" fill="url(#mascotte-peau)" />
      <path d="M71 22 C75 10 87 5 94 7 C92 18 82 25 71 22 Z" fill="#6fae47" />
      <path d="M72 21 C78 15 85 11 91 9" stroke="#4f8d2f" strokeWidth="1.2" fill="none" />
      <ellipse cx="51" cy="72" rx="4" ry="9" fill="#fff" opacity="0.35" />

      {/* visage */}
      <circle cx="60" cy="84" r="5.5" fill="#fff" />
      <circle cx="80" cy="84" r="5.5" fill="#fff" />
      <circle className="mascotte__oeil" cx="60.5" cy="84.5" r="3" fill="#1d1d1f" />
      <circle className="mascotte__oeil" cx="80.5" cy="84.5" r="3" fill="#1d1d1f" />
      <ellipse cx="51" cy="96" rx="5" ry="3" fill="#f27f7f" opacity="0.45" />
      <ellipse cx="89" cy="96" rx="5" ry="3" fill="#f27f7f" opacity="0.45" />
      <path className="mascotte__sourire" d="M63 98 Q70 105 77 98" stroke="#1d1d1f" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <ellipse className="mascotte__bouche" cx="70" cy="100" rx="4.5" ry="3.5" fill="#5a2a1e" />
    </svg>
  );
}
