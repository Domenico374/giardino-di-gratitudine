import { codiceValido, attesaRifiuto } from '../../lib/accesso';

// Controlla il codice prima di aprire il giardino.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ errore: 'Metodo non consentito.' });
  if (codiceValido(req.body?.codice)) return res.status(200).json({ ok: true });
  await attesaRifiuto();
  return res.status(401).json({ errore: 'Codice di accesso errato.' });
}
