import type { Metadata } from "next";
import { Outfit, Bebas_Neue, Oswald } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://videsol.com.uy"),

  title: {
    default: "Videsol — Automotora | Colonia del Sacramento",
    template: "%s | Videsol",
  },
  description:
    "Videsol, tu automotora de confianza en Colonia del Sacramento. Más de 50 años. BYD, Nissan, Citroën, Peugeot, Riddara, Renault y Subaru. Servicio mecánico.",

  // ── Favicons ──────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/images/favicon-32x32.png",
    shortcut: "/images/favicon-32x32.png",
  },

  // ── Open Graph (WhatsApp, Facebook, LinkedIn) ──────────────────
  openGraph: {
    title: "Videsol — Automotora | Colonia del Sacramento",
    description:
      "Tu automotora de confianza en Colonia del Sacramento. 0 km y usados con garantía. BYD, Nissan, Citroën, Peugeot, Riddara, Renault y Subaru.",
    url: "https://videsol.com.uy",
    siteName: "Videsol",
    locale: "es_UY",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Videsol — Automotora en Colonia del Sacramento",
      },
    ],
  },

  // ── Twitter / X card ──────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Videsol — Automotora | Colonia del Sacramento",
    description:
      "Tu automotora de confianza en Colonia del Sacramento. BYD, Nissan, Citroën, Peugeot, Riddara, Renault y Subaru.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${outfit.variable} ${bebasNeue.variable} ${oswald.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
