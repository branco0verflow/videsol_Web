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
  title: "Videsol — Automotora | Colonia del Sacramento",
  description:
    "Videsol, tu automotora de confianza en Colonia del Sacramento. Más de 50 años. BYD, Nissan, Citroën, Peugeot, Riddara, Renault y Subaru. Servicio mecánico.",
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
