import { Fraunces, Source_Serif_4, Caveat } from 'next/font/google';
import '../styles/globals.css';

// Caratteri scaricati da Next al momento della pubblicazione: niente richieste a Google dal browser.
const titoli = Fraunces({ subsets: ['latin'], variable: '--font-titoli', axes: ['SOFT', 'opsz'] });
const testo = Source_Serif_4({ subsets: ['latin'], variable: '--font-testo' });
const mano = Caveat({ subsets: ['latin'], variable: '--font-mano' });

export default function App({ Component, pageProps }) {
  return (
    <div className={`${titoli.variable} ${testo.variable} ${mano.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
