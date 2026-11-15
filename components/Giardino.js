// Il giardino disegnato: una pianta per ogni giorno con almeno una gratitudine.
// Più gratitudini nello stesso giorno = pianta più alta. Giorni consecutivi = fiori aperti.

const ALTEZZA = 240;
const TERRA = 196;

// Numero stabile da una stringa, per scegliere forma e colore di ogni pianta.
function numero(testo) {
  let h = 0;
  for (const c of testo) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

function Fiore({ tipo, colore, aperto }) {
  if (!aperto) {
    return <ellipse cx="0" cy="-3" rx="4.5" ry="7" fill={colore} opacity="0.85" />;
  }
  switch (tipo) {
    case 0: // margherita
      return (
        <g>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <ellipse key={a} cx="0" cy="-8" rx="3.4" ry="7" fill={colore} transform={`rotate(${a})`} />
          ))}
          <circle r="4.2" fill="var(--cuore)" />
        </g>
      );
    case 1: // tulipano
      return <path d="M-8 -14 Q-9 4 0 5 Q9 4 8 -14 L4 -6 L0 -15 L-4 -6 Z" fill={colore} />;
    case 2: // fiore tondo
      return (
        <g>
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx="0" cy="-6.5" r="6" fill={colore} transform={`rotate(${a})`} />
          ))}
          <circle r="4" fill="var(--cuore)" />
        </g>
      );
    default: // rametto con bacche
      return (
        <g fill={colore}>
          <circle cx="-5" cy="-2" r="3.6" />
          <circle cx="4" cy="-5" r="3.6" />
          <circle cx="0" cy="-11" r="3.6" />
          <circle cx="6" cy="3" r="3" />
        </g>
      );
  }
}

function Pianta({ x, giorno, quante, aperto, scelta, onScegli, etichetta }) {
  const n = numero(giorno);
  const altezza = 46 + Math.min(quante, 4) * 20 + (n % 9);
  const piega = ((n >> 3) % 13) - 6;
  const colore = `var(--fiore-${n % 4})`;
  const cima = TERRA - altezza;
  const lato = n % 2 ? 1 : -1;
  return (
    <g
      className={`pianta${scelta ? ' scelta' : ''}`}
      transform={`translate(${x} 0)`}
      role="button"
      tabIndex={0}
      aria-label={etichetta}
      aria-pressed={scelta}
      onClick={onScegli}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onScegli())}
    >
      <title>{etichetta}</title>
      <rect x="-12" y={cima - 20} width="24" height={altezza + 26} fill="transparent" />
      <g className="cresce" style={{ animationDelay: `${(n % 7) * 40}ms` }}>
        <path d={`M0 ${TERRA} Q${piega} ${TERRA - altezza / 2} ${piega / 2} ${cima}`} stroke="var(--stelo)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path
          d={`M${piega / 3} ${TERRA - altezza * 0.4} q${12 * lato} -5 ${19 * lato} -17 q${-12 * lato} 1 ${-19 * lato} 17`}
          fill="var(--foglia)"
        />
        {quante > 1 && (
          <path
            d={`M${piega / 2.5} ${TERRA - altezza * 0.64} q${-11 * lato} -4 ${-16 * lato} -15 q${11 * lato} 1 ${16 * lato} 15`}
            fill="var(--foglia)"
          />
        )}
        <g transform={`translate(${piega / 2} ${cima}) scale(1.55)`} stroke="rgba(60, 45, 25, 0.28)" strokeWidth="0.7">
          <Fiore tipo={n % 4} colore={colore} aperto={aperto} />
        </g>
      </g>
    </g>
  );
}

export default function Giardino({ giorni, scelto, onScegli }) {
  // Sul telefono si vedono meno giorni: il disegno si restringe così le piante restano grandi.
  const larghezza = giorni.length <= 14 ? 420 : 700;
  const r = larghezza / 700;
  const passo = (larghezza - 40) / giorni.length;
  return (
    <svg className="giardino" viewBox={`0 0 ${larghezza} ${ALTEZZA}`} role="group" aria-label="Il tuo giardino degli ultimi giorni">
      <defs>
        <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--cielo-alto)" />
          <stop offset="1" stopColor="var(--cielo-basso)" />
        </linearGradient>
      </defs>
      <rect width={larghezza} height={ALTEZZA} fill="url(#cielo)" />
      <circle cx={larghezza - 70} cy="52" r="24" fill="var(--sole)" opacity="0.55" />
      <path d={`M0 ${TERRA - 4} Q${175 * r} ${TERRA - 14} ${350 * r} ${TERRA - 5} T${larghezza} ${TERRA - 6} V${ALTEZZA} H0 Z`} fill="var(--prato)" />
      {[38, 112, 205, 268, 341, 430, 497, 566, 648].map((x0, i) => x0 * r).map((x, i) => (
        <path
          key={x}
          d={`M${x} ${TERRA - 3} l-4 -${8 + (i % 3) * 3} M${x + 3} ${TERRA - 3} l1 -${11 + (i % 2) * 4} M${x + 6} ${TERRA - 3} l5 -${7 + (i % 3) * 2}`}
          stroke="var(--stelo)"
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.45"
          aria-hidden="true"
        />
      ))}
      <path d={`M0 ${TERRA + 10} Q${200 * r} ${TERRA + 2} ${420 * r} ${TERRA + 12} T${larghezza} ${TERRA + 8} V${ALTEZZA} H0 Z`} fill="var(--terra)" />
      {giorni.map((g, i) => {
        const x = 20 + passo * (i + 0.5);
        if (!g.quante) {
          return (
            <g key={g.giorno} transform={`translate(${x} ${TERRA + 6})`} aria-hidden="true">
              <ellipse rx="5" ry="2" fill="var(--zolla)" />
              {g.oggi && <text y="26" textAnchor="middle" className="oggi-etichetta">oggi</text>}
            </g>
          );
        }
        return (
          <g key={g.giorno}>
            <Pianta
              x={x}
              giorno={g.giorno}
              quante={g.quante}
              aperto={g.fila}
              scelta={scelto === g.giorno}
              onScegli={() => onScegli(scelto === g.giorno ? null : g.giorno)}
              etichetta={`${g.etichetta}: ${g.quante === 1 ? 'una gratitudine' : `${g.quante} gratitudini`}`}
            />
            {g.oggi && <text x={x} y={TERRA + 32} textAnchor="middle" className="oggi-etichetta">oggi</text>}
          </g>
        );
      })}
    </svg>
  );
}
