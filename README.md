# Giardino della Gratitudine

**Un diario della gratitudine che diventa un giardino.**

Ogni giorno in cui scrivi qualcosa per cui provi gratitudine spunta una pianta. Più gratitudini nello stesso giorno fanno una pianta più alta, i giorni vicini la fanno fiorire. Toccando una pianta si rilegge cosa si era scritto quel giorno. I colori cambiano con le stagioni.

## Cosa fa

- **Quaderno**: si scrive la gratitudine del giorno; ogni mattina compare una domanda per ispirarsi.
- **Giardino**: le ultime quattro settimane (due sul telefono) disegnate come un'aiuola.
- **Commenti dell'AI** (facoltativi): una frase che accoglie ciò che hai scritto, qualche spunto, il riassunto della settimana.
- **Privacy**: le gratitudini restano solo nel browser. Il testo va a OpenAI solo quando si chiede un commento, uno spunto o il riassunto.
- **Backup**: "Salva un backup" scarica un file con tutte le gratitudini, "Carica un backup" le rimette, anche su un altro dispositivo.
- **Accesso riservato**: si entra con un codice, così nessun altro può usare l'AI a tue spese.

---

## Per chi gestisce il sito

### Pubblicazione su Vercel

Il progetto Vercel collegato al repository pubblica il sito a ogni modifica del ramo `main`.
In Settings > Environment Variables servono, come **Secret**:

- `OPENAI_API_KEY`: la chiave OpenAI (platform.openai.com), con un limite di spesa mensile.
- `CODICE_ACCESSO`: il codice da dare a chi usa il giardino. Senza questa variabile il sito rifiuta tutti.
- `MODELLO` (facoltativa): il modello OpenAI; se manca si usa `gpt-4.1-mini`.

Dopo aver cambiato le variabili serve un nuovo Deploy. Non scrivere mai le chiavi in un file del repository.

### Dove cambiare le cose

- `pages/index.js`: la pagina (ingresso, quaderno, elenco, backup).
- `components/Giardino.js`: il disegno del giardino e delle piante.
- `styles/globals.css`: colori, caratteri e i colori di ogni stagione.
- `pages/api/ai.js`: le richieste all'AI e il loro testo.
- `pages/api/accesso.js` e `lib/accesso.js`: il controllo del codice.

### Provare sul computer

```bash
npm install
npm run dev
```

Serve un file `.env.local` con `CODICE_ACCESSO` e, per l'AI, `OPENAI_API_KEY`.
