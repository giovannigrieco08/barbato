import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Informativa estesa sui cookie utilizzati dal sito dello Studio Dentistico Fabio Barbato e modalità di gestione del consenso.",
  // Testi segnaposto: non indicizzare finché non sono inseriti i contenuti reali.
  robots: { index: false, follow: true },
};

export default function CookiePage() {
  return (
    <article className="legal-prose">
      <p className="legal-kicker">Ultimo aggiornamento: [da inserire]</p>
      <h1>Cookie Policy</h1>
      <p>
        Informativa estesa relativa ai cookie e alle tecnologie simili utilizzati da questo sito,
        in conformità al GDPR e alle Linee guida del Garante in materia di cookie.
      </p>

      <h2>1. Cosa sono i cookie</h2>
      <p className="legal-placeholder">
        [Breve definizione di cookie e tecnologie di tracciamento.]
      </p>

      <h2>2. Tipologie di cookie utilizzati</h2>
      <h3>Cookie tecnici</h3>
      <p className="legal-placeholder">
        [Descrivere i cookie tecnici/necessari, che non richiedono consenso.]
      </p>
      <h3>Cookie analitici</h3>
      <p className="legal-placeholder">
        [Indicare se sono presenti cookie analitici, se anonimizzati o assimilati ai tecnici, e
        se richiedono consenso.]
      </p>
      <h3>Cookie di profilazione / di terze parti</h3>
      <p className="legal-placeholder">
        [Indicare eventuali cookie di profilazione o di terze parti (social, video, mappe) e le
        relative finalità.]
      </p>

      <h2>3. Elenco dei cookie</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Fornitore</th>
            <th>Finalità</th>
            <th>Durata</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} style={{ fontStyle: "italic", color: "rgba(10,46,54,0.6)" }}>
              [Compilare l&rsquo;elenco dei cookie effettivamente impostati dal sito.]
            </td>
          </tr>
        </tbody>
      </table>

      <h2>4. Gestione del consenso</h2>
      <p>
        Al primo accesso viene mostrato un banner che consente di accettare o rifiutare i cookie
        non necessari. La scelta viene memorizzata e può essere modificata in qualsiasi momento
        cancellando i dati del sito dal browser.
      </p>

      <h2>5. Come disabilitare i cookie dal browser</h2>
      <p className="legal-placeholder">
        [Istruzioni o link alle guide dei principali browser (Chrome, Firefox, Safari, Edge) per
        gestire o eliminare i cookie.]
      </p>
    </article>
  );
}
