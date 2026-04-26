export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "Studio Dentistico Fabio Barbato",
    image: "https://studiobarbato.it/images/dr-fabio-barbato.png",
    "@id": "https://studiobarbato.it",
    url: "https://studiobarbato.it",
    telephone: "+39-0884-000000",
    priceRange: "€€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via del Porto, 14",
      addressLocality: "Manfredonia",
      addressRegion: "FG",
      postalCode: "71043",
      addressCountry: "IT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.6264,
      longitude: 15.9173,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    founder: {
      "@type": "Person",
      name: "Dr. Fabio Barbato",
      jobTitle: "Odontoiatra · Implantologo · Direttore Sanitario",
    },
    medicalSpecialty: ["Implantology", "Orthodontics", "CosmeticDentistry", "PreventiveDentistry"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
