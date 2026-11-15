import { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import Giardino from '../components/Giardino';

const CHIAVE_VOCI = 'gratitude-entries'; // stesso nome della versione precedente: i ricordi restano
const CHIAVE_DOMANDA = 'domanda-del-giorno';
const CHIAVE_CODICE = 'codice-giardino';

// ---------- date ----------
const chiaveGiorno = (data) => {
  const d = new Date(data);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const daChiave = (chiave) => {
  const [a, m, g] = chiave.split('-').map(Number);
  return new Date(a, m - 1, g);
};
const giornoLungo = (data) => new Date(data).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
const giornoBreve = (data) => new Date(data).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' });
const ora = (data) => new Date(data).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

function stagione(data = new Date()) {
  const m = data.getMonth();
  if (m >= 2 && m <= 4) return 'primavera';
  if (m >= 5 && m <= 7) return 'estate';
  if (m >= 8 && m <= 10) return 'autunno';
  return 'inverno';
}

// ---------- memoria del browser ----------
const leggi = (chiave, riserva) => {
  try {
    const valore = JSON.parse(localStorage.getItem(chiave));
    return valore ?? riserva;
  } catch {
    return riserva;
  }
};
const scrivi = (chiave, valore) => {
  try {
    localStorage.setItem(chiave, JSON.stringify(valore));
  } catch {}
};

async function chiediAI(codice, azione, dati = {}) {
  const risposta = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codice, azione, ...dati }),
  });
  const corpo = await risposta.json().catch(() => ({}));
  if (!risposta.ok) {
    const errore = new Error(corpo.errore || "L'AI non risponde in questo momento.");
    errore.stato = risposta.status;
    throw errore;
  }
  return corpo.testo;
}

// ---------- ingresso ----------
function Entrata({ onEntra, messaggio }) {
  const [codice, setCodice] = useState('');
  const [visibile, setVisibile] = useState(false);
  const [errore, setErrore] = useState(messaggio);
  const [attesa, setAttesa] = useState(false);

  async function entra(evento) {
    evento.preventDefault();
    if (!codice) return;
    setAttesa(true);
    setErrore('');
    try {
      const risposta = await fetch('/api/accesso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codice }),
      });
      if (risposta.ok) onEntra(codice);
      else setErrore('Codice di accesso errato.');
    } catch {
      setErrore('Non riesco a contattare il sito. Controlla la connessione e riprova.');
    } finally {
      setAttesa(false);
    }
  }

  return (
    <form className="entrata foglio" onSubmit={entra}>
      <label htmlFor="codice" className="etichetta">Codice di accesso</label>
      <div className="campo-codice">
        <input
          id="codice"
          type={visibile ? 'text' : 'password'}
          value={codice}
          onChange={(e) => setCodice(e.target.value)}
          autoComplete="current-password"
          spellCheck={false}
          autoFocus
        />
        <button type="button" className="mostra" onClick={() => setVisibile(!visibile)}>
          {visibile ? 'Nascondi' : 'Mostra'}
        </button>
      </div>
      <button className="principale" type="submit" disabled={attesa || !codice}>
        {attesa ? 'Controllo…' : 'Entra nel giardino'}
      </button>
      {errore && <p className="avviso" role="alert">{errore}</p>}
    </form>
  );
}

