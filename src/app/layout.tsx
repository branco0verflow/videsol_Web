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
  metadataBase: new URL("https://videsol-web.vercel.app"),

  title: {
    default: "Videsol",
    template: "%s Concesionaria oficial",
  },
  description:
    "Videsol, Concesionaria oficial con mas de 45 años de trayectoria en el mercado automotor del departamento de Colonia.",

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
    title: "Videsol",
    description:
      "Videsol, Concesionaria oficial con mas de 45 años de trayectoria en el mercado automotor del departamento de Colonia.",
    url: "https://videsol-web.vercel.app",
    siteName: "Videsol",
    locale: "es_UY",
    type: "website",
    images: [
      {
        url: "https://videsol-web.vercel.app/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Videsol — Concesionaria oficial",
      },
    ],
  },

  // ── Twitter / X card ──────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Videsol — Automotora | Colonia del Sacramento",
    description:
      "Tu automotora de confianza en Colonia del Sacramento. BYD, Nissan, Citroën, Peugeot, Riddara, Renault y Subaru.",
    images: ["https://videsol-web.vercel.app/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${outfit.variable} ${bebasNeue.variable} ${oswald.variable}`} suppressHydrationWarning>
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}
