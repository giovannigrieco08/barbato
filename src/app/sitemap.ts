import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://studiobarbato.it";
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/cookie`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/note-legali`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/trasparenza-tariffe`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