// ---------- diario ----------
function Diario({ codice, onEsci }) {
  const [voci, setVoci] = useState([]);
  const [caricato, setCaricato] = useState(false);
  const [testo, setTesto] = useState('');
  const [domanda, setDomanda] = useState('');
  const [commento, setCommento] = useState('');
  const [spunti, setSpunti] = useState('');
  const [riassunto, setRiassunto] = useState('');
  const [inCorso, setInCorso] = useState(''); // quale richiesta all'AI è in corso
  const [avviso, setAvviso] = useState('');
  const [vista, setVista] = useState('oggi');
  const [scelto, setScelto] = useState(null);
  const [quantiGiorni, setQuantiGiorni] = useState(28);
  const importa = useRef(null);

  const oggi = chiaveGiorno(new Date());

  // Caricamento iniziale.
  useEffect(() => {
    const salvate = leggi(CHIAVE_VOCI, []);
    setVoci(Array.isArray(salvate) ? salvate : []);
    setCaricato(true);
    const piccolo = window.matchMedia('(max-width: 560px)');
    const adatta = () => setQuantiGiorni(piccolo.matches ? 14 : 28);
    adatta();
    piccolo.addEventListener('change', adatta);
    return () => piccolo.removeEventListener('change', adatta);
  }, []);

  // Salva sempre, anche quando il diario resta vuoto.
  useEffect(() => {
    if (caricato) scrivi(CHIAVE_VOCI, voci);
  }, [voci, caricato]);

  // Una sola domanda al giorno.
  useEffect(() => {
    const salvata = leggi(CHIAVE_DOMANDA, null);
    if (salvata?.giorno === oggi && salvata.testo) setDomanda(salvata.testo);
    else nuovaDomanda();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function chiedi(nome, azione, dati) {
    setInCorso(nome);
    setAvviso('');
    try {
      return await chiediAI(codice, azione, dati);
    } catch (errore) {
      if (errore.stato === 401) onEsci('Il codice di accesso è cambiato: inserisci quello nuovo.');
      else setAvviso(errore.message);
      return null;
    } finally {
      setInCorso('');
    }
  }

  async function nuovaDomanda() {
    const risposta = await chiedi('domanda', 'domanda');
    if (risposta) {
      setDomanda(risposta);
      scrivi(CHIAVE_DOMANDA, { giorno: oggi, testo: risposta });
    }
  }

  async function aggiungi(evento) {
    evento.preventDefault();
    const scritto = testo.trim();
    if (!scritto) return;
    const voce = { id: Date.now(), text: scritto, date: new Date().toISOString(), insight: '' };
    setVoci((prima) => [voce, ...prima]);
    setTesto('');
    setCommento('');
    setSpunti('');
    setScelto(null);
    setVista('oggi');
    const risposta = await chiedi('commento', 'commento', { testo: scritto });
    if (risposta) {
      setCommento(risposta);
      setVoci((prima) => prima.map((v) => (v.id === voce.id ? { ...v, insight: risposta } : v)));
    }
  }

  function elimina(voce) {
    if (!window.confirm(`Eliminare questa gratitudine del ${giornoBreve(voce.date)}?`)) return;
    setVoci((prima) => prima.filter((v) => v.id !== voce.id));
  }

  async function chiediSpunti() {
    const risposta = await chiedi('spunti', 'spunti');
    if (risposta) setSpunti(risposta);
  }

  const settimana = useMemo(() => {
    const limite = new Date();
    limite.setHours(0, 0, 0, 0);
    limite.setDate(limite.getDate() - 6);
    return voci.filter((v) => new Date(v.date) >= limite);
  }, [voci]);

  async function chiediRiassunto() {
    const risposta = await chiedi('settimana', 'settimana', {
      voci: settimana.slice(0, 60).map((v) => ({ giorno: giornoLungo(v.date), testo: v.text.slice(0, 2000) })),
    });
    if (risposta) setRiassunto(risposta);
  }

  // Giorni del giardino, dal più vecchio a oggi.
  const perGiorno = useMemo(() => {
    const mappa = new Map();
    for (const v of voci) {
      const g = chiaveGiorno(v.date);
      mappa.set(g, (mappa.get(g) ?? 0) + 1);
    }
    return mappa;
  }, [voci]);

  const giorni = useMemo(() => {
    const elenco = [];
    for (let i = quantiGiorni - 1; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const g = chiaveGiorno(d);
      elenco.push({ giorno: g, quante: perGiorno.get(g) ?? 0, oggi: g === oggi, etichetta: giornoLungo(d) });
    }
    // Un fiore si apre quando il giorno prima o il giorno dopo c'è un'altra pianta.
    return elenco.map((g, i) => ({
      ...g,
      fila: g.quante > 0 && ((elenco[i - 1]?.quante ?? 0) > 0 || (elenco[i + 1]?.quante ?? 0) > 0),
    }));
  }, [perGiorno, quantiGiorni, oggi]);

  const giorniDiFila = useMemo(() => {
    let conta = 0;
    const d = new Date();
    if (!perGiorno.get(chiaveGiorno(d))) d.setDate(d.getDate() - 1); // oggi non è ancora finito
    while (perGiorno.get(chiaveGiorno(d))) {
      conta += 1;
      d.setDate(d.getDate() - 1);
    }
    return conta;
  }, [perGiorno]);

  const mostrate = scelto
    ? voci.filter((v) => chiaveGiorno(v.date) === scelto)
    : vista === 'oggi'
      ? voci.filter((v) => chiaveGiorno(v.date) === oggi)
      : vista === 'tutte'
        ? voci
        : [];

  function esporta() {
    const blob = new Blob([JSON.stringify({ app: 'giardino-della-gratitudine', versione: 2, voci }, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `giardino-${oggi}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function caricaBackup(evento) {
    const file = evento.target.files?.[0];
    evento.target.value = '';
    if (!file) return;
    try {
      const dati = JSON.parse(await file.text());
      const arrivate = (Array.isArray(dati) ? dati : dati.voci) ?? [];
      const valide = arrivate.filter((v) => v && typeof v.text === 'string' && !Number.isNaN(new Date(v.date).getTime()));
      if (!valide.length) throw new Error();
      setVoci((prima) => {
        const presenti = new Set(prima.map((v) => v.id));
        const nuove = valide
          .filter((v) => !presenti.has(v.id))
          .map((v) => ({ id: v.id ?? Date.now() + Math.random(), text: v.text, date: v.date, insight: typeof v.insight === 'string' ? v.insight : '' }));
        setAvviso(nuove.length ? `Ho aggiunto ${nuove.length} gratitudini dal backup.` : 'Queste gratitudini erano già nel giardino.');
        return [...nuove, ...prima].sort((a, b) => new Date(b.date) - new Date(a.date));
      });
    } catch {
      setAvviso('Questo file non sembra un backup del Giardino.');
    }
  }

  const piante = perGiorno.size;
  const occupato = Boolean(inCorso);

  return (
    <>
      <section className="aiuola" aria-labelledby="titolo-giardino">
        <div className="aiuola-testa">
          <h2 id="titolo-giardino" className="titoletto">Il tuo giardino</h2>
          <p className="conteggio">
            {piante === 0 ? 'Ancora nessuna pianta' : piante === 1 ? 'Una pianta' : `${piante} piante`}
            {giorniDiFila > 1 && <> · {giorniDiFila} giorni di fila</>}
          </p>
        </div>
        <Giardino giorni={giorni} scelto={scelto} onScegli={setScelto} />
        <p className="didascalia">
          {piante === 0
            ? 'Scrivi la tua prima gratitudine: spunterà la prima pianta.'
            : 'Ogni giorno grato fa spuntare una pianta; i giorni vicini la fanno fiorire. Tocca una pianta per rileggerla.'}
        </p>
      </section>

      <section className="foglio quaderno">
        <div className="domanda">
          <p className="mano">{domanda || (inCorso === 'domanda' ? 'Sto cercando la domanda di oggi…' : 'Di cosa ti senti grata o grato oggi?')}</p>
          <button className="leggero" type="button" onClick={nuovaDomanda} disabled={occupato}>
            Un'altra domanda
          </button>
        </div>

        <form onSubmit={aggiungi}>
          <label htmlFor="nuova" className="etichetta">Oggi sono grata o grato per…</label>
          <textarea
            id="nuova"
            className="righe"
            value={testo}
            onChange={(e) => setTesto(e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="Una persona, un momento, una piccola cosa…"
          />
          <div className="azioni">
            <button className="principale" type="submit" disabled={!testo.trim() || inCorso === 'commento'}>
              {inCorso === 'commento' ? 'Sto piantando…' : 'Pianta questa gratitudine'}
            </button>
            <button className="secondario" type="button" onClick={chiediSpunti} disabled={occupato}>
              {inCorso === 'spunti' ? 'Cerco spunti…' : 'Dammi qualche spunto'}
            </button>
          </div>
        </form>

        {avviso && <p className="avviso" role="status">{avviso}</p>}
        {commento && <p className="biglietto mano">{commento}</p>}
        {spunti && <div className="biglietto spunti">{spunti}</div>}
      </section>

      <section className="foglio pagine">
        <div className="schede" role="tablist" aria-label="Quali gratitudini vedere">
          {[
            ['oggi', `Oggi (${voci.filter((v) => chiaveGiorno(v.date) === oggi).length})`],
            ['tutte', `Tutto il quaderno (${voci.length})`],
            ['settimana', 'La settimana'],
          ].map(([id, nome]) => (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={!scelto && vista === id}
              className={!scelto && vista === id ? 'attiva' : ''}
              onClick={() => {
                setScelto(null);
                setVista(id);
              }}
            >
              {nome}
            </button>
          ))}
        </div>

        {scelto && (
          <p className="giorno-scelto">
            <span>{giornoLungo(daChiave(scelto))}</span>
            <button className="leggero" type="button" onClick={() => setScelto(null)}>Chiudi</button>
          </p>
        )}

        {!scelto && vista === 'settimana' ? (
          <div className="settimana">
            <p>
              {settimana.length
                ? `Negli ultimi sette giorni hai scritto ${settimana.length === 1 ? 'una gratitudine' : `${settimana.length} gratitudini`}.`
                : 'Negli ultimi sette giorni non hai ancora scritto nulla.'}
            </p>
            {settimana.length > 0 && (
              <button className="secondario" type="button" onClick={chiediRiassunto} disabled={occupato}>
                {inCorso === 'settimana' ? 'Sto rileggendo la settimana…' : 'Rileggi la settimana con l’AI'}
              </button>
            )}
            {riassunto && <p className="biglietto mano">{riassunto}</p>}
          </div>
        ) : mostrate.length ? (
          <ol className="voci">
            {mostrate.map((v) => (
              <li key={v.id}>
                <div className="voce-testa">
                  <time dateTime={v.date}>{vista === 'oggi' && !scelto ? ora(v.date) : `${giornoLungo(v.date)}, ${ora(v.date)}`}</time>
                  <button className="elimina" type="button" onClick={() => elimina(v)} aria-label="Elimina questa gratitudine" title="Elimina">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></svg>
                  </button>
                </div>
                <p className="voce-testo">{v.text}</p>
                {v.insight && <p className="voce-nota mano">{v.insight}</p>}
              </li>
            ))}
          </ol>
        ) : (
          <p className="vuoto">
            {vista === 'oggi' && !scelto ? 'Oggi il quaderno è ancora bianco.' : 'Il quaderno è ancora vuoto: scrivi la prima gratitudine qui sopra.'}
          </p>
        )}
      </section>

      <footer className="piede">
        <p>
          Le gratitudini restano solo in questo browser. Quando chiedi un commento, uno spunto o il riassunto, il testo viene inviato a
          OpenAI per la risposta.
        </p>
        <div className="piede-azioni">
          <button className="leggero" type="button" onClick={esporta} disabled={!voci.length}>Salva un backup</button>
          <button className="leggero" type="button" onClick={() => importa.current?.click()}>Carica un backup</button>
          <input ref={importa} type="file" accept="application/json,.json" hidden onChange={caricaBackup} />
          <button className="leggero" type="button" onClick={() => onEsci()}>Esci</button>
        </div>
      </footer>
    </>
  );
}

export default function Home() {
  const [codice, setCodice] = useState(null);
  const [pronto, setPronto] = useState(false);
  const [messaggio, setMessaggio] = useState('');
  const [periodo, setPeriodo] = useState('autunno');
  const [data, setData] = useState('');

  useEffect(() => {
    setPeriodo(stagione());
    setData(giornoLungo(new Date()));
    const salvato = leggi(CHIAVE_CODICE, null);
    if (!salvato) return setPronto(true);
    fetch('/api/accesso', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codice: salvato }) })
      .then((r) => (r.ok ? setCodice(salvato) : localStorage.removeItem(CHIAVE_CODICE)))
      .catch(() => setCodice(salvato))
      .finally(() => setPronto(true));
  }, []);

  function entra(nuovo) {
    scrivi(CHIAVE_CODICE, nuovo);
    setMessaggio('');
    setCodice(nuovo);
  }

  function esci(motivo = '') {
    try {
      localStorage.removeItem(CHIAVE_CODICE);
    } catch {}
    setMessaggio(motivo);
    setCodice(null);
  }

  return (
    <>
      <Head>
        <title>Giardino della Gratitudine</title>
        <meta name="description" content="Un diario della gratitudine che diventa un giardino: ogni giorno grato fa crescere una pianta." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={`pagina ${periodo}`}>
        <main className="contenitore">
          <header className="testata">
            <svg className="marchio" viewBox="0 0 40 40" aria-hidden="true">
              <path d="M20 36V18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M20 24c-7 0-11-5-11-11 7 0 11 5 11 11zM20 20c0-7 4-12 11-12 0 7-4 12-11 12z" fill="currentColor" />
            </svg>
            <h1>Giardino della Gratitudine</h1>
            {data && <p className="data mano">{data}</p>}
          </header>
          {!pronto ? null : codice ? <Diario codice={codice} onEsci={esci} /> : <Entrata onEntra={entra} messaggio={messaggio} />}
        </main>
      </div>
    </>
  );
}
