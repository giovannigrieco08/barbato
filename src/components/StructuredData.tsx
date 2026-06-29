import { studio } from "@/config/studio";

export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: studio.legalName,
    image: `${studio.url}${studio.ogImage}`,
    "@id": studio.url,
    url: studio.url,
    telephone: studio.phone.schema,
    priceRange: "€€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: studio.address.street,
      addressLocality: studio.address.locality,
      addressRegion: studio.address.province,
      postalCode: studio.address.postalCode,
      addressCountry: studio.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: studio.geo.lat,
      longitude: studio.geo.lng,
    },
    openingHoursSpecification: studio.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    founder: {
      "@type": "Person",
      name: studio.founder.name,
      jobTitle: studio.founder.jobTitle,
    },
    medicalSpecialty: "Dentistry",
    knowsAbout: [
      "Implantologia dentale",
      "Ortodonzia invisibile",
      "Estetica dentale",
      "Odontoiatria preventiva",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
