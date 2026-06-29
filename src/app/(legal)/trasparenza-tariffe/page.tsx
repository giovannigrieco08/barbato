import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trasparenza tariffe",
  description:
    "Informazioni sulle tariffe delle prestazioni dello Studio Dentistico Fabio Barbato, in trasparenza ai sensi della L. 4/2013.",
  // Testi segnaposto: non indicizzare finché non sono inseriti i contenuti reali.
  robots: { index: false, follow: true },
};

export default function TrasparenzaTariffePage() {
  return (
    <article className="legal-prose">
      <p className="legal-kicker">Ultimo aggiornamento: [da inserire]</p>
      <h1>Trasparenza tariffe</h1>
      <p>
        In conformità agli obblighi di trasparenza previsti per le professioni sanitarie
        (L. 4/2013), riportiamo di seguito le informazioni sulle tariffe delle prestazioni.
      </p>

      <h2>1. Premessa</h2>
      <p className="legal-placeholder">
        [Nota introduttiva: le tariffe indicate sono indicative; per ogni trattamento viene
        rilasciato un preventivo scritto e personalizzato prima dell&rsquo;inizio delle cure.]
      </p>

      <h2>2. Tariffario delle prestazioni</h2>
      <table>
        <thead>
          <tr>
            <th>Prestazione</th>
            <th>Tariffa indicativa</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2} style={{ fontStyle: "italic", color: "rgba(10,46,54,0.6)" }}>
              [Compilare con l&rsquo;elenco delle prestazioni e le relative tariffe indicative.]
            </td>
          </tr>
        </tbody>
      </table>

      <h2>3. Note</h2>
      <p className="legal-placeholder">
        [Eventuali note su IVA, convenzioni con fondi sanitari, modalità di pagamento e
        finanziamenti, gratuità della prima visita.]
      </p>

      <h2>4. Direttore Sanitario</h2>
      <p className="legal-placeholder">
        [Nominativo del Direttore Sanitario responsabile delle informazioni sulle tariffe.]
      </p>
    </article>
  );
}
