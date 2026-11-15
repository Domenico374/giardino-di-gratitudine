import { createHash, timingSafeEqual } from 'node:crypto';

const hash = (valore) => createHash('sha256').update(String(valore)).digest();

// Senza la variabile CODICE_ACCESSO il sito rifiuta tutti.
export function codiceValido(codice) {
  const atteso = process.env.CODICE_ACCESSO;
  return Boolean(atteso) && typeof codice === 'string' && timingSafeEqual(hash(codice), hash(atteso));
}

// Una piccola attesa rende più lento chi prova i codici a caso.
export const attesaRifiuto = () => new Promise((ok) => setTimeout(ok, 800));
