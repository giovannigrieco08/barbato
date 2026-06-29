import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Note legali",
  description:
    "Note legali, dati identificativi e condizioni di utilizzo del sito dello Studio Dentistico Fabio Barbato.",
  // Testi segnaposto: non indicizzare finché non sono inseriti i contenuti reali.
  robots: { index: false, follow: true },
};

export default function NoteLegaliPage() {
  return (
    <article className="legal-prose">
      <p className="legal-kicker">Ultimo aggiornamento: [da inserire]</p>
      <h1>Note legali</h1>

      <h2>1. Dati identificativi</h2>
      <p className="legal-placeholder">
        [Inserire denominazione dello studio, sede, P.IVA e C.F., recapiti, nominativo e numero di
        iscrizione all&rsquo;Ordine del Direttore Sanitario e degli odontoiatri operanti.]
      </p>

      <h2>2. Informazioni sanitarie e pubblicità</h2>
      <p className="legal-placeholder">
        [Dichiarazione di conformità della comunicazione sanitaria alla normativa vigente
        (es. L. 248/2006 e linee guida sulla pubblicità dell&rsquo;informazione sanitaria).]
      </p>

      <h2>3. Proprietà intellettuale</h2>
      <p className="legal-placeholder">
        [Clausola su titolarità di marchi, testi, immagini e contenuti del sito e relative
        condizioni d&rsquo;uso.]
      </p>

      <h2>4. Limitazione di responsabilità</h2>
      <p className="legal-placeholder">
        [Clausola sui contenuti del sito a scopo informativo e sull&rsquo;esclusione di responsabilità
        per usi non previsti; i contenuti non sostituiscono una visita o un parere professionale.]
      </p>

      <h2>5. Legge applicabile e foro competente</h2>
      <p className="legal-placeholder">
        [Indicare legge applicabile e foro competente.]
      </p>
    </article>
  );
}
