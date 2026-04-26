import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import StructuredData from "@/components/StructuredData";

const funcity = localFont({
  src: "./fonts/FunCity.woff2",
  variable: "--font-funcity",
  display: "swap",
  preload: true,
});

const europaGrotesk = localFont({
  src: "./fonts/EuropaGrotesk-Bold.woff2",
  weight: "700",
  variable: "--font-europa",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://studiobarbato.it"),
  title: {
    default: "Studio Dentistico Fabio Barbato · Manfredonia",
    template: "%s · Studio Barbato",
  },
  description:
    "Odontoiatria di precisione a Manfredonia. Implantologia a carico immediato, ortodonzia invisibile, estetica del sorriso. Prima visita gratuita con TAC cone beam inclusa.",
  keywords: [
    "dentista Manfredonia",
    "studio dentistico Manfredonia",
    "implantologia Manfredonia",
    "ortodonzia invisibile Gargano",
    "dentista Puglia",
    "Fabio Barbato odontoiatra",
  ],
  authors: [{ name: "Studio Dentistico Fabio Barbato" }],
  creator: "Studio Dentistico Fabio Barbato",
  publisher: "Studio Dentistico Fabio Barbato",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://studiobarbato.it",
    siteName: "Studio Dentistico Fabio Barbato",
    title: "Studio Dentistico Fabio Barbato · Manfredonia",
    description:
      "Odontoiatria di precisione a Manfredonia. Implantologia, ortodonzia invisibile, estetica del sorriso. Prima visita gratuita.",
    images: [
      {
        url: "/images/dr-fabio-barbato.png",
        width: 1200,
        height: 630,
        alt: "Studio Dentistico Fabio Barbato",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Dentistico Fabio Barbato",
    description: "Odontoiatria di precisione a Manfredonia.",
    images: ["/images/dr-fabio-barbato.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/images/logo-ring.svg", type: "image/svg+xml" }],
    apple: "/images/logo-ring.png",
  },
  alternates: { canonical: "https://studiobarbato.it" },
};

export const viewport: Viewport = {
  themeColor: "#0A2E36",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${funcity.variable} ${europaGrotesk.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body" suppressHydrationWarning>
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-foreground focus:text-background focus:px-4 focus:py-2 focus:rounded"
        >
          Salta al contenuto principale
        </a>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <StructuredData />
      </body>
    </html>
  );
}
