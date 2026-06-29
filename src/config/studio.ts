/**
 * SINGLE SOURCE OF TRUTH — dati dello studio.
 *
 * Tutti i dati di contatto / fiscali / sede dello Studio vivono qui e in nessun
 * altro punto del codice. Per aggiornare il sito basta cambiare i valori sotto.
 *
 * ⚠️  ATTENZIONE: i valori marcati `// TODO: dato reale` sono SEGNAPOSTO.
 *     Vanno sostituiti con i dati veri prima del lancio. Finché restano
 *     segnaposto, le pagine legali sono `noindex` (vedi metadata delle pagine).
 */

export const studio = {
  // ————— Brand / ragione sociale —————
  legalName: "Studio Dentistico Fabio Barbato", // confermato
  /** Wordmark su due righe usato in footer e pagine legali. */
  wordmark: { line1: "STUDIO DENTISTICO", line2: "FABIO BARBATO" },
  url: "https://studiobarbato.it", // TODO: confermare dominio definitivo
  ogImage: "/images/dr-fabio-barbato.png",

  founder: {
    name: "Dr. Fabio Barbato",
    jobTitle: "Odontoiatra · Implantologo · Direttore Sanitario",
  },

  // ————— Contatti —————
  phone: {
    /** Come mostrato all'utente. */
    display: "0884 585138", // reale (elenchi pubblici) — da confermare con lo studio
    /** Formato E.164 per gli href `tel:`. */
    e164: "+390884585138",
    /** Formato schema.org `telephone`. */
    schema: "+39-0884-585138",
  },
  email: "info@studiobarbato.it", // ⚠️ INVENTATO — da confermare
  instagram: {
    handle: "@fabiobarbato.studiodentistico",
    url: "https://instagram.com/fabiobarbato.studiodentistico",
  },

  // ————— Sede (reale, da Google / OpenStreetMap) —————
  address: {
    street: "Via Giosuè Carducci, 31",
    postalCode: "71043",
    locality: "Manfredonia",
    province: "FG",
    region: "Apulia",
    country: "Italia",
    countryCode: "IT",
  },
  geo: {
    lat: 41.63662, // reale (OpenStreetMap, Via Giosuè Carducci)
    lng: 15.92708, // reale (OpenStreetMap, Via Giosuè Carducci)
  },

  // ————— Dati fiscali —————
  vat: "03156200713", // ⚠️ INVENTATO (formato valido) — da sostituire con la P.IVA reale

  /**
   * Orari di apertura (reali, da Google). Usati sia per la UI sia per lo
   * structured data (schema.org openingHoursSpecification).
   */
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "19:00",
    },
    {
      days: ["Saturday"],
      opens: "10:00",
      closes: "18:00",
    },
  ],

  copyrightYear: 2026,
} as const;

// ————— Helper derivati —————
export const telHref = `tel:${studio.phone.e164}`;
export const mailHref = `mailto:${studio.email}`;

/** "Via Giosuè Carducci, 31 · Manfredonia" — riga indirizzo compatta. */
export const addressShort = `${studio.address.street} · ${studio.address.locality}`;

/** "© 2026 Studio Dentistico Fabio Barbato · P.IVA 03156200713" */
export const copyrightLine = `© ${studio.copyrightYear} ${studio.legalName} · P.IVA ${studio.vat}`;

/** Messaggio di fallback prenotazione (chat) con i contatti reali interpolati. */
export const bookingFallback = `Per prenotare la tua visita, chiama lo ${studio.phone.display} o scrivi a ${studio.email}. Saremo felici di aiutarti.`;
export const bookingFallbackError = `Mi scuso, c'è stato un problema tecnico. Per prenotare chiama lo ${studio.phone.display} o scrivi a ${studio.email}.`;
