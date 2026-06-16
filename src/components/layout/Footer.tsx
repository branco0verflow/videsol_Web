'use client'

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { brandToSlug } from "@/lib/brands";

// ─── Data ────────────────────────────────────────────────────────────────────

const BRANDS = [
  "BYD", "Nissan", "Citroën", "Peugeot", "Riddara", "Renault", "Subaru",
  "Baic", "KYC", "Avantier",
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/AutomotoraVidesol/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/videsol.automoviles",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Footer() {
  const router   = useRouter();
  const pathname = usePathname();

  /** Navega a una sección del home con scroll suave */
  const handleHashNav = (hash: string) => {
    if (pathname === "/") {
      setTimeout(() => smoothScrollTo(hash), 80);
    } else {
      router.push(`/#${hash}`);
    }
  };

  const linkCls =
    "text-[13px] text-white/40 hover:text-white/80 transition-colors duration-150 text-left";
  const headingCls =
    "text-[10px] font-semibold tracking-[2.5px] uppercase text-white/20 mb-5";

  return (
    <footer className="bg-[#080c10] text-white">

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-16 pb-10">

        {/* Top grid: Brand | Catálogo | Empresa | Marcas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-12 mb-14">

          {/* ── Brand column ── */}
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo22.png"
                alt="Videsol"
                width={120}
                height={40}
                className="h-9 w-auto object-contain"
              />
            </Link>

            <p className="text-[13px] text-white/35 leading-relaxed">
              Tu automotora de confianza en Colonia del Sacramento. Más de 50 años al servicio del automovilista uruguayo.
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-2">
              <a
                href="https://maps.google.com/?q=José+Pedro+Varela+593,+Colonia+del+Sacramento,+Uruguay"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-[12px] text-white/30 hover:text-white/70 transition-colors leading-snug group"
              >
                <MapPin size={11} className="shrink-0 mt-0.5 group-hover:text-white/60 transition-colors" />
                José Pedro Varela 593,<br />Colonia del Sacramento
              </a>
              <a
                href="https://wa.me/59845225411"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[12px] text-white/30 hover:text-white/70 transition-colors group"
              >
                <Phone size={11} className="shrink-0 group-hover:text-white/60 transition-colors" />
                4522 5411 / 5412
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/12 border border-white/8 hover:border-white/20 flex items-center justify-center text-white/40 hover:text-white/80 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Catálogo ── */}
          <div>
            <p className={headingCls}>Catálogo</p>
            <ul className="flex flex-col gap-3">
              <li>
                <button suppressHydrationWarning onClick={() => handleHashNav("okm")} className={linkCls}>
                  Autos 0 km
                </button>
              </li>
              <li>
                <button suppressHydrationWarning onClick={() => handleHashNav("usados")} className={linkCls}>
                  Autos Usados
                </button>
              </li>
            </ul>
          </div>

          {/* ── Empresa ── */}
          <div>
            <p className={headingCls}>Empresa</p>
            <ul className="flex flex-col gap-3">
              <li>
                <button suppressHydrationWarning onClick={() => handleHashNav("nosotros")} className={linkCls}>
                  Sobre Nosotros
                </button>
              </li>
              <li>
                <Link href="/taller" className={linkCls}>
                  Taller Mecánico
                </Link>
              </li>
              <li>
                <button suppressHydrationWarning onClick={() => handleHashNav("contacto")} className={linkCls}>
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* ── Marcas ── */}
          <div>
            <p className={headingCls}>Marcas</p>
            <ul className="flex flex-col gap-3">
              {BRANDS.map((brand) => (
                <li key={brand}>
                  <Link
                    href={`/marcas/${brandToSlug(brand)}`}
                    className={linkCls}
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/20 order-2 sm:order-1">
            © {new Date().getFullYear()} Videsol. Todos los derechos reservados.
          </p>

          {/* Social inline (mobile) */}
          <div className="flex items-center gap-4 order-1 sm:order-2 sm:hidden">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-white/30 hover:text-white/70 flex items-center gap-1.5 transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
