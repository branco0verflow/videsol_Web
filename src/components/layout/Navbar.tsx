"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, X, Menu, Phone } from "lucide-react";
import { brandToSlug } from "@/lib/brands";

// ─── Data ─────────────────────────────────────────────────────────────────────

const brands = [
  { name: "BYD"     },
  { name: "Nissan"  },
  { name: "Citroën" },
  { name: "Peugeot" },
  { name: "Riddara" },
  { name: "Renault" },
  { name: "Subaru"  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dispatchCatalogo(catalogo: "okm" | "usados") {
  window.dispatchEvent(new CustomEvent("videsol:set-catalogo", { detail: { catalogo } }));
}

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [dropdownOpen,   setDropdownOpen]   = useState<string | null>(null);
  const [activeCatalogo, setActiveCatalogo] = useState<"okm" | "usados" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Scroll shadow ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close dropdown on outside click ──
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Lock body scroll when mobile open ──
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // ── Sync when sidebar changes catalog ──
  useEffect(() => {
    const handler = (e: Event) => {
      const { catalogo } = (e as CustomEvent<{ catalogo: "okm" | "usados" }>).detail;
      setActiveCatalogo(catalogo);
    };
    window.addEventListener("videsol:catalogo-changed", handler);
    return () => window.removeEventListener("videsol:catalogo-changed", handler);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const handleCatalogo = (catalogo: "okm" | "usados") => {
    closeMobile();
    setActiveCatalogo(catalogo);
    dispatchCatalogo(catalogo);
    setTimeout(() => smoothScrollTo("vehiculos"), 80);
  };

  return (
    <>
      {/* ── Navbar ──────────────────────────────────────────────────── */}
      <nav
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.09)]"
            : "bg-white border-b border-border"
        }`}
      >
        {/* Crimson accent line */}
        <div className="h-0.5 w-full bg-crimson" />

        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="flex items-center justify-between h-15 lg:h-17">

            {/* ── Logo ── */}
            <Link href="/" className="shrink-0 mr-6">
              <Image
                src="/images/logo.png"
                alt="Videsol"
                width={130}
                height={44}
                className="h-9 w-auto object-contain"
                priority
              />
            </Link>

            {/* ── Desktop links (lg+) ── */}
            <div className="flex max-lg:hidden items-center gap-0.5 flex-1" ref={dropdownRef}>

              <NavLink href="#inicio">Inicio</NavLink>

              {/* 0 km */}
              <CatalogoBtn
                active={activeCatalogo === "okm"}
                onClick={() => handleCatalogo("okm")}
              >
                0&nbsp;km
              </CatalogoBtn>

              {/* Usados */}
              <CatalogoBtn
                active={activeCatalogo === "usados"}
                onClick={() => handleCatalogo("usados")}
              >
                Usados
              </CatalogoBtn>

              {/* Marcas dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((p) => p === "marcas" ? null : "marcas")}
                  className="flex items-center gap-1 px-3.5 py-2 text-[13px] text-slate-600 hover:text-navy font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap"
                  suppressHydrationWarning
                >
                  Marcas
                  <ChevronDown
                    size={13}
                    className={`text-crimson transition-transform duration-300 ${dropdownOpen === "marcas" ? "rotate-180" : ""}`}
                  />
                </button>

                <DropdownPanel open={dropdownOpen === "marcas"} wide>
                  <div className="grid grid-cols-2 gap-0.5 p-1">
                    {brands.map((b) => (
                      <Link
                        key={b.name}
                        href={`/marcas/${brandToSlug(b.name)}`}
                        onClick={() => setDropdownOpen(null)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-slate-500 hover:text-navy hover:bg-slate-50 rounded-lg transition-colors font-medium group/item"
                      >
                        <span className="w-1 h-1 rounded-full bg-crimson opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0" />
                        {b.name}
                      </Link>
                    ))}
                  </div>
                </DropdownPanel>
              </div>

              <NavLink href="#servicios">Taller</NavLink>
              <NavLink href="#nosotros">Nosotros</NavLink>
              <NavLink href="#contacto">Contacto</NavLink>
            </div>

            {/* ── Desktop CTAs (lg+) ── */}
            <div className="flex max-lg:hidden items-center gap-3 shrink-0 ml-4">
              <a
                href="tel:+54XXXXXXXXXX"
                className="flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-navy font-medium transition-colors"
              >
                <Phone size={14} />
                <span className="hidden xl:inline">Llamar</span>
              </a>
              <Link
                href="#contacto"
                className="flex items-center gap-2 bg-navy hover:bg-navy-dark text-white text-[12px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-full transition-all duration-200"
              >
                Consultar
              </Link>
            </div>

            {/* ── Hamburger (below lg) ── */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex lg:hidden p-2 text-slate-600 hover:text-navy transition-colors"
              aria-label="Abrir menú"
              suppressHydrationWarning
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu (oculto en lg+) ─────────────────────────────── */}
      <div className="lg:hidden">
      {/* Backdrop */}
      <div
        onClick={closeMobile}
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[min(340px,100vw)] bg-slate-950 flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <Image
            src="/images/logo22.png"
            alt="Videsol"
            width={110}
            height={40}
            className="h-8 w-auto object-contain"
          />
          <button
            onClick={closeMobile}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            aria-label="Cerrar menú"
            suppressHydrationWarning
          >
            <X size={18} />
          </button>
        </div>
        <div className="h-0.5 bg-crimson" />

        {/* Links */}
        <div className="flex flex-col overflow-y-auto flex-1 px-6 py-6 gap-1">

          <MobileLink href="#inicio" onClick={closeMobile} num="01">Inicio</MobileLink>

          {/* Vehículos section */}
          <div className="pt-2 pb-1">
            <p className="text-white/30 text-[10px] font-bold tracking-[0.25em] uppercase mb-3 px-1">Vehículos</p>
            <div className="flex gap-2">
              <MobileCatalogoBtn
                active={activeCatalogo === "okm"}
                onClick={() => handleCatalogo("okm")}
                num="02"
              >
                0 km
              </MobileCatalogoBtn>
              <MobileCatalogoBtn
                active={activeCatalogo === "usados"}
                onClick={() => handleCatalogo("usados")}
                num="03"
              >
                Usados
              </MobileCatalogoBtn>
            </div>
          </div>

          {/* Marcas */}
          <div className="pt-2 pb-1">
            <p className="text-white/30 text-[10px] font-bold tracking-[0.25em] uppercase mb-3 px-1">Marcas</p>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <Link
                  key={b.name}
                  href={`/marcas/${brandToSlug(b.name)}`}
                  onClick={closeMobile}
                  className="px-3.5 py-1.5 text-[13px] text-white/60 hover:text-white border border-white/10 hover:border-crimson rounded-full transition-colors font-medium"
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/10 my-2" />

          <MobileLink href="#servicios" onClick={closeMobile} num="04">Taller mecánico</MobileLink>
          <MobileLink href="#nosotros"  onClick={closeMobile} num="05">Sobre nosotros</MobileLink>
          <MobileLink href="#contacto"  onClick={closeMobile} num="06">Contacto</MobileLink>
        </div>

        {/* CTA */}
        <div className="px-6 py-6 border-t border-white/10">
          <Link
            href="#contacto"
            onClick={closeMobile}
            className="flex items-center justify-center bg-crimson hover:bg-crimson/90 text-white text-[13px] font-bold tracking-widest uppercase px-6 py-4 rounded-full transition-colors w-full"
          >
            Consultar ahora
          </Link>
          <a
            href="tel:+54XXXXXXXXXX"
            className="flex items-center justify-center gap-2 text-white/40 hover:text-white/70 text-[13px] mt-3 transition-colors"
          >
            <Phone size={14} />
            Llamar al concesionario
          </a>
        </div>
      </div>
      </div>{/* end lg:hidden */}
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative px-3.5 py-2 text-[13px] text-slate-600 hover:text-navy font-semibold tracking-wide transition-colors duration-200 group whitespace-nowrap"
    >
      {children}
      <span className="absolute bottom-1 left-3.5 right-3.5 h-px bg-crimson scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  );
}

/** Botón de catálogo con estado activo en el navbar desktop */
function CatalogoBtn({
  active, onClick, children,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      suppressHydrationWarning
      className={`relative px-3.5 py-1.5 text-[13px] font-semibold tracking-wide transition-all duration-200 whitespace-nowrap rounded-full ${
        active
          ? "bg-navy text-white"
          : "text-slate-600 hover:text-navy"
      }`}
    >
      {children}
      {/* underline when inactive hover */}
      {!active && (
        <span className="absolute bottom-0.5 left-3.5 right-3.5 h-px bg-crimson scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      )}
    </button>
  );
}

function DropdownPanel({
  open, wide = false, children,
}: {
  open: boolean; wide?: boolean; children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute top-full left-0 mt-2 bg-white border border-border rounded-2xl shadow-xl overflow-hidden transition-all duration-200 origin-top ${
        wide ? "w-52" : "w-44"
      } ${open ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"}`}
    >
      <div className="h-0.5 bg-crimson w-full" />
      <div className="py-1.5">{children}</div>
    </div>
  );
}

function MobileLink({
  href, onClick, num, children,
}: {
  href: string; onClick: () => void; num: string; children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-white/5 text-white font-semibold text-[15px] transition-colors"
    >
      {children}
      <span className="text-[11px] text-white/30 tracking-widest font-normal">{num}</span>
    </Link>
  );
}

/** Botón de catálogo con estado activo en el drawer mobile */
function MobileCatalogoBtn({
  active, onClick, num, children,
}: {
  active: boolean; onClick: () => void; num: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      suppressHydrationWarning
      className={`flex-1 flex items-center justify-between px-4 py-3.5 rounded-xl font-semibold text-[15px] transition-all text-left border ${
        active
          ? "bg-crimson border-crimson text-white"
          : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
      }`}
    >
      <span>{children}</span>
      <span className={`text-[11px] tracking-widest font-normal ${active ? "text-white/60" : "text-white/30"}`}>
        {num}
      </span>
    </button>
  );
}
