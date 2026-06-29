import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Informativa sul trattamento dei dati personali dello Studio Dentistico Fabio Barbato ai sensi degli artt. 13-14 del Regolamento UE 2016/679 (GDPR).",
};

export default function PrivacyPage() {
  return (
    <article className="legal-prose">
      <p className="legal-kicker">Ultimo aggiornamento: [da inserire]</p>
      <h1>Privacy Policy</h1>
      <p>
        Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14 del
        Regolamento (UE) 2016/679 (&ldquo;GDPR&rdquo;) e della normativa nazionale applicabile.
      </p>

      <h2>1. Titolare del trattamento</h2>
      <p className="legal-placeholder">
        [Inserire denominazione, sede legale, P.IVA/C.F., email e PEC del Titolare del
        trattamento, ed eventuale Responsabile della Protezione dei Dati (DPO) se nominato.]
      </p>

      <h2>2. Tipologie di dati trattati</h2>
      <p className="legal-placeholder">
        [Specificare le categorie di dati: dati anagrafici e di contatto; dati relativi alla
        salute (categoria particolare, art. 9 GDPR) raccolti per le prestazioni odontoiatriche;
        dati di navigazione del sito. Indicare quali sono conferiti dall&rsquo;interessato e quali
        raccolti automaticamente.]
      </p>

      <h2>3. Finalità e basi giuridiche del trattamento</h2>
      <p className="legal-placeholder">
        [Elencare le finalità (es. erogazione delle prestazioni sanitarie, adempimenti
        amministrativi e fiscali, gestione delle richieste tramite form/chat, eventuale
        marketing previo consenso) e la relativa base giuridica per ciascuna.]
      </p>

      <h2>4. Modalità del trattamento</h2>
      <p className="legal-placeholder">
        [Descrivere strumenti e misure di sicurezza adottate per il trattamento dei dati.]
      </p>

      <h2>5. Periodo di conservazione</h2>
      <p className="legal-placeholder">
        [Indicare i tempi di conservazione per ciascuna finalità (es. obblighi di legge per la
        documentazione sanitaria e fiscale).]
      </p>

      <h2>6. Destinatari e comunicazione dei dati</h2>
      <p className="legal-placeholder">
        [Indicare le categorie di destinatari/responsabili esterni (es. laboratori odontotecnici,
        consulenti, fornitori di servizi IT) ed eventuale trasferimento extra-UE con relative
        garanzie.]
      </p>

      <h2>7. Diritti dell&rsquo;interessato</h2>
      <p className="legal-placeholder">
        [Elencare i diritti ex artt. 15&ndash;22 GDPR (accesso, rettifica, cancellazione,
        limitazione, portabilità, opposizione) e le modalità per esercitarli presso il Titolare,
        oltre al diritto di reclamo al Garante per la protezione dei dati personali.]
      </p>

      <h2>8. Modifiche alla presente informativa</h2>
      <p className="legal-placeholder">
        [Clausola sulle possibili modifiche dell&rsquo;informativa e su come verranno comunicate.]
      </p>
    </article>
  );
}
